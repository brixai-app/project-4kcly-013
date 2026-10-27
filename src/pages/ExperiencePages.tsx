import React from 'react';
import { useParams } from 'react-router-dom';
import { artisans, products } from '@/data/mockData';
import {
  ArtisanListingSection,
  CheckoutSection,
  CustomOrderSection,
  ExperienceSections,
  ProductDetailSection,
} from '@/components/ExperienceSections';
import { useCart } from '@/context/CartContext';

type PageShellProps = { className?: string };

function PageShell({ className = '' }: PageShellProps) {
  return <ExperienceSections className={className} />;
}

export function ProductPage({ className = '' }: PageShellProps) {
  const params = useParams();
  const slug = params?.slug ?? products?.[0]?.slug ?? '';
  return <ProductDetailSection slug={slug} className={className} />;
}

export function CheckoutPage({ className = '' }: PageShellProps) {
  return <CheckoutSection className={className} />;
}

export function ArtisansPage({ className = '' }: PageShellProps) {
  return <ArtisanListingSection className={className} />;
}

export function ArtisanDetailPage({ className = '' }: PageShellProps) {
  const params = useParams();
  const artisanId = params?.artisanId ?? artisans?.[0]?.id ?? '';
  const artisan = artisans?.find((item) => item?.id === artisanId) ?? artisans?.[0] ?? null;
  return <ArtisanListingSection className={className} />;
}

export function CustomOrderPage({ className = '' }: PageShellProps) {
  return <CustomOrderSection className={className} />;
}

export function CartRoute({ className = '' }: PageShellProps) {
  const cart = useCart();
  const count = cart?.items?.reduce((sum: number, item: { quantity?: number }) => sum + (item?.quantity ?? 0), 0) ?? 0;
  return <CheckoutSection className={className} />;
}

export default ProductPage;