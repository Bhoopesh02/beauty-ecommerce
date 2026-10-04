import { storage, STORAGE_KEYS } from "../utils/storage";

export const wishlistService = {
  async getWishlist(): Promise<string[]> {
    return storage.get<string[]>(STORAGE_KEYS.WISHLIST, []);
  },

  async addToWishlist(productId: string): Promise<string[]> {
    const wishlist = await this.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      storage.set(STORAGE_KEYS.WISHLIST, wishlist);
    }
    return wishlist;
  },

  async removeFromWishlist(productId: string): Promise<string[]> {
    const wishlist = await this.getWishlist();
    const newWishlist = wishlist.filter(id => id !== productId);
    storage.set(STORAGE_KEYS.WISHLIST, newWishlist);
    return newWishlist;
  },

  async toggleWishlist(productId: string): Promise<string[]> {
    const wishlist = await this.getWishlist();
    if (wishlist.includes(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  },
  
  async isInWishlist(productId: string): Promise<boolean> {
    const wishlist = await this.getWishlist();
    return wishlist.includes(productId);
  },
  
  async clearWishlist(): Promise<void> {
    storage.set(STORAGE_KEYS.WISHLIST, []);
  }
};
