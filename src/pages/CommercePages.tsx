import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { products, getProductBySlug } from '@/data/mockData';
import { ProductDetailView } from '@/components/ProductDetailModal';
import { CheckoutForm, OrderSummary } from '@/components/CartDrawer';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export function ProductPage({ className = '' }: { className?: string }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = (slug ? getProductBySlug(slug) : null) ?? products?.[0] ?? null;
  const { addItem } = useCart();

  return (
    <section className={cn('mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 border border-[#D8C9B4] bg-[#FFFCF7] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#2B2B2B] transition hover:border-[#A7834D] hover:text-[#000000]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 border border-[#D8C9B4] bg-[#FFFCF7] px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#2B2B2B] transition hover:border-[#A7834D] hover:text-[#000000]"
        >
          <ShoppingBag className="h-4 w-4" />
          Shop
        </Link>
      </div>
      <ProductDetailView product={product} onAdd={(size) => product?.id && addItem(product.id, 1, size)} />
    </section>
  );
}

export function CartRoute({ className = '' }: { className?: string }) {
  const { state } = useCart();
  const items = state?.items ?? [];
  const subtotal = state?.subtotal ?? 0;
  const shipping = state?.shipping ?? 0;
  const tax = state?.tax ?? 0;
  const total = state?.total ?? 0;

  return (
    <section className={cn('mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#D8C9B4] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Cart</p>
          <h1 className="font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Your selected pieces</h1>
        </div>
        <p className="text-sm text-[#6F665B]">{items.length} item(s)</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => {
              const product = products?.find((p) => p.id === item?.productId) ?? null;
              return (
                <div key={`${item?.productId ?? 'item'}-${item?.size ?? 'na'}`} className="flex items-center gap-4 border border-[#D8C9B4] bg-[#FFFCF7] p-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden bg-[#F5F1EB]">
                    <img
                      src={product?.image ?? products?.[0]?.image ?? ''}
                      alt={product?.name ?? 'Product'}
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-['Playfair_Display'] text-lg text-[#2B2B2B]">{product?.name ?? 'Selected piece'}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#6F665B]">{product?.category ?? 'mojri'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#2B2B2B]">₹{(product?.price ?? 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-[#6F665B]">Qty {item?.quantity ?? 0}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border border-dashed border-[#D8C9B4] bg-[#FFFCF7] p-8 text-center">
              <p className="font-['Playfair_Display'] text-2xl text-[#2B2B2B]">Your cart is empty</p>
              <p className="mt-2 text-sm text-[#6F665B]">Browse the collection to add handcrafted Mojris.</p>
              <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A7834D]">
                Explore collection
              </Link>
            </div>
          )}
        </div>
        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} itemCount={items.length} />
      </div>
    </section>
  );
}

export function CheckoutPage({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const { state } = useCart();
  const itemCount = state?.items?.length ?? 0;

  return (
    <section className={cn('mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className="mb-6 border-b border-[#D8C9B4] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Checkout</p>
        <h1 className="font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Complete your order</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <CheckoutForm
          open
          onSubmit={async () => {
            navigate('/order-confirmation');
          }}
          loading={false}
        />
        <div className="space-y-4">
          <OrderSummary
            subtotal={state?.subtotal ?? 0}
            shipping={state?.shipping ?? 0}
            tax={state?.tax ?? 0}
            total={state?.total ?? 0}
            itemCount={itemCount}
          />
          <div className="border border-[#D8C9B4] bg-[#FFFCF7] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#2B2B2B]">
              <CheckCircle2 className="h-4 w-4 text-[#A7834D]" />
              Secure artisan checkout
            </p>
            <p className="mt-2 text-sm text-[#6F665B]">Your shipping details are handled with care and stored locally for a seamless return visit.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrderConfirmationPage({ className = '' }: { className?: string }) {
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId ?? 'JT-0001';

  return (
    <section className={cn('mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8', className)}>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full border border-[#D8C9B4] bg-[#FFFCF7] p-8 shadow-[0_18px_50px_rgba(43,43,43,0.08)]">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#A7834D]" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Order confirmed</p>
        <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-light text-[#2B2B2B]">Thank you for choosing Jootiya</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6F665B]">Your order has been placed successfully. We are preparing your handcrafted pair with the same attention that shaped it.</p>
        <div className="mt-6 inline-flex items-center gap-2 border border-[#D8C9B4] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#2B2B2B]">
          Order ID
          <span className="text-[#A7834D]">{orderId}</span>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/shop" className="border border-[#C9A66B] bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#A7834D]">
            Continue shopping
          </Link>
          <Link to="/" className="border border-[#D8C9B4] bg-[#FFFCF7] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#2B2B2B] transition hover:border-[#A7834D]">
            Return home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default ProductPage;