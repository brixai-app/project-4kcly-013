import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Circle as ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Product, Size, ColorVariant } from '@/types';
import { computeStockKey } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

export interface ProductDetailModalProps {
  product?: Product;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductDetailModal({
  product,
  open = false,
  onOpenChange,
}: ProductDetailModalProps) {
  const { addItem, openDrawer } = useCart();
  const firstSize = product?.sizes?.[0] ?? 'EU 38';
  const firstColor = product?.colors?.[0] ?? 'Black';
  const [size, setSize] = useState<Size>(firstSize as Size);
  const [color, setColor] = useState<ColorVariant>(firstColor as ColorVariant);
  const [quantity, setQuantity] = useState<number>(1);
  const [imageIndex, setImageIndex] = useState(0);

  const maxAvailable = useMemo(() => {
    if (!product) return 0;
    const key = computeStockKey(size, color);
    const stock = product.stockByKey?.[key] ?? 0;
    return stock < 10 ? stock : 10;
  }, [product, size, color]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (maxAvailable > 0 && next > maxAvailable) return maxAvailable;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (maxAvailable <= 0) {
      toast.error('Selected variant is out of stock.');
      return;
    }
    addItem({
      productId: product.id,
      size,
      color,
      quantity,
    });
    toast.success('Added to bag');
    openDrawer();
    onOpenChange?.(false);
  };

  const handleImageNav = (direction: 'prev' | 'next') => {
    if (!product?.images?.length) return;
    setImageIndex(prev => {
      const total = product.images.length;
      if (direction === 'next') return (prev + 1) % total;
      return (prev - 1 + total) % total;
    });
  };

  const isOutOfStock = maxAvailable <= 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-6 right-6 left-6 md:left-auto md:w-[540px] z-50 bg-white rounded-2xl border border-[#E6DED3] shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E6DED3] px-5 py-3">
              <Dialog.Title className="text-sm tracking-[0.2em] uppercase text-[#6F675E]">
                Quick View
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-2 rounded-full border border-transparent hover:border-[#E6DED3] hover:bg-[#F9F6F2] transition-colors"
                >
                  <X className="w-4 h-4 text-[#2E2B28]" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F9F6F2]">
                    {product?.images?.[imageIndex] && (
                      <img
                        src={product.images[imageIndex].url}
                        alt={product.images[imageIndex].alt}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {product?.images?.length && product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleImageNav('prev')}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white"
                        >
                          <ChevronLeft className="w-4 h-4 text-[#2E2B28]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImageNav('next')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-sm hover:bg-white"
                        >
                          <ChevronRight className="w-4 h-4 text-[#2E2B28]" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {product?.images?.map((img, idx) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setImageIndex(idx)}
                        className={cn(
                          'h-14 w-11 flex-shrink-0 rounded-lg overflow-hidden border transition-all',
                          idx === imageIndex
                            ? 'border-[#BFA06A]'
                            : 'border-transparent hover:border-[#E6DED3]'
                        )}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-2xl font-light tracking-tight text-[#2E2B28] font-[Playfair Display]">
                      {product?.name ?? 'Untitled Piece'}
                    </h2>
                    <p className="mt-1 text-xs tracking-[0.18em] uppercase text-[#6F675E]">
                      {product?.collection ?? 'Signature Line'} · {product?.category ?? 'Heels'}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[#2E2B28]">
                      ₹{product?.price?.toLocaleString('en-IN') ?? '0'}
                    </p>
                  </div>

                  <p className="text-xs text-[#6F675E] leading-relaxed line-clamp-4">
                    {product?.description ??
                      'Refined silhouette crafted in supple leather with subtle elevation for everyday rituals.'}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675E]">
                        Size
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(product?.sizes ?? ['EU 37', 'EU 38', 'EU 39']).map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setSize(option);
                              setQuantity(1);
                            }}
                            className={cn(
                              'px-2.5 py-1.5 text-xs border rounded-md transition-colors',
                              option === size
                                ? 'border-[#BFA06A] bg-[#F9F6F2] text-[#2E2B28]'
                                : 'border-[#E6DED3] text-[#6F675E] hover:border-[#BFA06A]'
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675E]">
                        Color
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(product?.colors ?? ['Black', 'Ivory']).map(option => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setColor(option);
                              setQuantity(1);
                            }}
                            className={cn(
                              'px-2.5 py-1.5 text-xs border rounded-md transition-colors',
                              option === color
                                ? 'border-[#BFA06A] bg-[#F9F6F2] text-[#2E2B28]'
                                : 'border-[#E6DED3] text-[#6F675E] hover:border-[#BFA06A]'
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F675E]">
                          Quantity
                        </p>
                        <div className="mt-1 inline-flex items-center border border-[#E6DED3] rounded-md">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(-1)}
                            className="px-2 py-1 text-sm text-[#6F675E] hover:bg-[#F9F6F2]"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm text-[#2E2B28]">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(1)}
                            className="px-2 py-1 text-sm text-[#6F675E] hover:bg-[#F9F6F2]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#6F675E]">
                        {isOutOfStock
                          ? 'Out of stock for this selection'
                          : `Available: ${maxAvailable} pair${maxAvailable === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={cn(
                      'mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase rounded-md transition-colors',
                      isOutOfStock
                        ? 'bg-[#E6DED3] text-[#6F675E] cursor-not-allowed'
                        : 'bg-[#BFA06A] text-black hover:bg-[#A88955]'
                    )}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'Unavailable' : 'Add to bag'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;