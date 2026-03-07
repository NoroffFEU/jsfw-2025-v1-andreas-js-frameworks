"use client";

import { useState, useEffect } from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

export function FetchProducts() {
  const url = "https://v2.api.noroff.dev/online-shop";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  try {
    return (
      <>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={() => addToCart(product)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-400">No products found.</p>
        )}
      </>
    );
  } catch (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
}
