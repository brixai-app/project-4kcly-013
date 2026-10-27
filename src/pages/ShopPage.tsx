import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Filter, Search, Sliders, RefreshCw } from 'lucide-react';
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        const json = (await res.json()) as { success?: boolean; data?: Product[]; message?: string; error?: string };
        if (!res.ok || !json?.success) throw new Error(json?.message ?? json?.error ?? "Unable to load products");
        setProducts(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") setError((err as Error)?.message ?? "Unable to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))], [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesQuery =
        !q ||
        [p.name, p.description, p.category, p.collection, p.artisan?.name].some((v) => v?.toLowerCase().includes(q));
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, query, category, sort]);

  return (
    <main className="bg-[#FAF7F0] text-[#2B2B2B]">
      <section className="border-b border-[#D8CCB8] bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Shop Jootiya</p>
              <h1 className="mt-3 font-serif text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl">
                Authentic Jodhpuri Mojris, curated with editorial restraint.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D6257] sm:text-base">
                Explore handcrafted silhouettes, artisan-led finishes, and heritage textures across a refined catalog built for slow luxury.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]">
              <Sliders className="h-4 w-4 text-[#9A7440]" />
              <span>{filtered.length} pieces</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-sm border border-[#D8CCB8] bg-[#FFFDF8] p-4">
            <div className="flex items-center gap-2 border-b border-[#D8CCB8] pb-3">
              <Filter className="h-4 w-4 text-[#9A7440]" />
              <h2 className="min-w-0 truncate font-sans text-xs font-semibold uppercase tracking-[0.28em]">Filters</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257]">Search</span>
                <div className="flex items-center gap-2 rounded-sm border border-[#D8CCB8] bg-white px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#9A7440]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search mojris, craft, artisan"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#6D6257]"
                  />
                </div>
              </label>

              <div className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257]">Category</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={cn(
                        "min-w-0 rounded-sm border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.18em] transition",
                        category === item
                          ? "border-[#9A7440] bg-[#9A7440] text-black"
                          : "border-[#D8CCB8] bg-white text-[#2B2B2B] hover:border-[#9A7440]"
                      )}
                    >
                      <span className="block min-w-0 truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257]">Sort</span>
                <div className="rounded-sm border border-[#D8CCB8] bg-white px-3 py-2">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </label>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setSort("featured");
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm border border-[#D8CCB8] bg-[#FFFDF8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#9A7440]"
              >
                <RefreshCw className="h-4 w-4 text-[#9A7440]" />
                Reset
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#D8CCB8] pb-3">
              <p className="min-w-0 truncate text-sm text-[#6D6257]">
                {loading ? "Loading collection..." : error ? error : `${filtered.length} results`}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257]">
                <span className="hidden sm:inline">Refined catalog</span>
                <ArrowRight className="h-4 w-4 text-[#9A7440]" />
              </div>
            </div>

            {error ? (
              <div className="rounded-sm border border-[#D8CCB8] bg-[#FFFDF8] p-6 text-sm text-[#6D6257]">{error}</div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="columns-1 gap-4 sm:columns-2 xl:columns-3"
              >
                {(loading ? Array.from({ length: 6 }) : filtered).map((product, index) => (
                  <div key={(product as Product)?.id ?? `skeleton-${index}`} className="mb-4 break-inside-avoid">
                    {loading ? (
                      <div className="overflow-hidden rounded-sm border border-[#D8CCB8] bg-[#FFFDF8]">
                        <div className="aspect-[3/4] animate-pulse bg-[#E9E1D3]" />
                        <div className="space-y-3 p-4">
                          <div className="h-3 w-24 animate-pulse bg-[#E9E1D3]" />
                          <div className="h-4 w-3/4 animate-pulse bg-[#E9E1D3]" />
                          <div className="h-3 w-16 animate-pulse bg-[#E9E1D3]" />
                        </div>
                      </div>
                    ) : (
                      <ProductCard product={product as Product} />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ShopPage;