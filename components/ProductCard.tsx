"use client";

import Image from "next/image";
import { Product } from "../types/product";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.discountedPrice != null && product.discountedPrice < product.price ? ((product.price - product.discountedPrice) / product.price) * 100 : false;
  return (
    <article className="flex flex-col rounded-lg bg-white/5 overflow-hidden shadow-sm hover:shadow-lg transition">
      <div className="relative h-52 w-full bg-zinc-800">
        <Image src={product.image?.url} alt={product.image?.alt || product.title} width={600} height={400} className="object-cover max-h-52" unoptimized />
        {onSale ? <span className="absolute top-3 left-3 rounded-full bg-black/80 px-3 py-1 font-semibold text-orange-300 ring-1 ring-orange-600/20 shadow-sm">-{onSale.toFixed(0)}%</span> : null}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
          <div className="flex items-center gap-3 mb-3">
            {onSale ? (
              <>
                <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
                <span className="text-orange-400 font-bold text-lg">${product.discountedPrice!.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-orange-400 font-bold text-lg">${product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="text-sm text-zinc-300 leading-snug">{product.description}</p>
        </div>
        <div className="mt-4 flex flex-col gap-3 justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: product.rating ?? 4 }).map((_, i) => (
              <svg key={`${product.id}-star-${i}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.788 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.211l8.2-1.193z" />
              </svg>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link href={`/product/${product.id}`} className="rounded-md px-3 py-2 bg-white/5 text-orange-300 hover:bg-orange-600/10 hover:cursor-pointer transition">
              View
            </Link>
            <button className="rounded-md bg-orange-500 px-3 py-2 text-black font-medium hover:cursor-pointer hover:brightness-95">Add</button>
          </div>
        </div>
      </div>
    </article>
  );
}
