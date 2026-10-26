import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';

export type CartDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const defaultProps: Required<CartDrawerProps> = {
  open: false,
  onOpenChange: () => undefined,
};

export function CartDrawer({
  open = defaultProps.open,
  onOpenChange = defaultProps.onOpenChange,
}: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeItem, subtotal = 0 } = useCart() as any;
  const shippingThreshold = 2500;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 149;
  const total = subtotal + shippingFee;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const featured = products?.find((p) => p?.featured) ?? products?.[0];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#8A806F] bg-[#FFFDF8] shadow-2xl outline-none">
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex h-full flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#8A806F] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl text-[#211F1C]">
                  Your Cart
                </Dialog.Title>
                <Dialog.Description className="text-xs uppercase tracking-[0.24em] text-[#514B42]">
                  Guest-first checkout
                </Dialog.Description>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#8A806F] text-[#211F1C] transition-colors hover:bg-[#6B451D] hover:text-white">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items?.length ? (
                  <div className="space-y-4">
                    {items.map((item: any) => {
                      const lineTotal = (item?.price ?? 0) * (item?.quantity ?? 0);
                      return (
                        <motion.div
                          key={`${item?.productId ?? item?.name ?? 'item'}-${item?.size ?? ''}-${item?.color ?? ''}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
                          className="flex gap-3 border border-[#8A806F]/70 bg-white p-3"
                        >
                          <img
                            src={item?.image ?? featured?.image ?? ''}
                            alt={item?.name ?? 'Cart item'}
                            crossOrigin="anonymous"
                            className="h-24 w-20 shrink-0 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#211F1C]">{item?.name ?? 'Product'}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#514B42]">
                                  {item?.size ? `Size ${item.size}` : 'One size'}
                                  {item?.color ? ` · ${item.color}` : ''}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem?.(item?.productId, item?.size, item?.color)}
                                className="inline-flex h-8 w-8 items-center justify-center border border-[#8A806F] text-[#514B42] transition-colors hover:bg-[#6B451D] hover:text-white"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center border border-[#8A806F]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity?.(item?.productId, Math.max(1, (item?.quantity ?? 1) - 1), item?.size, item?.color)
                                  }
                                  className="inline-flex h-8 w-8 items-center justify-center text-[#211F1C] transition-colors hover:bg-[#FAF7F0]"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-9 px-2 text-center text-sm text-[#211F1C]">{item?.quantity ?? 1}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity?.(item?.productId, (item?.quantity ?? 1) + 1, item?.size, item?.color)
                                  }
                                  className="inline-flex h-8 w-8 items-center justify-center text-[#211F1C] transition-colors hover:bg-[#FAF7F0]"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-[#211F1C]">₹{lineTotal.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center border border-[#8A806F] text-[#6B451D]">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <p className="font-['Playfair_Display'] text-2xl text-[#211F1C]">Your cart is empty</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#514B42]">
                      Add a pair of handcrafted mojris to begin your order.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#8A806F] px-5 py-4">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#514B42]">
                  <span>Free shipping progress</span>
                  <span>{subtotal >= shippingThreshold ? 'Unlocked' : `₹${Math.max(shippingThreshold - subtotal, 0).toLocaleString('en-IN')} away`}</span>
                </div>
                <div className="h-1.5 w-full bg-[#E7E0D3]">
                  <div className="h-full bg-[#6B451D]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-2 border-b border-[#8A806F]/70 pb-4 text-sm text-[#211F1C]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span>Total</span>
                  <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="flex-1 border border-[#8A806F] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211F1C] transition-colors hover:bg-[#FAF7F0]"
                >
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 bg-[#6B451D] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#4E3014]',
                    items?.length === 0 && 'pointer-events-none opacity-60'
                  )}
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
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