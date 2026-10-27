import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Minus, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

export interface ProductDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
}

export function ProductDetailModal({ open = false, onOpenChange = () => {}, product = null }: ProductDetailModalProps) {
  const navigate = useNavigate();
  const { addItem } = useCart() as { addItem?: (product: Product, quantity?: number, size?: string) => void };
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('Ivory');
  const [quantity, setQuantity] = useState<number>(1);

  const sizes = useMemo(() => product?.sizes?.length ? product.sizes : ['7', '8', '9', '10', '11'], [product?.sizes]);
  const colors = useMemo(() => ['Ivory', 'Tan', 'Espresso'], []);

  useEffect(() => {
    if (!open) return;
    setSize(product?.sizes?.[0] ?? '');
    setColor('Ivory');
    setQuantity(1);
  }, [open, product?.id, product?.sizes]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    addItem?.(product, quantity, size);
    toast.success(`${product.name} added to cart`);
    onOpenChange(false);
  };

  const handleViewProduct = () => {
    if (!product?.id) return;
    onOpenChange(false);
    navigate(`/shop?product=${encodeURIComponent(product.id)}`);
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
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#D8CDBB] bg-[#FAF9F6] text-[#2B2B2B] shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
              >
                <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[320px] bg-white">
                    <img
                      src={product?.image ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'}
                      alt={product?.name ?? 'Product preview'}
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 border border-[#D8CDBB] bg-[#FAF9F6]/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665C]">
                      <span className="h-1.5 w-1.5 bg-[#9A7135]" />
                      Heritage Preview
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col p-5 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Dialog.Title className="font-['Playfair_Display'] text-3xl font-normal tracking-tight text-[#2B2B2B]">
                          {product?.name ?? 'Jootiya'}
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 max-w-xl text-sm leading-6 text-[#6E665C]">
                          {product?.description ?? 'Hand-finished Jodhpuri craftsmanship shaped in supple leather, balanced for ceremonial presence and everyday ease.'}
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBB] text-[#2B2B2B] transition-colors hover:bg-[#9A7135] hover:text-black"
                          aria-label="Close"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4 border-y border-[#D8CDBB] py-4">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Price</div>
                        <div className="mt-1 font-['Bodoni_Moda'] text-3xl leading-none text-[#2B2B2B]">
                          ₹{product?.price?.toLocaleString('en-IN') ?? '0'}
                        </div>
                      </div>
                      <div className="text-right text-xs uppercase tracking-[0.24em] text-[#6E665C]">
                        {product?.artisan ?? 'Artisan atelier'}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4">
                      <div>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Color</div>
                        <div className="flex flex-wrap gap-2">
                          {colors.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setColor(item)}
                              className={cn(
                                'inline-flex items-center gap-2 border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors',
                                color === item
                                  ? 'border-[#9A7135] bg-[#9A7135] text-black'
                                  : 'border-[#D8CDBB] bg-white text-[#2B2B2B] hover:border-[#9A7135]'
                              )}
                            >
                              {color === item ? <Check className="h-3.5 w-3.5" /> : null}
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Size</div>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setSize(item)}
                              className={cn(
                                'inline-flex min-w-0 items-center justify-center border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors',
                                size === item
                                  ? 'border-[#9A7135] bg-[#9A7135] text-black'
                                  : 'border-[#D8CDBB] bg-white text-[#2B2B2B] hover:border-[#9A7135]'
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Quantity</div>
                          <div className="inline-flex items-center border border-[#D8CDBB] bg-white">
                            <button type="button" onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="px-3 py-2 text-[#2B2B2B]">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 px-4 py-2 text-center text-sm font-medium">{quantity}</span>
                            <button type="button" onClick={() => setQuantity((v) => v + 1)} className="px-3 py-2 text-[#2B2B2B]">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right text-xs leading-5 text-[#6E665C]">
                          <div className="uppercase tracking-[0.24em]">Selected</div>
                          <div className="mt-1 font-medium text-[#2B2B2B]">{color} / {size || '—'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex items-center justify-center gap-2 bg-[#9A7135] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#765326]"
                      >
                        Add to Cart
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleViewProduct}
                        className="inline-flex items-center justify-center gap-2 border border-[#D8CDBB] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:border-[#9A7135]"
                      >
                        View Full Story
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