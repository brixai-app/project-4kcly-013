import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { OrderConfirmationPanel } from '@/components/CheckoutForm';

export function OrderConfirmationPage() {
  const { orders } = useCart() as { orders?: Array<{ id?: string; total?: number; shipping?: { email?: string } }> };
  const latestOrder = orders?.[0] ?? null;

  if (!latestOrder?.id) {
    return (
      <main className="min-h-screen bg-[#F5F0E6] px-6 py-20 text-[#2B2B2B]">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 border border-[#C9A66B] bg-[#FFF9F0] p-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Order status</p>
          <h1 className="font-serif text-4xl font-light tracking-tight md:text-6xl">No completed order found.</h1>
          <p className="max-w-xl font-serif text-base leading-7 text-[#6F655B]">
            Your confirmation page is waiting for the latest completed checkout. Return to the collection and place an order to continue.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center border border-[#7B2D26] bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#61211C]"
          >
            Explore Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6] px-4 py-10 text-[#2B2B2B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <OrderConfirmationPanel
          orderId={latestOrder.id ?? ''}
          total={latestOrder.total ?? 0}
          email={latestOrder.shipping?.email ?? ''}
        />
      </div>
    </main>
  );
}

export default OrderConfirmationPage;