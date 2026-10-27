import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Award, CheckCircle2, Clock, MapPin, Sparkles, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { products, artisans, editorialCopy } from '@/data/mockData';
import type { Artisan, Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

type SectionProps = { className?: string };
type ProductDetailProps = { slug?: string; className?: string };
type CheckoutProps = { className?: string };
type ArtisanProps = { artisanId?: string; className?: string };
type CustomOrderProps = { className?: string };

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { duration: 0.55 } };

export function HeroSection({ className = '' }: SectionProps) {
  const hero = products?.find((p) => p?.featured) ?? products?.[0];
  return (
    <section className={cn('bg-[#F9F5F0] px-4 pb-10 pt-4 md:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden border border-[#C9A66B] bg-[#FFFDFC] lg:grid-cols-2">
          <div className="relative min-h-[72vh]">
            <img src={hero?.image ?? ''} alt={hero?.name ?? 'Jootiya editorial hero'} crossOrigin="anonymous" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          </div>
          <div className="flex items-end border-t border-[#C9A66B] p-6 lg:border-l lg:border-t-0 lg:p-10">
            <motion.div {...fade} className="max-w-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">{editorialCopy?.heroKicker ?? 'Heritage footwear atelier'}</p>
              <h1 className="font-['Playfair_Display',serif] text-5xl font-light leading-[0.92] tracking-tight text-[#2B2B2B] md:text-7xl">{editorialCopy?.heroTitle ?? 'Jodhpuri Mojris, refined for the modern wardrobe.'}</h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[#6F625E] md:text-base">{editorialCopy?.heroBody ?? 'Warm ivory canvases, vermilion accents, and hand-finished craft details shape a storefront devoted to authentic mojris and ceremonial ease.'}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#B92A15]">
                  Explore Collection <ArrowRight size={16} />
                </Link>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#6F625E]">
                  <Sparkles size={14} className="text-[#C9A66B]" /> Hand-finished in Rajasthan
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedCollectionSection({ className = '' }: SectionProps) {
  const featured = products?.filter((p) => p?.featured)?.slice(0, 3) ?? [];
  return (
    <section className={cn('bg-[#F9F5F0] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">Featured drop</p>
            <h2 className="mt-2 font-['Playfair_Display',serif] text-3xl font-light text-[#2B2B2B] md:text-4xl">A quiet rhythm of craft and silhouette.</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] md:inline-flex">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((product) => <ProductCard key={product?.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}

export function CraftManifestoSection({ className = '' }: SectionProps) {
  const points = [
    { icon: Award, title: 'Authentic craft', text: 'Traditional construction, balanced proportions, and hand-finished detailing.' },
    { icon: Clock, title: 'Measured making', text: 'A considered process that respects fit, comfort, and ceremonial longevity.' },
    { icon: Truck, title: 'Thoughtful delivery', text: 'Local persistence for carts and a calm checkout path for every order.' },
  ];
  return (
    <section className={cn('bg-[#FFFDFC] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div {...fade} className="border border-[#C9A66B] bg-[#F9F5F0] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">Craft manifesto</p>
          <h2 className="mt-3 font-['Playfair_Display',serif] text-3xl font-light text-[#2B2B2B] md:text-5xl">Designed like an editorial, built like a legacy object.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6F625E] md:text-base">{editorialCopy?.manifesto ?? 'Every pair is presented with restraint: warm ivory surfaces, gold rules, and a vermilion call to action that keeps the focus on material, silhouette, and origin.'}</p>
        </motion.div>
        <div className="grid gap-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="flex gap-4 border border-[#C9A66B] bg-[#FFFDFC] p-5">
                <Icon className="mt-0.5 shrink-0 text-[#D9381E]" size={18} />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">{point.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6F625E]">{point.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductDetailSection({ slug = '', className = '' }: ProductDetailProps) {
  const product = products?.find((p) => p?.slug === slug) ?? products?.[0];
  const navigate = useNavigate();
  const { addItem } = useCart();
  if (!product) return null;
  return (
    <section className={cn('bg-[#F9F5F0] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <img src={product?.image ?? ''} alt={product?.name ?? 'Product image'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
          <div className="grid grid-cols-2 gap-4">
            {(product?.images ?? []).slice(0, 2).map((src, index) => <img key={`${src}-${index}`} src={src} alt={`${product?.name ?? 'Product'} detail ${index + 1}`} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />)}
          </div>
        </div>
        <motion.div {...fade} className="border border-[#C9A66B] bg-[#FFFDFC] p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">{product?.collection ?? product?.category ?? 'Collection'}</p>
          <h2 className="mt-3 font-['Playfair_Display',serif] text-4xl font-light text-[#2B2B2B]">{product?.name ?? ''}</h2>
          <p className="mt-3 text-lg font-semibold text-[#2B2B2B]">₹{product?.price?.toLocaleString?.('en-IN') ?? '0'}</p>
          <p className="mt-4 text-sm leading-7 text-[#6F625E]">{product?.description ?? 'A refined pair shaped for ceremony, comfort, and enduring wear.'}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-[#2B2B2B]">
            {(product?.sizes ?? []).slice(0, 4).map((size) => <span key={size} className="border border-[#C9A66B] px-3 py-2">{size}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => { addItem(product?.id ?? '', 1); toast.success('Added to cart'); }} className="bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#B92A15]">Quick add</button>
            <button onClick={() => navigate('/shop')} className="border border-[#C9A66B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">Continue browsing</button>
          </div>
          <div className="mt-8 grid gap-3 border-t border-[#C9A66B] pt-6 text-sm text-[#6F625E]">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#D9381E]" /> {product?.material ?? 'Hand-finished leather upper'}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-[#D9381E]" /> {product?.origin ?? 'Jodhpur, Rajasthan'}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function CheckoutSection({ className = '' }: CheckoutProps) {
  const { items, subtotal } = useCart();
  return (
    <section className={cn('bg-[#FFFDFC] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl border border-[#C9A66B] bg-[#F9F5F0] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">Checkout</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-['Playfair_Display',serif] text-3xl font-light text-[#2B2B2B]">A calm final step.</h2>
            <p className="mt-2 text-sm leading-7 text-[#6F625E]">Your cart persists locally, and orders are recorded through a secure backend when you confirm shipping details.</p>
          </div>
          <div className="text-sm text-[#2B2B2B]">Items: {items?.length ?? 0} · Subtotal: ₹{subtotal?.toLocaleString?.('en-IN') ?? '0'}</div>
        </div>
      </div>
    </section>
  );
}

export function ArtisanListingSection({ className = '' }: SectionProps) {
  return (
    <section className={cn('bg-[#F9F5F0] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">Artisans</p>
          <h2 className="mt-2 font-['Playfair_Display',serif] text-3xl font-light text-[#2B2B2B] md:text-4xl">The hands behind the pair.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(artisans ?? []).slice(0, 3).map((artisan) => <ArtisanCard key={artisan?.id} artisan={artisan} />)}
        </div>
      </div>
    </section>
  );
}

function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <div className="border border-[#C9A66B] bg-[#FFFDFC] p-4">
      <img src={artisan?.image ?? ''} alt={artisan?.name ?? 'Artisan'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
      <div className="mt-4">
        <h3 className="font-['Playfair_Display',serif] text-2xl font-light text-[#2B2B2B]">{artisan?.name ?? ''}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#D9381E]">{artisan?.title ?? artisan?.location ?? 'Artisan'}</p>
        <p className="mt-3 text-sm leading-7 text-[#6F625E]">{artisan?.bio ?? ''}</p>
      </div>
    </div>
  );
}

export function CustomOrderSection({ className = '' }: CustomOrderProps) {
  return (
    <section className={cn('bg-[#FFFDFC] px-4 py-10 md:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl border border-[#C9A66B] bg-[#F9F5F0] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D9381E]">Custom order</p>
        <h2 className="mt-2 font-['Playfair_Display',serif] text-3xl font-light text-[#2B2B2B]">Commission a pair for a specific occasion.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6F625E]">Share your size, color preference, and occasion. We will route the request into a measured review flow without interrupting shopping.</p>
      </div>
    </section>
  );
}

export function HomeEditorialSections({ className = '' }: SectionProps) {
  return (
    <div className={cn('bg-[#F9F5F0]', className)}>
      <HeroSection />
      <FeaturedCollectionSection />
      <CraftManifestoSection />
      <ArtisanListingSection />
      <CustomOrderSection />
    </div>
  );
}

export function ExperienceSections({ className = '' }: SectionProps) {
  return <HomeEditorialSections className={className} />;
}

export default HomeEditorialSections;