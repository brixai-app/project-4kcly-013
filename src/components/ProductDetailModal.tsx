import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, CheckCircle2, Minus, Plus, Shield, Truck, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import type { Product, ProductSize } from '@/types';

export interface ProductDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
}

export function ProductDetailModal({ open = false, onOpenChange = () => {}, product = null }: ProductDetailModalProps) {
  const { addToCart } = useCart?.() ?? {};
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [quantity, setQuantity] = useState(1);

  const availableSizes = product?.sizes ?? [];
  const inStock = product?.inStock ?? true;
  const rating = product?.rating ?? 4.8;
  const reviewCount = product?.reviewCount ?? 0;
  const gallery = useMemo(() => [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[], [product]);

  useEffect(() => {
    if (open) {
      setSelectedSize((product?.sizes?.[0] ?? '') as ProductSize | '');
      setQuantity(1);
    }
  }, [open, product]);

  const handleAdd = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Select a size to continue.');
      return;
    }
    if (!inStock) {
      toast.error('This piece is currently unavailable.');
      return;
    }
    addToCart?.({
      productId: product.id,
      quantity,
      size: selectedSize,
      price: product.price,
      name: product.name,
      image: product.image,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart.`);
    onOpenChange(false);
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
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 48 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-4xl overflow-y-auto border-l border-[#D8CCB9] bg-[#FAF9F6] text-[#1A1A1A] shadow-2xl outline-none"
              >
                <div className="flex items-center justify-between border-b border-[#D8CCB9] px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Quick View</p>
                    <Dialog.Title className="mt-1 truncate font-['Playfair_Display'] text-2xl font-medium">
                      {product?.name ?? 'Product'}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] bg-white text-[#1A1A1A] transition-colors hover:bg-[#A94720] hover:text-white"
                      aria-label="Close quick view"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="border-b border-[#D8CCB9] lg:border-b-0 lg:border-r">
                    <div className="grid gap-0 sm:grid-cols-2">
                      {gallery.slice(0, 4).map((src, index) => (
                        <div key={`${src}-${index}`} className={cn('relative overflow-hidden border-[#D8CCB9]', index < 2 ? 'border-b sm:border-b-0' : '', index % 2 === 0 ? 'sm:border-r' : '')}>
                          <img
                            src={src}
                            alt={product?.name ?? 'Product image'}
                            crossOrigin="anonymous"
                            className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 px-5 py-5 lg:px-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-[#675F56]">
                        <span className="uppercase tracking-[0.24em]">{product?.collection ?? 'Collection'}</span>
                        <span className="h-1 w-1 rounded-full bg-[#D8CCB9]" />
                        <span>{product?.category ?? 'Mojri'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#675F56]">
                        <Star className="h-4 w-4 fill-[#A94720] text-[#A94720]" />
                        <span>{rating.toFixed(1)}</span>
                        <span>({reviewCount} reviews)</span>
                      </div>
                      <p className="max-w-xl text-sm leading-6 text-[#675F56]">{product?.description ?? ''}</p>
                    </div>

                    <div className="grid gap-3 border-y border-[#D8CCB9] py-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Material</p>
                        <p className="text-sm font-medium">{(product?.materials ?? []).join(', ') || 'Hand-finished leather'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Color</p>
                        <p className="text-sm font-medium">{product?.color ?? 'Natural'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Availability</p>
                        <p className={cn('inline-flex items-center gap-2 text-sm font-medium', inStock ? 'text-[#1A1A1A]' : 'text-[#A94720]')}>
                          {inStock ? <CheckCircle2 className="h-4 w-4 text-[#A94720]" /> : <Shield className="h-4 w-4 text-[#A94720]" />}
                          {inStock ? 'In stock' : 'Limited stock'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Delivery</p>
                        <p className="inline-flex items-center gap-2 text-sm font-medium">
                          <Truck className="h-4 w-4 text-[#A94720]" />
                          3–5 business days
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Price</p>
                          <p className="font-['Playfair_Display'] text-3xl font-medium">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</p>
                        </div>
                        {product?.compareAtPrice ? (
                          <p className="text-sm text-[#675F56] line-through">₹{product.compareAtPrice.toLocaleString('en-IN')}</p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#675F56]">Select size</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                                selectedSize === size
                                  ? 'border-[#A94720] bg-[#A94720] text-white'
                                  : 'border-[#D8CCB9] bg-white text-[#1A1A1A] hover:border-[#A94720]'
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#D8CCB9] bg-white">
                          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 hover:bg-[#F5F1E9]">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-10 px-3 text-center text-sm font-medium">{quantity}</span>
                          <button type="button" onClick={() => setQuantity((q) => q + 1)} className="p-3 hover:bg-[#F5F1E9]">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleAdd}
                          className="inline-flex flex-1 items-center justify-center gap-2 bg-[#A94720] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#843616]"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Add to cart
                        </button>
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