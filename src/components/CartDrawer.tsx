import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function CartDrawer({ open = false, onOpenChange, className = '' }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeItem, clearCart, subtotal = 0 } = useCart() as any;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shipping = useMemo(() => (subtotal >= 5000 ? 0 : 250), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);
  const progress = useMemo(() => Math.min((subtotal / 5000) * 100, 100), [subtotal]);

  const handleCheckout = async () => {
    if (!items?.length) {
      toast.info('Your cart is empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        items: items?.map((item: any) => ({
          productId: item?.productId ?? '',
          quantity: item?.quantity ?? 1,
          size: item?.size ?? '',
        })),
        subtotal,
        shipping,
        total,
      };
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response?.ok) throw new Error('Checkout failed');
      const data = await response.json().catch(() => null);
      toast.success(data?.message ?? 'Checkout ready.');
      clearCart?.();
      onOpenChange?.(false);
      navigate('/checkout');
    } catch {
      toast.error('Unable to start checkout right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#CDBB9B] bg-[#FFFDF9] text-[#2E2B28] shadow-2xl outline-none',
            className
          )}
        >
          <div className="flex items-center justify-between border-b border-[#CDBB9B] px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-['Bodoni_Moda'] text-2xl font-light tracking-tight">
                Cart
              </Dialog.Title>
              <p className="text-xs uppercase tracking-[0.24em] text-[#6E6258]">
                {items?.length ?? 0} item{(items?.length ?? 0) === 1 ? '' : 's'}
              </p>
            </div>
            <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9B] text-[#2E2B28] transition hover:bg-[#C1440E] hover:text-white">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <AnimatePresence initial={false}>
              {items?.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="flex flex-col gap-4"
                >
                  {items.map((item: any) => {
                    const product = item?.product ?? {};
                    const image = product?.image ?? 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';
                    const price = product?.price ?? 0;
                    return (
                      <div key={`${item?.productId ?? 'item'}-${item?.size ?? 'one'}`} className="flex gap-3 border-b border-[#CDBB9B]/70 pb-4">
                        <img
                          src={image}
                          crossOrigin="anonymous"
                          alt={product?.name ?? 'Product'}
                          className="h-24 w-20 shrink-0 rounded-sm object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium">{product?.name ?? 'Mojri'}</p>
                              <p className="truncate text-xs uppercase tracking-[0.2em] text-[#6E6258]">
                                {product?.category ?? 'Jodhpuri'}
                              </p>
                            </div>
                            <p className="shrink-0 font-semibold">₹{price.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center border border-[#CDBB9B]">
                              <button
                                type="button"
                                onClick={() => updateQuantity?.(item?.productId, Math.max(1, (item?.quantity ?? 1) - 1), item?.size)}
                                className="inline-flex h-9 w-9 items-center justify-center text-[#2E2B28] transition hover:bg-[#F9F5F0]"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-8 px-2 text-center text-sm">{item?.quantity ?? 1}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity?.(item?.productId, (item?.quantity ?? 1) + 1, item?.size)}
                                className="inline-flex h-9 w-9 items-center justify-center text-[#2E2B28] transition hover:bg-[#F9F5F0]"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem?.(item?.productId, item?.size)}
                              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-[#6E6258] transition hover:text-[#C1440E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center border border-[#CDBB9B] text-[#C1440E]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-['Bodoni_Moda'] text-3xl font-light">Your cart is empty</p>
                    <p className="mt-2 text-sm text-[#6E6258]">Add handcrafted pairs to begin your order.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-[#CDBB9B] bg-[#F9F5F0] px-5 py-4">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#6E6258]">
                <span>Free shipping</span>
                <span>₹5,000</span>
              </div>
              <div className="h-1.5 overflow-hidden bg-[#E7DDCF]">
                <div className="h-full bg-[#C1440E]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-[#6E6258]">
                {subtotal >= 5000 ? 'You qualify for complimentary shipping.' : `Add ₹${Math.max(0, 5000 - subtotal).toLocaleString('en-IN')} more for free shipping.`}
              </p>
            </div>

            <div className="space-y-2 border-t border-[#CDBB9B] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6E6258]">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6E6258]">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#CDBB9B] pt-2 text-base">
                <span className="font-medium">Total</span>
                <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!items?.length || isSubmitting}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#963308] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Preparing checkout' : 'Proceed to checkout'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;