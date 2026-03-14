"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";

export function FetchProducts({ showGrid = true, showSearch = true, limit }: { showGrid?: boolean; showSearch?: boolean; limit?: number }) {
  const url = "https://v2.api.noroff.dev/online-shop";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        setProducts(data.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.slice();
    if (q.length > 0) {
      list = list.filter((p) => {
        const inTitle = p.title?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        const inTags = Array.isArray(p.tags) && p.tags.join(" ").toLowerCase().includes(q);
        return inTitle || inDesc || inTags;
      });
    }

    switch (sortOption) {
      case "price-asc":
        list.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
        break;
      case "rating-desc":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, query, sortOption]);

  if (error) return <div>Error: {error.message}</div>;

  try {
    const showList = query.trim().length > 0;
    let visibleProducts = showList ? filtered : products;

    if (!showList && typeof limit === "number") {
      visibleProducts = visibleProducts.slice(0, limit);
    }

    return (
      <>
        {showSearch ? (
          <div className="mb-6">
            <div className="flex gap-3 items-center w-full">
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

              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-md bg-zinc-900 px-3 text-sm text-white h-12 w-40 shrink-0">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>
        ) : null}

        {showGrid ? (
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: typeof limit === "number" ? Math.min(limit, 12) : 12 }).map((_, i) => (
                <ProductCardSkeleton key={`skel-${i}`} />
              ))}
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={() => addToCart(product)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-400">No products found.</p>
          )
        ) : null}
      </>
    );
  } catch (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
}
