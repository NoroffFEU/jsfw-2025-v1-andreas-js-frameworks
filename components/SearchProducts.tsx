"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchProps } from "../types/searchProps";

export default function SearchProducts({ query, setQuery, filtered, loading }: SearchProps) {
  const showList = query.trim().length > 0;

  return (
    <div className="relative flex-1 min-w-0">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full h-12 rounded-md bg-zinc-900 px-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {showList && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 rounded-md shadow-lg z-50 max-h-80 overflow-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border-b border-zinc-800">
                <div className="h-10 w-10 bg-zinc-800 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.slice(0, 8).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} onClick={() => setQuery("")} className="flex items-center gap-3 p-3 hover:bg-zinc-800 border-b border-zinc-800">
                <Image src={product.image?.url || ""} alt={product.image?.alt || product.title} width={48} height={48} className="object-cover rounded" unoptimized />
                <div>
                  <div className="font-medium text-sm">{product.title}</div>
                  <div className="text-xs text-zinc-400">${(product.discountedPrice ?? product.price).toFixed(2)}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-3 text-zinc-500">No matching products.</div>
          )}
        </div>
      )}
    </div>
  );
}
