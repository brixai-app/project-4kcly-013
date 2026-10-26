import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection, ProductGrid, CategoryShowcase, BrandManifesto, NewsletterSection } from '@/components/StorefrontSections';
import { products } from '@/data/mockData';

export function Home() {
  const featuredProducts = products?.filter((product) => product?.featured ?? false)?.slice(0, 8) ?? products?.slice(0, 8) ?? [];
  return (
    <motion.main
      className="bg-[#F5F0E6] text-[#2B2B2B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-[#C9A66B]/70 pb-3">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Featured Selection</p>
            <h2 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">Curated for ceremony, travel, and evening wear</h2>
          </div>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
      <CategoryShowcase />
      <BrandManifesto />
      <NewsletterSection />
    </motion.main>
  );
}

export default Home;