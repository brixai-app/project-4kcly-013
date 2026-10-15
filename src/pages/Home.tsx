import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  Product,
  ProductFilterState,
  ActiveSortState,
} from '@/types';
import {
  getFeaturedProducts,
  getNewArrivals,
  sortOptions,
} from '@/data/mockData';
import AppLayout from '@/components/AppLayout';
import ProductGridMasonry from '@/components/ProductGridMasonry';
import FilterDrawer from '@/components/FilterDrawer';
import ProductDetailModal from '@/components/ProductDetailModal';

export interface HomeProps {
  className?: string;
}

const initialFilterState: ProductFilterState = {
  query: '',
  categories: [],
  tags: [],
  colors: [],
  priceMin: undefined,
  priceMax: undefined,
  onlyInStock: false,
  onlyFeatured: true,
};

const initialSortState: ActiveSortState = {
  optionId: sortOptions[0]?.id ?? 'featured',
  field: sortOptions[0]?.field ?? 'featured',
  direction: sortOptions[0]?.direction ?? 'desc',
};

function applyFilterAndSort(
  products: Product[],
  filter: ProductFilterState,
  sort: ActiveSortState
): Product[] {
  let result = [...products];

  if (filter.query.trim()) {
    const q = filter.query.toLowerCase();
    result = result.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const collectionMatch = (p.collection ?? '').toLowerCase().includes(q);
      const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
      return nameMatch || collectionMatch || tagMatch;
    });
  }

  if (filter.categories.length > 0) {
    result = result.filter((p) => filter.categories.includes(p.category));
  }

  if (filter.tags.length > 0) {
    result = result.filter((p) => p.tags.some((t) => filter.tags.includes(t)));
  }

  if (filter.colors.length > 0) {
    result = result.filter((p) =>
      p.colors.some((c) => filter.colors.includes(c))
    );
  }

  if (typeof filter.priceMin === 'number') {
    result = result.filter((p) => p.price >= (filter.priceMin ?? 0));
  }

  if (typeof filter.priceMax === 'number') {
    result = result.filter((p) => p.price <= (filter.priceMax ?? Infinity));
  }

  if (filter.onlyFeatured) {
    result = result.filter((p) => p.isFeatured ?? false);
  }

  const dir = sort.direction === 'asc' ? 1 : -1;

  result.sort((a, b) => {
    switch (sort.field) {
      case 'price':
        return (a.price - b.price) * dir;
      case 'name':
        return a.name.localeCompare(b.name) * dir;
      case 'createdAt':
        return (
          (new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()) * dir
        );
      case 'popularity':
        return (
          ((a.popularityScore ?? 0) - (b.popularityScore ?? 0)) * dir
        );
      case 'featured':
      default:
        return ((b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)) || 0;
    }
  });

  return result;
}

export function Home({ className = '' }: HomeProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] =
    useState<ProductFilterState>(initialFilterState);
  const [sortState] = useState<ActiveSortState>(initialSortState);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const featured = useMemo(() => getFeaturedProducts(), []);
  const newArrivals = useMemo(() => getNewArrivals(), []);
  const curatedProducts = useMemo(
    () => applyFilterAndSort(featured, filterState, sortState),
    [featured, filterState, sortState]
  );

  const handleCardClick = (product: Product) => {
    setDetailProductId(product.id);
    setDetailOpen(true);
  };

  const activeSortLabel =
    sortOptions.find((o) => o.id === sortState.optionId)?.label ??
    'Featured';

  return (
    <AppLayout showGutterFrame>
      <main
        className={cn(
          'min-h-screen bg-[#F9F6F2] text-[#2E2B28] pb-20',
          className
        )}
      >
        <section className="w-full border-b border-[#D9D1C7] bg-[#F9F6F2]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <motion.div
                className="lg:col-span-6 flex flex-col justify-between"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 border border-[#D9D1C7] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] uppercase tracking-[0.18em] text-[#6F675E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
                    New season edit · Atelier Jootiya
                  </div>
                  <h1 className="font-[Playfair Display] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight">
                    Tailored silhouettes
                    <br />
                    for the streets of tomorrow.
                  </h1>
                  <p className="text-sm sm:text-base leading-relaxed text-[#6F675E] max-w-xl font-[Inter]">
                    Jootiya curates limited-run sneakers and handcrafted
                    leather forms, stitched in small batches for the
                    obsessively detail-oriented. Think gallery-grade soles,
                    engineered for the city.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 bg-[#8B0000] hover:bg-[#6F0000] text-white px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-md transition-colors"
                    >
                      Explore collection
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(true)}
                      className="inline-flex items-center gap-2 border border-[#D9D1C7] bg-white/80 px-4 py-3 text-xs font-semibold tracking-[0.2em] uppercase rounded-md text-[#2E2B28] hover:bg-[#F3EDE4] transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Refine edit
                    </button>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-6 max-w-md text-xs text-[#6F675E] font-[Inter]">
                  <div className="border-t border-[#D9D1C7] pt-3">
                    <p className="uppercase tracking-[0.18em] text-[11px] mb-1">
                      Hand-finished
                    </p>
                    <p>Artisan stitched uppers, calibrated cushioning.</p>
                  </div>
                  <div className="border-t border-[#D9D1C7] pt-3">
                    <p className="uppercase tracking-[0.18em] text-[11px] mb-1">
                      Limited drops
                    </p>
                    <p>Micro-runs, serialized pairs, never mass-produced.</p>
                  </div>
                  <div className="border-t border-[#D9D1C7] pt-3">
                    <p className="uppercase tracking-[0.18em] text-[11px] mb-1">
                      Atelier fit
                    </p>
                    <p>Architected for all-day wear on concrete canvases.</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="lg:col-span-6 relative"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              >
                <div className="relative h-[360px] sm:h-[440px] lg:h-full overflow-hidden rounded-[20px] border border-[#D9D1C7] bg-[#141414]">
                  <img
                    src="https://images.unsplash.com/photo-1731272832794-d66014ad7d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                    alt="Editorial sneaker still life in Jootiya studio"
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute top-6 right-6 px-3 py-1 border border-white/40 bg-black/30 backdrop-blur-md rounded-md text-[11px] uppercase tracking-[0.24em] text-white flex items-center gap-1.5">
                    Lookbook 08 · Studio Lights
                  </div>
                  <div className="absolute left-6 bottom-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] mb-1 text-white/70">
                        Shot in Lower Parel, Mumbai
                      </p>
                      <p className="font-[Playfair Display] text-2xl sm:text-3xl leading-snug">
                        The Crimson Orbit Runner
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex flex-col text-right text-xs text-white/70">
                        <span>Drop 03 · 2024</span>
                        <span>Edition of 120</span>
                      </div>
                      <span className="inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-md px-3 py-2 rounded-md text-[11px] uppercase tracking-[0.2em]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Featured silhouette
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-[#D9D1C7] bg-[#F9F6F2]/80">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-14 pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full border border-[#D9D1C7] bg-white flex items-center justify-center text-[11px] tracking-[0.18em] uppercase">
                  01
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E] mb-1">
                    Curated for now
                  </p>
                  <h2 className="font-[Playfair Display] text-2xl sm:text-3xl">
                    New season, first arrivals.
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-[Inter] text-[#6F675E]">
                <div className="inline-flex items-center gap-2 border border-[#D9D1C7] bg-white px-3 py-2 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
                  {curatedProducts.length} pieces in this curation
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-[#2E2B28]">Sort</span>
                  <span className="px-2 py-1 border border-[#D9D1C7] rounded-md bg-white text-[#2E2B28]">
                    {activeSortLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-12 lg:pb-16">
            <div className="mb-6 flex justify-between items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#6F675E]">
                <span className="h-px w-10 bg-[#D9D1C7]" />
                Gallery-grade footwear, arranged in a loose masonry rhythm.
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="sm:hidden inline-flex items-center gap-2 border border-[#D9D1C7] bg-white px-3 py-2 rounded-md text-[11px] uppercase tracking-[0.18em]"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
            <ProductGridMasonry
              products={curatedProducts}
              isLoading={false}
              accentFirstRow
              className="mb-4"
            />
            <div className="flex justify-end mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#2E2B28] border-b border-[#8B0000]/60 pb-1 hover:border-[#6F0000] transition-colors"
              >
                View complete shop
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-[#D9D1C7] bg-[#F9F6F2]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <motion.div
                className="lg:col-span-7 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="relative h-[260px] sm:h-[320px] lg:h-[360px] overflow-hidden rounded-[18px] border border-[#D9D1C7] bg-[#141414]">
                  <img
                    src="https://images.unsplash.com/photo-1741086154510-522e68f76933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                    alt="High fashion footwear flatlay on neutral backdrop"
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                  <div className="absolute inset-y-8 left-8 right-10 flex flex-col justify-between text-white">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/70 mb-2">
                        The manifesto
                      </p>
                      <p className="font-[Playfair Display] text-2xl sm:text-3xl max-w-md leading-snug">
                        We treat every pair as architecture for your
                        stride—light, deliberate, and built to move.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                      <span>Supple leathers, tuned foams, zero noise.</span>
                      <span className="h-px w-8 bg-white/40" />
                      <span>Sketched in Mumbai · Hand-finished in small runs</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="lg:col-span-5 flex flex-col justify-between"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E]">
                    The Jootiya footnote
                  </p>
                  <p className="font-[Inter] text-sm leading-relaxed text-[#2E2B28]">
                    We source low-contrast grains, muted palettes, and
                    elevated silhouettes that slip under the radar yet anchor
                    every look. Each outsole is tuned for city tempo, each
                    stitch hidden in plain sight.
                  </p>
                  <p className="font-[Inter] text-sm leading-relaxed text-[#6F675E]">
                    Our atelier partners cut, last, and finish in
                    micro-batches, allowing material quirks and human touch to
                    remain visible. No screaming logos, just quietly obsessive
                    construction.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-xs font-[Inter]">
                  <div className="border border-[#D9D1C7] rounded-[14px] bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E] mb-2">
                      Stitch count
                    </p>
                    <p className="text-lg font-semibold text-[#2E2B28]">
                      1,200+
                    </p>
                    <p className="mt-1 text-[11px] text-[#6F675E]">
                      micro stitches secure our flagship sole units.
                    </p>
                  </div>
                  <div className="border border-[#D9D1C7] rounded-[14px] bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E] mb-2">
                      Pairs per run
                    </p>
                    <p className="text-lg font-semibold text-[#2E2B28]">
                      80–140
                    </p>
                    <p className="mt-1 text-[11px] text-[#6F675E]">
                      deliberately small, serialized micro-productions.
                    </p>
                  </div>
                  <div className="border border-[#D9D1C7] rounded-[14px] bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E] mb-2">
                      Break-in
                    </p>
                    <p className="text-lg font-semibold text-[#2E2B28]">
                      48 hrs
                    </p>
                    <p className="mt-1 text-[11px] text-[#6F675E]">
                      average to mold to your stride, not the other way.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full bg-[#F9F6F2]">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center border border-[#D9D1C7] rounded-[18px] bg-white/80 px-5 sm:px-8 md:px-10 py-8 md:py-10">
              <motion.div
                className="md:col-span-7 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F675E]">
                  Jootiya dispatch
                </p>
                <h3 className="font-[Playfair Display] text-2xl sm:text-3xl leading-snug">
                  Stay ahead of the next drop, not the algorithm.
                </h3>
                <p className="font-[Inter] text-sm leading-relaxed text-[#6F675E] max-w-xl">
                  Receive editorial-style drop briefs, studio notes, and
                  early access links to the pairs that disappear fastest. No
                  clutter, just the shoes worth knowing about.
                </p>
                <form
                  className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full sm:flex-1 border border-[#D9D1C7] rounded-md bg-[#F9F6F2] px-3 py-2.5 text-sm font-[Inter] placeholder:text-[#B0A79E] focus:outline-none focus:border-[#8B0000]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#6F0000] text-white px-4 sm:px-5 py-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase rounded-md transition-colors"
                  >
                    Join the list
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
              <motion.div
                className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-[#D9D1C7] md:pl-6 pt-4 md:pt-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              >
                <div className="flex items-center justify-between text-xs font-[Inter] text-[#6F675E]">
                  <span>What you&apos;ll receive</span>
                  <span className="h-px w-8 bg-[#D9D1C7]" />
                </div>
                <ul className="space-y-2 text-xs font-[Inter] text-[#2E2B28]">
                  <li>· 48-hour advance access to limited runs</li>
                  <li>· Lookbook styling notes direct from the studio</li>
                  <li>· Occasional invites to pop-ups and fitting sessions</li>
                  <li>· No resale spam, ever</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <FilterDrawer
          open={filterOpen}
          onOpenChange={setFilterOpen}
          value={filterState}
          onChange={(value) => setFilterState(value)}
        />

        <ProductDetailModal
          productId={detailProductId}
          open={detailOpen}
          onOpenChange={(open) => {
            setDetailOpen(open);
            if (!open) {
              setDetailProductId(null);
            }
          }}
        />
      </main>
    </AppLayout>
  );
}

export default Home;