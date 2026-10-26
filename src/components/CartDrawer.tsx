import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartDrawer({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, updateItem, removeItem, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = useMemo(() => (subtotal > 0 ? 0 : 0), [subtotal]);
  const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  const handleCheckout = async () => {
    if (!items?.length) {
      toast.error('Your cart is empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      toast.success('Cart ready for checkout.');
      closeCart();
      navigate('/checkout');
    } catch {
      toast.error('Unable to proceed to checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#2B1715]/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-[420px] border-l border-[#CDBB9F] bg-[#FFFDF8] shadow-2xl outline-none',
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
            <div className="flex items-center justify-between border-b border-[#CDBB9F] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#2B1715]">
                  Cart
                </Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#765F55]">
                  {items?.length ?? 0} item{(items?.length ?? 0) === 1 ? '' : 's'}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9F] text-[#2B1715] transition-colors hover:bg-[#741F2B] hover:text-white"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items?.length ? (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => {
                      const product = item.product;
                      const key = `${item.productId}-${item.size ?? 'na'}-${item.color ?? 'na'}`;
                      return (
                        <motion.div
                          key={key}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-3 border border-[#CDBB9F] bg-white p-3"
                        >
                          <img
                            src={product?.image ?? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'}
                            alt={product?.name ?? 'Product image'}
                            crossOrigin="anonymous"
                            className="h-24 w-20 shrink-0 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-['Playfair_Display'] text-base text-[#2B1715]">
                                  {product?.name ?? 'Mojri'}
                                </p>
                                <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-[#765F55]">
                                  {product?.category ?? 'artisan'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId, item.size, item.color)}
                                className="inline-flex h-8 w-8 items-center justify-center border border-[#CDBB9F] text-[#765F55] transition-colors hover:border-[#741F2B] hover:text-[#741F2B]"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-[#765F55]">
                              {item.size ? <span className="border border-[#CDBB9F] px-2 py-1">{item.size}</span> : null}
                              {item.color ? <span className="border border-[#CDBB9F] px-2 py-1">{item.color}</span> : null}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="flex items-center border border-[#CDBB9F]">
                                <button
                                  type="button"
                                  onClick={() => updateItem(item.productId, item.size, item.color, Math.max(1, (item.quantity ?? 1) - 1))}
                                  className="inline-flex h-8 w-8 items-center justify-center text-[#2B1715] transition-colors hover:bg-[#F7F0E4]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-9 px-2 text-center text-sm text-[#2B1715]">{item.quantity ?? 1}</span>
                                <button
                                  type="button"
                                  onClick={() => updateItem(item.productId, item.size, item.color, (item.quantity ?? 1) + 1)}
                                  className="inline-flex h-8 w-8 items-center justify-center text-[#2B1715] transition-colors hover:bg-[#F7F0E4]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-[#2B1715]">
                                ₹{((product?.price ?? 0) * (item.quantity ?? 1)).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border border-[#CDBB9F] text-[#741F2B]">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <p className="font-['Playfair_Display'] text-2xl text-[#2B1715]">Your cart is empty</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#765F55]">
                      Add a pair of handcrafted Mojris to begin your order.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#CDBB9F] bg-[#FFFDF8] px-5 py-4">
              <div className="space-y-2 text-sm text-[#2B1715]">
                <div className="flex items-center justify-between">
                  <span className="text-[#765F55]">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#765F55]">Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#CDBB9F] pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="inline-flex flex-1 items-center justify-center border border-[#CDBB9F] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:bg-[#F7F0E4]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={!items?.length || isSubmitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#57151F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Check className="h-4 w-4 animate-pulse" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;