import React, { useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { CartItem, Product } from '@/types';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function formatPrice(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function getItemProduct(item: CartItem): Product | null {
  return item?.product ?? null;
}

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const navigate = useNavigate();
  const cart = useCart() as any;
  const items: CartItem[] = cart?.items ?? [];
  const updateQuantity = cart?.updateQuantity ?? (() => {});
  const removeItem = cart?.removeItem ?? (() => {});
  const subtotal = cart?.subtotal ?? 0;
  const shippingFee = subtotal >= 2500 || subtotal === 0 ? 0 : 149;
  const total = subtotal + shippingFee;

  const progress = useMemo(() => Math.min((subtotal / 2500) * 100, 100), [subtotal]);
  const remaining = Math.max(2500 - subtotal, 0);

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#D8CDBD] bg-[#FAF9F6] text-[#1A1A1A] shadow-2xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-[#D8CDBD] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">
                  Cart
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.22em] text-[#675F56]">
                  Slide-over checkout
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBD] text-[#1A1A1A] transition-colors hover:bg-[#F5F1E9]"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-5 rounded-sm border border-[#D8CDBD] bg-white p-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#675F56]">
                  <span>Shipping progress</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="h-1.5 overflow-hidden bg-[#F5F1E9]">
                  <div className="h-full bg-[#A94721]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-[#675F56]">
                  {remaining > 0 ? `${formatPrice(remaining)} away from complimentary shipping.` : 'Complimentary shipping unlocked.'}
                </p>
              </div>

              <AnimatePresence initial={false}>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, index) => {
                      const product = getItemProduct(item);
                      const quantity = Math.max(item?.quantity ?? 1, 1);
                      const stock = product?.inStock ?? true;
                      const maxQty = stock ? 10 : 1;
                      const lineTotal = (product?.price ?? 0) * quantity;

                      return (
                        <motion.div
                          key={`${item?.productId ?? index}-${item?.size ?? 'default'}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className="flex gap-4 border-b border-[#D8CDBD] pb-4"
                        >
                          <div className="h-24 w-20 shrink-0 overflow-hidden border border-[#D8CDBD] bg-[#F5F1E9]">
                            <img
                              src={product?.image ?? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'}
                              alt={product?.name ?? 'Cart item'}
                              crossOrigin="anonymous"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-['Playfair_Display'] text-lg font-medium">
                                  {product?.name ?? 'Selected item'}
                                </p>
                                <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-[#675F56]">
                                  {product?.category ?? 'Mojri'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem?.(item?.productId, item?.size)}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[#D8CDBD] text-[#675F56] transition-colors hover:bg-[#F5F1E9] hover:text-[#1A1A1A]"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="flex items-center border border-[#D8CDBD]">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity?.(item?.productId, Math.max(quantity - 1, 0), item?.size)}
                                  className="inline-flex h-9 w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F5F1E9]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-10 px-3 text-center text-sm font-medium">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity?.(item?.productId, Math.min(quantity + 1, maxQty), item?.size)}
                                  disabled={!stock || quantity >= maxQty}
                                  className={cn(
                                    'inline-flex h-9 w-9 items-center justify-center text-[#1A1A1A] transition-colors hover:bg-[#F5F1E9]',
                                    (!stock || quantity >= maxQty) && 'cursor-not-allowed opacity-40 hover:bg-transparent'
                                  )}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">{formatPrice(lineTotal)}</p>
                                <p className="text-xs text-[#675F56]">{formatPrice(product?.price ?? 0)} each</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#D8CDBD] bg-white">
                      <ShoppingBag className="h-6 w-6 text-[#A94721]" />
                    </div>
                    <p className="font-['Playfair_Display'] text-2xl font-medium">Your cart is empty</p>
                    <p className="mt-2 max-w-xs text-sm text-[#675F56]">
                      Discover handcrafted Jodhpuri Mojris and add your first pair to begin.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#D8CDBD] bg-[#F5F1E9] px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#675F56]">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#675F56]">Shipping</span>
                  <span className="font-medium">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#D8CDBD] pt-2 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0}
                className={cn(
                  'mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#A94721] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#873619]',
                  items.length === 0 && 'cursor-not-allowed opacity-50 hover:bg-[#A94721]'
                )}
              >
                Proceed to checkout
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;