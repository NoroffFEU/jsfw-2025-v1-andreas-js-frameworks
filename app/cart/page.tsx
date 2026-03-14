"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, removeOneFromCart, clearCart } = useCart();

  const grouped = cart.reduce<Record<string, { product: (typeof cart)[number]; qty: number }>>((acc, item) => {
    if (acc[item.id]) acc[item.id].qty++;
    else acc[item.id] = { product: item, qty: 1 };
    return acc;
  }, {});

  const items = Object.values(grouped);

  const totalItems = cart.length;

  const totalPrice = items.reduce((sum, it) => {
    const unit = it.product.discountedPrice != null && it.product.discountedPrice < it.product.price ? it.product.discountedPrice : it.product.price;
    return sum + unit * it.qty;
  }, 0);

  const format = (n: number) => `$${n.toFixed(2)}`;

  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-12 px-6 text-zinc-300">
          <h1 className="text-3xl font-bold mb-6 text-white">Shopping Cart</h1>
          {items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-200 mb-4">Your cart is empty.</p>
              <Link href="/" className="text-blue-500 hover:underline">
                Back to shop
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <section className="md:col-span-2">
                <ul className="divide-y divide-zinc-700">
                  {items.map(({ product, qty }) => {
                    const unit = product.discountedPrice != null && product.discountedPrice < product.price ? product.discountedPrice : product.price;
                    return (
                      <li key={product.id} className="py-4">
                        <div className="bg-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                          <Image src={product.image.url} alt={product.image.alt} width={160} height={120} className="w-full sm:w-32 h-52 sm:h-24 object-cover rounded" />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h2 className="font-semibold">{product.title}</h2>
                              <div className="text-sm text-zinc-300 mt-1">{product.description}</div>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center border border-zinc-700 rounded overflow-hidden bg-transparent">
                                  <button onClick={() => removeOneFromCart(product.id)} className="px-2 py-1 sm:px-3 sm:py-1 text-sm hover:cursor-pointer bg-white/5 hover:bg-white/10 text-zinc-100">
                                    -
                                  </button>
                                  <div className="px-3 sm:px-4 text-center text-sm">{qty}</div>
                                  <button onClick={() => addToCart(product)} className="px-2 py-1 sm:px-3 sm:py-1 text-sm hover:cursor-pointer bg-white/5 hover:bg-white/10 text-zinc-100">
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  aria-label="Remove"
                                  className="sm:hidden text-red-500 text-sm px-2 py-1 rounded hover:cursor-pointer hover:bg-red-600/10"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-4">
                                <div className="text-right">
                                  <div className="font-semibold">{format(unit)}</div>
                                  <div className="text-sm text-zinc-400">{format(unit * qty)}</div>
                                </div>
                                <button onClick={() => removeFromCart(product.id)} className="hidden sm:inline text-red-500 text-sm px-3 py-1 rounded hover:cursor-pointer hover:bg-red-600/10">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <aside className="md:col-span-1 bg-zinc-800 p-6 rounded text-zinc-200">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-zinc-300">Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-zinc-300">Subtotal</span>
                  <span className="font-semibold">{format(totalPrice)}</span>
                </div>
                <button onClick={clearCart} className="w-full mb-3 px-4 py-2 border border-zinc-700 rounded hover:cursor-pointer hover:bg-white/5 text-zinc-200">
                  Clear cart
                </button>
                <Link href="/checkout" className="w-full block text-center px-4 py-3 bg-orange-400 text-black hover:cursor-pointer font-bold rounded hover:bg-orange-500">
                  Checkout — {format(totalPrice)}
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
