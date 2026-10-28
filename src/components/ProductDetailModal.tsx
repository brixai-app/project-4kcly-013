import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Heart, ShoppingBag, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export interface ProductDetailModalProps {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';

export function ProductDetailModal({
  product = null,
  open = false,
  onOpenChange,
  className = '',
}: ProductDetailModalProps) {
  const { addItem } = useCart?.() ?? { addItem: undefined };
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const gallery = useMemo(() => {
    const images = [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[];
    return images.length > 0 ? images : [fallbackImage];
  }, [product]);

  useEffect(() => {
    if (!open || !product) return;
    setSelectedSize(product?.sizes?.[0] ?? '');
    setSelectedColor(product?.color ?? '');
    setSelectedImage(product?.image ?? gallery?.[0] ?? fallbackImage);
    setQuantity(1);
  }, [open, product, gallery]);

  const stockLabel = product?.availability === 'sold_out'
    ? 'Sold out'
    : product?.availability === 'preorder'
      ? 'Pre-order'
      : product?.availability === 'low_stock'
        ? 'Low stock'
        : 'In stock';

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size.');
      return;
    }
    addItem?.(product, quantity, selectedSize);
    toast.success(`${product?.name ?? 'Item'} added to cart.`);
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-6xl overflow-hidden rounded-t-[6px] border border-[#CDBB9B] bg-[#FFFDF9] shadow-2xl md:inset-0 md:my-auto md:h-[92vh] md:rounded-[6px]',
                  className
                )}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.99 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <div className="grid h-full md:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[42vh] border-b border-[#CDBB9B] bg-[#F9F5F0] md:min-h-0 md:border-b-0 md:border-r">
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-sm border border-[#CDBB9B] bg-[#FFFDF9]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6E6258] backdrop-blur">
                      <span>{stockLabel}</span>
                      <span className="h-1 w-1 rounded-full bg-[#C1440E]" />
                      <span>{product?.category ?? 'Mojri'}</span>
                    </div>
                    <div className="grid h-full grid-rows-[1fr_auto]">
                      <div className="relative min-h-[32rem] overflow-hidden">
                        <img
                          src={selectedImage || gallery?.[0] || fallbackImage}
                          alt={product?.name ?? 'Product image'}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 text-white">
                          <p className="max-w-xl text-sm leading-6 text-white/90">
                            {product?.description ?? 'Hand-finished craftsmanship rooted in Jodhpur’s ceremonial footwear tradition.'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto border-t border-[#CDBB9B] bg-[#FFFDF9] p-3">
                        {gallery?.map((src, index) => (
                          <button
                            key={`${src}-${index}`}
                            type="button"
                            onClick={() => setSelectedImage(src)}
                            className={cn(
                              'h-20 w-20 flex-none overflow-hidden border transition',
                              selectedImage === src ? 'border-[#C1440E]' : 'border-[#CDBB9B]'
                            )}
                          >
                            <img
                              src={src}
                              alt={`${product?.name ?? 'Product'} thumbnail ${index + 1}`}
                              crossOrigin="anonymous"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col">
                    <div className="flex items-start justify-between gap-4 border-b border-[#CDBB9B] p-5 md:p-6">
                      <div className="min-w-0">
                        <Dialog.Title className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight text-[#2E2B28] md:text-4xl">
                          {product?.name ?? 'Product'}
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm leading-6 text-[#6E6258]">
                          {product?.artisan ?? 'Artisan atelier'} · {product?.material ?? 'Leather'} · {selectedColor || product?.color || 'Natural'}
                        </Dialog.Description>
                      </div>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9B] text-[#2E2B28] transition hover:border-[#C1440E] hover:text-[#C1440E]"
                          aria-label="Close dialog"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 md:p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Price</p>
                          <p className="mt-1 font-['Bodoni_Moda'] text-3xl font-light text-[#2E2B28]">
                            ₹{product?.price?.toLocaleString?.('en-IN') ?? '0'}
                          </p>
                        </div>
                        {product?.compareAtPrice ? (
                          <p className="text-sm text-[#6E6258] line-through">
                            ₹{product?.compareAtPrice?.toLocaleString?.('en-IN') ?? ''}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-6 space-y-5">
                        <section>
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Size</h3>
                            <span className="text-xs text-[#6E6258]">{selectedSize || 'Select a size'}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(product?.sizes ?? []).map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                  'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                                  selectedSize === size
                                    ? 'border-[#C1440E] bg-[#C1440E] text-white'
                                    : 'border-[#CDBB9B] bg-[#FFFDF9] text-[#2E2B28] hover:border-[#963308]'
                                )}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </section>

                        <section>
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Color</h3>
                            <span className="text-xs text-[#6E6258]">{selectedColor || '—'}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[selectedColor || product?.color || 'Natural'].map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className="inline-flex items-center gap-2 border border-[#CDBB9B] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E2B28]"
                              >
                                <span className="h-3 w-3 rounded-full border border-[#CDBB9B] bg-[#C1440E]" />
                                {color}
                              </button>
                            ))}
                          </div>
                        </section>

                        <section className="rounded-[6px] border border-[#CDBB9B] bg-[#F9F5F0] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Quantity</p>
                              <p className="mt-1 text-sm text-[#2E2B28]">Choose how many pairs to reserve.</p>
                            </div>
                            <div className="flex items-center border border-[#CDBB9B] bg-[#FFFDF9]">
                              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 text-[#2E2B28]">
                                <ArrowLeft className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 px-3 text-center text-sm font-semibold text-[#2E2B28]">{quantity}</span>
                              <button type="button" onClick={() => setQuantity((q) => q + 1)} className="p-2 text-[#2E2B28]">
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </section>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center gap-2 border border-[#C1440E] bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#963308]"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Add to cart
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.message('Saved to wishlist.')}
                            className="inline-flex items-center justify-center gap-2 border border-[#CDBB9B] bg-[#FFFDF9] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#2E2B28] transition hover:border-[#963308] hover:text-[#963308]"
                          >
                            <Heart className="h-4 w-4" />
                            Save
                          </button>
                        </div>

                        <div className="space-y-3 border-t border-[#CDBB9B] pt-5">
                          <div className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 text-[#C1440E]" />
                            <p className="text-sm leading-6 text-[#6E6258]">Handcrafted by {product?.artisan ?? 'master artisans'} with heritage finishing.</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 text-[#C1440E]" />
                            <p className="text-sm leading-6 text-[#6E6258]">Secure checkout and order tracking through the Jootiya storefront.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#CDBB9B] px-5 py-4 md:px-6">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-[#6E6258]">
                        <span>Quick preview</span>
                        <span>{product?.rating ? `${product.rating.toFixed(1)} rating` : 'Crafted detail'}</span>
                      </div>
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