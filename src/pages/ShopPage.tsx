import { useEffect, useMemo, useState } from 'react';
import { Search, Sliders, ArrowUpRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterSidebar, ProductGrid } from '@/components/StorefrontSections';
import type { Product, ProductFilterState } from '@/types';

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Partial<ProductFilterState>>({
    query: '',
    sortBy: 'featured',
    categories: [],
    genders: [],
    sizes: [],
    availability: [],
    featuredOnly: false,
    handcraftedOnly: false,
    priceRange: [0, 100000],
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/products');
        const json = await res.json().catch(() => null);
        const payload = Array.isArray(json) ? json : (json?.data ?? json?.products ?? json?.items ?? []);
        const next = Array.isArray(payload) ? payload : [];
        if (active) setProducts(next);
      } catch {
        if (active) setError('Unable to load the collection right now.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = (filters.query ?? '').trim().toLowerCase();
    const categories = filters.categories ?? [];
    const genders = filters.genders ?? [];
    const sizes = filters.sizes ?? [];
    const availability = filters.availability ?? [];
    const [minPrice, maxPrice] = filters.priceRange ?? [0, Number.MAX_SAFE_INTEGER];

    const list = products.filter((product) => {
      const matchesQuery =
        !query ||
        [product.name, product.category, product.artisan, product.material, product.color, ...(product.tags ?? [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesCategory = categories.length === 0 || categories.some((category) => String(product.category ?? '').toLowerCase() === String(category ?? '').toLowerCase());
      const matchesGender = genders.length === 0 || genders.includes(product.gender);
      const matchesSize = sizes.length === 0 || sizes.some((size) => (product.sizes ?? []).includes(size));
      const matchesAvailability =
        availability.length === 0 || availability.includes(product.availability ?? 'in_stock');
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesFeatured = !filters.featuredOnly || !!product.featured;
      const matchesHandcrafted = !filters.handcraftedOnly || !!product.handcrafted;
      return matchesQuery && matchesCategory && matchesGender && matchesSize && matchesAvailability && matchesPrice && matchesFeatured && matchesHandcrafted;
    });

    const sortBy = filters.sortBy ?? 'featured';
    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === 'newest') return Number(!!b.newArrival) - Number(!!a.newArrival);
      return Number(!!b.featured) - Number(!!a.featured);
    });
  }, [filters, products]);

  return (
    <main className="bg-[#F9F5F0] text-[#2E2B28]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border border-[#CDBB9B] bg-[#FFFDF9] p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Shop Jootiya</p>
              <h1 className="mt-2 font-['Bodoni_Moda'] text-4xl font-light tracking-tight sm:text-5xl">
                Authentic Jodhpuri Mojris, curated with editorial precision.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E6258]">
                Explore handcrafted silhouettes, heritage finishes, and occasion-ready pairs sourced from master artisans.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6258]">
              <ArrowUpRight className="h-4 w-4" />
              <span>{filteredProducts.length} pieces</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="min-w-0">
              <div className="sticky top-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6258]">
                  <Sliders className="h-4 w-4" />
                  <span>Filters</span>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
                  className="rounded-none border border-[#CDBB9B] bg-[#FFFDF9] p-4"
                />
              </div>
            </aside>

            <section className="min-w-0">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex min-w-0 flex-1 items-center gap-3 border border-[#CDBB9B] bg-[#FFFDF9] px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#6E6258]" />
                  <input
                    value={filters.query ?? ''}
                    onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                    placeholder="Search by style, artisan, material..."
                    className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-[#6E6258]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setFilters({ query: '', sortBy: 'featured', categories: [], genders: [], sizes: [], availability: [], featuredOnly: false, handcraftedOnly: false, priceRange: [0, 100000] })}
                  className="inline-flex items-center gap-2 border border-[#CDBB9B] bg-[#FFFDF9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2E2B28] transition-colors hover:bg-[#F9F5F0]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              {loading ? (
                <div className="flex min-h-[40vh] items-center justify-center border border-dashed border-[#CDBB9B] bg-[#FFFDF9]">
                  <div className="flex items-center gap-3 text-sm text-[#6E6258]">
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <RefreshCw className="h-4 w-4" />
                    </motion.span>
                    Loading collection...
                  </div>
                </div>
              ) : error ? (
                <div className="border border-[#CDBB9B] bg-[#FFFDF9] p-6 text-sm text-[#6E6258]">{error}</div>
              ) : (
                <ProductGrid products={filteredProducts} className="min-w-0" />
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ShopPage;