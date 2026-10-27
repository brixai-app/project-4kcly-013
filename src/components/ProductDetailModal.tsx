import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export interface ProductDetailModalProps {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
}

export function ProductDetailModal({
  product = null,
  open = false,
  onOpenChange = () => {},
  onAddToCart = () => {},
}: ProductDetailModalProps) {
  const { addItem } = useCart?.() ?? { addItem: () => {} };
  const images = useMemo(() => {
    const list = product?.images?.length ? product.images : [product?.image ?? ''];
    return list.filter(Boolean);
  }, [product]);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState(product?.color ?? '');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSize(product?.sizes?.[0] ?? '');
    setColor(product?.color ?? '');
    setAdded(false);
  }, [product, open]);

  const currentImage = images[index] ?? product?.image ?? '';
  const stockLabel = product?.inStock === false ? 'Out of stock' : 'In stock';
  const canAdd = Boolean(product?.id) && product?.inStock !== false;

  const handleAdd = () => {
    if (!product || !canAdd) return;
    addItem?.(product, 1, size || undefined, color || undefined);
    onAddToCart?.(product, size || undefined, color || undefined);
    setAdded(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(96vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] shadow-2xl outline-none">
          <div className="grid max-h-[92vh] md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative bg-[#F9F5F0]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={product?.name ?? 'Product preview'}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </AnimatePresence>
                <Dialog.Close className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#BFA6A0] bg-[#FFFDFC]/90 text-[#2B2B2B] transition hover:bg-white">
                  <X className="h-4 w-4" />
                </Dialog.Close>
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIndex((v) => (v - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm border border-[#BFA6A0] bg-[#FFFDFC]/90 text-[#2B2B2B] transition hover:bg-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndex((v) => (v + 1) % images.length)}
                      className="absolute right-14 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm border border-[#BFA6A0] bg-[#FFFDFC]/90 text-[#2B2B2B] transition hover:bg-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto border-t border-[#BFA6A0] bg-white p-3">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      'h-16 w-12 shrink-0 overflow-hidden border transition',
                      i === index ? 'border-[#D9381E]' : 'border-[#BFA6A0]'
                    )}
                  >
                    <img src={img} alt="" crossOrigin="anonymous" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B]">
                    {product?.name ?? 'Product'}
                  </Dialog.Title>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F625D]">
                    {product?.category ?? 'Mojri'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F625D]">{stockLabel}</p>
                </div>
              </div>

              <Dialog.Description className="mt-5 text-sm leading-7 text-[#6F625D]">
                {product?.description ?? 'Handcrafted in Jodhpur with refined leatherwork, heritage detailing, and a tailored fit for ceremonial and everyday wear.'}
              </Dialog.Description>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6F625D]">Size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(product?.sizes?.length ? product.sizes : ['6', '7', '8', '9', '10']).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSize(item)}
                        className={cn(
                          'min-w-0 border px-3 py-2 text-xs uppercase tracking-[0.2em] transition',
                          size === item ? 'border-[#D9381E] bg-[#D9381E] text-white' : 'border-[#BFA6A0] bg-white text-[#2B2B2B]'
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6F625D]">Color</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(product?.color ? [product.color, 'Antique Gold', 'Charcoal'] : ['Tan', 'Antique Gold', 'Charcoal']).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setColor(item)}
                        className={cn(
                          'min-w-0 border px-3 py-2 text-xs uppercase tracking-[0.2em] transition',
                          color === item ? 'border-[#D9381E] bg-[#D9381E] text-white' : 'border-[#BFA6A0] bg-white text-[#2B2B2B]'
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 border-t border-[#BFA6A0] pt-5">
                  {(product?.details ?? ['Hand-finished upper', 'Cushioned leather insole', 'Traditional Jodhpur craftsmanship']).slice(0, 3).map((detail) => (
                    <div key={detail} className="flex items-start gap-2 text-sm text-[#2B2B2B]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D9381E]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#B92B17] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {added ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center border border-[#BFA6A0] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition hover:bg-[#F9F5F0]"
                  >
                    View Collection
                  </Link>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#6F625D]">
                  {product?.artisanId ? `Artisan reference: ${product.artisanId}` : 'Crafted for the Jootiya atelier edit'}
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;