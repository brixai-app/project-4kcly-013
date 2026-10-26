import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, MapPin, Star, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockData } from '@/data/mockData';
import type { Product } from '@/types';

type SectionProps = { className?: string };

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.35 }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } };

function ProductCard({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <motion.article {...reveal} className={cn('group relative overflow-hidden border border-[#8A806F]/30 bg-[#FFFDF8] shadow-[0_1px_0_rgba(33,31,28,0.04)]', className)}>
      <Link to="/shop" className="block">
        <div className="aspect-[3/4] overflow-hidden bg-[#FAF7F0]">
          <img src={product.image} alt={product.name} crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-2 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#514B42]">{product.category}</p>
          <h3 className="min-w-0 truncate font-serif text-xl text-[#211F1C]">{product.name}</h3>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#211F1C]">₹{product.price.toLocaleString('en-IN')}</p>
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6B451D]">Quick add</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function HeroBanner({ className = '' }: SectionProps) {
  const hero = mockData?.lookbookSlides?.[0] ?? mockData?.products?.[0];
  const image = hero?.image ?? mockData?.imageAssets?.[3] ?? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
  return (
    <section className={cn('relative overflow-hidden bg-[#FAF7F0]', className)}>
      <div className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div {...reveal} className="relative flex min-h-[62vh] items-end lg:min-h-[92vh]">
          <img src={image} alt="Jootiya editorial hero" crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211F1C]/70 via-[#211F1C]/20 to-transparent" />
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl border border-white/20 bg-[#FFFDF8]/92 p-6 backdrop-blur-sm sm:p-8">
              <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6B451D]"><Sparkles className="h-4 w-4" /> Handcrafted in Jodhpur</p>
              <h1 className="font-serif text-5xl font-light tracking-tight text-[#211F1C] sm:text-6xl lg:text-7xl">Mojris shaped by heritage, worn with intent.</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#514B42] sm:text-base">Authentic Rajasthani craftsmanship, refined silhouettes, and a guest-first shopping experience built for discovery, confidence, and ease.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-[#6B451D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#4E3014]">Explore Collection <ArrowRight className="h-4 w-4" /></Link>
                <button type="button" onClick={() => toast.message('Scroll to discover the latest handcrafted drop.')} className="inline-flex items-center gap-2 border border-[#8A806F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#211F1C] transition-colors hover:bg-[#FFFDF8]">View Story</button>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex flex-col justify-between gap-6 p-6 sm:p-10 lg:p-14">
          <motion.div {...reveal} className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6B451D]">Lookbook rail</p>
            <div className="space-y-3 border-l border-[#8A806F]/40 pl-4">
              {(mockData?.lookbookSlides ?? []).slice(0, 3).map((slide, index) => (
                <div key={slide?.id ?? index} className="flex items-start gap-3">
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#514B42]">0{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-lg text-[#211F1C]">{slide?.title ?? 'Crafted detail'}</p>
                    <p className="text-sm leading-6 text-[#514B42]">{slide?.caption ?? 'A quiet study in leather, stitch, and form.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal} className="grid gap-3 sm:grid-cols-2">
            <div className="border border-[#8A806F]/30 bg-[#FFFDF8] p-4">
              <Leaf className="h-5 w-5 text-[#6B451D]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#211F1C]">Natural materials</p>
              <p className="mt-2 text-sm leading-6 text-[#514B42]">Supple leather, hand-finished edges, and enduring comfort.</p>
            </div>
            <div className="border border-[#8A806F]/30 bg-[#FFFDF8] p-4">
              <Truck className="h-5 w-5 text-[#6B451D]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#211F1C]">Careful delivery</p>
              <p className="mt-2 text-sm leading-6 text-[#514B42]">Secure packing and responsive checkout from cart to doorstep.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function LookbookCarousel({ className = '' }: SectionProps) {
  const slides = mockData?.lookbookSlides ?? [];
  return (
    <section className={cn('bg-[#FFFDF8] py-10 sm:py-14', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6B451D]">Lookbook</p>
            <h2 className="mt-2 font-serif text-3xl text-[#211F1C]">A ribbon of craft and silhouette</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6B451D] sm:inline-flex">Shop latest <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <motion.div key={slide?.id ?? index} {...reveal} className="min-w-[78%] sm:min-w-[42%] lg:min-w-[28%]">
              <div className="overflow-hidden border border-[#8A806F]/30 bg-[#FAF7F0]">
                <img src={slide?.image ?? mockData?.imageAssets?.[index % (mockData?.imageAssets?.length ?? 1)]} alt={slide?.title ?? 'Lookbook slide'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#514B42]">0{index + 1}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#211F1C]">{slide?.title ?? 'Heritage edit'}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#514B42]">{slide?.caption ?? 'An editorial frame for the season’s most tactile forms.'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingDrop({ className = '' }: SectionProps) {
  const products = (mockData?.products ?? []).filter((p) => p?.featured ?? false).slice(0, 4);
  return (
    <section className={cn('bg-[#FAF7F0] py-12 sm:py-16', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6B451D]">Trending drop</p>
            <h2 className="mt-2 font-serif text-3xl text-[#211F1C]">Selected pairs with quiet presence</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#514B42]">A curated field of bestsellers and new arrivals, presented with the restraint of a luxury atelier and the clarity of a modern storefront.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

export function ArtisanSpotlight({ className = '' }: SectionProps) {
  const artisan = mockData?.artisans?.[0];
  return (
    <section className={cn('bg-[#FFFDF8] py-12 sm:py-16', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div {...reveal} className="order-2 flex flex-col justify-center border border-[#8A806F]/30 bg-[#FAF7F0] p-6 sm:p-8 lg:order-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#6B451D]">Artisan spotlight</p>
          <h2 className="mt-3 font-serif text-4xl text-[#211F1C]">{artisan?.name ?? 'Master artisan'}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#514B42]"><MapPin className="h-4 w-4 text-[#6B451D]" /> {artisan?.location ?? 'Jodhpur, Rajasthan'}</div>
          <p className="mt-5 text-sm leading-7 text-[#514B42]">{artisan?.story ?? 'Each pair is shaped by hand, balancing tradition, fit, and the quiet confidence of enduring craft.'}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(artisan?.specialties ?? ['Hand-stitching', 'Leather finishing', 'Traditional motifs']).map((item) => <span key={item} className="border border-[#8A806F]/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#211F1C]">{item}</span>)}
          </div>
        </motion.div>
        <motion.div {...reveal} className="order-1 overflow-hidden lg:order-2">
          <img src={artisan?.image ?? mockData?.imageAssets?.[4]} alt={artisan?.name ?? 'Artisan portrait'} crossOrigin="anonymous" className="h-full min-h-[420px] w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

export function NewsletterBand({ className = '' }: SectionProps) {
  return (
    <section className={cn('bg-[#211F1C] py-12 text-white sm:py-16', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D8C7A3]">Newsletter</p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Receive first access to new drops and artisan stories.</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">Measured updates, no clutter. Just product launches, craft notes, and occasional private offers.</p>
        </div>
        <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); toast.success('Thanks for joining the Jootiya list.'); }}>
          <input type="email" required placeholder="Email address" className="min-w-0 flex-1 border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none" />
          <button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#6B451D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#4E3014]">Join list <ArrowRight className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
  );
}

export function HomeSections({ className = '' }: SectionProps) {
  return (
    <main className={cn('bg-[#FAF7F0]', className)}>
      <HeroBanner />
      <LookbookCarousel />
      <TrendingDrop />
      <ArtisanSpotlight />
      <NewsletterBand />
    </main>
  );
}

export default HomeSections;