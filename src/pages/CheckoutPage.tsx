import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Shield, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { CheckoutForm } from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { shippingMethods } from '@/data/mockData';
import type { Order } from '@/types';

const safeNumber = (value?: number | null) => Number(value ?? 0);

export function CheckoutPage({ className = '' }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useCart() as {
    items?: unknown[];
    subtotal?: number;
    shipping?: number;
    total?: number;
    clearCart?: () => void;
  };
  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shipping = cart?.shipping ?? 0;
  const total = cart?.total ?? 0;
  const clearCart = cart?.clearCart;
  const [order, setOrder] = React.useState<Order | null>(null);

  const isConfirmation = location.pathname?.includes('/confirmation') ?? false;

  const handleSubmit = React.useCallback(
    (payload?: Order) => {
      if (payload) setOrder(payload);
      clearCart?.();
      navigate('/checkout/confirmation', { replace: true, state: { order: payload ?? order } });
    },
    [clearCart, navigate, order]
  );

  const activeOrder = (location.state as { order?: Order } | null)?.order ?? order ?? null;

  if (isConfirmation) {
    return (
      <div className={`mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-6 shadow-[0_18px_50px_rgba(43,43,43,0.08)]">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-md border border-[#D8CDBE] bg-[#F5F1EB] p-3">
              <CheckCircle2 className="h-5 w-5 text-[#C9A66B]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6E665D]">Order confirmed</p>
              <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B]">Your Jootiya order is being prepared</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6E665D]">
                {activeOrder ? `Order ${activeOrder.id} has been received. We will share shipping updates shortly.` : 'Your checkout is complete. We will share shipping updates shortly.'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-[#D8CDBE] bg-white p-4">
              <Truck className="h-5 w-5 text-[#C9A66B]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665D]">Shipping</p>
              <p className="mt-2 text-sm text-[#2B2B2B]">{activeOrder?.shippingMethod?.label ?? shippingMethods?.[0]?.label ?? 'Standard delivery'}</p>
            </div>
            <div className="rounded-md border border-[#D8CDBE] bg-white p-4">
              <Shield className="h-5 w-5 text-[#C9A66B]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665D]">Payment</p>
              <p className="mt-2 text-sm text-[#2B2B2B]">{activeOrder?.paymentMethod?.toUpperCase?.() ?? 'UPI'}</p>
            </div>
            <div className="rounded-md border border-[#D8CDBE] bg-white p-4">
              <CheckCircle2 className="h-5 w-5 text-[#C9A66B]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665D]">Total</p>
              <p className="mt-2 text-sm text-[#2B2B2B]">₹{safeNumber(activeOrder?.total ?? total).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-md border border-[#2B2B2B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:bg-[#2B2B2B] hover:text-white">
              Continue shopping
            </Link>
            <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-md border border-[#D8CDBE] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665D] transition-colors hover:border-[#C9A66B] hover:text-[#2B2B2B]">
              <ArrowLeft className="h-4 w-4" />
              Return home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6E665D]">Checkout</p>
          <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">Finalize your order</h1>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665D] transition-colors hover:text-[#2B2B2B]">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-5 shadow-[0_18px_50px_rgba(43,43,43,0.06)]">
          <CheckoutForm
            shippingMethod={shippingMethods?.[0] ?? null}
            subtotal={subtotal ?? 0}
            shipping={shipping ?? 0}
            total={total ?? 0}
            onSubmit={handleSubmit}
          />
        </div>

        <aside className="rounded-md border border-[#D8CDBE] bg-[#F5F1EB] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6E665D]">Order summary</p>
          <div className="mt-4 space-y-3 text-sm text-[#2B2B2B]">
            <div className="flex items-center justify-between gap-4">
              <span>Items</span>
              <span>{items?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Subtotal</span>
              <span>₹{Number(subtotal ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Shipping</span>
              <span>₹{Number(shipping ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-[#D8CDBE] pt-3 flex items-center justify-between gap-4 font-semibold">
              <span>Total</span>
              <span>₹{Number(total ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;