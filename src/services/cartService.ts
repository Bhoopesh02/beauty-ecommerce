import { CartItem } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    return storage.get<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  async addToCart(item: CartItem): Promise<CartItem[]> {
    const cart = await this.getCart();
    const existingIndex = cart.findIndex(
      i => i.productId === item.productId && i.variantId === item.variantId
    );
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    storage.set(STORAGE_KEYS.CART, cart);
    return cart;
  },

  async updateQuantity(productId: string, variantId: string | undefined, quantity: number): Promise<CartItem[]> {
    const cart = await this.getCart();
    const existingIndex = cart.findIndex(
      i => i.productId === productId && i.variantId === variantId
    );
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity = quantity;
      storage.set(STORAGE_KEYS.CART, cart);
    }
    
    return cart;
  },

  async removeFromCart(productId: string, variantId: string | undefined): Promise<CartItem[]> {
    const cart = await this.getCart();
    const newCart = cart.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    );
    storage.set(STORAGE_KEYS.CART, newCart);
    return newCart;
  },

  async clearCart(): Promise<void> {
    storage.set(STORAGE_KEYS.CART, []);
  }
};
