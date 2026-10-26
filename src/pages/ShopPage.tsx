import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Search, Sliders, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products, categories, categoryLabels } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import type { Product, ProductColor, ProductSize } from '@/types';

type SortBy = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const sizeOptions: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const colorOptions: ProductColor[] = ['ivory', 'maroon', 'antique-gold', 'tan', 'black', 'rust'];
const sortOptions: { label: string; value: SortBy }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export function ShopPage({ className = '' }: { className?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'all');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') ?? 'all');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') ?? 'all');
  const [sortBy, setSortBy] = useState<SortBy>((searchParams.get('sort') as SortBy) ?? 'featured');

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const matchesQuery =
        !q ||
        [product.name, product.description, product.material, product.craftsmanship, product.artisanName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSize = selectedSize === 'all' || product.sizes?.includes(selectedSize as ProductSize);
      const matchesColor = selectedColor === 'all' || product.colors?.includes(selectedColor as ProductColor);
      return matchesQuery && matchesCategory && matchesSize && matchesColor;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return sorted;
  }, [query, selectedCategory, selectedSize, selectedColor, sortBy]);

  const updateParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  const activeCount = [selectedCategory, selectedSize, selectedColor].filter((v) => v !== 'all').length + (query ? 1 : 0);

  return (
    <div className={cn('bg-[#F7F0E4] text-[#2B1715]', className)}>
      <section className="border-b border-[#CDBB9F] bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#765F55]">Shop the collection</p>
              <h1 className="mt-2 font-serif text-4xl font-light tracking-tight sm:text-5xl">Jodhpuri Mojris, curated with editorial restraint.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#765F55]">
                Explore handcrafted silhouettes, heritage materials, and artisan-led finishes across bridal, menswear, and everyday ceremonial pairs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 border border-[#CDBB9F] bg-transparent px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#2B1715] transition hover:border-[#741F2B] hover:text-[#741F2B]"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-sm border border-[#CDBB9F] bg-[#FFFDF8] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#765F55]">Filters</p>
                <h2 className="mt-1 min-w-0 truncate font-serif text-xl font-light">Refine the drop</h2>
              </div>
              <Sliders className="h-4 w-4 text-[#741F2B]" />
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55]">Search</span>
                <div className="flex items-center gap-2 border border-[#CDBB9F] bg-white px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#765F55]" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      updateParams({ q: e.target.value });
                    }}
                    placeholder="Search mojris, colors, artisans"
                    className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-[#765F55]/70"
                  />
                </div>
              </label>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55]">Category</span>
                <div className="flex flex-wrap gap-2">
                  {['all', ...categories].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        updateParams({ category: category === 'all' ? '' : category });
                      }}
                      className={cn(
                        'min-w-0 border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] transition',
                        selectedCategory === category
                          ? 'border-[#741F2B] bg-[#741F2B] text-white'
                          : 'border-[#CDBB9F] bg-transparent text-[#2B1715] hover:border-[#741F2B] hover:text-[#741F2B]'
                      )}
                    >
                      <span className="block min-w-0 truncate">{category === 'all' ? 'All' : categoryLabels[category as keyof typeof categoryLabels]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55]">Size</span>
                <div className="flex flex-wrap gap-2">
                  {['all', ...sizeOptions].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        updateParams({ size: size === 'all' ? '' : size });
                      }}
                      className={cn(
                        'border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
                        selectedSize === size
                          ? 'border-[#741F2B] bg-[#741F2B] text-white'
                          : 'border-[#CDBB9F] bg-transparent text-[#2B1715] hover:border-[#741F2B] hover:text-[#741F2B]'
                      )}
                    >
                      {size === 'all' ? 'All' : size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55]">Color</span>
                <div className="flex flex-wrap gap-2">
                  {['all', ...colorOptions].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        updateParams({ color: color === 'all' ? '' : color });
                      }}
                      className={cn(
                        'border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
                        selectedColor === color
                          ? 'border-[#741F2B] bg-[#741F2B] text-white'
                          : 'border-[#CDBB9F] bg-transparent text-[#2B1715] hover:border-[#741F2B] hover:text-[#741F2B]'
                      )}
                    >
                      {color === 'all' ? 'All' : color}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55]">Sort</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      const value = e.target.value as SortBy;
                      setSortBy(value);
                      updateParams({ sort: value });
                    }}
                    className="w-full appearance-none border border-[#CDBB9F] bg-white px-3 py-3 pr-10 text-sm outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#765F55]" />
                </div>
              </label>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 border border-[#741F2B] bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#57151F]"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[#765F55]">
                {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}
                {activeCount > 0 ? <span className="ml-2 text-[#741F2B]">• {activeCount} active filter{activeCount === 1 ? '' : 's'}</span> : null}
              </p>
              <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#765F55] sm:flex">
                <Filter className="h-4 w-4" />
                Curated masonry
              </div>
            </div>

            <motion.div layout className="columns-1 gap-5 sm:columns-2 xl:columns-3">
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
                  className="mb-5 break-inside-avoid"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 ? (
              <div className="mt-10 border border-[#CDBB9F] bg-[#FFFDF8] p-8 text-center">
                <p className="font-serif text-2xl font-light">No pieces match these filters.</p>
                <p className="mt-2 text-sm text-[#765F55]">Try widening the size, color, or category selection.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 inline-flex items-center justify-center border border-[#741F2B] bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#57151F]"
                >
                  Reset filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopPage;