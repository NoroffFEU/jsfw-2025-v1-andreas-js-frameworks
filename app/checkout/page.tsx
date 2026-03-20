"use client";

import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import type { ZodError } from "zod";
import { useCart } from "../../context/CartContext";
import { checkoutSchema, type CheckoutForm } from "./checkoutSchema";
import { OrderLine } from "../../types/orderLine";

type FormState = CheckoutForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CheckoutPage() {
  const { cart, clearCart, showToast } = useCart();
  const router = useRouter();

  const getUnitPrice = (product: (typeof cart)[number]) => (product.discountedPrice != null && product.discountedPrice < product.price ? product.discountedPrice : product.price);

  const groupCartItems = (cartItems: typeof cart): OrderLine[] => {
    const map = new Map<string, OrderLine>();
    for (const product of cartItems) {
      const existing = map.get(product.id);
      const price = getUnitPrice(product);
      if (existing) existing.quantity++;
      else map.set(product.id, { productId: product.id, title: product.title, quantity: 1, unitPrice: price });
    }
    return Array.from(map.values());
  };

  const orderLines = groupCartItems(cart);
  const subtotal = orderLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const initialForm: FormState = { name: "", email: "", address: "", city: "", zip: "" };
  const [form, setForm] = useState<FormState>(initialForm);
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

  const handleFieldBlur = (field: keyof FormState) => {
    const res = checkoutSchema.safeParse(form);
    if (!res.success) {
      const fieldErrors = extractFieldErrors(res.error);
      setErrors((s) => ({ ...s, [field]: fieldErrors[field]?.[0] }));
    } else {
      setErrors((s) => ({ ...s, [field]: undefined }));
    }
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
    showToast?.(`Order submitted — ${orderLines.length} line(s), total $${subtotal.toFixed(2)}.`);
    clearCart?.();
    setForm(initialForm);
    router.push("../checkoutSuccess");
  };
  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-12 px-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Checkout</h1>
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
                  onBlur={() => handleFieldBlur("name")}
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
                  onBlur={() => handleFieldBlur("email")}
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
                  onBlur={() => handleFieldBlur("address")}
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
                    onBlur={() => handleFieldBlur("city")}
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
                    onBlur={() => handleFieldBlur("zip")}
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
                    setForm(initialForm);
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
                {orderLines.map((line) => (
                  <li key={line.productId} className="py-3 flex justify-between">
                    <div>
                      <div className="font-medium">{line.title}</div>
                      <div className="text-sm text-zinc-500">
                        {line.quantity} × ${line.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-semibold">${(line.unitPrice * line.quantity).toFixed(2)}</div>
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
    </>
  );
}
