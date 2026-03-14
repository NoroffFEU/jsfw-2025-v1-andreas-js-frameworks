"use client";

import Image from "next/image";
import { FetchProducts } from "../components/FetchProducts";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="max-w-7xl w-full pt-8 pb-16 px-6">
          <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-5xl font-extrabold mb-4">Discover standout products</h1>
              <p className="text-lg text-zinc-300 mb-6">Shop modern products to elevate your lifestyle.</p>
              <div className="flex gap-3">
                <a href="#shop" className="rounded-md bg-orange-400 px-5 py-3 text-black font-semibold shadow hover:brightness-95 transition hover:bg-orange-500">
                  Shop Now
                </a>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative h-64 w-full max-w-md rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=60&auto=format&fit=crop"
                  alt="Hero"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  unoptimized
                />
              </div>
            </div>
          </section>
          <section id="shop">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured products</h2>
              <Link href="/products" className="text-sm text-orange-300 hover:underline">
                View all
              </Link>
            </div>
            <div className="mb-8">
              <FetchProducts showGrid={false} />
            </div>
            <FetchProducts limit={12} showSearch={false} />
          </section>
        </div>
      </main>
    </>
  );
}
