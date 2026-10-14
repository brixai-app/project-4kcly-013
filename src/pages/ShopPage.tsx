import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Sliders, ChevronDown } from 'lucide-react';
import { products } from '@/data/mockData';
import type { Category, Size, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export interface ShopPageProps {
  className?: string;
}

type SortOption = 'new' | 'price-asc' | 'price-desc';

function useQueryParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(location.search);
    if (value && value.length > 0) next.set(key, value);
    else next.delete(key);
    navigate({ search: next.toString() }, { replace: true });
  };

  return { params, setParam };
}

function applyFilters(
  items: Product[],
  search: string,
  category: string,
  size: string,
  sort: SortOption
) {
  const s = search.toLowerCase();
  let result = items.filter(p => {
    const matchSearch =
      !s ||
      p.name.toLowerCase().includes(s) ||
      p.collection.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s);
    const matchCategory = !category || p.category === (category as Category);
    const matchSize = !size || p.sizes.includes(size as Size);
    return matchSearch && matchCategory && matchSize;
  });

  result = [...result].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return result;
}

export function ShopPage({ className = '' }: ShopPageProps) {
  const { params, setParam } = useQueryParams();

  const search = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const size = params.get('size') ?? '';
  const sort = (params.get('sort') as SortOption) ?? 'new';

  const filtered = useMemo(
    () => applyFilters(products ?? [], search, category, size, sort),
    [search, category, size, sort]
  );

  const categories: Category[] = ['Heels', 'Loafers', 'Sneakers', 'Sandals', 'Boots', 'Mules', 'Slides'];
  const sizes: Size[] = ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'];

  return (
    <main className={cn('min-h-screen bg-[#F9F6F2] pt-24 pb-16', className)}>
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <header className="mb-10 flex flex-col gap-4 border-b border-[#E6DED3] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-[#6F675E] uppercase">
              Jootiya Atelier
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-light tracking-tight text-[#2E2B28]">
              Shop the Edit
            </h1>
            <p className="mt-2 text-sm text-[#6F675E] max-w-xl">
              Curated silhouettes in Italian leather, designed for quiet luxury and long city walks.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6F675E]">
            <Filter className="w-4 h-4" />
            <span>
              {filtered.length} styles · Sorted by{' '}
              {sort === 'new' ? 'Newest' : sort === 'price-asc' ? 'Price (Low–High)' : 'Price (High–Low)'}
            </span>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[260px,1fr]">
          <aside className="space-y-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#BFA06A]" />
              <input
                value={search}
                onChange={e => setParam('q', e.target.value || null)}
                placeholder="Search silhouettes, leather, colour..."
                className="w-full rounded-xl border border-[#E6DED3] bg-[#F9F6F2] px-9 py-2 text-sm text-[#2E2B28] placeholder:text-[#BFA06A]/70 focus:outline-none focus:ring-2 focus:ring-[#BFA06A]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#6F675E] uppercase">
                <Sliders className="w-3.5 h-3.5" />
                <span>Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setParam('category', null)}
                  className={cn(
                    'px-3 py-1.5 border text-xs uppercase tracking-[0.18em]',
                    'rounded-md transition-colors',
                    !category
                      ? 'bg-[#2E2B28] text-[#F9F6F2] border-[#2E2B28]'
                      : 'border-[#E6DED3] text-[#6F675E] hover:border-[#BFA06A]'
                  )}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setParam('category', cat === category ? null : cat)}
                    className={cn(
                      'px-3 py-1.5 border text-xs uppercase tracking-[0.18em] rounded-md transition-colors',
                      category === cat
                        ? 'bg-[#BFA06A] text-black border-[#BFA06A]'
                        : 'border-[#E6DED3] text-[#6F675E] hover:border-[#BFA06A]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#6F675E] uppercase">Size</p>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setParam('size', s === size ? null : s)}
                    className={cn(
                      'px-2 py-1.5 border text-[11px] tracking-[0.16em] rounded-md transition-colors',
                      size === s
                        ? 'bg-[#2E2B28] text-[#F9F6F2] border-[#2E2B28]'
                        : 'border-[#E6DED3] text-[#6F675E] hover:border-[#BFA06A]'
                    )}
                  >
                    {s.replace('EU ', '')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#6F675E] uppercase">Sort</p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setParam('sort', e.target.value || null)}
                  className="w-full appearance-none rounded-md border border-[#E6DED3] bg-white px-3 py-2 text-xs text-[#2E2B28] tracking-[0.14em] uppercase focus:outline-none focus:ring-2 focus:ring-[#BFA06A]"
                >
                  <option value="new">Newest Arrivals</option>
                  <option value="price-asc">Price · Low to High</option>
                  <option value="price-desc">Price · High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-[#6F675E]" />
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            {filtered.length === 0 && (
              <div className="border border-dashed border-[#E6DED3] rounded-2xl p-10 text-center">
                <p className="text-sm text-[#6F675E]">
                  No styles match this curation. Adjust your filters to explore more silhouettes.
                </p>
              </div>
            )}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map(product => (
                <div key={product.id} className="break-inside-avoid">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default ShopPage;