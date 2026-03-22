"use client";

import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <>
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl w-full bg-zinc-900 p-8 rounded-md text-center">
          <h1 className="text-3xl font-bold mb-4">Thank you! Your order is complete</h1>
          <p className="text-zinc-300 mb-6">We have received your order and sent a confirmation to your email.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="inline-block bg-orange-400 text-black font-semibold px-5 py-3 rounded hover:bg-orange-500 hover:cursor-pointer">
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
