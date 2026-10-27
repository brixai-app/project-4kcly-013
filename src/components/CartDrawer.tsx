import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartDrawer({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { items = [], updateQuantity = () => {}, removeItem = () => {}, clearCart = () => {} } = useCart() as any;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const subtotal = useMemo(() => items.reduce((sum: number, item: any) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0), 0), [items]);
  const shippingFee = subtotal > 0 ? (subtotal >= 5000 ? 0 : 249) : 0;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!items?.length) {
      toast.error('Your cart is empty.');
      return;
    }
    toast.success('Checkout saved. Continue to secure payment.');
    onOpenChange(false);
    navigate('/shop');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#D8CDBB] bg-[#FAF9F6] shadow-2xl outline-none">
          <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#D8CDBB] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#2B2B2B]">Cart</Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6E665C]">{items?.length ?? 0} items</p>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBB] text-[#2B2B2B] transition-colors hover:bg-[#9A7135] hover:text-black">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items?.length ? items.map((item: any) => {
                  const product = item?.product ?? {};
                  const id = item?.productId ?? product?.id ?? '';
                  return (
                    <motion.div key={`${id}-${item?.size ?? 'default'}`} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24 }} className="mb-4 border border-[#D8CDBB] bg-white p-3">
                      <div className="flex gap-3">
                        <img src={product?.image ?? ''} alt={product?.name ?? 'Product'} crossOrigin="anonymous" className="h-24 w-20 shrink-0 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-['Playfair_Display'] text-base text-[#2B2B2B]">{product?.name ?? 'Item'}</p>
                              <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-[#6E665C]">{product?.category ?? 'Collection'}</p>
                              <p className="mt-2 text-sm font-semibold text-[#2B2B2B]">₹{Number(product?.price ?? 0).toLocaleString('en-IN')}</p>
                            </div>
                            <button onClick={() => setConfirmId(id)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CDBB] text-[#6E665C] transition-colors hover:bg-[#9A7135] hover:text-black">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center border border-[#D8CDBB]">
                              <button onClick={() => updateQuantity(id, Math.max(1, (item?.quantity ?? 1) - 1))} className="inline-flex h-8 w-8 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#FAF9F6]"><Minus className="h-3.5 w-3.5" /></button>
                              <span className="min-w-9 px-3 text-center text-sm text-[#2B2B2B]">{item?.quantity ?? 1}</span>
                              <button onClick={() => updateQuantity(id, (item?.quantity ?? 1) + 1)} className="inline-flex h-8 w-8 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#FAF9F6]"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                            <span className="text-xs uppercase tracking-[0.2em] text-[#6E665C]">{item?.size ? `Size ${item.size}` : 'One size'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center border border-[#D8CDBB] bg-white text-[#9A7135]">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">Your cart is empty</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6E665C]">Discover handcrafted Jodhpuri Mojris and add your first pair to begin the journey.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#D8CDBB] bg-white px-5 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#6E665C]"><span>Subtotal</span><span className="text-[#2B2B2B]">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex items-center justify-between text-[#6E665C]"><span>Shipping</span><span className="text-[#2B2B2B]">{shippingFee === 0 && subtotal > 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span></div>
                <div className="flex items-center justify-between border-t border-[#D8CDBB] pt-2 font-semibold text-[#2B2B2B]"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="mt-4 h-1 overflow-hidden bg-[#FAF9F6]">
                <div className="h-full bg-[#9A7135]" style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#6E665C]">{subtotal >= 5000 ? 'Complimentary shipping unlocked' : `Add ₹${Math.max(0, 5000 - subtotal).toLocaleString('en-IN')} for free shipping`}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => clearCart()} className="inline-flex flex-1 items-center justify-center border border-[#D8CDBB] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:bg-[#FAF9F6]">Clear</button>
                <button onClick={handleCheckout} className="inline-flex flex-1 items-center justify-center bg-[#9A7135] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#765326]">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>

      <Dialog.Root open={!!confirmId} onOpenChange={(v) => !v && setConfirmId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/35" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-[#D8CDBB] bg-white p-5 outline-none">
            <Dialog.Title className="font-['Playfair_Display'] text-xl text-[#2B2B2B]">Remove item?</Dialog.Title>
            <p className="mt-2 text-sm leading-6 text-[#6E665C]">This pair will be removed from your cart.</p>
            <div className="mt-5 flex gap-3">
              <Dialog.Close asChild>
                <button onClick={() => setConfirmId(null)} className="flex-1 border border-[#D8CDBB] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">Cancel</button>
              </Dialog.Close>
              <button onClick={() => { if (confirmId) removeItem(confirmId); setConfirmId(null); toast.success('Item removed'); }} className="flex-1 bg-[#9A7135] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black">Remove</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Dialog.Root>
  );
}

export default CartDrawer;