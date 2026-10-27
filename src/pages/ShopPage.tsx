import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { categories, products, shopSortOptions } from '@/data/mockData';
import { CommerceSections } from '@/components/CommerceSections';
import type { ProductFilters, ShopSortOption } from '@/types';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({
    query: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? 'All',
    priceRange: [0, 99999],
    artisan: searchParams.get('artisan') ?? '',
    inStockOnly: searchParams.get('inStock') === '1',
  });
  const [sort, setSort] = useState<ShopSortOption>(shopSortOptions?.[0] ?? { label: 'Featured', value: 'featured' });

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return (products ?? [])
      .filter((product) => {
        const matchesQuery =
          !query ||
          [product?.name, product?.category, product?.artisan, product?.description, ...(product?.tags ?? [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
        const matchesCategory = filters.category === 'All' || product?.category === filters.category;
        const matchesPrice = (product?.price ?? 0) >= filters.priceRange[0] && (product?.price ?? 0) <= filters.priceRange[1];
        const matchesArtisan = !filters.artisan || product?.artisan === filters.artisan;
        const matchesStock = !filters.inStockOnly || product?.inStock !== false;
        return matchesQuery && matchesCategory && matchesPrice && matchesArtisan && matchesStock;
      })
      .sort((a, b) => {
        if (sort.value === 'price-asc') return (a?.price ?? 0) - (b?.price ?? 0);
        if (sort.value === 'price-desc') return (b?.price ?? 0) - (a?.price ?? 0);
        if (sort.value === 'newest') return (b?.id ?? '').localeCompare(a?.id ?? '');
        return Number(Boolean(b?.featured)) - Number(Boolean(a?.featured));
      });
  }, [filters, sort]);

  const updateFilters = (next: ProductFilters) => {
    setFilters(next);
    const nextParams = new URLSearchParams(searchParams);
    next.query ? nextParams.set('q', next.query) : nextParams.delete('q');
    next.category && next.category !== 'All' ? nextParams.set('category', next.category) : nextParams.delete('category');
    next.artisan ? nextParams.set('artisan', next.artisan) : nextParams.delete('artisan');
    next.inStockOnly ? nextParams.set('inStock', '1') : nextParams.delete('inStock');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="bg-[#FAF9F6] text-[#2B2B2B]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-[#D8CDBB] pb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6E665C]">Shop Jootiya</p>
            <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-light tracking-tight sm:text-5xl">Jodhpuri Mojris, curated with restraint.</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6E665C]">
            <Sliders className="h-4 w-4" />
            <span>{filteredProducts.length} pieces</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0 border border-[#D8CDBB] bg-white p-4">
            <div className="mb-4 flex items-center gap-2 border-b border-[#D8CDBB] pb-3">
              <Filter className="h-4 w-4 text-[#9A7135]" />
              <h2 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.25em] text-[#6E665C]">Refine</h2>
            </div>
            <CommerceSections.ShopFilters filters={filters} onChange={updateFilters} sort={sort} onSortChange={setSort} />
            <div className="mt-6 border-t border-[#D8CDBB] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6E665C]">Quick links</p>
              <div className="mt-3 flex flex-col gap-2.5">
                <Link to="/journey" className="inline-flex items-center justify-between border border-[#D8CDBB] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]">
                  Craft story <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/cart" className="inline-flex items-center justify-between border border-[#D8CDBB] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]">
                  View cart <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 border-b border-[#D8CDBB] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-sm text-[#6E665C]">
                <Search className="h-4 w-4" />
                <span className="min-w-0 truncate">Search and sort the collection with editorial precision.</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6E665C]">
                {filteredProducts.length === 0 ? 'No results' : 'Available now'}
              </p>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="min-w-0">
              <CommerceSections.ProductMasonry className="min-w-0" />
            </motion.div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {filteredProducts.slice(0, 2).map((product, index) => (
                <div key={product?.id ?? index} className="border border-[#D8CDBB] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6E665C]">{product?.category ?? 'Collection'}</p>
                  <h3 className="mt-2 font-['Playfair_Display'] text-2xl font-light">{product?.name ?? 'Mojri'}</h3>
                  <p className="mt-2 text-sm text-[#6E665C]">{product?.description ?? 'Hand-finished leatherwork with a quiet, ceremonial profile.'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ShopPage;