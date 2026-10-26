import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Filter, Sliders, X } from 'lucide-react';
import { motion } from "framer-motion";
import { FilterState, Product } from "@/types";
import { products, defaultFilterState, filterOptions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { FilterDrawer, ProductGridSection } from "@/components/StoreSections";

export function ShopPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";
    const collection = searchParams.get("collection") ?? "";
    const min = Number(searchParams.get("min") ?? defaultFilterState.priceRange[0]);
    const max = Number(searchParams.get("max") ?? defaultFilterState.priceRange[1]);
    const inStockOnly = searchParams.get("stock") === "1";
    const artisan = searchParams.get("artisan") ?? "";
    const sort = searchParams.get("sort") ?? "featured";
    setFilters({
      query,
      categories: category ? [category] : [],
      collections: collection ? [collection] : [],
      priceRange: [Number.isFinite(min) ? min : defaultFilterState.priceRange[0], Number.isFinite(max) ? max : defaultFilterState.priceRange[1]],
      inStockOnly,
      artisanIds: artisan ? [artisan] : [],
    });
    if (!searchParams.get("sort")) {
      const next = new URLSearchParams(searchParams);
      next.set("sort", sort);
      setSearchParams(next, { replace: true });
    }
  }, [location.search]);

  const sort = searchParams.get("sort") ?? "featured";

  const filteredProducts = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const [minPrice, maxPrice] = filters.priceRange;
    const list = products.filter((product: Product) => {
      const matchesQuery =
        !q ||
        [product.name, product.category, product.collection, product.description, product.material, product.color, ...(product.tags ?? [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchesCollection = filters.collections.length === 0 || filters.collections.includes(product.collection);
      const matchesStock = !filters.inStockOnly || product.inStock;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesArtisan = filters.artisanIds.length === 0 || (product.artisanId ? filters.artisanIds.includes(product.artisanId) : false);
      return matchesQuery && matchesCategory && matchesCollection && matchesStock && matchesPrice && matchesArtisan;
    });
    const sorted = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
    return sorted;
  }, [filters, sort]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setFilters(defaultFilterState);
  };

  return (
    <div className="bg-[#FAF7F0] text-[#1F1E1C]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 border-b border-[#B8AD9D] pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#514B43]">Catalog</p>
            <h1 className="mt-2 font-serif text-4xl font-light tracking-tight text-[#1F1E1C] sm:text-5xl">Jodhpur-made Mojris</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#514B43]">
              Refine by size, color, price, and collection to discover handcrafted pairs shaped for ceremony, travel, and everyday elegance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 border border-[#B8AD9D] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1F1E1C] transition hover:border-[#C9A66B] hover:text-black"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 border border-[#B8AD9D] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1F1E1C] transition hover:border-[#C9A66B] hover:text-black"
            >
              <X className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-6 rounded-sm border border-[#B8AD9D] bg-white p-4">
              <div className="flex items-center justify-between gap-3 border-b border-[#B8AD9D] pb-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B43]">Refine</p>
                  <p className="mt-1 truncate text-sm text-[#1F1E1C]">Curated filters</p>
                </div>
                <Sliders className="h-4 w-4 shrink-0 text-[#514B43]" />
              </div>
              <FilterDrawer open={true} onOpenChange={() => {}} filters={filters} onChange={(next) => setFilters(next)} />
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#514B43]">
                Showing <span className="font-semibold text-[#1F1E1C]">{filteredProducts.length}</span> pieces
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#514B43]">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="min-w-0 border border-[#B8AD9D] bg-white px-3 py-2 text-sm text-[#1F1E1C] outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {(filterOptions?.categories ?? []).slice(0, 6).map((item: string) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateParam("category", item)}
                  className={cn(
                    "min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
                    filters.categories.includes(item) ? "border-[#C9A66B] bg-[#C9A66B] text-black" : "border-[#B8AD9D] bg-white text-[#1F1E1C] hover:border-[#C9A66B]"
                  )}
                >
                  <span className="block truncate">{item}</span>
                </button>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <ProductGridSection className="min-w-0" />
            </motion.div>
          </main>
        </div>
      </div>

      <FilterDrawer open={drawerOpen} onOpenChange={setDrawerOpen} filters={filters} onChange={setFilters} />
    </div>
  );
}

export default ShopPage;