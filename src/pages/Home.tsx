import React from 'react';
import { motion } from 'framer-motion';
import {
  ArtisanStoryTeaser,
  FeaturedGallery,
  HeroSlider,
  sectionRegistry,
} from '@/components/EditorialSections';

export function Home({ className = '' }: { className?: string }) {
  const manifesto = sectionRegistry?.manifesto ?? null;
  const newsletter = sectionRegistry?.newsletter ?? null;

  return (
    <main className={className}>
      <HeroSlider />
      <FeaturedGallery className="relative z-10 -mt-10 px-4 pb-8 sm:px-6 lg:px-8" />
      <ArtisanStoryTeaser className="px-4 py-8 sm:px-6 lg:px-8" />
      {manifesto ? (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="border-y border-[#CFC2B2] bg-[#FFFDF7] px-4 py-14 sm:px-6 lg:px-8"
        >
          {manifesto}
        </motion.section>
      ) : null}
      {newsletter ? (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-[#F5F1EB] px-4 py-14 sm:px-6 lg:px-8"
        >
          {newsletter}
        </motion.section>
      ) : null}
    </main>
  );
}

export default Home;