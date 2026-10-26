import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function CartDrawer({ className = '' }: { className?: string } = {}) {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, subtotal } = useCart();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const cartItems = items ?? [];
  const shippingCost = subtotal > 0 ? (subtotal >= 5000 ? 0 : 250) : 0;
  const total = subtotal + shippingCost;
  const itemCount = cartItems.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Dialog.Root open={isOpen ?? false} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#C9A66B] bg-[#FFF9F0] text-[#2B2B2B] shadow-2xl outline-none',
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
            <div className="flex items-center justify-between border-b border-[#C9A66B] px-5 py-4">
              <div>
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight">
                  Shopping Bag
                </Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F655B]">
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </p>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#C9A66B] text-[#2B2B2B] transition-colors hover:bg-[#7B2D26] hover:text-white"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {cartItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex h-full flex-col items-start justify-center gap-4 py-10"
                  >
                    <div className="flex h-14 w-14 items-center justify-center border border-[#C9A66B] bg-white">
                      <ShoppingBag className="h-6 w-6 text-[#7B2D26]" />
                    </div>
                    <div>
                      <h3 className="font-['Playfair_Display'] text-2xl font-medium">Your bag is empty</h3>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-[#6F655B]">
                        Discover handcrafted Jodhpuri Mojris and add your preferred size to begin.
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 border border-[#7B2D26] bg-[#7B2D26] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#61211C]"
                      >
                        Explore Collection <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Dialog.Close>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const product = products.find((p) => p.id === item?.productId);
                      if (!product) return null;
                      const isExpanded = expanded === product.id;
                      return (
                        <motion.div
                          key={`${product.id}-${item?.size ?? 'na'}-${item?.color ?? 'na'}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="border border-[#C9A66B] bg-white p-3"
                        >
                          <div className="flex gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              crossOrigin="anonymous"
                              className="h-24 w-20 shrink-0 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-['Playfair_Display'] text-lg font-medium">{product.name}</p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F655B]">
                                    {product.category}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(product.id, item?.size, item?.color)}
                                  className="inline-flex h-8 w-8 items-center justify-center border border-[#C9A66B] text-[#6F655B] transition-colors hover:bg-[#7B2D26] hover:text-white"
                                  aria-label={`Remove ${product.name}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#6F655B]">
                                <span className="border border-[#C9A66B] px-2 py-1">Size {item?.size ?? '—'}</span>
                                <button
                                  type="button"
                                  onClick={() => setExpanded(isExpanded ? null : product.id)}
                                  className="inline-flex items-center gap-1 border border-[#C9A66B] px-2 py-1 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-[#F5F0E6]"
                                >
                                  Details <ChevronDown className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')} />
                                </button>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center border border-[#C9A66B]">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(product.id, Math.max(1, (item?.quantity ?? 1) - 1), item?.size, item?.color)}
                                    className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F0E6]"
                                    aria-label={`Decrease quantity for ${product.name}`}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="min-w-10 px-3 text-center text-sm font-semibold">{item?.quantity ?? 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(product.id, (item?.quantity ?? 1) + 1, item?.size, item?.color)}
                                    className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#F5F0E6]"
                                    aria-label={`Increase quantity for ${product.name}`}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-base font-semibold">₹{((product.price ?? 0) * (item?.quantity ?? 1)).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {isExpanded ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 border-t border-[#C9A66B] pt-3 text-sm leading-6 text-[#6F655B]">
                                  <p>{product.description}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {(product.details ?? []).slice(0, 3).map((detail) => (
                                      <span key={detail} className="inline-flex items-center gap-1 border border-[#C9A66B] px-2 py-1 text-xs uppercase tracking-[0.16em]">
                                        <Check className="h-3 w-3 text-[#7B2D26]" /> {detail}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#C9A66B] bg-[#F5F0E6] px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F655B]">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6F655B]">Shipping</span>
                  <span className="font-semibold">{shippingCost === 0 ? 'Complimentary' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#C9A66B] pt-2 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 h-1 w-full overflow-hidden bg-white">
                <div className="h-full bg-[#7B2D26]" style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#6F655B]">
                {subtotal >= 5000 ? 'Complimentary shipping unlocked' : `Add ₹${Math.max(0, 5000 - subtotal).toLocaleString('en-IN')} for complimentary shipping`}
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="inline-flex items-center justify-center gap-2 bg-[#7B2D26] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#61211C]"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>
                <Dialog.Close asChild>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center border border-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:bg-white"
                  >
                    Continue Shopping
                  </Link>
                </Dialog.Close>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;