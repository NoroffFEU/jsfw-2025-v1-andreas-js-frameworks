"use client";

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from "react";
import { Product } from "../types/product";
import { CartContextType, CartItem } from "../types/cartContextType";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.product.id === product.id);
      if (index === -1) {
        const newCart = [...prev, { product, quantity: 1 }];
        showToast(`${product.title} added to cart`);
        return newCart;
      }
      const newCart = [...prev];
      newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
      showToast(`${product.title} quantity increased`);
      return newCart;
    });
  };

  const addOneToCart = (id: string) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.product.id === id);
      if (index === -1) return prev;
      const newCart = [...prev];
      newCart[index] = { ...newCart[index], quantity: newCart[index].quantity + 1 };
      showToast(`${newCart[index].product.title} quantity increased`);
      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const item = prev.find((p) => p.product.id === id);
      if (!item) return prev;
      const newCart = prev.filter((p) => p.product.id !== id);
      showToast(`${item.product.title} removed from cart`);
      return newCart;
    });
  };

  const removeOneFromCart = (id: string) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.product.id === id);
      if (index === -1) return prev;
      const item = prev[index];
      if (item.quantity > 1) {
        const newCart = [...prev];
        newCart[index] = { ...item, quantity: item.quantity - 1 };
        showToast(`${item.product.title} quantity decreased`);
        return newCart;
      }
      showToast(`${item.product.title} removed from cart`);
      return prev.filter((p) => p.product.id !== id);
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

  return <CartContext.Provider value={{ cart, addToCart, addOneToCart, removeFromCart, removeOneFromCart, clearCart, toastMessage, clearToast, showToast }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
