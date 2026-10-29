import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search, Sliders, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductFilters } from '@/types';

const categoryFallback = (value?: string) => (value ?? 'all').trim().toLowerCase();
const money = (value: number, currency = '₹') => `${currency}${new Intl.NumberFormat('en-IN').format(value)}`;

const sortProducts = (items: Product[], sortBy: ProductFilters['sortBy'] = 'featured') => {
  const list = [...items];
  if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
  if (sortBy === 'name-asc') return list.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'newest') return list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  return list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
};

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo<ProductFilters>(() => ({
    query: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? 'all',
    artisanId: searchParams.get('artisanId') ?? '',
    minPrice: Number(searchParams.get('minPrice') ?? 0) || undefined,
    maxPrice: Number(searchParams.get('maxPrice') ?? 0) || undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) ?? 'featured',
  }), [searchParams]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products', { credentials: 'include' });
        const json = await res.json().catch(() => null);
        const payload = json?.data ?? json ?? [];
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : Array.isArray(payload?.products) ? payload.products : [];
        if (active) setProducts(list.filter(Boolean));
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const key = categoryFallback(p?.category);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [{ label: 'All', value: 'all', count: products.length }, ...Array.from(map.entries()).map(([value, count]) => ({ label: value === 'all' ? 'All' : value.replace(/-/g, ' '), value, count }))];
  }, [products]);

  const filtered = useMemo(() => {
    const q = filters.query?.trim().toLowerCase() ?? '';
    const category = categoryFallback(filters.category);
    const list = products.filter((p) => {
      const matchesQuery = !q || [p.name, p.description, p.category, p.material, p.origin, ...(p.colors ?? []), ...(p.sizes ?? [])].some((v) => (v ?? '').toLowerCase().includes(q));
      const matchesCategory = category === 'all' || categoryFallback(p.category) === category;
      const matchesArtisan = !filters.artisanId || p.artisanId === filters.artisanId;
      const matchesMin = filters.minPrice == null || p.price >= filters.minPrice;
      const matchesMax = filters.maxPrice == null || p.price <= filters.maxPrice;
      const matchesStock = filters.inStock == null || Boolean(p.inStock ?? true) === filters.inStock;
      const matchesFeatured = filters.featured == null || Boolean(p.featured ?? false) === filters.featured;
      return matchesQuery && matchesCategory && matchesArtisan && matchesMin && matchesMax && matchesStock && matchesFeatured;
    });
    return sortProducts(list, filters.sortBy);
  }, [filters, products]);

  const setFilter = (key: keyof ProductFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  return (
    <div className="bg-[#F5F1EB] text-[#302D29]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#C9BFB1] pb-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#71695F]">Shop</p>
            <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight sm:text-5xl">Jodhpuri Mojris</h1>
          </div>
          <button onClick={() => setMobileFiltersOpen((v) => !v)} className="inline-flex items-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#302D29] lg:hidden">
            <Sliders className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={cn('space-y-6 lg:sticky lg:top-24 lg:h-fit', mobileFiltersOpen ? 'block' : 'hidden lg:block')}>
            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.28em] text-[#71695F]">Filters</h2>
                <button onClick={clearFilters} className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B1E1E]">Reset</button>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="flex items-center gap-2 border border-[#C9BFB1] bg-white px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#71695F]" />
                  <input value={filters.query ?? ''} onChange={(e) => setFilter('query', e.target.value)} placeholder="Search mojris" className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-[#71695F]" />
                </label>
                <select value={filters.sortBy ?? 'featured'} onChange={(e) => setFilter('sortBy', e.target.value)} className="border border-[#C9BFB1] bg-white px-3 py-2 text-sm outline-none">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c.value} onClick={() => setFilter('category', c.value)} className={cn('min-w-0 border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] transition', categoryFallback(filters.category) === c.value ? 'border-[#6B1E1E] bg-[#6B1E1E] text-white' : 'border-[#C9BFB1] bg-white text-[#302D29]')}>
                      <span className="block truncate">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#71695F]">Refine</p>
              <div className="flex flex-col gap-2.5">
                <button onClick={() => setFilter('inStock', filters.inStock ? '' : 'true')} className="border border-[#C9BFB1] bg-white px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em]">
                  {filters.inStock ? 'In stock only' : 'Show in stock'}
                </button>
                <button onClick={() => setFilter('featured', filters.featured ? '' : 'true')} className="border border-[#C9BFB1] bg-white px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em]">
                  {filters.featured ? 'Featured only' : 'Featured pieces'}
                </button>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 border-b border-[#C9BFB1] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#71695F]">{loading ? 'Loading collection…' : `${filtered.length} pieces`}</p>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#71695F]">
                <Filter className="h-4 w-4" />
                <span>Editorial masonry</span>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
              {categories.slice(0, 6).map((c) => (
                <button key={c.value} onClick={() => setFilter('category', c.value)} className={cn('border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em]', categoryFallback(filters.category) === c.value ? 'border-[#6B1E1E] bg-[#6B1E1E] text-white' : 'border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29]')}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24) }}>
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="mt-10 border border-dashed border-[#C9BFB1] bg-[#FFFCF7] p-8 text-center">
                <p className="text-sm text-[#71695F]">No pieces match your current filters.</p>
                <button onClick={clearFilters} className="mt-4 inline-flex items-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                  Clear filters <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-[#C9BFB1] pt-4">
              <p className="text-sm text-[#71695F]">Looking for a bespoke pair?</p>
              <Link to="/custom-order" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6B1E1E]">
                Request custom <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;