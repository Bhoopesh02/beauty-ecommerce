import { Order, OrderStatus } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return storage.get<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "statusHistory" | "orderStatus">): Promise<Order> {
    const orders = await this.getOrders();
    
    const now = new Date().toISOString();
    // generate order id like DR-YYYYMMDD-XXX
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
      ]
    };
    
    orders.push(newOrder);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order | null> {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === id);
    if (!order) return null;
    
    if (order.orderStatus !== newStatus) {
      order.orderStatus = newStatus;
      order.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString()
      });
      storage.set(STORAGE_KEYS.ORDERS, orders);
    }
    
    return order;
  }
};
