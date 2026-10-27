import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ArtisanProfiles, CatalogWorkspace, CheckoutExperience, CustomOrderExperience, ProductExperience } from '@/components/EditorialSections';
import { cn } from '@/lib/utils';

export function ProductPage({ className = '' }: { className?: string }) {
  return (
    <main className={cn('min-h-screen bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <ProductExperience />
    </main>
  );
}

export function CheckoutPage({ className = '' }: { className?: string }) {
  return (
    <main className={cn('min-h-screen bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <CheckoutExperience />
    </main>
  );
}

export function ArtisanStoriesPage({ className = '' }: { className?: string }) {
  return (
    <main className={cn('min-h-screen bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <ArtisanProfiles />
    </main>
  );
}

export function CustomOrdersPage({ className = '' }: { className?: string }) {
  return (
    <main className={cn('min-h-screen bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <CustomOrderExperience />
    </main>
  );
}

export function SecondaryPages({ className = '' }: { className?: string }) {
  const location = useLocation();
  const params = useParams();
  const path = location?.pathname ?? '';
  const slug = params?.slug ?? '';

  if (path.includes('/checkout')) return <CheckoutPage className={className} />;
  if (path.includes('/artisans') || path.includes('/stories')) return <ArtisanStoriesPage className={className} />;
  if (path.includes('/custom') || path.includes('/bespoke')) return <CustomOrdersPage className={className} />;
  if (path.includes('/product') || slug) return <ProductPage className={className} />;

  return (
    <main className={cn('min-h-screen bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <CatalogWorkspace />
    </main>
  );
}

export default SecondaryPages;