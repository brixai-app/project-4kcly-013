import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Product, Size, ColorVariant } from '@/types';
import { computeStockKey } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from './ProductDetailModal';

export interface ProductCardProps {
  product?: Product;
  className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const safeProduct: Product | null = product ?? null;
  const { addItem, openDrawer } = useCart();
  const [open, setOpen] = useState(false);

  if (!safeProduct) {
    return null;
  }

  const primaryImage = safeProduct.images?.[0];
  const hasSingleSize = safeProduct.sizes?.length === 1;
  const hasSingleColor = safeProduct.colors?.length === 1;

  const handleQuickView = () => {
    setOpen(true);
  };

  const handleQuickAdd = () => {
    if (!hasSingleSize || !hasSingleColor) {
      toast('Select options in detail view', {
        description: 'This style has multiple sizes or colors. Open Quick View to choose.',
      });
      setOpen(true);
      return;
    }
    const size = safeProduct.sizes[0] as Size;
    const color = safeProduct.colors[0] as ColorVariant;
    const stockKey = computeStockKey(size, color);
    const maxAvailable = safeProduct.stockByKey?.[stockKey] ?? 0;

    if (maxAvailable <= 0) {
      toast.error('Out of stock', {
        description: 'This combination is currently unavailable.',
      });
      return;
    }

    addItem({
      productId: safeProduct.id,
      size,
      color,
      quantity: 1,
    });

    toast.success('Added to bag', {
      description: `${safeProduct.name} · ${size} · ${color}`,
      action: {
        label: 'View cart',
        onClick: () => openDrawer(),
      },
    });
  };

  const priceFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: safeProduct.currency ?? 'INR',
    maximumFractionDigits: 0,
  });

  return (
    <>
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className={cn(
          'group cursor-pointer space-y-3 rounded-2xl bg-white',
          'transition-shadow duration-300 hover:shadow-[0_22px_60px_rgba(15,14,12,0.18)]',
          className
        )}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#E6DED3] bg-[#F9F6F2]">
          <div className="aspect-[3/4] w-full overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt ?? safeProduct.name}
                crossOrigin="anonymous"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#6F675E]">
                Visual coming soon
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-3 pt-10">
            <div className="h-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            <span className="line-clamp-1">{safeProduct.collection}</span>
            <span>{safeProduct.category}</span>
          </div>
          <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-between text-[10px] font-medium uppercase tracking-[0.22em] text-white/80">
            <span>Jootiya</span>
            <span>{safeProduct.featured ? 'Featured' : 'New Drop'}</span>
          </div>
          <div className="pointer-events-auto absolute inset-x-3 bottom-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleQuickView}
              className={cn(
                'flex items-center gap-1 rounded-md bg-white/85 px-3 py-1.5',
                'text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E2B28]',
                'backdrop-blur-sm transition hover:bg-white'
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick View</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className={cn(
                'hidden items-center gap-1 rounded-md bg-[#BFA06A] px-3 py-1.5 text-[11px] font-semibold',
                'uppercase tracking-[0.18em] text-black transition hover:bg-[#A88955]',
                'group-hover:flex'
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>
        <div className="space-y-1 px-0.5 pb-2 pt-1">
          <h3 className="text-[17px] font-light tracking-tight text-[#2E2B28]" style={{ fontFamily: 'Playfair Display, ui-serif' }}>
            {safeProduct.name}
          </h3>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6F675E]" style={{ fontFamily: 'Lora, ui-serif' }}>
            {safeProduct.collection} · {safeProduct.category}
          </p>
          <p className="text-sm font-semibold text-[#2E2B28]" style={{ fontFamily: 'Lora, ui-serif' }}>
            {priceFormatter.format(safeProduct.price)}
          </p>
        </div>
      </motion.article>
      <ProductDetailModal
        open={open}
        onOpenChange={setOpen}
        product={safeProduct}
      />
    </>
  );
}

export default ProductCard;