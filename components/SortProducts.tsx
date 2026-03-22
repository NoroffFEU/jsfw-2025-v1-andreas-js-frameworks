"use client";

import { SortProps } from "../types/sortProps";

export default function SortProducts({ sortOption, setSortOption }: SortProps) {
  return (
    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-md bg-zinc-900 px-3 text-sm text-white h-12 w-40 shrink-0">
      <option value="featured">Featured</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating-desc">Top Rated</option>
    </select>
  );
}
