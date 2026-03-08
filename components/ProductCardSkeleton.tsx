"use client";

export default function ProductCardSkeleton() {
  return (
    <article className="flex flex-col rounded-lg bg-white/5 overflow-hidden shadow-sm animate-pulse">
      <div className="relative h-52 w-full bg-zinc-800" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-5 bg-zinc-700 rounded w-3/4 mb-3" />
          <div className="flex items-center gap-3 mb-3">
            <div className="h-4 bg-zinc-700 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-full" />
            <div className="h-3 bg-zinc-700 rounded w-5/6" />
            <div className="h-3 bg-zinc-700 rounded w-2/3" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-zinc-700 rounded w-16" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="h-8 bg-zinc-700 rounded w-24" />
            <div className="h-8 bg-zinc-700 rounded w-24" />
          </div>
        </div>
      </div>
    </article>
  );
}
