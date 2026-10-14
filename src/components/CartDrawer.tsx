import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className = '' }: CartDrawerProps) {
  const { state, isDrawerOpen, closeDrawer, updateItemQuantity, removeItem, subtotal, itemCount } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, next: number, max: number) => {
    if (next < 1) {
      removeItem(id);
      return;
    }
    const safeQty = Math.min(next, max);
    updateItemQuantity(id, safeQty);
  };

  const progress = Math.min((subtotal / 5000) * 100, 100);
  const remaining = Math.max(5000 - subtotal, 0);
  const shippingMessage =
    progress >= 100
      ? 'You’ve unlocked complimentary shipping on this order.'
      : `Spend ₹${remaining.toLocaleString('en-IN')} more for complimentary shipping.`;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <Dialog.Root open={isDrawerOpen} onOpenChange={(open) => (!open ? closeDrawer() : undefined)}>
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.aside
                  className={cn(
                    'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#F9F6F2] shadow-2xl border-l border-[#E6DED3] flex flex-col',
                    className
                  )}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                >
                  <header className="flex items-center justify-between px-6 py-5 border-b border-[#E6DED3] bg-[#F9F6F2]/80 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border border-[#E6DED3] flex items-center justify-center bg-white">
                        <ShoppingBag className="h-5 w-5 text-[#2E2B28]" />
                      </div>
                      <div>
                        <Dialog.Title className="font-[Playfair_Display] text-xl tracking-tight text-[#2E2B28]">
                          Your curation
                        </Dialog.Title>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6F675E]">
                          {itemCount ?? 0} item{(itemCount ?? 0) === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="h-9 w-9 rounded-full border border-[#E6DED3] flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <X className="h-4 w-4 text-[#2E2B28]" />
                    </button>
                  </header>

                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {state?.items?.length ? (
                      state.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 border-b border-[#E6DED3]/80 pb-4 last:border-none"
                        >
                          <div className="relative h-24 w-20 overflow-hidden rounded-lg bg-white border border-[#E6DED3]">
                            <img
                              src={item.imageUrl}
                              crossOrigin="anonymous"
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-[Playfair_Display] text-sm text-[#2E2B28] leading-snug">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-[#6F675E] mt-0.5">
                                  {item.size} · {item.color}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-[11px] uppercase tracking-[0.18em] text-[#6F675E] hover:text-[#2E2B28]"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full border border-[#E6DED3] bg-white">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity - 1, item.maxAvailable)
                                  }
                                  className="h-7 w-7 flex items-center justify-center text-[#2E2B28]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-[2.5rem] text-center text-xs font-medium text-[#2E2B28]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityChange(item.id, item.quantity + 1, item.maxAvailable)
                                  }
                                  className="h-7 w-7 flex items-center justify-center text-[#2E2B28]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#2E2B28]">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </p>
                                <p className="text-[11px] text-[#6F675E]">
                                  Max {item.maxAvailable} available
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-16">
                        <p className="font-[Playfair_Display] text-lg text-[#2E2B28]">
                          Your canvas is still empty.
                        </p>
                        <p className="mt-2 text-sm text-[#6F675E] max-w-xs">
                          Add a pair to begin composing your Jootiya story.
                        </p>
                      </div>
                    )}
                  </div>

                  <footer className="border-t border-[#E6DED3] bg-[#F9F6F2] px-6 py-4 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#6F675E]">
                        <span>Complimentary shipping at ₹5,000</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#E6DED3]/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#BFA06A]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#6F675E]">{shippingMessage}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6F675E]">Subtotal</span>
                      <span className="font-semibold text-[#2E2B28]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={!state?.items?.length}
                      className={cn(
                        'mt-1 inline-flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
                        'bg-[#BFA06A] text-black hover:bg-[#A88955]',
                        !state?.items?.length && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      <span>Proceed to checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </footer>
                </motion.aside>
              </Dialog.Content>
            </Dialog.Portal>
          </>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default CartDrawer;