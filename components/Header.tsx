"use client";

import { useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white">
      <MobileMenu open={open} onClose={() => setOpen(false)} />

      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-linear-to-br from-orange-400 to-orange-600 shadow-md">
            <span className="font-bold text-black">TOS</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">The Online Store</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-3">
          <Link href="/" className="px-3 py-2 rounded-md text-orange-300 hover:bg-orange-600/40 hover:text-orange-200 transition">
            Home
          </Link>
          <Link href="/cart" className="px-3 py-2 rounded-md text-orange-300 hover:bg-orange-600/40 hover:text-orange-200 transition">
            Cart
          </Link>
          <Link href="/contact" className="px-3 py-2 rounded-md text-orange-300 hover:bg-orange-600/40 hover:text-orange-200 transition">
            Contact
          </Link>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 bg-white/5 hover:bg-white/10">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
