import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CartRoute, CheckoutExperience, ArtisanExperience, ProductExperience } from '@/components/CommerceSections';
import mockData from '@/data/mockData';

export function ProductPage({ className = '' }: { className?: string } = {}) {
  const { slug } = useParams();
  const product = mockData?.products?.find((item) => item?.slug === slug) ?? mockData?.products?.[0] ?? null;
  return <ProductExperience className={className} />;
}

export function CheckoutPage({ className = '' }: { className?: string } = {}) {
  return <CheckoutExperience className={className} />;
}

export function ArtisansPage({ className = '' }: { className?: string } = {}) {
  return <ArtisanExperience className={className} />;
}

export function CartRoute({ className = '' }: { className?: string } = {}) {
  return <CheckoutExperience className={className} />;
}

export default ProductPage;