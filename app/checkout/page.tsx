"use client";

import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import type { ZodError } from "zod";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { checkoutSchema, type CheckoutForm } from "./checkoutSchema";

type FormState = CheckoutForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CheckoutPage() {
  const { cart, clearCart, showToast } = useCart();
  const router = useRouter();

  const items = cart.reduce<Record<string, { title: string; qty: number; price: number }>>((acc, p) => {
    if (acc[p.id]) acc[p.id].qty++;
    else acc[p.id] = { title: p.title, qty: 1, price: p.discountedPrice && p.discountedPrice < p.price ? p.discountedPrice : p.price };
    return acc;
  }, {});

  const summary = Object.values(items);
  const subtotal = summary.reduce((s, it) => s + it.price * it.qty, 0);

  const [form, setForm] = useState<FormState>({ name: "", email: "", address: "", city: "", zip: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const extractFieldErrors = (err: ZodError<FormState>) => {
    const mapped: Partial<Record<keyof FormState, string[]>> = {};
    for (const issue of err.issues) {
      if (!issue.path || issue.path.length === 0) continue;
      const k = issue.path[0] as keyof FormState;
      const msg = issue.message ?? String(issue);
      if (!mapped[k]) mapped[k] = [];
      mapped[k]!.push(msg);
    }
    return mapped;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormState;
    setForm((s) => ({ ...s, [key]: value }) as FormState);
    setErrors((s) => ({ ...s, [key]: undefined }));
  };
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = extractFieldErrors(parsed.error);
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        address: fieldErrors.address?.[0],
        city: fieldErrors.city?.[0],
        zip: fieldErrors.zip?.[0],
      });
      return;
    }

    setErrors({});
    showToast?.(`Order submitted — ${summary.length} line(s), total $${subtotal.toFixed(2)}.`);
    clearCart?.();
    setForm({ name: "", email: "", address: "", city: "", zip: "" });
    router.push("../checkoutSuccess");
  };
  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-12 px-6">
          <h1 className="text-4xl font-bold mb-6">Checkout</h1>
          <div className="grid md:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="md:col-span-2 bg-zinc-900 p-6 rounded shadow text-zinc-200">
              <h2 className="text-2xl font-semibold mb-4">Billing details</h2>
              {Object.values(errors).some(Boolean) && <div className="mb-4 text-sm text-red-400">Please fix the highlighted fields.</div>}
              <div className="block mb-3">
                <label htmlFor="name">
                  <span className="text-sm text-zinc-300">Full name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => {
                    const res = checkoutSchema.safeParse(form);
                    if (!res.success) {
                      const fe = extractFieldErrors(res.error);
                      setErrors((s) => ({ ...s, name: fe.name?.[0] }));
                    } else {
                      setErrors((s) => ({ ...s, name: undefined }));
                    }
                  }}
                  className="mt-1 block w-full rounded bg-white/5 px-3 py-2 text-zinc-100"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>
              <div className="block mb-3">
                <label htmlFor="email">
                  <span className="text-sm text-zinc-300">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => {
                    const res = checkoutSchema.safeParse(form);
                    if (!res.success) {
                      const fe = extractFieldErrors(res.error);
                      setErrors((s) => ({ ...s, email: fe.email?.[0] }));
                    } else {
                      setErrors((s) => ({ ...s, email: undefined }));
                    }
                  }}
                  className="mt-1 block w-full rounded bg-white/5 px-3 py-2 text-zinc-100"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
              <div className="block mb-3">
                <label htmlFor="address">
                  <span className="text-sm text-zinc-300">Address</span>
                </label>
                <textarea
                  name="address"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                  onBlur={() => {
                    const res = checkoutSchema.safeParse(form);
                    if (!res.success) {
                      const fe = extractFieldErrors(res.error);
                      setErrors((s) => ({ ...s, address: fe.address?.[0] }));
                    } else {
                      setErrors((s) => ({ ...s, address: undefined }));
                    }
                  }}
                  className="mt-1 block w-full rounded bg-white/5 px-3 py-2 text-zinc-100"
                  rows={3}
                />
                {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="block">
                  <label htmlFor="city">
                    <span className="text-sm text-zinc-300">City</span>
                  </label>
                  <input
                    name="city"
                    type="text"
                    id="city"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={() => {
                      const res = checkoutSchema.safeParse(form);
                      if (!res.success) {
                        const fe = extractFieldErrors(res.error);
                        setErrors((s) => ({ ...s, city: fe.city?.[0] }));
                      } else {
                        setErrors((s) => ({ ...s, city: undefined }));
                      }
                    }}
                    className="mt-1 block w-full rounded bg-white/5 px-3 py-2 text-zinc-100"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
                </div>
                <div className="block">
                  <label htmlFor="zip">
                    <span className="text-sm text-zinc-300">ZIP</span>
                  </label>
                  <input
                    name="zip"
                    type="text"
                    id="zip"
                    value={form.zip}
                    onChange={handleChange}
                    onBlur={() => {
                      const res = checkoutSchema.safeParse(form);
                      if (!res.success) {
                        const fe = extractFieldErrors(res.error);
                        setErrors((s) => ({ ...s, zip: fe.zip?.[0] }));
                      } else {
                        setErrors((s) => ({ ...s, zip: undefined }));
                      }
                    }}
                    className="mt-1 block w-full rounded bg-white/5 px-3 py-2 text-zinc-100"
                  />
                  {errors.zip && <p className="mt-1 text-sm text-red-400">{errors.zip}</p>}
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button type="submit" className="px-6 py-3 bg-orange-400 text-black font-semibold rounded hover:cursor-pointer hover:bg-orange-500">
                  Place order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", email: "", address: "", city: "", zip: "" });
                    setErrors({});
                  }}
                  className="px-4 py-3 border border-zinc-700 rounded text-zinc-200 hover:cursor-pointer hover:bg-zinc-800"
                >
                  Reset
                </button>
              </div>
            </form>
            <aside className="bg-zinc-800 p-6 rounded text-zinc-200">
              <h2 className="text-2xl font-semibold mb-4">Order summary</h2>
              <ul className="divide-y divide-zinc-700 mb-4">
                {summary.map((it) => (
                  <li key={it.title} className="py-3 flex justify-between">
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-zinc-500">
                        {it.qty} × ${it.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-semibold">${(it.price * it.qty).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between mb-6 text-zinc-200">
                <span className="text-sm">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
