import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { HeroBanner, FeaturedArtisan, CuratedSpotlight, CraftManifesto, NewsletterSection } from '@/components/StorefrontSections';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json().catch(() => null);
        const data = (json?.data ?? json ?? []) as Product[];
        if (active) setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (active) setProducts([]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);
  return (
    <main className="bg-[#F9F5F0] text-[#2E2B28]">
      <HeroBanner />
      <FeaturedArtisan />
      <CuratedSpotlight />
      <CraftManifesto />
      <NewsletterSection />
    </main>
  );
}

export default Home;