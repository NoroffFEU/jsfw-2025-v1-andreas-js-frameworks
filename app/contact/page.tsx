"use client";

import { useState, ChangeEvent, FocusEvent, SyntheticEvent } from "react";
import type { ZodError } from "zod";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { contactSchema, type ContactForm } from "./contactSchema";

type FormState = ContactForm;
type FormErrors = Partial<Record<keyof FormState, string>>;

export default function Contact() {
  const [form, setForm] = useState<FormState>({ fullName: "", subject: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const { showToast } = useCart();

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

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const key = name as keyof FormState;
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = extractFieldErrors(result.error);
      const msg = fieldErrors[key]?.[0];
      setErrors((s) => ({ ...s, [key]: msg }));
    } else {
      setErrors((s) => ({ ...s, [key]: undefined }));
    }
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = extractFieldErrors(parsed.error);
      setErrors({
        fullName: fieldErrors.fullName?.[0],
        subject: fieldErrors.subject?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      });
      return;
    }

    showToast?.("Message sent. Thank you!");
    setForm({ fullName: "", subject: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-20 px-6">
          <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-zinc-300 mb-6">Have questions? Get in touch with our support team.</p>
          <div className="w-full mt-6 bg-zinc-900 p-6 rounded-md shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label htmlFor="fullName">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Full Name</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-400">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="subject">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Subject</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-400">
                    {errors.subject}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="message">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Message</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical"
                  required
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <button type="submit" className="rounded-md bg-orange-500 px-5 py-3 text-black font-semibold hover:bg-orange-400 hover:cursor-pointer">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
