import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product?: Product;
  className?: string;
};

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = React.useState<string>('');

  const sizes = product?.sizes ?? [];
  const firstSize = sizes?.[0] ?? '';
  const activeSize = selectedSize || firstSize;
  const canQuickAdd = sizes.length > 0;
  const detailHref = product?.id ? `/product/${product.id}` : '/shop';

  React.useEffect(() => {
    setSelectedSize(firstSize);
  }, [firstSize]);

  const handleQuickAdd = () => {
    if (!product?.id) return;
    addToCart(product.id, 1, activeSize || undefined);
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('group relative flex h-full flex-col overflow-hidden border border-[#C9A66B] bg-[#FFF9F0]', className)}
    >
      <Link to={detailHref} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0E6]">
          <img
            src={product?.image ?? 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'}
            alt={product?.name ?? 'Product image'}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="border border-[#C9A66B] bg-[#FFF9F0]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2B2B2B]">
              {product?.artisanName ?? 'Artisan'}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655B]">
            {product?.category ?? 'Mojri'}
          </p>
          <Link to={detailHref} className="block">
            <h3 className="font-['Playfair_Display'] text-lg font-medium leading-tight text-[#2B2B2B]">
              {product?.name ?? 'Untitled Mojri'}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-[#6F655B]">
            {product?.description ?? 'Hand-finished heritage footwear crafted for ceremonial and everyday elegance.'}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655B]">Price</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[#2B2B2B]">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</span>
              {product?.originalPrice ? (
                <span className="text-xs text-[#6F655B] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              ) : null}
            </div>
          </div>

          <Link
            to={detailHref}
            className="inline-flex items-center gap-1 border border-[#C9A66B] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:bg-[#F5F0E6]"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            {sizes.length > 0 ? (
              <select
                value={activeSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="pointer-events-auto h-10 flex-1 border border-[#C9A66B] bg-[#FFF9F0] px-3 text-xs uppercase tracking-[0.2em] text-[#2B2B2B] outline-none"
                aria-label="Select size"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            ) : (
              <div className="pointer-events-auto h-10 flex-1 border border-[#C9A66B] bg-[#FFF9F0] px-3 text-xs uppercase tracking-[0.2em] text-[#6F655B] flex items-center">
                Size on request
              </div>
            )}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!canQuickAdd}
              className="pointer-events-auto inline-flex h-10 items-center gap-2 bg-[#7B2D26] px-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#61211C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {canQuickAdd ? <ShoppingBag className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
              Quick Add
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;