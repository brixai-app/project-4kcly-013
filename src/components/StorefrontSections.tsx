import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Sparkles, Star, Truck, Shield, Leaf, ShoppingBag, Search, Circle as Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import type { Product, ProductCategory, ProductFilterState } from '@/types';

const heroImage = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80';
const artisanImage = 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80';
const workshopImage = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80';
const detailImage = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80';
const craftImage = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80';

const categories: ProductCategory[] = ['Mojri', 'Jutti', 'Slip-on', 'Wedding', 'Heritage', 'Everyday'];

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return <div className={cn('h-10 w-10 animate-spin rounded-full border-2 border-[#CDBB9B] border-t-[#C1440E]', className)} />;
}

export function HeroBanner({ className = '' }: { className?: string }) {
  return (
    <section className={cn('relative overflow-hidden bg-[#F9F5F0]', className)}>
      <div className="mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[56vh] lg:min-h-[88vh]">
          <img src={heroImage} alt="Jodhpuri mojris editorial hero" crossOrigin="anonymous" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#F9F5F0]/85">Authentic Jodhpuri Mojris</p>
            <h1 className="max-w-3xl font-['Bodoni_Moda'] text-5xl font-light leading-[0.92] tracking-tight text-[#FFFDF9] sm:text-6xl lg:text-7xl">
              Heritage footwear, cut with modern restraint.
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm bg-[#C1440E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#963308]">
                Explore Collection <ArrowRight size={16} />
              </Link>
              <span className="max-w-md text-sm leading-6 text-[#F9F5F0]/85">
                Hand-finished pairs in warm ivory, terracotta, and restrained gold, sourced from master artisans in Rajasthan.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between border-t border-[#CDBB9B] bg-[#FFFDF9] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E6258]">Collection Rail</span>
              <span className="h-px flex-1 bg-[#CDBB9B]" />
            </div>
            <div className="space-y-4">
              {['Hand-embroidered uppers', 'Supple leather lining', 'Wedding and everyday silhouettes'].map((item, index) => (
                <div key={item} className="flex items-start gap-4 border-b border-[#CDBB9B]/60 pb-4">
                  <span className="font-['Bodoni_Moda'] text-2xl text-[#C1440E]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-6 text-[#2E2B28]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-sm border border-[#CDBB9B] bg-[#F9F5F0] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Craft note</p>
              <p className="mt-2 text-sm leading-6 text-[#2E2B28]">Every pair is photographed in natural light to preserve texture, stitch, and tonal depth.</p>
            </div>
            <div className="rounded-sm border border-[#CDBB9B] bg-[#FFFDF9] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Fast dispatch</p>
              <p className="mt-2 text-sm leading-6 text-[#2E2B28]">Secure packaging, size guidance, and attentive support from order to delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedArtisan({ className = '' }: { className?: string }) {
  return (
    <section className={cn('bg-[#FFFDF9] px-4 py-16 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E6258]">Featured artisan</p>
          <h2 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight text-[#2E2B28] sm:text-5xl">A workshop language of thread, leather, and patience.</h2>
          <p className="max-w-xl text-sm leading-7 text-[#6E6258]">
            Jootiya pairs contemporary retail discipline with the tactile rhythm of Rajasthan&apos;s craft houses, where each silhouette is shaped, stitched, and finished by hand.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Handcrafted', 'Limited batches', 'Authentic materials'].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-2 rounded-sm border border-[#CDBB9B] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2E2B28]">
                <Sparkles size={12} className="text-[#C1440E]" /> {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <img src={artisanImage} alt="Artisan portrait" crossOrigin="anonymous" className="h-full min-h-[320px] w-full object-cover" />
          <div className="grid gap-4">
            <img src={workshopImage} alt="Workshop detail" crossOrigin="anonymous" className="h-40 w-full object-cover sm:h-48" />
            <div className="border border-[#CDBB9B] bg-[#F9F5F0] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Signature</p>
              <p className="mt-2 font-['Bodoni_Moda'] text-2xl text-[#2E2B28]">Terracotta stitching, gold thread accents, and a refined toe profile.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CuratedSpotlight({ className = '' }: { className?: string }) {
  return (
    <section className={cn('bg-[#F9F5F0] px-4 py-16 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E6258]">Curated spotlight</p>
            <h2 className="mt-2 font-['Bodoni_Moda'] text-4xl font-light tracking-tight text-[#2E2B28]">Selected pairs for ceremony and daily wear.</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C1440E] sm:inline-flex">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[heroImage, detailImage, craftImage].map((src, index) => (
            <motion.article key={src} whileHover={{ y: -4 }} className="group overflow-hidden border border-[#CDBB9B] bg-[#FFFDF9]">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={src} alt={`Spotlight ${index + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E6258]">Editorial edit</p>
                <h3 className="mt-2 font-['Bodoni_Moda'] text-2xl text-[#2E2B28]">Crafted silhouette {index + 1}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6E6258]">A refined balance of comfort, ceremony, and heritage detailing.</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CraftManifesto({ className = '' }: { className?: string }) {
  return (
    <section className={cn('bg-[#0f0f0f] px-4 py-14 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        {[
          { icon: Leaf, title: 'Natural materials', text: 'Leather, thread, and finishing details chosen for longevity and comfort.' },
          { icon: Shield, title: 'Trusted quality', text: 'Careful inspection across stitching, fit, and finish before dispatch.' },
          { icon: Truck, title: 'Reliable delivery', text: 'Secure packaging and responsive support from checkout to arrival.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="border border-white/10 bg-white/5 p-6 text-[#FFFDF9]">
            <Icon className="text-[#CDBB9B]" size={20} />
            <h3 className="mt-4 font-['Bodoni_Moda'] text-2xl font-light">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-white/75">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection({ className = '' }: { className?: string }) {
  return (
    <section className={cn('bg-[#FFFDF9] px-4 py-16 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl border border-[#CDBB9B] bg-[#F9F5F0] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6E6258]">Newsletter</p>
            <h2 className="mt-2 font-['Bodoni_Moda'] text-4xl font-light tracking-tight text-[#2E2B28]">Receive new drops, artisan stories, and private access.</h2>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <input id="newsletter-email" type="email" placeholder="Email address" className="min-w-0 flex-1 border border-[#CDBB9B] bg-[#FFFDF9] px-4 py-3 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]" />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#C1440E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#963308]">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function FilterSidebar({
  filters,
  onFilterChange,
  className = '',
}: {
  filters?: Partial<ProductFilterState>;
  onFilterChange?: (next: Partial<ProductFilterState>) => void;
  className?: string;
}) {
  const activeCategories = filters?.categories ?? [];
  return (
    <aside className={cn('rounded-sm border border-[#CDBB9B] bg-[#FFFDF9] p-4', className)}>
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-[#C1440E]" />
        <h3 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.28em] text-[#2E2B28]">Filters</h3>
      </div>
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = activeCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => onFilterChange?.({ categories: active ? activeCategories.filter((item) => item !== category) : [...activeCategories, category] })}
                className={cn('min-w-0 truncate border px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors', active ? 'border-[#C1440E] bg-[#C1440E] text-white' : 'border-[#CDBB9B] bg-transparent text-[#2E2B28] hover:border-[#C1440E]')}
              >
                {category}
              </button>
            );
          })}
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C1440E]">
          <Search size={14} /> Search all
        </Link>
      </div>
    </aside>
  );
}

export function ProductGrid({ products = [], className = '' }: { products?: Product[]; className?: string }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const sections = { HeroBanner, FeaturedArtisan, CuratedSpotlight, CraftManifesto, NewsletterSection, FilterSidebar, ProductGrid, LoadingSpinner };
export default sections;
export { sections };
