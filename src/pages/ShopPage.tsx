import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CatalogWorkspace } from '@/components/EditorialSections';
import { products } from '@/data/mockData';

export function ShopPage({ className = '' }: { className?: string }) {
  const location = useLocation();
  const params = new URLSearchParams(location?.search ?? '');
  const category = params.get('category') ?? '';
  const search = params.get('search') ?? '';
  const sort = params.get('sort') ?? '';
  const initialCount = products?.length ?? 0;

  return (
    <main className={className}>
      <section className="border-b border-[#CFC2B2] bg-[#FFFDF7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655C]">Shop Jootiya</p>
            <h1 className="mt-3 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B] sm:text-5xl">
              Handcrafted Mojris, edited like a lookbook.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6F655C] sm:text-base">
              Explore refined Rajasthani silhouettes, artisan-led details, and seasonal pairs selected for ceremony, everyday wear, and limited drops.
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655C]">
            <span className="rounded-sm border border-[#CFC2B2] px-3 py-2">Products {initialCount}</span>
            <span className="rounded-sm border border-[#CFC2B2] px-3 py-2">Category {category || 'All'}</span>
            <span className="rounded-sm border border-[#CFC2B2] px-3 py-2">Search {search || '—'}</span>
            <span className="rounded-sm border border-[#CFC2B2] px-3 py-2">Sort {sort || 'Featured'}</span>
          </div>
        </div>
      </section>
      <CatalogWorkspace className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" />
    </main>
  );
}

export default ShopPage;