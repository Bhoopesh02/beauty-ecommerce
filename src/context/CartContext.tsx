"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "../types";
import { cartService } from "../services/cartService";

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  refreshCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  loading: true,
  refreshCart: async () => {},
  itemCount: 0,
  subtotal: 0
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const items = await cartService.getCart();
      setCart(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
