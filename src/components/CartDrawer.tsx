import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function CartDrawer({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const navigate = useNavigate();
  const cart = useCart?.() ?? {};
  const items = cart?.items ?? [];
  const updateQuantity = cart?.updateQuantity ?? (() => {});
  const removeItem = cart?.removeItem ?? (() => {});
  const clearCart = cart?.clearCart ?? (() => {});
  const subtotal = useMemo(() => items.reduce((sum: number, item: any) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0), [items]);
  const shipping = subtotal > 0 ? (subtotal >= 5000 ? 0 : 250) : 0;
  const discount = cart?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(false);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return toast.error('Enter a promo code');
    if (code === 'JOOTIYA10') return toast.success('Promo applied');
    toast.error('Invalid promo code');
  };

  const checkout = async () => {
    if (!items.length) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, subtotal, shipping, discount, total, currency: 'INR', status: 'pending' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) throw new Error(data?.message ?? 'Checkout failed');
      toast.success('Order placed successfully');
      clearCart();
      onOpenChange(false);
      navigate('/checkout');
    } catch (e: any) {
      toast.error(e?.message ?? 'Unable to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#C9BFB1] bg-[#FFFCF7] shadow-2xl outline-none">
          <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ duration: 0.28 }} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#C9BFB1] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Bodoni_Moda'] text-2xl font-light tracking-tight text-[#302D29]">Cart</Dialog.Title>
                <p className="text-xs uppercase tracking-[0.24em] text-[#71695F]">{items.length} item{items.length === 1 ? '' : 's'}</p>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#C9BFB1] text-[#302D29] transition hover:bg-[#6B1E1E] hover:text-white">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items.length ? items.map((item: any) => (
                  <motion.div key={item?.id ?? item?.productId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24 }} className="mb-4 flex gap-3 border-b border-[#C9BFB1] pb-4">
                    <img src={item?.image ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'} alt={item?.name ?? 'Cart item'} crossOrigin="anonymous" className="h-24 w-20 shrink-0 rounded-sm object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#302D29]">{item?.name ?? 'Product'}</p>
                          <p className="truncate text-xs uppercase tracking-[0.18em] text-[#71695F]">{item?.size ?? item?.color ?? 'Selected variant'}</p>
                        </div>
                        <button onClick={() => removeItem(item?.id)} className="inline-flex h-8 w-8 items-center justify-center border border-[#C9BFB1] text-[#71695F] transition hover:border-[#6B1E1E] hover:text-[#6B1E1E]">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#C9BFB1]">
                          <button onClick={() => updateQuantity(item?.id, Math.max(1, (item?.quantity ?? 1) - 1))} className="inline-flex h-8 w-8 items-center justify-center text-[#302D29] transition hover:bg-[#F5F1EB]"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-10 text-center text-sm font-medium text-[#302D29]">{item?.quantity ?? 1}</span>
                          <button onClick={() => updateQuantity(item?.id, (item?.quantity ?? 1) + 1)} className="inline-flex h-8 w-8 items-center justify-center text-[#302D29] transition hover:bg-[#F5F1EB]"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <p className="text-sm font-semibold text-[#302D29]">₹{((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
                    <ShoppingBag className="h-10 w-10 text-[#71695F]" />
                    <p className="text-sm text-[#71695F]">Your cart is currently empty.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#C9BFB1] bg-[#FAF8F3] px-5 py-4">
              <div className="mb-4 flex items-center gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" className="h-11 min-w-0 flex-1 border border-[#C9BFB1] bg-white px-3 text-sm text-[#302D29] outline-none placeholder:text-[#71695F]" />
                <button onClick={applyPromo} className="h-11 border border-[#6B1E1E] bg-[#6B1E1E] px-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#501515]">Apply</button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#71695F]"><span>Subtotal</span><span className="text-[#302D29]">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex items-center justify-between text-[#71695F]"><span>Shipping</span><span className="text-[#302D29]">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span></div>
                <div className="flex items-center justify-between text-[#71695F]"><span>Discount</span><span className="text-[#302D29]">₹{discount.toLocaleString('en-IN')}</span></div>
                <div className="flex items-center justify-between border-t border-[#C9BFB1] pt-2 text-base font-semibold text-[#302D29]"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#71695F]">
                <Check className="h-4 w-4 text-[#6B1E1E]" />
                <span>Secure checkout with direct order persistence.</span>
              </div>

              <button onClick={checkout} disabled={!items.length || loading} className={cn('mt-4 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#6B1E1E] text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#501515]', (!items.length || loading) && 'cursor-not-allowed opacity-60')}>
                {loading ? 'Processing' : 'Checkout'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;