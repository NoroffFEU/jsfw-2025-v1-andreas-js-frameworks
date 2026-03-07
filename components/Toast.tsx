"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Toast() {
  const { toastMessage, clearToast } = useCart();

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => clearToast && clearToast(), 4000);
    return () => clearTimeout(t);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed right-4 top-6 z-50">
      <div className="max-w-xs bg-green-600/90 text-white px-4 py-2 rounded shadow-lg">{toastMessage}</div>
    </div>
  );
}
