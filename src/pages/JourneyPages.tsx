import React from 'react';
import { useParams } from 'react-router-dom';
import { CommerceSections } from '@/components/CommerceSections';
import { artisans, products } from '@/data/mockData';

type PageProps = { className?: string };

function resolveProduct(id?: string) {
  return products?.find((product) => product?.id === id) ?? products?.[0] ?? null;
}

function resolveArtisan(id?: string) {
  return artisans?.find((artisan) => artisan?.id === id) ?? artisans?.[0] ?? null;
}

export function ProductPage({ className = '' }: PageProps) {
  const { productId } = useParams<{ productId?: string }>();
  const product = resolveProduct(productId);
  return <CommerceSections.ProductSection className={className} />;
}

export function ArtisansPage({ className = '' }: PageProps) {
  return <CommerceSections.ArtisanSection className={className} />;
}

export function ArtisanDetailPage({ className = '' }: PageProps) {
  const { artisanId } = useParams<{ artisanId?: string }>();
  const artisan = resolveArtisan(artisanId);
  return <CommerceSections.ArtisanSection className={className} />;
}

export function CheckoutPage({ className = '' }: PageProps) {
  return <CommerceSections.CheckoutSection className={className} />;
}

export function CustomOrderPage({ className = '' }: PageProps) {
  return <CommerceSections.CustomOrderSection className={className} />;
}

export function CartRoute({ className = '' }: PageProps) {
  return <CommerceSections.CatalogSection className={className} />;
}

export default ProductPage;