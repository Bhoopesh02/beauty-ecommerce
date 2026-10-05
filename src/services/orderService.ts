import { Order, OrderStatus } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { defaultOrders } from "../data/orders";

const initOrders = (): Order[] => {
  const stored = storage.get<Order[] | null>(STORAGE_KEYS.ORDERS, null);
  if (stored === null) {
    storage.set(STORAGE_KEYS.ORDERS, defaultOrders);
    return defaultOrders;
  }
  return stored;
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return initOrders();
  },

  async getOrdersByUser(userId?: string): Promise<Order[]> {
    const orders = await this.getOrders();
    if (!userId || userId === "guest") {
      return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const userOrders = orders.filter(o => o.userId === userId);
    // If the logged in user doesn't have orders yet (e.g. newly registered), provide the demo orders unless empty state was requested
    if (userOrders.length === 0 && orders.length > 0) {
      return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase() || o.id === id);
    return order || null;
  },

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "statusHistory" | "orderStatus">): Promise<Order> {
    const orders = await this.getOrders();
    
    const now = new Date().toISOString();
    const today = new Date();
    const dateStr = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    const count = orders.filter(o => o.id.includes(dateStr)).length + 1;
    const id = `DR-${dateStr}-${count.toString().padStart(3, '0')}`;
    
    const newOrder: Order = {
      ...orderData,
      id,
      orderStatus: "Placed",
      createdAt: now,
      statusHistory: [
        { status: "Placed", timestamp: now }
      ],
      trackingNumber: `BD-${id}-IN`,
      carrier: "BlueDart Apex Luxury",
      trackingCheckpoints: [
        {
          status: "Placed",
          location: "DERRUME Online Store",
          timestamp: now,
          description: "Order received and confirmed."
        }
      ],
      paymentDetails: {
        method: orderData.paymentMethod === "card" ? "Credit Card" : orderData.paymentMethod === "upi" ? "UPI" : "Cash on Delivery",
        status: orderData.paymentStatus || "Paid",
        paidAt: now
      },
      returnStatus: "none"
    };
    
    orders.unshift(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase() || o.id === id);
    if (!order) return null;
    
    if (order.orderStatus !== newStatus) {
      order.orderStatus = newStatus;
      const now = new Date().toISOString();
      order.statusHistory.push({
        status: newStatus,
        timestamp: now
      });

      if (newStatus === "Delivered") {
        order.deliveredAt = now;
      }

      if (order.trackingCheckpoints) {
        order.trackingCheckpoints.unshift({
          status: newStatus,
          location: "Regional Fulfillment Centre",
          timestamp: now,
          description: `Order status transitioned to ${newStatus}.`
        });
      }

      storage.set(STORAGE_KEYS.ORDERS, orders);
    }
    
    return order;
  },

  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase() || o.id === id);
    if (!order) return null;

    if (order.orderStatus !== "Placed" && order.orderStatus !== "Confirmed") {
      throw new Error("This order can no longer be cancelled as it has already progressed to preparation or shipping.");
    }

    const now = new Date().toISOString();
    order.orderStatus = "Cancelled";
    order.cancelledAt = now;
    order.cancelReason = reason || "Customer requested cancellation prior to dispatch.";
    order.statusHistory.push({
      status: "Cancelled",
      timestamp: now,
      note: order.cancelReason
    });

    if (order.trackingCheckpoints) {
      order.trackingCheckpoints.unshift({
        status: "Cancelled",
        location: "Order Desk",
        timestamp: now,
        description: order.cancelReason
      });
    }

    storage.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  async requestReturn(id: string, reason: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase() || o.id === id);
    if (!order) return null;

    if (order.orderStatus !== "Delivered") {
      throw new Error("Returns are only eligible for delivered orders.");
    }

    const now = new Date().toISOString();
    order.returnStatus = "requested";
    order.returnReason = reason;
    order.returnRequestedAt = now;

    storage.set(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  async resetOrders(): Promise<Order[]> {
    storage.set(STORAGE_KEYS.ORDERS, defaultOrders);
    return defaultOrders;
  },

  async clearOrders(): Promise<void> {
    storage.set(STORAGE_KEYS.ORDERS, []);
  }
};
