import React, { useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity = () => {}, removeItem = () => {}, subtotal = 0 } = useCart() ?? {};
  const cartItems = Array.isArray(items) ? items : [];
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;
  const progress = Math.min((subtotal / 5000) * 100, 100);

  const enrichedItems = useMemo(
    () =>
      cartItems.map((item) => {
        const product = products?.find((p) => p?.id === item?.productId) ?? null;
        return { item, product };
      }),
    [cartItems]
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open ? (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/35"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-[#BFA6A0] px-5 py-4">
                    <div className="min-w-0">
                      <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">
                        Cart
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F625D]">
                        Your selected mojris
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center border border-[#BFA6A0] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]"
                        aria-label="Close cart"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {cartItems.length === 0 ? (
                      <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
                        <div className="flex h-14 w-14 items-center justify-center border border-[#BFA6A0]">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-['Playfair_Display'] text-2xl font-medium">Your cart is empty</p>
                          <p className="max-w-xs text-sm leading-6 text-[#6F625D]">
                            Discover handcrafted Rajasthani mojris and add your preferred pair to continue.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenChange(false);
                            navigate('/shop');
                          }}
                          className="inline-flex items-center gap-2 border border-[#D9381E] bg-[#D9381E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#B92B17]"
                        >
                          Explore Collection
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {enrichedItems.map(({ item, product }) => (
                          <div key={`${item?.productId ?? 'item'}-${item?.size ?? 'na'}-${item?.color ?? 'na'}`} className="flex gap-3 border-b border-[#BFA6A0] pb-4">
                            <img
                              src={product?.image ?? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'}
                              alt={product?.name ?? 'Cart item'}
                              crossOrigin="anonymous"
                              className="h-24 w-20 shrink-0 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-['Playfair_Display'] text-lg font-medium">{product?.name ?? 'Handcrafted Mojri'}</p>
                                  <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-[#6F625D]">
                                    {product?.category ?? 'Mojri'}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem?.(item?.productId, item?.size, item?.color)}
                                  className="inline-flex h-8 w-8 items-center justify-center border border-[#BFA6A0] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6F625D]">
                                <span className="border border-[#BFA6A0] px-2 py-1">Size {item?.size ?? '—'}</span>
                                <span className="border border-[#BFA6A0] px-2 py-1">Qty {item?.quantity ?? 1}</span>
                                {item?.color ? <span className="border border-[#BFA6A0] px-2 py-1">{item?.color}</span> : null}
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center border border-[#BFA6A0]">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity?.(item?.productId, Math.max(1, (item?.quantity ?? 1) - 1), item?.size, item?.color)}
                                    className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-[#F9F5F0]"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="min-w-10 px-3 text-center text-sm font-medium">{item?.quantity ?? 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity?.(item?.productId, (item?.quantity ?? 1) + 1, item?.size, item?.color)}
                                    className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-[#F9F5F0]"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="font-['Playfair_Display'] text-lg font-medium">
                                  ₹{((product?.price ?? 0) * (item?.quantity ?? 1)).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#BFA6A0] bg-[#F9F5F0] px-5 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6F625D]">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6F625D]">Shipping</span>
                        <span className="font-medium">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                      </div>
                      <div className="h-1 overflow-hidden bg-white">
                        <div className="h-full bg-[#D9381E]" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs leading-5 text-[#6F625D]">
                        {subtotal >= 5000 ? 'You qualify for complimentary shipping.' : `Add ₹${Math.max(0, 5000 - subtotal).toLocaleString('en-IN')} more for free shipping.`}
                      </p>
                      <div className="flex items-center justify-between border-t border-[#BFA6A0] pt-3">
                        <span className="text-sm uppercase tracking-[0.2em] text-[#6F625D]">Total</span>
                        <span className="font-['Playfair_Display'] text-2xl font-medium">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenChange(false);
                          navigate('/checkout');
                        }}
                        className={cn(
                          'inline-flex w-full items-center justify-center gap-2 bg-[#D9381E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#B92B17]'
                        )}
                      >
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </Dialog.Content>
            </>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;