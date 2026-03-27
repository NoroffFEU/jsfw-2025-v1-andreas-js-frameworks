"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useCart } from "../context/CartContext";
import SearchProducts from "./SearchProducts";
import SortProducts from "./SortProducts";

export function FetchProducts({
  showGrid = true,
  showSearch = true,
  limit,
  sortOption: controlledSortOption,
  setSortOption: controlledSetSortOption,
}: {
  showGrid?: boolean;
  showSearch?: boolean;
  limit?: number;
  sortOption?: string;
  setSortOption?: (option: string) => void;
}) {
  const url = "https://v2.api.noroff.dev/online-shop";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState("");
  const [localSortOption, setLocalSortOption] = useState("featured");
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

  const searchResults = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (search.length === 0) return [] as Product[];
    return products.filter((product) => {
      const inTitle = product.title?.toLowerCase().includes(search);
      const inDesc = product.description?.toLowerCase().includes(search);
      const inTags = Array.isArray(product.tags) && product.tags.join(" ").toLowerCase().includes(search);
      return inTitle || inDesc || inTags;
    });
  }, [products, query]);

  const sortOption = controlledSortOption ?? localSortOption;
  const setSortOption = controlledSetSortOption ?? setLocalSortOption;

  const sortedProducts = useMemo(() => {
    const list = products.slice();

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
  }, [products, sortOption]);

  if (error) return <div>Error: {error.message}</div>;

  try {
    const showList = query.trim().length > 0;
    let visibleProducts = sortedProducts;

    if (!showList && typeof limit === "number") {
      visibleProducts = visibleProducts.slice(0, limit);
    }

    return (
      <>
        {showSearch ? (
          <div className="mb-6">
            <div className="flex gap-3 items-center w-full">
              <SearchProducts query={query} setQuery={setQuery} filtered={searchResults} loading={loading} />
              <SortProducts sortOption={sortOption} setSortOption={setSortOption} />
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
