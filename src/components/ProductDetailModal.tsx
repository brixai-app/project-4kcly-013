import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Circle as ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { artisans, products } from '@/data/mockData';
import type { Product } from '@/types';

type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
  slug?: string;
  className?: string;
};

type SizeSelectorProps = {
  sizes?: string[];
  value?: string;
  onChange?: (size: string) => void;
  className?: string;
};

type ProductCarouselProps = {
  images?: string[];
  title?: string;
  className?: string;
};

export function SizeSelector({ sizes = [], value = '', onChange = () => {}, className = '' }: SizeSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {sizes?.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={cn(
            'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
            value === size ? 'border-[#C9A66B] bg-[#C9A66B] text-black' : 'border-[#D8CDBE] bg-[#FFFCF7] text-[#2B2B2B] hover:border-[#B38A4E]'
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

export function ProductCarousel({ images = [], title = '', className = '' }: ProductCarouselProps) {
  const [index, setIndex] = useState(0);
  const safeImages = images?.length ? images : ['https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85'];
  const current = safeImages[index % safeImages.length] ?? safeImages[0];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative overflow-hidden border border-[#D8CDBE] bg-[#FAF9F6]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={current}
            alt={title}
            crossOrigin="anonymous"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="aspect-[3/4] w-full object-cover"
          />
        </AnimatePresence>
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((p) => (p - 1 + safeImages.length) % safeImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 border border-[#D8CDBE] bg-[#FFFCF7]/90 p-2 text-[#2B2B2B] backdrop-blur-sm transition hover:border-[#C9A66B]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((p) => (p + 1) % safeImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#D8CDBE] bg-[#FFFCF7]/90 p-2 text-[#2B2B2B] backdrop-blur-sm transition hover:border-[#C9A66B]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn('shrink-0 border transition', i === index ? 'border-[#C9A66B]' : 'border-[#D8CDBE]')}
            >
              <img src={img} alt={`${title} ${i + 1}`} crossOrigin="anonymous" className="h-16 w-12 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDetailModal({ open = false, onOpenChange = () => {}, product = null, slug = '', className = '' }: ProductDetailModalProps) {
  const { addItem } = useCart() as any;
  const [size, setSize] = useState('');
  const [busy, setBusy] = useState(false);

  const resolvedProduct = useMemo(() => {
    if (product?.id) return product;
    return products?.find((item) => item?.slug === slug) ?? null;
  }, [product, slug]);

  const artisan = useMemo(
    () => artisans?.find((item) => item?.id === resolvedProduct?.artisanId) ?? null,
    [resolvedProduct]
  );

  const gallery = useMemo(() => {
    const base = resolvedProduct?.gallery?.length ? resolvedProduct.gallery : [resolvedProduct?.image ?? 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'];
    return base.filter(Boolean);
  }, [resolvedProduct]);

  const handleAdd = () => {
    if (!resolvedProduct) return;
    const selectedSize = size || resolvedProduct.sizes?.[0] || '';
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setBusy(true);
    addItem?.({ productId: resolvedProduct.id, quantity: 1, size: selectedSize, color: resolvedProduct.colors?.[0] ?? null });
    toast.success('Added to cart');
    setTimeout(() => setBusy(false), 250);
  };

  if (!resolvedProduct) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className={cn('fixed inset-y-0 right-0 z-50 w-full max-w-5xl overflow-y-auto bg-[#FFFCF7] shadow-2xl outline-none', className)}>
          <div className="grid min-h-full gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-[#D8CDBE] p-4 lg:border-b-0 lg:border-r lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">{resolvedProduct.category}</div>
                <Dialog.Close asChild>
                  <button type="button" className="border border-[#D8CDBE] p-2 text-[#2B2B2B] transition hover:border-[#C9A66B]">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </div>
              <ProductCarousel images={gallery} title={resolvedProduct.name} />
            </div>

            <div className="flex flex-col p-5 lg:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B]">
                    {resolvedProduct.name}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-6 text-[#6E665D]">
                    {resolvedProduct.description}
                  </Dialog.Description>
                </div>
                <button type="button" className="shrink-0 border border-[#D8CDBE] p-2 text-[#2B2B2B] transition hover:border-[#C9A66B]">
                  <Heart className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6 flex items-end justify-between border-y border-[#D8CDBE] py-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Price</div>
                  <div className="mt-1 text-2xl font-semibold text-[#2B2B2B]">₹{resolvedProduct.price.toLocaleString('en-IN')}</div>
                </div>
                {resolvedProduct.compareAtPrice ? (
                  <div className="text-right text-sm text-[#6E665D] line-through">₹{resolvedProduct.compareAtPrice.toLocaleString('en-IN')}</div>
                ) : null}
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Select size</div>
                  <SizeSelector sizes={resolvedProduct.sizes ?? []} value={size} onChange={setSize} />
                </div>

                <div className="grid gap-3 border-t border-[#D8CDBE] pt-5 text-sm text-[#2B2B2B]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#6E665D]">Availability</span>
                    <span className="inline-flex items-center gap-2">
                      <span className={cn('h-2 w-2 rounded-full', resolvedProduct.inStock ? 'bg-emerald-600' : 'bg-rose-600')} />
                      {resolvedProduct.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#6E665D]">Material</span>
                    <span className="text-right">{resolvedProduct.material ?? 'Hand-finished leather'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[#6E665D]">Care</span>
                    <span className="text-right">{resolvedProduct.care ?? 'Wipe gently with a dry cloth'}</span>
                  </div>
                  {artisan ? (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-[#6E665D]">Artisan</span>
                      <span className="text-right">{artisan.name}</span>
                    </div>
                  ) : null}
                </div>

                {artisan ? (
                  <div className="border border-[#D8CDBE] bg-[#FAF9F6] p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Craft note</div>
                    <p className="mt-2 text-sm leading-6 text-[#2B2B2B]">{artisan.story}</p>
                  </div>
                ) : null}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!resolvedProduct.inStock || busy}
                    className="flex-1 bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#B38A4E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? 'Adding' : 'Add to cart'}
                  </button>
                  <Dialog.Close asChild>
                    <button type="button" className="border border-[#D8CDBE] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:border-[#C9A66B]">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;