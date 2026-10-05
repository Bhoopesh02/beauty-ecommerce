import { Order, OrderStatus, TrackOrderResult } from "../types";
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

  async trackOrder(query: { orderIdOrTracking: string; emailOrPhone?: string }): Promise<TrackOrderResult> {
    const rawInput = (query.orderIdOrTracking || '').trim();
    if (!rawInput) {
      return {
        success: false,
        error: 'Please enter an Order ID or Courier Tracking Number.'
      };
    }

    const cleanInput = rawInput.replace(/^#/, '').toLowerCase();
    const orders = await this.getOrders();

    // Look for exact match or flexible matching
    const matched = orders.find(o => {
      const orderId = o.id.toLowerCase();
      const tracking = (o.trackingNumber || '').toLowerCase();
      
      if (orderId === cleanInput || tracking === cleanInput) return true;
      // also allow matching if input is just the suffix digits (e.g. 10284 matches DR-10284)
      const cleanAlphaNum = cleanInput.replace(/[^a-z0-9]/gi, '');
      if (cleanAlphaNum && (orderId.replace(/[^a-z0-9]/gi, '') === cleanAlphaNum || tracking.replace(/[^a-z0-9]/gi, '') === cleanAlphaNum)) {
        return true;
      }
      if (orderId.endsWith(cleanInput) || tracking.endsWith(cleanInput)) return true;
      return false;
    });

    if (!matched) {
      return {
        success: false,
        error: `We could not locate a shipment matching "${rawInput}". Please verify your Order ID or Tracking Number.`
      };
    }

    // Optional verification if email or phone is provided
    if (query.emailOrPhone && query.emailOrPhone.trim()) {
      const verif = query.emailOrPhone.trim().toLowerCase();
      const cleanVerifDigits = verif.replace(/\D/g, '');
      const orderPhoneDigits = (matched.shippingAddress?.phone || '').replace(/\D/g, '');
      
      const phoneMatches = cleanVerifDigits.length >= 7 && (orderPhoneDigits.includes(cleanVerifDigits) || cleanVerifDigits.includes(orderPhoneDigits));
      const emailMatches = verif.includes('@') && matched.userId.toLowerCase().includes(verif);

      // If user provided a phone or email query and it doesn't match
      if (!phoneMatches && !emailMatches && (cleanVerifDigits.length >= 7 || verif.includes('@'))) {
        return {
          success: false,
          error: 'The phone number or email provided does not match the records for this order.'
        };
      }
    }

    // Deep clone and ensure enriched fields
    const enrichedOrder: Order = JSON.parse(JSON.stringify(matched));
    if (!enrichedOrder.carrier) {
      enrichedOrder.carrier = 'BlueDart Apex Luxury';
    }
    if (!enrichedOrder.trackingNumber) {
      enrichedOrder.trackingNumber = `BD-${enrichedOrder.id}-IN`;
    }
    if (!enrichedOrder.trackingCheckpoints || enrichedOrder.trackingCheckpoints.length === 0) {
      enrichedOrder.trackingCheckpoints = (enrichedOrder.statusHistory || []).map(sh => ({
        status: sh.status,
        location: sh.status === 'Delivered' ? 'Delivery Address' : sh.status === 'Shipped' ? 'Logistics Hub' : 'DERRUME Atelier, Bengaluru',
        timestamp: sh.timestamp,
        description: `Order status: ${sh.status}.`
      })).reverse();
    }

    return {
      success: true,
      order: enrichedOrder
    };
  },

  async getLatestOrder(): Promise<Order | null> {
    const orders = await this.getOrders();
    if (!orders || orders.length === 0) return null;
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted[0] || null;
  },

  async resetOrders(): Promise<Order[]> {
    storage.set(STORAGE_KEYS.ORDERS, defaultOrders);
    return defaultOrders;
  },

  async clearOrders(): Promise<void> {
    storage.set(STORAGE_KEYS.ORDERS, []);
  }
};
