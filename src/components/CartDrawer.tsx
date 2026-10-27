import React, { useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function CartDrawer({ open = false, onOpenChange = () => {}, className = '' }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeItem, subtotal = 0 } = useCart() as any;
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;
  const progress = Math.min((subtotal / 5000) * 100, 100);

  const enrichedItems = useMemo(
    () =>
      (items ?? []).map((item: any) => ({
        ...item,
        product: item?.product ?? products?.find((p) => p?.id === item?.productId),
      })),
    [items]
  );

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
    toast.success('Proceeding to checkout');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#CFC2B2] bg-[#FFFDF7] shadow-2xl outline-none',
            className
          )}
        >
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#CFC2B2] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">
                  Cart
                </Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F655C]">
                  {enrichedItems.length} item{enrichedItems.length === 1 ? '' : 's'}
                </p>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#CFC2B2] text-[#2B2B2B] transition-colors hover:bg-[#E07A5F] hover:text-black">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {enrichedItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#CFC2B2] bg-white">
                      <ShoppingBag className="h-7 w-7 text-[#6F655C]" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">Your cart is empty</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6F655C]">
                      Add handcrafted Mojris and Juttis to begin your edit.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        navigate('/shop');
                      }}
                      className="mt-6 inline-flex items-center gap-2 border border-[#2B2B2B] bg-[#E07A5F] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#C85F45]"
                    >
                      Explore Collection <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {enrichedItems.map((item: any) => (
                      <motion.div
                        key={`${item?.productId ?? 'item'}-${item?.size ?? ''}-${item?.color ?? ''}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-3 border border-[#CFC2B2] bg-white p-3"
                      >
                        <img
                          src={item?.product?.imageUrl ?? products?.[0]?.imageUrl ?? ''}
                          alt={item?.product?.name ?? 'Product'}
                          crossOrigin="anonymous"
                          className="h-24 w-20 shrink-0 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-['Playfair_Display'] text-lg text-[#2B2B2B]">
                                {item?.product?.name ?? 'Selected item'}
                              </p>
                              <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-[#6F655C]">
                                {item?.product?.category ?? 'Mojri'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                removeItem?.(item?.productId);
                                toast.message('Removed from cart');
                              }}
                              className="inline-flex h-9 w-9 items-center justify-center border border-[#CFC2B2] text-[#6F655C] transition-colors hover:bg-[#E07A5F] hover:text-black"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6F655C]">
                            {item?.size ? <span className="border border-[#CFC2B2] px-2 py-1">Size {item.size}</span> : null}
                            {item?.color ? <span className="border border-[#CFC2B2] px-2 py-1">{item.color}</span> : null}
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center border border-[#CFC2B2]">
                              <button
                                type="button"
                                onClick={() => updateQuantity?.(item?.productId, Math.max(1, (item?.quantity ?? 1) - 1))}
                                className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 px-3 text-center text-sm font-semibold text-[#2B2B2B]">
                                {item?.quantity ?? 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity?.(item?.productId, (item?.quantity ?? 1) + 1)}
                                className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-[#2B2B2B]">
                              ₹{((item?.price ?? 0) * (item?.quantity ?? 1)).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#CFC2B2] bg-[#FAF9F6] px-5 py-4">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#6F655C]">
                  <span>Shipping progress</span>
                  <span>{progress >= 100 ? 'Free shipping unlocked' : `₹${Math.max(0, 5000 - subtotal).toLocaleString('en-IN')} away`}</span>
                </div>
                <div className="h-2 overflow-hidden border border-[#CFC2B2] bg-white">
                  <div className="h-full bg-[#E07A5F]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-2 border-b border-[#CFC2B2] pb-4 text-sm">
                <div className="flex items-center justify-between text-[#6F655C]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B2B2B]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-[#6F655C]">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#2B2B2B]">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-[#2B2B2B]">Total</span>
                  <span className="font-semibold text-[#2B2B2B]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="inline-flex items-center justify-center gap-2 border border-[#2B2B2B] bg-[#E07A5F] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#C85F45]"
                >
                  Checkout <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6F655C]">
                  <CheckCircle2 className="h-4 w-4 text-[#E07A5F]" />
                  Secure local cart persistence
                </div>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;