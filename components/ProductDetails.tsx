"use client";

import { Product } from "../types/product";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

import Image from "next/image";

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await fetch(`https://v2.api.noroff.dev/online-shop/${id}`);
      const result = await response.json();
      setProduct(result.data);
      setLoading(false);
    };
    fetchSingleProduct();
  }, [id]);
  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
        <div className="relative">
          <div className="w-full h-96 bg-zinc-700 rounded-lg" />
        </div>
        <div>
          <div className="h-10 bg-zinc-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-zinc-700 rounded w-full mb-3" />
          <div className="h-4 bg-zinc-700 rounded w-full mb-3" />

          <div className="flex items-baseline gap-4 mb-3">
            <div className="h-5 w-24 bg-zinc-700 rounded" />
            <div className="h-8 w-32 bg-zinc-700 rounded" />
          </div>

          <div className="h-10 w-40 bg-zinc-700 rounded mt-6" />

          <div className="mt-10">
            <div className="h-6 bg-zinc-700 rounded w-1/3 mb-4"></div>
            <ul className="space-y-3">
              <li className="h-16 bg-zinc-700 rounded"></li>
              <li className="h-16 bg-zinc-700 rounded"></li>
            </ul>
          </div>
        </div>
      </div>
    );
  if (!product) return <div>Product not found</div>;

  const onSale = product.discountedPrice != null && product.discountedPrice < product.price;
  const discountPercent = onSale ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;
  const savings = onSale ? product.price - product.discountedPrice : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="relative">
        <Image src={product.image.url} alt={product.image.alt} width={700} height={700} className="rounded-lg shadow-lg object-cover" />
        {onSale && <div className="absolute top-4 left-4 bg-orange-500 text-black font-extrabold px-4 py-2 rounded-full text-sm tracking-wide shadow-lg">SALE -{discountPercent}%</div>}
        {onSale && <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm shadow">Save ${savings.toFixed(2)}</div>}
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-zinc-300 mb-6">{product.description}</p>

        <div className="flex items-baseline gap-4 mb-3">
          {onSale ? (
            <>
              <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
              <span className="text-4xl font-extrabold text-orange-400">${product.discountedPrice!.toFixed(2)}</span>
              <span className="ml-2 text-sm text-green-300 font-semibold">({discountPercent}% off)</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-orange-400">${product.price.toFixed(2)}</span>
          )}
        </div>

        {onSale && (
          <div className="mb-4 text-sm text-green-200 font-medium">
            You save ${savings.toFixed(2)} ({discountPercent}%)
          </div>
        )}

        <div className="mb-6 text-sm text-zinc-400">{Array.isArray(product.tags) ? product.tags.join(" | ") : product.tags}</div>

        <div className="mt-6">
          <button
            onClick={() => {
              addToCart(product);
            }}
            className="text-black bg-orange-400 font-semibold hover:bg-orange-500 px-5 py-3 hover:cursor-pointer rounded shadow"
          >
            Add to cart
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {product.reviews && product.reviews.length > 0 ? (
            <ul className="divide-y">
              {product.reviews.map((review) => (
                <li key={review.id} className="py-4">
                  <h3 className="font-semibold">{review.username}</h3>
                  <p className="text-sm text-gray-400">Rating: {review.rating}/5</p>
                  <p className="italic">{review.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviews yet for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
}
