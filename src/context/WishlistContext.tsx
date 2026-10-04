"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { wishlistService } from "../services/wishlistService";

interface WishlistContextType {
  wishlist: string[];
  loading: boolean;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  loading: true,
  refreshWishlist: async () => {},
  isInWishlist: () => false
});

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = async () => {
    try {
      const items = await wishlistService.getWishlist();
      setWishlist(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, refreshWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
