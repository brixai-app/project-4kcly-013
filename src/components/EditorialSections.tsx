import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Check, ChevronDown, MapPin, Sparkles, Star, Truck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { sizeGuide, products, artisans, editorialContent } from '@/data/mockData';
import type { Product, Artisan } from '@/types';
import { cn } from '@/lib/utils';

export function HeroBanner({ className = '' }: { className?: string }) {
  const hero = products?.[0];
  return (
    <section className={cn('relative min-h-[92vh] overflow-hidden bg-[#1a1a1a] text-white', className)}>
      <div className="absolute inset-0">
        <img src={hero?.image ?? 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'} alt={hero?.name ?? 'Jootiya hero'} crossOrigin="anonymous" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
      </div>
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">{editorialContent?.heroEyebrow ?? 'Authentic Jodhpuri Mojris'}</p>
            <h1 className="font-[Playfair_Display] text-5xl font-light leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">{editorialContent?.heroTitle ?? 'Crafted for the ceremonial walk, refined for every day.'}</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">{editorialContent?.heroCopy ?? 'Warm ivory canvases, terracotta accents, and hand-finished silhouettes shaped by artisans in Jodhpur.'}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[#A94721] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#873619]">
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm transition hover:bg-white/15">
                    Size Guide <ChevronDown size={16} />
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/55" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#D8CDBD] bg-[#FAF9F6] p-6 text-[#1A1A1A] shadow-2xl focus:outline-none">
                    <div className="flex items-start justify-between gap-4">
                      <Dialog.Title className="font-[Playfair_Display] text-2xl">Size Guide</Dialog.Title>
                      <Dialog.Close asChild><button className="text-[#675F56]"><X size={18} /></button></Dialog.Close>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-[#675F56]">
                      {(sizeGuide?.map((row: string, i: number) => <p key={i}>{row}</p>)) ?? null}
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
          <div className="border border-white/20 bg-black/20 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Provenance</p>
            <div className="mt-4 space-y-4 text-sm text-white/85">
              <p className="flex items-center gap-2"><MapPin size={16} /> Jodhpur atelier lineage</p>
              <p className="flex items-center gap-2"><Truck size={16} /> Pan-India delivery</p>
              <p className="flex items-center gap-2"><Sparkles size={16} /> Hand-finished detailing</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductExperience({ className = '' }: { className?: string }) {
  const featured = (products ?? []).slice(0, 6);
  return (
    <section className={cn('mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10', className)}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Featured edit</p>
          <h2 className="mt-2 font-[Playfair_Display] text-3xl font-light text-[#1A1A1A] sm:text-4xl">A staggered composition of signature pairs.</h2>
        </div>
        <Link to="/shop" className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-[#A94721] sm:inline-flex items-center gap-2">View all <ArrowRight size={16} /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((p: Product, i: number) => (
          <motion.article key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: i * 0.05 }} className={cn('group overflow-hidden border border-[#D8CDBD] bg-white', i % 3 === 0 ? 'md:translate-y-8' : i % 3 === 1 ? 'md:-translate-y-2' : '')}>
            <div className="aspect-[3/4] overflow-hidden bg-[#F5F1E9]">
              <img src={p.image} alt={p.name} crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.28em] text-[#675F56]">{p.category}</p>
                <h3 className="mt-1 truncate font-[Playfair_Display] text-xl text-[#1A1A1A]">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => toast.success(`${p.name} added to cart`)} className="inline-flex h-10 items-center justify-center border border-[#A94721] px-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#A94721] transition group-hover:bg-[#A94721] group-hover:text-white">
                Quick Add
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function CheckoutForm({ className = '' }: { className?: string }) {
  return <section className={cn('mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10', className)}><div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"><div className="border border-[#D8CDBD] bg-white p-6"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Guest checkout</p><h2 className="mt-2 font-[Playfair_Display] text-3xl font-light text-[#1A1A1A]">A calm, guided purchase.</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><input className="border border-[#D8CDBD] bg-[#FAF9F6] px-4 py-3 text-sm outline-none" placeholder="Full name" /><input className="border border-[#D8CDBD] bg-[#FAF9F6] px-4 py-3 text-sm outline-none" placeholder="Email address" /><input className="border border-[#D8CDBD] bg-[#FAF9F6] px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="Shipping address" /><button onClick={() => toast.success('Checkout details saved')} className="bg-[#A94721] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#873619]">Continue</button></div></div><div className="border border-[#D8CDBD] bg-[#F5F1E9] p-6"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Why Jootiya</p><ul className="mt-5 space-y-3 text-sm text-[#1A1A1A]">{['Authentic artisan sourcing','Secure payment options','Carefully packed delivery'].map((item) => <li key={item} className="flex items-center gap-2"><Check size={16} className="text-[#A94721]" />{item}</li>)}</ul></div></div></section>;
}

export function ArtisanList({ className = '' }: { className?: string }) {
  return <section className={cn('mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10', className)}><div className="grid gap-5 lg:grid-cols-3">{(artisans ?? []).slice(0, 3).map((a: Artisan) => <ArtisanProfile key={a.id} artisan={a} />)}</div></section>;
}

export function ArtisanProfile({ artisan = null, className = '' }: { artisan?: Artisan | null; className?: string }) {
  return <article className={cn('border border-[#D8CDBD] bg-white p-5', className)}><div className="flex items-start gap-4"><img src={artisan?.image ?? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'} alt={artisan?.name ?? 'Artisan'} crossOrigin="anonymous" className="h-24 w-20 object-cover" /><div className="min-w-0"><p className="text-xs uppercase tracking-[0.28em] text-[#675F56]">Master artisan</p><h3 className="mt-1 font-[Playfair_Display] text-2xl text-[#1A1A1A]">{artisan?.name ?? 'Unnamed artisan'}</h3><p className="mt-1 text-sm text-[#675F56]">{artisan?.location ?? 'Jodhpur, Rajasthan'}</p></div></div><p className="mt-4 text-sm leading-7 text-[#1A1A1A]">{artisan?.story ?? 'A lineage of hand-finished craftsmanship, preserving the silhouette and soul of the mojri.'}</p></article>;
}

export function ManifestoSection({ className = '' }: { className?: string }) {
  return <section className={cn('mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10', className)}><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><div className="border border-[#D8CDBD] bg-[#1A1A1A] p-6 text-white"><p className="text-xs uppercase tracking-[0.35em] text-white/70">Manifesto</p><h2 className="mt-3 font-[Playfair_Display] text-3xl font-light">Made with restraint, worn with ceremony.</h2><p className="mt-4 text-sm leading-7 text-white/80">{editorialContent?.manifesto ?? 'Each pair is shaped to honor the ritual of dressing well: quiet luxury, tactile depth, and enduring comfort.'}</p></div><div className="grid gap-4 sm:grid-cols-2">{(editorialContent?.manifestoPoints ?? ['Hand-finished uppers','Supple leather lining','Traditional silhouette','Modern comfort']).map((point: string) => <div key={point} className="border border-[#D8CDBD] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#675F56]">{point}</p></div>)}</div></div></section>;
}

export function NewsletterBand({ className = '' }: { className?: string }) {
  return <section className={cn('bg-[#F5F1E9]', className)}><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Newsletter</p><h2 className="mt-2 font-[Playfair_Display] text-3xl font-light text-[#1A1A1A]">Receive the next drop, quietly.</h2></div><div className="flex w-full max-w-xl gap-3"><input className="min-w-0 flex-1 border border-[#D8CDBD] bg-white px-4 py-3 text-sm outline-none" placeholder="Email address" /><button onClick={() => toast.success('Subscribed')} className="bg-[#A94721] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#873619]">Join</button></div></div></section>;
}

const sections = { HeroBanner, ProductExperience, CheckoutForm, ArtisanList, ArtisanProfile, ManifestoSection, NewsletterBand };
export default sections;
export { sections };
