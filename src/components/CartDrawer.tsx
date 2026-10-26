import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { products } from '@/data/mockData';

type CartDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function CartDrawer({ open = false, onOpenChange = () => {}, className = '' }: CartDrawerProps = {}) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeItem, subtotal = 0, clearCart } = useCart() ?? {};
  const count = items?.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0) ?? 0;
  const shippingThreshold = 5000;
  const shippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
  const remaining = Math.max(0, shippingThreshold - subtotal);
  const lookup = React.useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), []);

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
    toast.message('Proceeding to checkout');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#17130F]/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-[420px] border-l border-[#CBBCA7] bg-[#FFFDF8] shadow-2xl outline-none',
            className
          )}
        >
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#CBBCA7] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#17130F]">
                  Cart
                </Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F6254]">
                  {count} item{count === 1 ? '' : 's'}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#CBBCA7] text-[#17130F] transition-colors hover:bg-[#A8472A] hover:text-white"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {count === 0 ? (
                <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
                  <div className="flex h-14 w-14 items-center justify-center border border-[#CBBCA7] text-[#A8472A]">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="max-w-sm">
                    <h3 className="font-['Playfair_Display'] text-3xl font-medium tracking-tight text-[#17130F]">
                      Your cart is empty
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#6F6254]">
                      Add handcrafted Mojris and accessories to begin your order.
                    </p>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="inline-flex items-center gap-2 border border-[#A8472A] bg-[#A8472A] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#84351F]"
                    >
                      Explore collection
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.22em] text-[#6F6254]">Shipping progress</span>
                      <span className="text-xs uppercase tracking-[0.22em] text-[#6F6254]">
                        {shippingProgress}% to free shipping
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden border border-[#CBBCA7] bg-white">
                      <div className="h-full bg-[#A8472A]" style={{ width: `${shippingProgress}%` }} />
                    </div>
                    <p className="text-sm text-[#6F6254]">
                      {remaining > 0 ? `Add ₹${remaining.toLocaleString('en-IN')} more for free shipping.` : 'You have unlocked free shipping.'}
                    </p>
                  </div>

                  <AnimatePresence initial={false}>
                    {items?.map((item: any) => {
                      const product = lookup.get(item?.productId ?? '');
                      if (!product) return null;
                      const lineTotal = (product?.price ?? 0) * (item?.quantity ?? 0);
                      return (
                        <motion.div
                          key={`${item?.productId ?? ''}-${item?.size ?? ''}-${item?.color ?? ''}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className="flex gap-4 border-b border-[#CBBCA7] pb-4"
                        >
                          <img
                            src={product?.image ?? ''}
                            alt={product?.name ?? 'Product'}
                            crossOrigin="anonymous"
                            className="h-24 w-20 shrink-0 border border-[#CBBCA7] object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-['Playfair_Display'] text-lg text-[#17130F]">{product?.name ?? ''}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6F6254]">
                                  {product?.collection ?? product?.category ?? ''}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem?.(item)}
                                className="inline-flex h-9 w-9 items-center justify-center border border-[#CBBCA7] text-[#17130F] transition-colors hover:bg-[#A8472A] hover:text-white"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6F6254]">
                              {item?.size ? <span className="border border-[#CBBCA7] px-2 py-1">Size {item.size}</span> : null}
                              {item?.color ? <span className="border border-[#CBBCA7] px-2 py-1">Color {item.color}</span> : null}
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center border border-[#CBBCA7]">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity?.(item, Math.max(1, (item?.quantity ?? 1) - 1))}
                                  className="flex h-9 w-9 items-center justify-center text-[#17130F] transition-colors hover:bg-[#F6F0E5]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-10 px-3 text-center text-sm text-[#17130F]">{item?.quantity ?? 1}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity?.(item, (item?.quantity ?? 1) + 1)}
                                  className="flex h-9 w-9 items-center justify-center text-[#17130F] transition-colors hover:bg-[#F6F0E5]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#17130F]">₹{lineTotal.toLocaleString('en-IN')}</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#6F6254]">
                                  ₹{(product?.price ?? 0).toLocaleString('en-IN')} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="border-t border-[#CBBCA7] bg-[#FFFDF8] px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F6254]">Subtotal</span>
                  <span className="font-semibold text-[#17130F]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F6254]">Shipping</span>
                  <span className="text-[#17130F]">{subtotal >= shippingThreshold ? 'Free' : 'Calculated at checkout'}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#A8472A] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#84351F]"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCart?.();
                    toast.success('Cart cleared');
                  }}
                  className="inline-flex items-center justify-center border border-[#CBBCA7] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#17130F] transition-colors hover:bg-[#F6F0E5]"
                >
                  Clear
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6F6254]">
                <Check className="h-4 w-4 text-[#A8472A]" />
                Secure checkout and local cart persistence
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;