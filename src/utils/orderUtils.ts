import { Order, OrderFilterTab, OrderStatus } from "@/types";

export const formatPrice = (amount: number): string => {
  if (isNaN(amount)) return "₹0";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).toUpperCase();
  } catch {
    return dateStr;
  }
};

export const isCancellable = (status: OrderStatus): boolean => {
  return status === "Placed" || status === "Confirmed";
};

export const isReturnEligible = (order: Order): boolean => {
  return order.orderStatus === "Delivered" && order.returnStatus !== "requested";
};

export const matchesFilter = (order: Order, filter: OrderFilterTab): boolean => {
  switch (filter) {
    case "All":
      return true;
    case "Processing":
      return order.orderStatus === "Placed" || order.orderStatus === "Confirmed" || order.orderStatus === "Packed";
    case "Shipped":
      return order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery";
    case "Delivered":
      return order.orderStatus === "Delivered";
    case "Cancelled":
      return order.orderStatus === "Cancelled";
    default:
      return true;
  }
};

export const getStatusMessage = (status: OrderStatus): string => {
  switch (status) {
    case "Placed":
      return "Your order has been placed and is being queued for preparation.";
    case "Confirmed":
      return "Your order has been verified and confirmed by our atelier.";
    case "Packed":
      return "Your pieces have been hand-packed with care and are ready for courier handover.";
    case "Shipped":
      return "Your package is on its way with premium priority dispatch.";
    case "Out for Delivery":
      return "Your parcel has arrived at your local hub and is out for delivery.";
    case "Delivered":
      return "Your order was delivered successfully.";
    case "Cancelled":
      return "This order has been cancelled.";
    default:
      return "Order status is currently being updated.";
  }
};
