import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Product, MasonryColumnConfig } from '@/types';
import { masonryConfig } from '@/data/mockData';
import ProductCard from './ProductCard';

export interface ProductGridMasonryProps {
  products?: Product[];
  isLoading?: boolean;
  emptyLabel?: string;
  className?: string;
  accentFirstRow?: boolean;
}

interface MasonryColumn {
  id: number;
  items: Product[];
}

function getColumnConfig(config: MasonryColumnConfig[]): MasonryColumnConfig {
  if (!Array.isArray(config) || config.length === 0) {
    return { minWidth: 320, columnCount: 3 };
  }
  const sorted = [...config].sort((a, b) => a.minWidth - b.minWidth);
  if (typeof window === 'undefined') {
    return sorted[0] ?? { minWidth: 320, columnCount: 3 };
  }
  const width = window.innerWidth || 1024;
  let selected = sorted[0];
  for (const item of sorted) {
    if (width >= item.minWidth) {
      selected = item;
    }
  }
  return selected ?? { minWidth: 320, columnCount: 3 };
}

function buildMasonryColumns(items: Product[], config: MasonryColumnConfig): MasonryColumn[] {
  const count = Math.max(1, config.columnCount || 1);
  const cols: MasonryColumn[] = Array.from({ length: count }).map((_, index) => ({
    id: index,
    items: [],
  }));
  items.forEach((product, index) => {
    const colIndex = index % count;
    cols[colIndex]?.items.push(product);
  });
  return cols;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.17, 0.55, 0.55, 1],
    },
  },
};

export function ProductGridMasonry({
  products = [],
  isLoading = false,
  emptyLabel = 'No pieces match this curation just yet.',
  className = '',
  accentFirstRow = true,
}: ProductGridMasonryProps) {
  const effectiveConfig = useMemo(() => {
    return getColumnConfig(masonryConfig ?? []);
  }, []);

  const columns = useMemo(() => {
    const list = products ?? [];
    return buildMasonryColumns(list, effectiveConfig);
  }, [products, effectiveConfig]);

  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
          className,
        )}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white"
          >
            <div className="aspect-[3/4] w-full bg-[#F0E9DF] animate-pulse" />
            <div className="p-4 sm:p-5 space-y-3">
              <div className="h-4 w-2/3 bg-[#E4DACE] rounded-full animate-pulse" />
              <div className="h-3 w-1/3 bg-[#E4DACE] rounded-full animate-pulse" />
              <div className="h-4 w-1/4 bg-[#E4DACE] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={cn('w-full py-16 border-t border-[#D9D1C7]/60', className)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 text-left">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#6F675E] mb-3">
            Curated Edit
          </p>
          <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl text-[#2E2B28] mb-3">
            The selection is catching its breath.
          </h3>
          <p className="text-sm sm:text-base text-[#6F675E] max-w-xl">
            {emptyLabel}
          </p>
        </div>
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <motion.div
      className={cn(
        'w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start',
        className,
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 xs:grid-cols-2 gap-5 lg:gap-7 auto-rows-[0]">
        <AnimatePresence>
          {columns.map((column, colIndex) => (
            <div
              key={column.id}
              className={cn(
                'flex flex-col gap-5 lg:gap-7',
                colIndex === 0 ? 'pt-2' : colIndex === 1 ? 'pt-10' : 'pt-16',
              )}
            >
              {column.items.map((product) => {
                const indexForAnimation = globalIndex;
                globalIndex += 1;
                const tallVariant =
                  accentFirstRow &&
                  ((colIndex === 0 && indexForAnimation % 5 === 0) ||
                    (colIndex === 1 && indexForAnimation % 7 === 0));

                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    className={cn(
                      'relative',
                      tallVariant ? 'row-span-2' : 'row-span-1',
                    )}
                  >
                    <ProductCard
                      product={product}
                      index={indexForAnimation}
                      enableHoverLift
                      showCollection
                      className={cn(
                        'h-full',
                        tallVariant ? 'aspect-[3/4] sm:aspect-[4/5]' : '',
                      )}
                    />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <aside className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 lg:gap-8">
        <div className="relative overflow-hidden rounded-2xl border border-[#D9D1C7] bg-[#F9F6F2] px-6 py-7 sm:px-7 sm:py-8">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-[#D9D1C7]/70" />
            <div className="absolute -right-16 top-16 h-52 w-52 rounded-full border border-[#D9D1C7]/40" />
          </div>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#6F675E]">
            Jootiya Studio Edit
          </p>
          <h2 className="mt-3 font-['Playfair_Display'] text-2xl sm:text-3xl text-[#2E2B28] leading-tight">
            Curated silhouettes for the week’s rhythm.
          </h2>
          <p className="mt-3 text-sm text-[#6F675E] leading-relaxed">
            Each pair is hand‑selected for proportion, line, and the quiet drama they
            bring to motion. The masonry below follows the way we build our lookbooks
            on set.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#6F675E]">
            <span className="px-2.5 py-1 rounded-md border border-[#D9D1C7] bg-white/80">
              Asymmetric rhythm
            </span>
            <span className="px-2.5 py-1 rounded-md border border-[#D9D1C7] bg-white/80">
              Street-to-soirée
            </span>
            <span className="px-2.5 py-1 rounded-md border border-[#D9D1C7] bg-white/80">
              Studio-approved
            </span>
          </div>
        </div>

        <div className="hidden md:block rounded-2xl overflow-hidden border border-[#D9D1C7] bg-white">
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              crossOrigin="anonymous"
              src="https://images.unsplash.com/photo-1731272832794-d66014ad7d87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bWluaW1hbGlzdCUyMGxlYXRoZXIlMjBncmFpbiUyMHRleHR1cmUlMjBvdmVybGF5JTIwc2VhbWxlc3N8ZW58MHwwfHx8MTc5MjA3NzU4OHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
              alt="Editorial sneakers on sculpted plinths in a neutral studio."
              className="h-full w-full object-cover object-center scale-105"
            />
          </div>
          <div className="px-5 py-4 border-t border-[#D9D1C7] bg-[#F9F6F2]">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6F675E] mb-1.5">
              Lookbook Snapshot
            </p>
            <p className="text-sm text-[#2E2B28]">
              Layered neutrals, precise edges, and a single deep-crimson accent tying the
              story together.
            </p>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}

export default ProductGridMasonry;