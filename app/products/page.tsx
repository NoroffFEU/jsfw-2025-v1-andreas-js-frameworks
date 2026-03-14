"use client";

import { FetchProducts } from "../../components/FetchProducts";

export default function AllProductsPage() {
  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="max-w-7xl w-full pt-12 pb-16 px-6">
          <h1 className="text-3xl font-bold mb-6 text-white">All Products</h1>
          <FetchProducts />
        </div>
      </main>
    </>
  );
}
