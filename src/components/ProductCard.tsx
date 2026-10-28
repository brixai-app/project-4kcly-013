import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';
import type { Product } from '@/types';

export interface ProductCardProps {
  product?: Product | null;
  className?: string;
}

export function ProductCard({ product = null, className = '' }: ProductCardProps) {
  const { addToCart } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const image = product?.image ?? 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';
  const slug = product?.slug ?? 'jootiya-signature';
  const price = useMemo(() => `₹${Number(product?.price ?? 0).toLocaleString('en-IN')}`, [product?.price]);
  const stockState = product?.availability ?? ((product?.stock ?? 0) > 0 ? 'in_stock' : 'sold_out');
  const stockLabel = stockState === 'low_stock' ? 'Low stock' : stockState === 'preorder' ? 'Pre-order' : stockState === 'sold_out' ? 'Sold out' : 'In stock';

  const handleQuickAdd = () => {
    if (!product || stockState === 'sold_out') {
      toast.error('This pair is currently sold out.');
      return;
    }
    addToCart?.(product, product?.sizes?.[0] ?? 'One Size');
    toast.success(`${product?.name ?? 'Item'} added to cart.`);
  };

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className={cn('group relative flex h-full flex-col overflow-hidden rounded-md border border-[#CDBB9B] bg-[#FFFDF9] shadow-[0_1px_0_rgba(0,0,0,0.03)]', className)}
      >
        <Link to={`/shop/${slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F5F0]">
            <img
              src={image}
              alt={product?.name ?? 'Product image'}
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-sm border border-[#CDBB9B] bg-[#FFFDF9]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E6258]">
                {product?.category ?? 'Mojri'}
              </span>
              {product?.handcrafted ? (
                <span className="rounded-sm border border-[#CDBB9B] bg-[#FFFDF9]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E6258]">
                  Handcrafted
                </span>
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2E2B28]/70 via-[#2E2B28]/10 to-transparent p-4">
              <p className="max-w-[85%] text-xs uppercase tracking-[0.24em] text-white/85">{product?.artisan ?? 'Artisan atelier'}</p>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-['Bodoni_Moda'] text-xl leading-none text-[#2E2B28]">{product?.name ?? 'Signature Jootiya'}</h3>
            <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-[#6E6258]">{product?.material ?? 'Leather craft'} · {product?.color ?? 'Ivory'}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-[#2E2B28]">{price}</span>
              {product?.compareAtPrice ? <span className="text-xs text-[#6E6258] line-through">₹{Number(product.compareAtPrice).toLocaleString('en-IN')}</span> : null}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#6E6258]">
              <Star className="h-3.5 w-3.5 fill-[#C1440E] text-[#C1440E]" />
              <span>{product?.rating?.toFixed?.(1) ?? '4.8'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-[#6E6258]">
            <span className={cn('min-w-0 truncate', stockState === 'sold_out' ? 'text-[#963308]' : '')}>{stockLabel}</span>
            <span className="min-w-0 truncate">{product?.gender ?? 'Unisex'}</span>
          </div>

          <div className="mt-auto flex items-center gap-2 opacity-100 transition-all duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E2B28] transition-colors hover:bg-[#F9F5F0]"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#C1440E] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#963308]"
            >
              <ShoppingCart className="h-4 w-4" />
              Quick Add
            </button>
            <button
              type="button"
              aria-label="Save to wishlist"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#CDBB9B] text-[#6E6258] transition-colors hover:bg-[#F9F5F0] hover:text-[#C1440E]"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.article>
      <ProductDetailModal product={product ?? undefined} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;