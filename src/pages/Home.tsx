import React from 'react';
import { ArtisanSection, CatalogSection, CustomOrderSection, HomeSection, ProductSection } from '@/components/CommerceSections';

export function Home({ className = '' }: { className?: string }) {
  return (
    <main className={className}>
      <HomeSection />
      <ProductSection />
      <CatalogSection />
      <ArtisanSection />
      <CustomOrderSection />
    </main>
  );
}

export default Home;