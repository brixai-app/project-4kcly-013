import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Search, Sliders } from 'lucide-react';
import { products } from '@/data/mockData';
import { ProductMasonryGrid } from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import type { Product, ProductFilters } from '@/types';

export function ShopPage({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [color, setColor] = useState('all');
  const [style, setStyle] = useState('all');
  const [sortBy, setSortBy] = useState<ProductFilters['sortBy']>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products ?? []).filter((product: Product) => {
      const matchesQuery =
        !q ||
        [product.name, product.description, product.category, product.material, product.color, product.artisan]
          .filter(Boolean)
          .some((value) => String(value ?? '').toLowerCase().includes(q));
      const matchesCategory = category === 'all' || String(product.category ?? '').toLowerCase() === category;
      const matchesSize = size === 'all' || (product.sizes ?? []).includes(size);
      const matchesColor = color === 'all' || String(product.color ?? '').toLowerCase().includes(color);
      const matchesStyle = style === 'all' || String(product.material ?? '').toLowerCase().includes(style);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesQuery && matchesCategory && matchesSize && matchesColor && matchesStyle && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return Number(b.featured ?? false) - Number(a.featured ?? false);
      return Number(b.featured ?? false) - Number(a.featured ?? false) || (b.rating ?? 0) - (a.rating ?? 0);
    });
  }, [query, category, size, color, style, sortBy, priceRange]);

  const categories = ['all', 'mojri', 'bridal', 'festive', 'classic', 'limited'];
  const sizes = ['all', '6', '7', '8', '9', '10', '11'];
  const colors = ['all', 'tan', 'brown', 'ivory', 'gold', 'black'];
  const styles = ['all', 'leather', 'embroidered', 'handcrafted', 'suede'];

  return (
    <div className={cn('bg-[#FAF9F6] text-[#1A1A1A]', className)}>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-sm border border-[#D8CDBD] bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#A94721]" />
              <h1 className="min-w-0 truncate font-['Playfair_Display'] text-2xl font-medium">Shop Jootiya</h1>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#675F56]">
                  <Search className="h-3.5 w-3.5" />
                  Search
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search mojris, colors, artisans"
                  className="w-full rounded-sm border border-[#D8CDBD] bg-[#FAF9F6] px-3 py-2 text-sm outline-none transition focus:border-[#A94721]"
                />
              </label>

              <div>
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#675F56]">
                  <Sliders className="h-3.5 w-3.5" />
                  Category
                </span>
                <div className="flex flex-col gap-2.5">
                  {categories.map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={cn(
                        'min-w-0 truncate rounded-sm border px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest transition',
                        category === item
                          ? 'border-[#A94721] bg-[#A94721] text-white'
                          : 'border-[#D8CDBD] bg-white text-[#1A1A1A] hover:border-[#A94721]'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#675F56]">Size</span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSize(item)}
                      className={cn(
                        'rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                        size === item
                          ? 'border-[#A94721] bg-[#A94721] text-white'
                          : 'border-[#D8CDBD] bg-white text-[#1A1A1A] hover:border-[#A94721]'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#675F56]">Color</span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((item) => (
                    <button
                      key={item}
                      onClick={() => setColor(item)}
                      className={cn(
                        'rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                        color === item
                          ? 'border-[#A94721] bg-[#A94721] text-white'
                          : 'border-[#D8CDBD] bg-white text-[#1A1A1A] hover:border-[#A94721]'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#675F56]">Style</span>
                <div className="flex flex-wrap gap-2">
                  {styles.map((item) => (
                    <button
                      key={item}
                      onClick={() => setStyle(item)}
                      className={cn(
                        'rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition',
                        style === item
                          ? 'border-[#A94721] bg-[#A94721] text-white'
                          : 'border-[#D8CDBD] bg-white text-[#1A1A1A] hover:border-[#A94721]'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#675F56]">Price Sort</span>
                <button
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                  className="flex w-full items-center justify-between rounded-sm border border-[#D8CDBD] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest transition hover:border-[#A94721]"
                >
                  <span>{sortBy === 'price-asc' ? 'Price Low to High' : 'Price High to Low'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex flex-col gap-3 border-b border-[#D8CDBD] pb-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#675F56]">Curated catalog</p>
                <h2 className="font-['Playfair_Display'] text-3xl font-medium">Hand-finished Jodhpuri Mojris</h2>
              </div>
              <p className="text-sm text-[#675F56]">{filteredProducts.length} pieces refined for your edit</p>
            </motion.div>

            <ProductMasonryGrid products={filteredProducts} className="pb-8" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopPage;