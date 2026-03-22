"use client";

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from "react";
import { Product } from "../types/product";
import { CartContextType } from "../types/cartContextType";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const addToCart = (item: Product) => {
    setCart((prev) => [...prev, item]);
    showToast(`${item.title} added to cart`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToastMessage(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (!removed) return prev;
      const newCart = prev.filter((item) => item.id !== id);
      showToast(`${removed.title} removed from cart`);
      return newCart;
    });
  };

  const removeOneFromCart = (id: string) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const removed = prev[index];
      const copy = [...prev];
      copy.splice(index, 1);
      showToast(`${removed.title} removed from cart`);
      return copy;
    });
  };

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const clearToast = () => {
    setToastMessage(null);
    if (toastTimeout.current) {
      window.clearTimeout(toastTimeout.current);
      toastTimeout.current = null;
    }
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeOneFromCart, clearCart, toastMessage, clearToast, showToast }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
