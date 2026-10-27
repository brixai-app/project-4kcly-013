import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export interface ProductCardProps {
  product?: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className = '', priority = false }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart?.() ?? {};
  const item = product ?? null;
  const inStock = item?.inStock ?? true;
  const artisanName = item?.artisan?.name ?? 'Jodhpur atelier';
  const artisanLocation = item?.artisan?.location ?? 'Rajasthan';
  const imageUrl = item?.imageUrl ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80';
  const slug = item?.slug ?? item?.id ?? '';

  const handleQuickAdd = () => {
    if (!item) return;
    if (!inStock) {
      toast.error('This pair is currently out of stock.');
      return;
    }
    addItem?.(item, 1);
    toast.success(`${item.name ?? 'Item'} added to cart.`);
  };

  const handleQuickView = () => {
    if (!slug) return;
    navigate(`/shop/${slug}`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={cn('group flex h-full flex-col overflow-hidden border border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B]', className)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1EB]">
        <img
          src={imageUrl}
          alt={item?.name ?? 'Product image'}
          crossOrigin="anonymous"
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/45 via-black/10 to-transparent p-4 text-white">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
              {item?.category ?? 'Mojri'}
            </p>
            <p className="truncate text-xs text-white/85">{artisanName}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-white/85">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{artisanLocation}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute right-3 top-3 inline-flex items-center gap-1 border border-white/70 bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" />
          Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-['Playfair_Display'] text-xl font-medium leading-tight text-[#2B2B2B]">
            {item?.name ?? 'Untitled Mojri'}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#6F655C]">
            {item?.description ?? 'Hand-finished leatherwork with a refined silhouette and artisan detailing.'}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6F655C]">
              {item?.material ?? 'Leather'}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-semibold text-[#2B2B2B]">₹{item?.price?.toLocaleString?.('en-IN') ?? '0'}</span>
              {item?.originalPrice ? (
                <span className="text-sm text-[#6F655C] line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={slug ? `/shop/${slug}` : '/shop'}
              className="inline-flex items-center gap-1 border border-[#CFC2B2] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:border-[#E07A5F] hover:text-[#000000]"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!inStock}
              className={cn(
                'inline-flex items-center gap-1 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all',
                inStock
                  ? 'border-[#E07A5F] bg-[#E07A5F] text-[#000000] hover:bg-[#C85F45]'
                  : 'cursor-not-allowed border-[#CFC2B2] bg-[#F5F1EB] text-[#6F655C]'
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {inStock ? 'Quick Add' : 'Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;