import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface ProductDetailModalProps {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ProductDetailModal({
  product = null,
  open = false,
  onOpenChange = () => {},
  className = '',
}: ProductDetailModalProps) {
  const { addItem } = useCart() as any;
  const sizes = product?.sizes?.length ? product.sizes : ['36', '37', '38', '39', '40', '41'];
  const colors = product?.colors?.length ? product.colors : ['Tan', 'Ivory', 'Onyx'];
  const [size, setSize] = useState(sizes[0] ?? '');
  const [color, setColor] = useState(colors[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSize(sizes[0] ?? '');
    setColor(colors[0] ?? '');
    setQuantity(1);
    setLoading(false);
    setAdded(false);
  }, [product?.id, open]);

  const priceLabel = useMemo(() => `₹${Number(product?.price ?? 0).toLocaleString('en-IN')}`, [product?.price]);
  const originalLabel = useMemo(
    () => (product?.originalPrice ? `₹${Number(product.originalPrice).toLocaleString('en-IN')}` : ''),
    [product?.originalPrice],
  );

  const handleAdd = async () => {
    if (!product?.id) return;
    if (!size) {
      toast.error('Please select a size.');
      return;
    }
    if (!color) {
      toast.error('Please select a color.');
      return;
    }
    setLoading(true);
    try {
      await Promise.resolve(
        addItem?.({
          productId: product.id,
          quantity,
          size,
          color,
          price: product.price ?? 0,
          product,
        }),
      );
      setAdded(true);
      toast.success('Added to cart');
      window.setTimeout(() => {
        onOpenChange(false);
      }, 700);
    } catch {
      toast.error('Could not add item right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(94vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] shadow-2xl outline-none',
            className,
          )}
        >
          <div className="grid max-h-[88vh] grid-cols-1 overflow-hidden md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[320px] bg-[#F5F1EB]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={product?.imageUrl ?? 'placeholder'}
                  src={product?.imageUrl ?? 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'}
                  alt={product?.name ?? 'Product image'}
                  crossOrigin="anonymous"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-[#CFC2B2] bg-[#FFFDF7]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655C]">
                <span>{product?.category ?? 'collection'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-5 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Dialog.Title className="font-['Playfair_Display',serif] text-3xl font-normal leading-none tracking-tight text-[#2B2B2B]">
                    {product?.name ?? 'Selected piece'}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-6 text-[#6F655C]">
                    {product?.description ?? 'Handcrafted with tactile leather, precise stitching, and a refined silhouette.'}
                  </Dialog.Description>
                </div>
                <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#CFC2B2] text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              <div className="flex items-end gap-3">
                <div className="font-['Bodoni_Moda',serif] text-2xl font-semibold text-[#2B2B2B]">{priceLabel}</div>
                {originalLabel ? <div className="pb-0.5 text-sm text-[#6F655C] line-through">{originalLabel}</div> : null}
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Size</div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={cn(
                        'min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                        size === item
                          ? 'border-[#E07A5F] bg-[#E07A5F] text-black'
                          : 'border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] hover:bg-[#F5F1EB]',
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Color</div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setColor(item)}
                      className={cn(
                        'min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                        color === item
                          ? 'border-[#E07A5F] bg-[#E07A5F] text-black'
                          : 'border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] hover:bg-[#F5F1EB]',
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-[#CFC2B2] pt-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Quantity</div>
                  <div className="inline-flex items-center rounded-sm border border-[#CFC2B2] bg-[#FFFDF7]">
                    <button
                      type="button"
                      onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                      className="flex h-10 w-10 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="min-w-10 px-3 text-center text-sm font-semibold">{quantity}</div>
                    <button
                      type="button"
                      onClick={() => setQuantity((v) => Math.min(10, v + 1))}
                      className="flex h-10 w-10 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={loading}
                  className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-sm bg-[#E07A5F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#C85F45] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Adding' : added ? 'Added' : 'Add to cart'}
                  {added ? <Check className="h-4 w-4" /> : null}
                </button>
              </div>

              <div className="rounded-sm border border-[#CFC2B2] bg-[#F5F1EB] p-4 text-sm leading-6 text-[#6F655C]">
                <span className="font-semibold text-[#2B2B2B]">Craft note:</span>{' '}
                {product?.material ?? 'Leather upper with hand-finished detailing and a cushioned insole.'}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;