import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CartDrawer } from '@/components/CartDrawer';
import {
  ArtisanList,
  ArtisanProfile,
  CheckoutForm,
  ManifestoSection,
  NewsletterBand,
  ProductExperience,
} from '@/components/EditorialSections';
import { artisans, products } from '@/data/mockData';
import type { Artisan, Product } from '@/types';

export function ProductPage({ className = '' }: { className?: string }) {
  const { slug } = useParams();
  const product = products?.find((item) => item?.slug === slug) ?? products?.[0] ?? null;
  return (
    <div className={className}>
      <ProductExperience className="px-4 py-8 sm:px-6 lg:px-8" />
      <ManifestoSection className="px-4 pb-8 sm:px-6 lg:px-8" />
      <NewsletterBand className="px-4 pb-10 sm:px-6 lg:px-8" />
      <CartDrawer />
      {product ? null : null}
    </div>
  );
}

export function CheckoutPage({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <CheckoutForm className="px-4 py-8 sm:px-6 lg:px-8" />
      <NewsletterBand className="px-4 pb-10 sm:px-6 lg:px-8" />
      <CartDrawer />
    </div>
  );
}

export function ArtisansPage({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <ArtisanList className="px-4 py-8 sm:px-6 lg:px-8" />
      <ManifestoSection className="px-4 pb-8 sm:px-6 lg:px-8" />
      <NewsletterBand className="px-4 pb-10 sm:px-6 lg:px-8" />
    </div>
  );
}

export function ArtisanProfilePage({ className = '' }: { className?: string }) {
  const { artisanId } = useParams();
  const artisan = artisans?.find((item) => item?.id === artisanId) ?? artisans?.[0] ?? null;
  return (
    <div className={className}>
      <ArtisanProfile artisan={artisan as Artisan | null} className="px-4 py-8 sm:px-6 lg:px-8" />
      <NewsletterBand className="px-4 pb-10 sm:px-6 lg:px-8" />
    </div>
  );
}

export function CartRoute({ className = '' }: { className?: string }) {
  const location = useLocation();
  const open = location?.pathname?.includes('/cart') ?? false;
  return <CartDrawer open={open} onOpenChange={() => {}} />;
}

export function JourneyPages({ className = '' }: { className?: string }) {
  const location = useLocation();
  const path = location?.pathname ?? '/';
  if (path.includes('/checkout')) return <CheckoutPage className={className} />;
  if (path.includes('/artisans/') || path.includes('/artisan/')) return <ArtisanProfilePage className={className} />;
  if (path.includes('/artisans')) return <ArtisansPage className={className} />;
  if (path.includes('/product/') || path.includes('/shop/')) return <ProductPage className={className} />;
  return <ProductPage className={className} />;
}

export default JourneyPages;