import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { ModalContractProps, Product } from '@/types';
import { useCart } from '@/context/CartContext';

export type ProductDetailModalProps = ModalContractProps & {
  product?: Product | null;
  onQuickAdd?: (product: Product, size?: string, color?: string) => void;
};

const defaultProps = {
  open: false,
  onOpenChange: () => undefined,
  product: null,
  onQuickAdd: () => undefined,
};

export function ProductDetailModal({
  open = defaultProps.open,
  onOpenChange = defaultProps.onOpenChange,
  product = defaultProps.product,
  onQuickAdd = defaultProps.onQuickAdd,
}: ProductDetailModalProps) {
  const { addItem } = useCart?.() ?? { addItem: () => undefined };
  const sizes = product?.sizes?.length ? product.sizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9'];
  const colors = product?.colors?.length ? product.colors : ['Tan', 'Ivory', 'Black'];
  const [size, setSize] = useState(sizes?.[0] ?? '');
  const [color, setColor] = useState(colors?.[0] ?? '');

  const inStock = (product?.stock ?? 0) > 0;
  const gallery = useMemo(() => {
    const base = product?.gallery?.length ? product.gallery : [product?.image ?? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85'];
    return base.filter(Boolean);
  }, [product]);

  const handleAdd = () => {
    if (!product) return;
    if (!inStock) {
      toast.error('This pair is currently out of stock.');
      return;
    }
    addItem?.({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: size || undefined,
      color: color || undefined,
      stock: product.stock,
    });
    onQuickAdd?.(product, size || undefined, color || undefined);
    toast.success('Added to cart.');
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-3xl flex-col overflow-hidden border-l border-[#8A806F] bg-[#FFFDF8] shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <div className="flex items-center justify-between border-b border-[#8A806F] px-5 py-4">
                  <div className="min-w-0">
                    <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#211F1C]">
                      {product?.name ?? 'Product Preview'}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.24em] text-[#514B42]">
                      Quick preview · artisan provenance · stock-safe selection
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center border border-[#8A806F] text-[#211F1C] transition-colors hover:bg-[#6B451D] hover:text-white"
                      aria-label="Close preview"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="border-b border-[#8A806F] lg:border-b-0 lg:border-r">
                    <div className="aspect-[4/5] w-full overflow-hidden bg-[#FAF7F0]">
                      <img
                        src={gallery?.[0] ?? product?.image ?? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85'}
                        alt={product?.name ?? 'Product image'}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-px border-t border-[#8A806F] bg-[#8A806F]">
                      {gallery.slice(0, 3).map((src, index) => (
                        <div key={`${src}-${index}`} className="aspect-[4/5] overflow-hidden bg-[#FAF7F0]">
                          <img
                            src={src}
                            alt={`${product?.name ?? 'Product'} view ${index + 1}`}
                            crossOrigin="anonymous"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 p-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#514B42]">{product?.category ?? 'Mojri'}</p>
                        <p className="text-sm font-semibold text-[#211F1C]">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</p>
                      </div>
                      <p className="max-w-prose text-sm leading-6 text-[#514B42]">{product?.description ?? 'Handcrafted footwear shaped by Jodhpur artisans using time-honored techniques and refined finishing.'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#514B42]">
                        <span className={cn('inline-flex items-center gap-1 border px-2 py-1', inStock ? 'border-[#8A806F] text-[#211F1C]' : 'border-red-400 text-red-700')}>
                          {inStock ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          {inStock ? `In stock · ${product?.stock ?? 0} left` : 'Out of stock'}
                        </span>
                        {product?.origin ? <span className="border border-[#8A806F] px-2 py-1">{product.origin}</span> : null}
                        {product?.material ? <span className="border border-[#8A806F] px-2 py-1">{product.material}</span> : null}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.24em] text-[#514B42]">Size</p>
                          <ChevronDown className="h-4 w-4 text-[#514B42]" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setSize(item)}
                              className={cn(
                                'min-w-0 border px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors',
                                size === item ? 'border-[#6B451D] bg-[#6B451D] text-white' : 'border-[#8A806F] text-[#211F1C] hover:bg-[#FAF7F0]'
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#514B42]">Color</p>
                        <div className="flex flex-wrap gap-2">
                          {colors.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setColor(item)}
                              className={cn(
                                'min-w-0 border px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors',
                                color === item ? 'border-[#6B451D] bg-[#6B451D] text-white' : 'border-[#8A806F] text-[#211F1C] hover:bg-[#FAF7F0]'
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto border-t border-[#8A806F] pt-5">
                      <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!inStock}
                        className="inline-flex w-full items-center justify-center gap-2 bg-[#6B451D] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#4E3014] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {inStock ? 'Add to Cart' : 'Notify Me'}
                        <ArrowRight className="h-4 w-4" />
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