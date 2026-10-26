import React from 'react';
import { HeroBanner, LookbookCarousel, TrendingDrop, ArtisanSpotlight, NewsletterBand } from '@/components/HomeSections';

export function Home() {
  return (
    <main className="bg-[#FAF7F0] text-[#211F1C]">
      <HeroBanner />
      <LookbookCarousel />
      <TrendingDrop />
      <ArtisanSpotlight />
      <NewsletterBand />
    </main>
  );
}

export default Home;