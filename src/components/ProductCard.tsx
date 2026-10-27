import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import ProductDetailModal from '@/components/ProductDetailModal';

type ProductCardProps = {
  product?: Product | null;
  masonrySpan?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function ProductCard({ product = null, masonrySpan = 'md', className = '' }: ProductCardProps) {
  const [open, setOpen] = React.useState(false);
  const safeProduct = product ?? null;
  if (!safeProduct) return null;

  const spanClass =
    masonrySpan === 'lg' ? 'md:col-span-2 md:row-span-2' : masonrySpan === 'sm' ? 'md:row-span-1' : 'md:row-span-2';

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={cn('group relative overflow-hidden border border-[#D8CCB9] bg-[#F5F1E9] shadow-[0_1px_0_rgba(0,0,0,0.04)]', spanClass, className)}
      >
        <Link to={`/shop/${safeProduct.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF9F6]">
            <img
              src={safeProduct.image ?? ''}
              alt={safeProduct.name ?? 'Product image'}
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-80" />
            {safeProduct.newArrival ? (
              <div className="absolute left-3 top-3 border border-white/70 bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]">
                New
              </div>
            ) : null}
          </div>
        </Link>

        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            <Link to={`/shop/${safeProduct.slug}`} className="block">
              <h3 className="truncate font-['Playfair_Display'] text-lg font-medium leading-tight text-[#1A1A1A]">
                {safeProduct.name}
              </h3>
            </Link>
            <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-[#675F56]">
              {safeProduct.collection ?? safeProduct.category}
            </p>
            <p className="mt-3 text-sm font-semibold text-[#1A1A1A]">₹{safeProduct.price.toLocaleString('en-IN')}</p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 shrink-0 items-center gap-2 border border-[#D8CCB9] bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1A1A1A] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-[#A94720] hover:bg-[#A94720] hover:text-white"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between border-t border-[#D8CCB9] bg-[#FAF9F6]/95 px-4 py-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#675F56]">
            {safeProduct.category ?? 'Mojri'}
          </span>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A94720]">
            <ShoppingBag className="h-3.5 w-3.5" />
            View Details
          </span>
        </div>
      </motion.article>

      <ProductDetailModal product={safeProduct} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;