import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Filter, RefreshCw, Search, Sliders, X } from 'lucide-react';
import { products, artisans, collections, categories } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import type { FilterState, MojriProduct } from "@/types";
import { cn } from "@/lib/utils";

const priceBands = [
  { label: "Under ₹2,000", value: [0, 2000] as [number, number] },
  { label: "₹2,000–₹4,000", value: [2000, 4000] as [number, number] },
  { label: "₹4,000–₹7,500", value: [4000, 7500] as [number, number] },
  { label: "₹7,500+", value: [7500, 100000] as [number, number] },
];

const initialState: FilterState = {
  query: "",
  category: "all",
  collection: "all",
  artisanId: "all",
  priceRange: [0, 100000],
  sortBy: "featured",
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = products.filter((product: MojriProduct) => {
      const matchesQuery =
        !q ||
        [product.name, product.description, product.category, product.collection, product.provenance]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(q));
      const matchesCategory = filters.category === "all" || product.category === filters.category;
      const matchesCollection = filters.collection === "all" || product.collection === filters.collection;
      const matchesArtisan = filters.artisanId === "all" || product.artisanId === filters.artisanId;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return matchesQuery && matchesCategory && matchesCollection && matchesArtisan && matchesPrice;
    });

    return [...list].sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "newest") return b.id.localeCompare(a.id);
      return Number(b.featured ?? false) - Number(a.featured ?? false) || a.name.localeCompare(b.name);
    });
  }, [filters]);

  const setField = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(initialState);

  return (
    <main className="bg-[#F7F0E3] text-[#211A17]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border border-[#CDBB9D] bg-[#FFFDFC] p-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F6258]">Catalog</p>
            <h1 className="mt-2 font-['Bodoni_Moda'] text-4xl font-light tracking-tight sm:text-5xl">Jodhpuri Mojris, curated by craft and collection.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6258]">
              Refine by color, size, style, provenance, and price to discover hand-finished pairs shaped for ceremonial dressing and everyday elegance.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">
            <span className="inline-flex items-center gap-2 border border-[#CDBB9D] px-3 py-2">
              <Sliders className="h-4 w-4" />
              {filtered.length} results
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 border border-[#CDBB9D] px-3 py-2 transition-colors hover:bg-[#741F2B] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-[#CDBB9D] bg-[#FFFDFC] p-4">
            <div className="flex items-center justify-between border-b border-[#CDBB9D] pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#741F2B]" />
                <h2 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.28em]">Filters</h2>
              </div>
              <button type="button" onClick={clearFilters} className="text-xs font-semibold uppercase tracking-[0.24em] text-[#741F2B]">
                Reset
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-5">
              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Search</span>
                <div className="flex items-center gap-2 border border-[#CDBB9D] px-3 py-2">
                  <Search className="h-4 w-4 text-[#6F6258]" />
                  <input
                    value={filters.query}
                    onChange={(e) => setField("query", e.target.value)}
                    placeholder="Search mojris, artisans, collections"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#6F6258]/70"
                  />
                </div>
              </label>

              <FilterGroup title="Category" value={filters.category} onChange={(value) => setField("category", value)} options={["all", ...categories]} />
              <FilterGroup title="Collection" value={filters.collection} onChange={(value) => setField("collection", value)} options={["all", ...collections.map((item) => item.slug)]} />
              <FilterGroup title="Artisan" value={filters.artisanId} onChange={(value) => setField("artisanId", value)} options={["all", ...artisans.map((item) => item.id)]} />

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Price</span>
                <div className="flex flex-col gap-2.5">
                  {priceBands.map((band) => (
                    <button
                      key={band.label}
                      type="button"
                      onClick={() => setField("priceRange", band.value)}
                      className={cn(
                        "flex items-center justify-between border px-3 py-2 text-left text-sm transition-colors",
                        filters.priceRange[0] === band.value[0] && filters.priceRange[1] === band.value[1]
                          ? "border-[#741F2B] bg-[#741F2B] text-white"
                          : "border-[#CDBB9D] hover:border-[#741F2B]"
                      )}
                    >
                      <span className="min-w-0 truncate">{band.label}</span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Sort</span>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setField("sortBy", e.target.value as FilterState["sortBy"])}
                    className="w-full appearance-none border border-[#CDBB9D] bg-transparent px-3 py-2 text-sm outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6258]" />
                </div>
              </label>
            </div>
          </aside>

          <section className="min-w-0">
            {filtered.length === 0 ? (
              <div className="border border-[#CDBB9D] bg-[#FFFDFC] p-10 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6F6258]">No results</p>
                <p className="mt-3 text-sm text-[#6F6258]">Try widening your price band or clearing one of the filters.</p>
                <button type="button" onClick={clearFilters} className="mt-6 border border-[#741F2B] bg-[#741F2B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                className="columns-1 gap-5 sm:columns-2 xl:columns-3"
              >
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                    className="mb-5 break-inside-avoid"
                  >
                    <ProductCard product={product} className="h-full" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({
  title = "",
  value = "all",
  onChange = () => {},
  options = [],
}: {
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: string[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">{title}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
              value === option ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] text-[#211A17] hover:border-[#741F2B]"
            )}
          >
            <span className="block max-w-full truncate">{option === "all" ? "All" : option.replace(/-/g, " ")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export { CatalogPage };
