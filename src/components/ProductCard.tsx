import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Plus, ShoppingBag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

type ProductCardProps = {
  product?: Product | null;
  className?: string;
  onPreview?: (product: Product) => void;
};

export function ProductCard({ product = null, className = '', onPreview = () => {} }: ProductCardProps) {
  const { addToCart } = useCart?.() ?? { addToCart: () => {} };
  const safeProduct = product ?? {
    id: '',
    name: 'Untitled Mojri',
    category: 'Mojri',
    price: 0,
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    inStock: false,
  };

  const priceLabel = useMemo(() => `₹${Number(safeProduct?.price ?? 0).toLocaleString('en-IN')}`, [safeProduct?.price]);
  const stockLabel = safeProduct?.inStock ? 'In stock' : 'Sold out';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={cn('group flex h-full flex-col overflow-hidden rounded-sm border border-[#BFA6A0] bg-[#FFFDFC]', className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#faf9f6]">
        <img
          src={safeProduct?.image ?? 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'}
          alt={safeProduct?.name ?? 'Product image'}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm border border-[#BFA6A0] bg-[#FFFDFC]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
          <Star className="h-3.5 w-3.5 text-[#D9381E]" />
          <span className="truncate">{safeProduct?.category ?? 'Mojri'}</span>
        </div>
        <div className="absolute bottom-3 left-3 rounded-sm bg-[#FFFDFC]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6F625D]">
          {stockLabel}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onPreview(safeProduct)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] shadow-sm transition-colors hover:bg-[#F9F5F0]"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => addToCart?.(safeProduct?.id ?? '')}
            disabled={!safeProduct?.inStock}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#D9381E] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#B92B17] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/shop/${safeProduct?.id ?? ''}`} className="block min-w-0">
              <h3 className="truncate font-['Playfair_Display'] text-lg font-medium leading-tight text-[#2B2B2B]">
                {safeProduct?.name ?? 'Untitled Mojri'}
              </h3>
            </Link>
            <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-[#6F625D]">
              {safeProduct?.artisanId ? `Artisan ${safeProduct.artisanId}` : 'Jodhpur atelier'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-[#2B2B2B]">{priceLabel}</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6F625D]">{safeProduct?.featured ? 'Featured' : 'Edition'}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#BFA6A0]/60 pt-3">
          <Link
            to={`/shop/${safeProduct?.id ?? ''}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:text-[#D9381E]"
          >
            <ShoppingBag className="h-4 w-4" />
            View details
          </Link>
          <button
            type="button"
            onClick={() => onPreview(safeProduct)}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6F625D] transition-colors hover:text-[#2B2B2B]"
          >
            <Eye className="h-4 w-4" />
            Quick preview
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;