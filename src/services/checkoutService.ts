import { CheckoutMode, OrderItem } from "../types";
import { sessionStorageUtils } from "../utils/storage";

const CHECKOUT_ITEMS_KEY = "derrume_checkout_items";
const CHECKOUT_MODE_KEY = "derrume_checkout_mode";

export const checkoutService = {
  setCheckoutItems(items: OrderItem[], mode: CheckoutMode) {
    sessionStorageUtils.set(CHECKOUT_ITEMS_KEY, items);
    sessionStorageUtils.set(CHECKOUT_MODE_KEY, mode);
  },

  getCheckoutItems(): OrderItem[] {
    return sessionStorageUtils.get<OrderItem[]>(CHECKOUT_ITEMS_KEY, []);
  },

  getCheckoutMode(): CheckoutMode {
    return sessionStorageUtils.get<CheckoutMode>(CHECKOUT_MODE_KEY, "cart");
  },

  clearCheckout() {
    sessionStorageUtils.remove(CHECKOUT_ITEMS_KEY);
    sessionStorageUtils.remove(CHECKOUT_MODE_KEY);
  }
};
