import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X, ShoppingBag, Shield, Truck, Leaf, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

type ProductDetailModalProps = {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DEFAULT_SIZES = ['6', '7', '8', '9', '10', '11'];

export function ProductDetailModal({ product = null, open = false, onOpenChange = () => {} }: ProductDetailModalProps) {
  const { addItem } = useCart?.() ?? {};
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [adding, setAdding] = useState(false);

  const sizes = useMemo(() => product?.sizes?.length ? product.sizes : DEFAULT_SIZES, [product?.sizes]);
  const inStock = product?.inStock ?? true;

  useEffect(() => {
    if (open) setSelectedSize(product?.sizes?.[0] ?? DEFAULT_SIZES[0] ?? '');
  }, [open, product?.id, product?.sizes]);

  const handleAdd = async () => {
    if (!product) return;
    if (!inStock) {
      toast.error('This size is currently unavailable.');
      return;
    }
    setAdding(true);
    try {
      addItem?.({
        id: `${product.id}-${selectedSize || 'default'}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        size: selectedSize || undefined,
      });
      toast.success('Added to cart');
      onOpenChange(false);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29] shadow-[0_24px_80px_rgba(48,45,41,0.22)]"
              >
                <div className="grid max-h-[88vh] md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[320px] bg-[#F5F1EB]">
                    <img
                      src={product?.image ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'}
                      alt={product?.name ?? 'Product preview'}
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#71695F] backdrop-blur">
                      <Leaf className="h-3.5 w-3.5" />
                      Provenance
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-col">
                    <div className="flex items-start justify-between gap-4 border-b border-[#C9BFB1] px-5 py-4 md:px-6">
                      <div className="min-w-0">
                        <Dialog.Title className="font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight text-[#302D29]">
                          {product?.name ?? 'Jodhpuri Mojri'}
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm leading-6 text-[#71695F]">
                          {product?.description ?? 'Hand-finished craftsmanship with a refined silhouette and heritage detailing.'}
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center border border-[#C9BFB1] text-[#302D29] transition-colors hover:bg-[#6B1E1E] hover:text-white"
                          aria-label="Close"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#71695F]">Price</p>
                          <p className="mt-1 text-2xl font-semibold text-[#302D29]">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: product?.currency ?? 'INR',
                              maximumFractionDigits: 0,
                            }).format(product?.price ?? 0)}
                          </p>
                        </div>
                        <div className={cn('inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em]', inStock ? 'text-[#6B1E1E]' : 'text-[#71695F]')}>
                          {inStock ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          {inStock ? 'In stock' : 'Sold out'}
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#71695F]">
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Select size
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((size) => {
                            const active = selectedSize === size;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                  'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                                  active ? 'border-[#6B1E1E] bg-[#6B1E1E] text-white' : 'border-[#C9BFB1] bg-transparent text-[#302D29] hover:border-[#6B1E1E]'
                                )}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 border-t border-[#C9BFB1] pt-5 text-sm text-[#71695F]">
                        <div className="flex items-start gap-3">
                          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                          <span>Authentic artisan finish with quality-checked detailing.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                          <span>Carefully packed and dispatched with tracked delivery.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                          <span>{product?.origin ?? 'Crafted in Jodhpur, Rajasthan.'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#C9BFB1] p-4 md:p-5">
                      <button
                        type="button"
                        onClick={() => void handleAdd()}
                        disabled={adding || !inStock}
                        className="inline-flex w-full items-center justify-center gap-2 bg-[#6B1E1E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#501515] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {adding ? 'Adding' : inStock ? 'Add to cart' : 'Unavailable'}
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ProductDetailModal;