"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">
        <div className="max-w-7xl w-full py-16 px-6">
          <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-5xl font-extrabold mb-4">Discover standout products</h1>
              <p className="text-lg text-zinc-300 mb-6">Shop modern products to elevate your lifestyle.</p>
              <div className="flex gap-3">
                <a href="#shop" className="rounded-md bg-orange-500 px-5 py-3 text-black font-semibold shadow hover:brightness-95 transition">
                  Shop Now
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
