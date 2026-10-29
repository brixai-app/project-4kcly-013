import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Plus, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';

type ProductCardProps = {
  product?: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className = '', priority = false }: ProductCardProps) {
  const { addItem } = useCart?.() ?? {};
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const sizes = product?.sizes ?? [];
  const image = product?.image ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80';
  const priceLabel = useMemo(() => `${product?.currency ?? '₹'}${Number(product?.price ?? 0).toLocaleString('en-IN')}`, [product?.currency, product?.price]);

  const handleQuickAdd = () => {
    if (!product?.id) return;
    if (sizes.length > 0 && !selectedSize) {
      toast.message('Select a size first');
      return;
    }
    addItem?.({
      id: `${product.id}-${selectedSize || 'default'}`,
      productId: product.id,
      product,
      name: product.name ?? 'Product',
      price: product.price ?? 0,
      quantity: 1,
      image,
      size: selectedSize || undefined,
    });
    toast.success('Added to cart');
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={cn('group relative flex h-full flex-col overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7]', className)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1EB]">
          <img
            src={image}
            alt={product?.name ?? 'Product image'}
            crossOrigin="anonymous"
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center border border-[#C9BFB1] bg-[#FFFCF7]/95 text-[#302D29] backdrop-blur-sm transition hover:bg-[#6B1E1E] hover:text-white"
            aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#0a0a0a]/55 via-[#0a0a0a]/10 to-transparent p-4 text-white">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">{product?.category ?? 'Collection'}</p>
              <h3 className="mt-1 line-clamp-2 font-['Bodoni_Moda'] text-2xl font-light leading-none tracking-tight">{product?.name ?? 'Untitled Mojri'}</h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>Craft</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-[#71695F]">{product?.origin ?? 'Jodhpur atelier'}</p>
              <p className="mt-1 text-base font-semibold text-[#302D29]">{priceLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#C9BFB1] text-[#302D29] transition hover:border-[#6B1E1E] hover:bg-[#6B1E1E] hover:text-white"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'min-w-0 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] transition',
                    selectedSize === size
                      ? 'border-[#6B1E1E] bg-[#6B1E1E] text-white'
                      : 'border-[#C9BFB1] bg-transparent text-[#302D29] hover:border-[#6B1E1E]'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#71695F]">{product?.description ?? 'Hand-finished leatherwork with a refined ceremonial profile.'}</p>
          )}

          <div className="mt-auto flex items-center gap-2 opacity-100 transition group-hover:translate-y-0">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex flex-1 items-center justify-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#501515]"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </button>
            <Link
              to={`/product/${product?.slug ?? product?.id ?? ''}`}
              className="inline-flex h-12 items-center justify-center border border-[#C9BFB1] px-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#302D29] transition hover:border-[#6B1E1E] hover:text-[#6B1E1E]"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="hidden"
              aria-hidden="true"
            >
              <Plus />
            </button>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal open={open} onOpenChange={setOpen} product={product} />
    </>
  );
}

export default ProductCard;