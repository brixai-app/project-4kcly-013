import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Product, ProductSize } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';

type ProductCardProps = {
  product?: Product;
  className?: string;
};

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ProductSize | ''>('');
  const [hovered, setHovered] = useState(false);

  const sizes = product?.sizes ?? [];
  const primarySize = useMemo(() => size || sizes?.[0] || '', [size, sizes]);

  if (!product) return null;

  const handleQuickAdd = () => {
    addItem?.({ product, quantity: 1, size: primarySize || undefined });
  };

  return (
    <>
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className={cn('group flex h-full flex-col overflow-hidden rounded-sm border border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715] shadow-[0_1px_0_rgba(43,23,21,0.04)]', className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F0E4]">
          <img
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm border border-[#CDBB9F] bg-[#FFFDF8]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#765F55] backdrop-blur">
              <Star className="h-3 w-3 fill-current" />
              {product.artisanName ?? 'Artisan Made'}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#2B1715]/70 via-[#2B1715]/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-[#741F2B] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#57151F] focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[#765F55]">
              {product.category}
            </p>
            <Link
              to={`/shop/${product.slug}`}
              className="mt-1 block min-w-0 text-lg font-semibold leading-tight text-[#2B1715] transition-colors hover:text-[#741F2B] focus:outline-none focus:ring-2 focus:ring-[#741F2B]/30"
            >
              {product.name}
            </Link>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-[#765F55]">{product.description}</p>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#741F2B]">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 truncate text-[11px] uppercase tracking-[0.2em] text-[#765F55]">
                {product.craftsmanship ?? 'Hand-finished'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#741F2B] transition-colors hover:text-[#57151F]"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={cn(
                    'min-w-0 rounded-sm border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors',
                    primarySize === item
                      ? 'border-[#741F2B] bg-[#741F2B] text-white'
                      : 'border-[#CDBB9F] bg-transparent text-[#765F55] hover:border-[#741F2B] hover:text-[#741F2B]'
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;