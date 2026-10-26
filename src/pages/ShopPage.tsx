import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Sliders } from 'lucide-react';
import { products, categories, sizes, artisansList } from '@/data/mockData';
import { CatalogFilter, Product } from '@/types';
import { cn } from '@/lib/utils';
import { HeroSection, CatalogToolbar, ProductGrid, CategoryShowcase, BrandManifesto, NewsletterSection } from '@/components/StorefrontSections';

export function ShopPage() {
  const [filters, setFilters] = useState<CatalogFilter>({
    query: '',
    category: 'All',
    occasion: 'All',
    size: 'All',
    priceRange: 'All',
    artisan: 'All',
    sortBy: 'Featured',
  });

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const [minPrice, maxPrice] = filters.priceRange === 'All' ? [0, Number.POSITIVE_INFINITY] : filters.priceRange.split('-').map((v) => Number(v));
    const sorted = [...products]
      .filter((product) => {
        const matchesQuery =
          !query ||
          [product.name, product.category, product.occasion, product.artisanName, product.description]
            .join(' ')
            .toLowerCase()
            .includes(query);
        const matchesCategory = filters.category === 'All' || product.category === filters.category;
        const matchesOccasion = filters.occasion === 'All' || product.occasion === filters.occasion;
        const matchesSize = filters.size === 'All' || (product.sizes?.includes(filters.size) ?? false);
        const matchesArtisan = filters.artisan === 'All' || product.artisanId === filters.artisan;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchesQuery && matchesCategory && matchesOccasion && matchesSize && matchesArtisan && matchesPrice;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'Price: Low to High') return a.price - b.price;
        if (filters.sortBy === 'Price: High to Low') return b.price - a.price;
        if (filters.sortBy === 'Newest') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });

    return sorted;
  }, [filters]);

  const toolbarProps = useMemo(
    () => ({
      className: '',
      filters,
      setFilters,
      categories,
      sizes,
      artisansList,
    }),
    [filters]
  );

  return (
    <div className="bg-[#F5F0E6] text-[#2B2B2B]">
      <HeroSection />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 grid gap-4 border border-[#C9A66B] bg-[#FFF9F0] p-4 md:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border border-[#C9A66B] bg-white">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <p className="font-['Playfair_Display'] text-2xl font-light tracking-tight">Curated Mojri Archive</p>
              <p className="mt-1 max-w-2xl font-['Lora'] text-sm leading-6 text-[#6F655B]">
                Refine by craft, occasion, size, and silhouette to discover hand-finished pairs from Jodhpur&apos;s ateliers.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#C9A66B] pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655B]">Selection</p>
              <p className="mt-1 text-sm font-semibold">{filteredProducts.length} pieces</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655B]">
              <Sliders className="h-4 w-4" />
              Editorial filter rail
            </div>
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[#C9A66B] bg-[#FFF9F0] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655B]">Filters</h2>
              </div>
              <CatalogToolbar {...toolbarProps} />
            </div>
            <CategoryShowcase />
          </aside>

          <section className="space-y-10">
            <ProductGrid products={filteredProducts} />
            <BrandManifesto />
            <NewsletterSection />
          </section>
        </div>
      </main>
    </div>
  );
}

export default ShopPage;