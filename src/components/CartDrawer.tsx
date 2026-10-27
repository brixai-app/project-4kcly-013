import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { shippingMethods } from '@/data/mockData';
import type { CartItem, PaymentMethod, ShippingMethod } from '@/types';

type CheckoutFormProps = {
  shippingMethod?: ShippingMethod | null;
  paymentMethod?: PaymentMethod;
  onPaymentMethodChange?: (method: PaymentMethod) => void;
  onShippingMethodChange?: (method: ShippingMethod) => void;
  onSubmit?: () => void;
  subtotal?: number;
  shipping?: number;
  total?: number;
  className?: string;
};

export function CheckoutForm({
  shippingMethod = shippingMethods?.[0] ?? null,
  paymentMethod = 'upi',
  onPaymentMethodChange = () => {},
  onShippingMethodChange = () => {},
  onSubmit = () => {},
  subtotal = 0,
  shipping = 0,
  total = 0,
  className = '',
}: CheckoutFormProps) {
  const methods = shippingMethods ?? [];
  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6E665D]">Shipping</p>
        <div className="flex flex-col gap-2.5">
          {methods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => onShippingMethodChange(method)}
              className={cn(
                'flex items-start justify-between gap-3 rounded-md border px-3 py-3 text-left transition-colors',
                shippingMethod?.id === method.id
                  ? 'border-[#C9A66B] bg-[#FFFCF7]'
                  : 'border-[#D8CDBE] bg-white hover:border-[#C9A66B]'
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[#2B2B2B]">{method.label}</span>
                <span className="block text-xs text-[#6E665D]">{method.eta}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-[#2B2B2B]">
                {method.price === 0 ? 'Free' : `₹${method.price.toLocaleString('en-IN')}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6E665D]">Payment</p>
        <div className="flex flex-wrap gap-2">
          {(['upi', 'card', 'cod', 'wallet'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onPaymentMethodChange(method)}
              className={cn(
                'border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors',
                paymentMethod === method
                  ? 'border-[#C9A66B] bg-[#C9A66B] text-black'
                  : 'border-[#D8CDBE] bg-white text-[#2B2B2B] hover:border-[#C9A66B]'
              )}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-[#D8CDBE] pt-4 text-sm">
        <div className="flex items-center justify-between text-[#6E665D]">
          <span>Subtotal</span>
          <span className="text-[#2B2B2B]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center justify-between text-[#6E665D]">
          <span>Shipping</span>
          <span className="text-[#2B2B2B]">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#D8CDBE] pt-3 text-base font-semibold text-[#2B2B2B]">
          <span>Total</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="flex w-full items-center justify-center gap-2 bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#B38A4E]"
      >
        <Check className="h-4 w-4" />
        Place Order
      </button>
    </div>
  );
}

type CartDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function CartDrawer({ open = false, onOpenChange = () => {}, className = '' }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity = () => {}, removeItem = () => {}, clearCart = () => {}, getItemCount = () => 0, getSubtotal = () => 0, products = [] } = useCart() as any;
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(shippingMethods?.[0] ?? { id: 'standard', label: 'Standard Delivery', eta: '5–7 business days', price: 0 });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal?.() ?? 0;
  const shipping = shippingMethod?.price ?? 0;
  const total = subtotal + shipping;
  const itemCount = getItemCount?.() ?? items.length;

  const enrichedItems = useMemo(
    () =>
      (items ?? []).map((item: CartItem) => {
        const product = (products ?? []).find((p: any) => p?.id === item?.productId);
        return { ...item, product };
      }),
    [items, products]
  );

  const submitOrder = async () => {
    if (!enrichedItems.length) {
      toast.error('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        id: crypto.randomUUID(),
        customer: { id: 'guest', name: 'Guest Customer', email: 'guest@jootiya.com' },
        items,
        subtotal,
        shipping,
        total,
        shippingMethod,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Order submission failed');
      clearCart?.();
      onOpenChange(false);
      toast.success('Order placed successfully.');
      navigate('/checkout');
    } catch {
      toast.error('Unable to place order right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/45"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.aside
                className={cn('fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-[#D8CDBE] bg-[#FFFCF7] shadow-2xl', className)}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <div className="flex items-center justify-between border-b border-[#D8CDBE] px-5 py-4">
                  <div className="min-w-0">
                    <Dialog.Title className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#2B2B2B]">
                      <ShoppingBag className="h-4 w-4" />
                      Cart
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-xs text-[#6E665D]">
                      {itemCount} item{itemCount === 1 ? '' : 's'} selected
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBE] text-[#2B2B2B] transition-colors hover:border-[#C9A66B] hover:text-black">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {enrichedItems.length ? (
                    <div className="space-y-4">
                      {enrichedItems.map((entry: any) => (
                        <div key={`${entry.productId}-${entry.size}-${entry.color ?? 'na'}`} className="flex gap-3 border-b border-[#D8CDBE] pb-4">
                          <img
                            src={entry.product?.image ?? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'}
                            alt={entry.product?.name ?? 'Product image'}
                            crossOrigin="anonymous"
                            className="h-24 w-20 shrink-0 rounded-sm object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#2B2B2B]">{entry.product?.name ?? 'Selected item'}</p>
                                <p className="truncate text-xs text-[#6E665D]">{entry.product?.category ?? 'Mojri'}</p>
                              </div>
                              <button type="button" onClick={() => removeItem?.(entry.productId, entry.size, entry.color)} className="text-[#6E665D] transition-colors hover:text-[#2B2B2B]">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => updateQuantity?.(entry.productId, Math.max(1, entry.quantity - 1), entry.size, entry.color)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CDBE]">
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-8 text-center text-sm text-[#2B2B2B]">{entry.quantity}</span>
                                <button type="button" onClick={() => updateQuantity?.(entry.productId, entry.quantity + 1, entry.size, entry.color)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CDBE]">
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="text-sm font-semibold text-[#2B2B2B]">₹{((entry.product?.price ?? 0) * entry.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
                      <ShoppingBag className="h-10 w-10 text-[#C9A66B]" />
                      <p className="mt-3 text-sm font-medium text-[#2B2B2B]">Your cart is empty</p>
                      <p className="mt-1 max-w-[240px] text-sm text-[#6E665D]">Add a pair of Jootiya favorites to begin your order.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#D8CDBE] px-5 py-4">
                  <CheckoutForm
                    shippingMethod={shippingMethod}
                    paymentMethod={paymentMethod}
                    onShippingMethodChange={setShippingMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    onSubmit={submitOrder}
                    subtotal={subtotal}
                    shipping={shipping}
                    total={total}
                  />
                  <button type="button" onClick={() => onOpenChange(false)} className="mt-3 w-full text-xs font-semibold uppercase tracking-[0.24em] text-[#6E665D] transition-colors hover:text-[#2B2B2B]">
                    Continue Shopping
                  </button>
                </div>
                {submitting ? <div className="pointer-events-none absolute inset-0 bg-white/40" /> : null}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default CartDrawer;