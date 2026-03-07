"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black font-sans">
      <Header />

      <main className="flex w-full max-w-6xl flex-col p-8 mt-24 bg-zinc-900 shadow-md rounded-lg text-zinc-300">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
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
                    <li key={product.id} className="py-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <Image src={product.image.url} alt={product.image.alt} width={100} height={100} className="min-w-25 min-h-25 max-w-25 max-h-25 object-cover rounded" />
                        <div>
                          <h2 className="font-semibold">{product.title}</h2>
                          <div className="text-sm text-zinc-500">
                            {product.description.slice(0, 80)}
                            {product.description.length > 80 ? "…" : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-72 justify-end">
                        <div className="flex items-center border border-zinc-700 rounded overflow-hidden bg-transparent w-28 justify-center">
                          <button onClick={() => removeOneFromCart(product.id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-zinc-100 hover:cursor-pointer">
                            -
                          </button>
                          <div className="px-4 text-center">{qty}</div>
                          <button onClick={() => addToCart(product)} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-zinc-100 hover:cursor-pointer">
                            +
                          </button>
                        </div>
                        <div className="text-right w-28">
                          <div className="font-semibold">{format(unit)}</div>
                          <div className="text-sm text-zinc-500">{format(unit * qty)}</div>
                        </div>
                        <button onClick={() => removeFromCart(product.id)} className="text-red-500 text-sm hover:bg-red-600/10 px-2 py-1 rounded w-20 hover:cursor-pointer">
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
            <aside className="md:col-span-1 bg-zinc-800 p-6 rounded text-zinc-200">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-zinc-500">Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-zinc-500">Subtotal</span>
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
      </main>
      <Footer />
    </div>
  );
}
