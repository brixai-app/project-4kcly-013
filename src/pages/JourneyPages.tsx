import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArtisanGrid, CartView, CheckoutForm, ConfirmationSummary } from '@/components/CommerceSections';
import { artisans, products } from '@/data/mockData';

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId?: string }>();
  const product = products?.find((item) => item?.id === productId) ?? products?.[0] ?? null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#D8CDBB] pb-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">Product details</p>
          <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">
            {product?.name ?? 'Jootiya'}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="border border-[#D8CDBB] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#2B2B2B] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]"
        >
          Back to shop
        </button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden border border-[#D8CDBB] bg-white">
          <img
            src={product?.image ?? 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'}
            alt={product?.name ?? 'Product image'}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="space-y-4 border border-[#D8CDBB] bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">{product?.category ?? 'Collection'}</p>
            <h2 className="font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B]">{product?.name ?? 'Handcrafted Mojri'}</h2>
            <p className="text-sm leading-7 text-[#6E665C]">{product?.description ?? 'An authentic Jodhpuri mojri crafted with refined detailing and a timeless silhouette.'}</p>
            <div className="flex items-center justify-between border-t border-[#D8CDBB] pt-4">
              <span className="text-lg font-semibold text-[#2B2B2B]">₹{product?.price?.toLocaleString?.('en-IN') ?? '0'}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6E665C]">{product?.inStock === false ? 'Out of stock' : 'In stock'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ArtisansPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-[#D8CDBB] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">Artisans</p>
        <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">The hands behind the craft</h1>
      </div>
      <ArtisanGrid className="rounded-none" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {artisans?.slice?.(0, 3)?.map((artisan) => (
          <article key={artisan?.id} className="border border-[#D8CDBB] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">{artisan?.location ?? 'India'}</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-2xl font-light text-[#2B2B2B]">{artisan?.name ?? 'Artisan'}</h2>
            <p className="mt-2 text-sm leading-7 text-[#6E665C]">{artisan?.specialty ?? 'Traditional craftsmanship'}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CartPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-[#D8CDBB] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">Cart</p>
        <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">Your selected pairings</h1>
      </div>
      <CartView className="rounded-none" />
    </section>
  );
}

export function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-[#D8CDBB] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">Checkout</p>
        <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">Complete your order</h1>
      </div>
      <CheckoutForm className="rounded-none" />
    </section>
  );
}

export function OrderConfirmationPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 border-b border-[#D8CDBB] pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E665C]">Confirmation</p>
        <h1 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">Your order is being prepared</h1>
      </div>
      <ConfirmationSummary className="rounded-none" />
    </section>
  );
}

export function JourneyPages() {
  return null;
}

export default JourneyPages;