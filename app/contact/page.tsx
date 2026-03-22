"use client";

import type { z } from "zod";
import { useCart } from "../../context/CartContext";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema } from "./ContactSchema";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullName: "",
      subject: "",
      email: "",
      message: "",
    },
    mode: "onBlur",
  });

  const { showToast } = useCart();

  const onSubmit = () => {
    showToast?.("Message sent. Thank you!");
    reset();
  };

  const onError = (errors: FieldErrors<z.infer<typeof ContactSchema>>) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const fieldElement = document.getElementsByName(`[name="${firstErrorKey}"]`);
      if (fieldElement && fieldElement[0]) {
        fieldElement[0].focus();
      }
    }
  };

  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="max-w-6xl w-full py-20 px-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-lg text-zinc-300 mb-6">Have questions? Get in touch with our support team.</p>
          <div className="w-full mt-6 bg-zinc-900 p-6 rounded-md shadow-sm">
            <form onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label htmlFor="fullName">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Full Name</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register("fullName")}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-400">
                    {errors.fullName.message}
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
                  {...register("subject")}
                  aria-invalid={errors.subject ? "true" : "false"}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-400">
                    {errors.subject.message}
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
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="message">
                  <span className="text-sm font-medium text-zinc-200 mb-1">Message</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message")}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="w-full rounded-md bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical"
                  required
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="rounded-md bg-orange-400 px-5 py-3 text-black font-semibold hover:bg-orange-500 hover:cursor-pointer">
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
