import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';

type ProductCardProps = {
  product?: Product | null;
  index?: number;
  className?: string;
};

export function ProductCard({ product = null, index = 0, className = '' }: ProductCardProps) {
  const { addToCart } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);

  const priceLabel = useMemo(() => {
    const value = Number(product?.price ?? 0);
    return `₹${value.toLocaleString('en-IN')}`;
  }, [product?.price]);

  if (!product?.id) return null;

  const handleQuickAdd = () => {
    if (typeof addToCart === 'function') addToCart(product, 1);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
        className={cn('group flex h-full flex-col overflow-hidden border border-[#D8CDBB] bg-white', className)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF9F6]">
          <img
            src={product.image ?? ''}
            alt={product.name ?? 'Product image'}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#9A7135]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 border border-[#D8CDBB] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6E665C]">
                {product.category ?? 'Collection'}
              </p>
              <h3 className="mt-1 truncate font-serif text-lg font-medium leading-tight text-[#2B2B2B]">
                {product.name ?? 'Untitled'}
              </h3>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#2B2B2B]">{priceLabel}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <p className="min-w-0 truncate text-xs uppercase tracking-[0.18em] text-[#6E665C]">
              {product.artisan ?? 'Artisan made'}
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A7135] transition-colors hover:text-[#765326]"
            >
              Details
            </button>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;