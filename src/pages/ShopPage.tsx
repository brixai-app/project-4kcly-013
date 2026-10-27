import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { ProductGrid, FiltersPanel } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { products, categories } from '@/data/mockData';
import type { FilterState, Product } from '@/types';
import { cn } from '@/lib/utils';

export function ShopPage({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ productId?: string }>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    categories: [],
    priceRange: [0, 0],
    sortBy: 'featured',
  });

  const activeProduct = useMemo(() => {
    const slug = params?.productId ?? '';
    return products.find((product) => product?.slug === slug) ?? null;
  }, [params?.productId]);

  useEffect(() => {
    setDetailOpen(Boolean(activeProduct));
  }, [activeProduct]);

  useEffect(() => {
    const prices = products.map((product) => product?.price ?? 0);
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.[0] === 0 && prev.priceRange?.[1] === 0 ? [min, max] : prev.priceRange,
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    const query = filters?.query?.trim().toLowerCase() ?? '';
    const [minPrice, maxPrice] = filters?.priceRange ?? [0, 0];
    const selected = filters?.categories ?? [];

    const list = products.filter((product) => {
      const matchesQuery =
        !query ||
        [product?.name, product?.description, product?.category, product?.material]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      const matchesCategory = !selected.length || selected.includes(product?.category ?? 'Mojri');
      const price = product?.price ?? 0;
      const matchesPrice = price >= minPrice && price <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });

    const sortBy = filters?.sortBy ?? 'featured';
    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return (a?.price ?? 0) - (b?.price ?? 0);
      if (sortBy === 'price-desc') return (b?.price ?? 0) - (a?.price ?? 0);
      if (sortBy === 'newest') return Number(Boolean(b?.newArrival)) - Number(Boolean(a?.newArrival));
      return Number(Boolean(b?.featured)) - Number(Boolean(a?.featured));
    });
  }, [filters]);

  const handleQuickAdd = (product: Product) => {
    if (product?.slug) navigate(`/products/${product.slug}`);
  };

  const handleFiltersChange = (next: FilterState) => setFilters(next);

  const handleOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open && params?.productId) navigate('/products');
  };

  return (
    <main className={cn('bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#D8CDBE] pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">
              <Filter className="h-4 w-4" />
              <span>Curated Catalog</span>
            </div>
            <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">
              Jodhpuri Mojris
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6E665D]">
              Explore handcrafted silhouettes, refined leathers, and artisan-made pairs selected for ceremonial and everyday wear.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 border border-[#D8CDBE] bg-[#FFFCF7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#C9A66B] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0 border border-[#D8CDBE] bg-[#FFFCF7] p-4 shadow-[0_10px_30px_rgba(43,43,43,0.06)]">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">
              <Search className="h-4 w-4" />
              <span>Filters</span>
            </div>
            <FiltersPanel filters={filters} onChange={handleFiltersChange} categories={categories} className="min-w-0" />
          </aside>

          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[#6E665D]">
                {filteredProducts.length} piece{filteredProducts.length === 1 ? '' : 's'} selected
              </p>
              <button
                type="button"
                onClick={() => navigate(`${location.pathname}`)}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A66B] transition hover:text-[#B38A4E]"
              >
                Reset view
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <ProductGrid products={filteredProducts} onQuickAdd={handleQuickAdd} className="min-w-0" />
            </motion.div>
          </section>
        </div>
      </section>

      <ProductDetailModal
        open={detailOpen}
        onOpenChange={handleOpenChange}
        product={activeProduct}
        slug={params?.productId ?? ''}
      />
    </main>
  );
}

export default ShopPage;