import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, Search, Sliders } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { products, filterOptions } from "@/data/mockData";
import { FiltersPanel, ProductGrid } from "@/components/StorefrontSections";

export function ShopPage({ className = "" }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams(location.search ?? "");
    setSearch(params.get("q") ?? "");
    setActiveCategory(params.get("category") ?? "All");
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter((product) => {
      const matchesSearch =
        !q ||
        [product.name, product.description, product.category, product.collection, product.material, product.color]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const updateQuery = (nextSearch: string, nextCategory: string) => {
    const params = new URLSearchParams(location.search ?? "");
    if (nextSearch.trim()) params.set("q", nextSearch.trim());
    else params.delete("q");
    if (nextCategory && nextCategory !== "All") params.set("category", nextCategory);
    else params.delete("category");
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
  };

  return (
    <main className={cn("bg-[#F5F0E6] text-[#2B2B2B]", className)}>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-4 shadow-[0_10px_30px_rgba(43,43,43,0.05)]">
            <div className="flex items-center gap-2 border-b border-[#C9A66B]/60 pb-4">
              <Sliders className="h-4 w-4 text-[#B04E2C]" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Editorial Filters</p>
                <h1 className="truncate font-serif text-2xl font-medium text-[#2B2B2B]">Shop Jootiya</h1>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Search</span>
                <div className="flex items-center gap-2 rounded-md border border-[#C9A66B] bg-white px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#6D6257]" />
                  <input
                    value={search}
                    onChange={(e) => {
                      const next = e.target.value;
                      setSearch(next);
                      updateQuery(next, activeCategory);
                    }}
                    placeholder="Search mojris, materials, collections"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#6D6257]/70"
                  />
                </div>
              </label>
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Category</span>
                <div className="flex flex-wrap gap-2">
                  {["All", ...(filterOptions?.categories ?? [])].map((category) => {
                    const active = activeCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setActiveCategory(category);
                          updateQuery(search, category);
                        }}
                        className={cn(
                          "min-w-0 max-w-full truncate rounded-md border px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.22em] transition",
                          active
                            ? "border-[#B04E2C] bg-[#B04E2C] text-white"
                            : "border-[#C9A66B] bg-white text-[#2B2B2B] hover:border-[#B04E2C] hover:text-[#B04E2C]"
                        )}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
              <FiltersPanel className="rounded-[18px] border border-[#C9A66B]/70 bg-[#faf9f6] p-3" />
            </div>
          </aside>

          <section className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mb-5 flex items-end justify-between gap-4 border-b border-[#C9A66B]/60 pb-4"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Collection Index</p>
                <h2 className="font-serif text-3xl font-medium text-[#2B2B2B] sm:text-4xl">Handcrafted Rajasthani Mojris</h2>
              </div>
              <div className="hidden items-center gap-2 rounded-md border border-[#C9A66B] bg-[#FFFBF4] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6D6257] sm:flex">
                <Filter className="h-4 w-4 text-[#B04E2C]" />
                {filteredProducts.length} Pieces
              </div>
            </motion.div>
            <ProductGrid className="min-w-0" />
          </section>
        </div>
      </section>
    </main>
  );
}

export default ShopPage;