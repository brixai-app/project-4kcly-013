import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { categories, editorialStories, products } from '@/data/mockData';
import type { CatalogFilter, Product } from '@/types';
import { cn } from '@/lib/utils';

type SectionProps = { className?: string };
type GridProps = { products?: Product[]; className?: string };

export function HeroSection({ className = '' }: SectionProps = {}) {
  const story = editorialStories?.[0] ?? {};
  return (
    <section className={cn('relative min-h-[92vh] overflow-hidden bg-[#F5F0E6] text-[#2B2B2B]', className)}>
      <div className="absolute inset-0">
        <img
          src={story?.image ?? 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=85'}
          alt={story?.title ?? 'Jootiya heritage lookbook'}
          crossOrigin="anonymous"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E6]/90 via-[#F5F0E6]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/35 via-transparent to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl border-l border-[#C9A66B] pl-5 sm:pl-8">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">JODHPUR PROVENANCE</p>
            <h1 className="font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#2B2B2B] sm:text-6xl lg:text-7xl">
              {story?.title ?? 'Heritage Mojris, reimagined for the modern ceremonial wardrobe.'}
            </h1>
            <p className="mt-5 max-w-xl font-['Lora'] text-base leading-7 text-[#6F655B] sm:text-lg">
              {story?.excerpt ?? 'Hand-finished silhouettes, supple leathers, and restrained ornamentation shaped by Jodhpuri craft traditions.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#61211C]"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 border border-[#C9A66B] bg-[#FFF9F0]/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition-colors hover:bg-[#FFF9F0]"
              >
                Bespoke Order
              </Link>
            </div>
          </div>
          <div className="hidden items-end justify-end lg:flex">
            <div className="w-full max-w-sm border border-[#C9A66B] bg-[#FFF9F0]/85 p-4 backdrop-blur-sm">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={editorialStories?.[1]?.image ?? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85'}
                  alt={editorialStories?.[1]?.title ?? 'Heritage detail'}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#C9A66B] pt-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Craft Notes</span>
                <span className="text-xs text-[#7B2D26]">Since 1984</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CatalogToolbar({ className = '' }: SectionProps = {}) {
  const filter: CatalogFilter = { query: '', category: '', occasion: '', size: '', priceRange: '', artisan: '', sortBy: '' };
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 border-y border-[#C9A66B] bg-[#FFF9F0] px-4 py-4 sm:px-6 lg:px-8', className)}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Catalog</p>
        <h2 className="font-['Playfair_Display'] text-2xl font-light text-[#2B2B2B]">Curated by occasion and craft</h2>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6F655B]">
        <Filter size={14} />
        <span>{filter?.sortBy ?? 'Refine selection'}</span>
        <ChevronDown size={14} />
      </div>
    </div>
  );
}

export function ProductGrid({ products: items = products, className = '' }: GridProps = {}) {
  return (
    <section className={cn('px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items?.map((product, index) => (
          <motion.div
            key={product?.id ?? index}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: index * 0.03 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CategoryShowcase({ className = '' }: SectionProps = {}) {
  return (
    <section className={cn('bg-[#2B2B2B] px-4 py-10 text-[#FFF9F0] sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-4">
        {categories?.slice(0, 4)?.map((category: string, index: number) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn('border border-[#C9A66B]/40 p-5', index === 0 ? 'lg:col-span-2' : 'lg:col-span-1')}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C9A66B]">Category</p>
            <h3 className="mt-3 font-['Playfair_Display'] text-3xl font-light">{category}</h3>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFF9F0]">
              <span>Shop</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BrandManifesto({ className = '' }: SectionProps = {}) {
  const story = editorialStories?.[2] ?? editorialStories?.[0] ?? {};
  return (
    <section className={cn('bg-[#F5F0E6] px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#C9A66B] bg-[#FFF9F0] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Manifesto</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-4xl font-light text-[#2B2B2B]">
            {story?.title ?? 'Crafted with restraint, worn with ceremony.'}
          </h2>
          <p className="mt-4 font-['Lora'] text-base leading-7 text-[#6F655B]">
            {story?.excerpt ?? 'Every pair is shaped by hand, balanced for comfort, and finished with a quiet sense of occasion.'}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {editorialStories?.slice(0, 2)?.map((item, index) => (
            <div key={item?.id ?? index} className="overflow-hidden border border-[#C9A66B] bg-[#FFF9F0]">
              <div className="aspect-[4/5]">
                <img src={item?.image ?? ''} alt={item?.title ?? 'Editorial story'} crossOrigin="anonymous" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Story</p>
                <h3 className="mt-2 font-['Playfair_Display'] text-2xl font-light text-[#2B2B2B]">{item?.title ?? 'Heritage'}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection({ className = '' }: SectionProps = {}) {
  return (
    <section className={cn('bg-[#FFF9F0] px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-[#C9A66B] pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F655B]">Newsletter</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-4xl font-light text-[#2B2B2B]">Receive new drops, artisan notes, and private access.</h2>
        </div>
        <Link to="/custom-orders" className="inline-flex items-center gap-2 bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#61211C]">
          Request Bespoke <Sparkles size={16} />
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;