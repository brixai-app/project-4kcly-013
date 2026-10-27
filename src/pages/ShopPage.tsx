import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Search, Sliders } from 'lucide-react';
import { CatalogControlsGrid, ProductPageComposition } from "@/components/StoreSections";
import { cn } from "@/lib/utils";
import { filters as defaultFilters } from "@/data/mockData";

type ShopPageProps = {
  className?: string;
};

function useQueryFilters() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search ?? ""), [location.search]);

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const artisan = params.get("artisan") ?? "";
  const sortBy = (params.get("sortBy") ?? "featured") as "featured" | "newest" | "price-asc" | "price-desc";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(location.search ?? "");
    if (value) next.set(key, value);
    else next.delete(key);
    navigate({ pathname: location.pathname, search: next.toString() ? `?${next.toString()}` : "" }, { replace: true });
  };

  return { search, category, artisan, sortBy, setParam };
}

export function ShopPage({ className = "" }: ShopPageProps = {}) {
  const { search, category, artisan, sortBy, setParam } = useQueryFilters();

  const activeSummary = useMemo(() => {
    const parts = [
      search ? `Search: ${search}` : "",
      category ? `Category: ${category}` : "",
      artisan ? `Artisan: ${artisan}` : "",
      sortBy !== "featured" ? `Sort: ${sortBy}` : "",
    ].filter(Boolean);
    return parts.length ? parts.join(" · ") : "Browse the full Jootiya collection";
  }, [artisan, category, search, sortBy]);

  return (
    <motion.main
      className={cn("bg-[#F9F5F0] text-[#2B2B2B]", className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#D8CBBB] pb-4">
              <div className="min-w-0">
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">
                  <Sliders className="h-4 w-4" />
                  Editorial Catalog
                </p>
                <h1 className="font-['Bodoni_Moda',serif] text-4xl font-light tracking-tight sm:text-5xl">
                  Jodhpuri Mojris
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6D6259]">{activeSummary}</p>
              </div>
              <div className="hidden shrink-0 rounded-sm border border-[#D8CBBB] bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6259] md:block">
                {defaultFilters?.categories?.length ?? 0} categories
              </div>
            </div>
            <ProductPageComposition className="min-w-0" />
          </div>

          <aside className="min-w-0 border border-[#D8CBBB] bg-[#FFFDFC] p-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-4 flex items-center gap-2 border-b border-[#D8CBBB] pb-3">
              <Filter className="h-4 w-4 text-[#BFA06E]" />
              <h2 className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">
                Refine Selection
              </h2>
            </div>

            <div className="mb-4 rounded-sm border border-[#D8CBBB] bg-[#F9F5F0] p-3">
              <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6D6259]">
                <Search className="h-4 w-4" />
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
                placeholder="Search mojris, artisans, motifs"
                className="w-full rounded-sm border border-[#D8CBBB] bg-[#FFFDFC] px-3 py-2 text-sm text-[#2B2B2B] outline-none transition focus:border-[#BFA06E]"
              />
            </div>

            <CatalogControlsGrid
              className="min-w-0"
              search={search}
              category={category}
              artisan={artisan}
              sortBy={sortBy}
              onSearchChange={(value: string) => setParam("search", value)}
              onCategoryChange={(value: string) => setParam("category", value)}
              onArtisanChange={(value: string) => setParam("artisan", value)}
              onSortChange={(value: string) => setParam("sortBy", value)}
            />
          </aside>
        </div>
      </section>
    </motion.main>
  );
}

export default ShopPage;