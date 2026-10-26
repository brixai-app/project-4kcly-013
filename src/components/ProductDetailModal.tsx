import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { Product, ProductColor, ProductSize } from '@/types';

type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
  className?: string;
};

const sizeOrder: ProductSize[] = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'XS', 'S', 'M', 'L', 'XL'];
const colorLabels: Record<ProductColor, string> = {
  ivory: 'Ivory',
  maroon: 'Maroon',
  'antique-gold': 'Antique Gold',
  tan: 'Tan',
  black: 'Black',
  rust: 'Rust',
};

export function ProductDetailModal({
  open = false,
  onOpenChange = () => {},
  product = null,
  className = '',
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<ProductSize | ''>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    const images = [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[];
    return Array.from(new Set(images));
  }, [product]);

  useEffect(() => {
    setSelectedImage(gallery?.[0] ?? '');
    setSelectedSize(product?.sizes?.[0] ?? '');
    setSelectedColor(product?.colors?.[0] ?? '');
    setQuantity(1);
    setAdded(false);
  }, [product, gallery, open]);

  const maxQty = product?.inStock ? 6 : 0;
  const canAdd = Boolean(product?.id) && Boolean(selectedSize) && Boolean(selectedColor) && quantity > 0 && quantity <= maxQty;

  const handleAdd = () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      toast.error('Please choose a size and color.');
      return;
    }
    if (!product.inStock) {
      toast.error('This style is currently out of stock.');
      return;
    }
    addItem({ product, quantity, size: selectedSize, color: selectedColor });
    setAdded(true);
    toast.success('Added to cart.');
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#2B1715]/55 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(96vw,1100px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715] shadow-2xl outline-none',
            className
          )}
        >
          <div className="grid max-h-[92vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative bg-[#F7F0E4]">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-none border border-[#CDBB9F] bg-[#FFFDF8]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#765F55]">
                <span>{product?.artisanName ?? 'Jodhpur Craft'}</span>
              </div>
              <Dialog.Close className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715] transition hover:bg-[#741F2B] hover:text-white">
                <X className="h-4 w-4" />
              </Dialog.Close>
              <div className="aspect-[4/5] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage || product?.id}
                    src={selectedImage || product?.image || ''}
                    alt={product?.name ?? 'Product image'}
                    crossOrigin="anonymous"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <div className="flex gap-2 overflow-x-auto border-t border-[#CDBB9F] bg-[#FFFDF8] p-3">
                {gallery.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      'h-20 w-20 shrink-0 overflow-hidden border transition',
                      selectedImage === image ? 'border-[#741F2B]' : 'border-[#CDBB9F]'
                    )}
                  >
                    <img src={image} alt={product?.name ?? 'Thumbnail'} crossOrigin="anonymous" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-col">
              <div className="border-b border-[#CDBB9F] px-6 py-5">
                <Dialog.Title className="font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B1715]">
                  {product?.name ?? 'Selected Mojri'}
                </Dialog.Title>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#765F55]">
                  <span>{product?.category ?? 'mojri'}</span>
                  <span>•</span>
                  <span>₹{product?.price?.toLocaleString('en-IN') ?? '0'}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="max-w-xl text-sm leading-7 text-[#765F55]">{product?.description ?? 'A refined handcrafted silhouette with heritage detailing and a tailored fit.'}</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#765F55]">Size</div>
                    <div className="flex flex-wrap gap-2">
                      {(product?.sizes?.length ? product.sizes : sizeOrder).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                            selectedSize === size ? 'border-[#741F2B] bg-[#741F2B] text-white' : 'border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715]'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#765F55]">Color</div>
                    <div className="flex flex-wrap gap-2">
                      {(product?.colors?.length ? product.colors : (['ivory', 'maroon', 'antique-gold'] as ProductColor[])).map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            'min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                            selectedColor === color ? 'border-[#741F2B] bg-[#741F2B] text-white' : 'border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715]'
                          )}
                        >
                          {colorLabels[color]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#765F55]">Quantity</div>
                      <div className="inline-flex items-center border border-[#CDBB9F] bg-[#FFFDF8]">
                        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-[#2B1715]">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 px-4 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(maxQty || 1, q + 1))}
                          className="px-3 py-2 text-[#2B1715]"
                          disabled={!product?.inStock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-[#765F55]">
                      {product?.inStock ? `In stock · up to ${maxQty} pieces` : 'Currently unavailable'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#CDBB9F] p-4">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] transition',
                    canAdd ? 'border-[#741F2B] bg-[#741F2B] text-white hover:bg-[#57151F]' : 'cursor-not-allowed border-[#CDBB9F] bg-[#F7F0E4] text-[#765F55]'
                  )}
                >
                  {added ? <Check className="h-4 w-4" /> : null}
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;