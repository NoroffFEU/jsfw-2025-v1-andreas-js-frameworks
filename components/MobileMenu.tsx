"use client";

import Link from "next/link";

export default function MobileMenu({ open, itemCount, onClose }: { open: boolean; itemCount: number; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
        <button onClick={onClose} aria-label="Close menu" className="absolute top-5 right-5 rounded-lg bg-white/5 p-2 text-white hover:bg-white/10">
          ✕
        </button>
        <nav className="flex flex-col gap-6">
          <Link href="/" onClick={onClose} className="text-2xl font-semibold text-white">
            Home
          </Link>
          <Link href="/products" onClick={onClose} className="text-2xl font-semibold text-white/90">
            Products
          </Link>
          <Link href="/cart" onClick={onClose} className="text-2xl font-semibold text-white/90 inline-flex items-center justify-center gap-2">
            <span>Cart</span>
            {itemCount > 0 && <span className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-orange-500 text-black text-sm font-semibold">{itemCount}</span>}
          </Link>
          <Link href="/contact" onClick={onClose} className="text-2xl font-semibold text-white/90">
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
