import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Award, MapPin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { artisans, editorialCopy, products } from '@/data/mockData';

type SectionProps = { className?: string };

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.35 }, transition: { duration: 0.7, ease: 'easeOut' } };

export function AtelierTriptych({ className = '' }: SectionProps) {
  const hero = products?.find((p) => p?.featured) ?? products?.[0] ?? null;
  const artisan = artisans?.[0] ?? null;
  const copy = editorialCopy?.home?.hero ?? {};
  return (
    <section className={cn('relative overflow-hidden border-b border-[#D8CDBE] bg-[#F5F1EB]', className)}>
      <div className="mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[56vh] lg:min-h-[88vh]">
          <motion.img {...fadeUp} src={hero?.image ?? ''} alt={hero?.name ?? 'Atelier hero'} crossOrigin="anonymous" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-col gap-2 text-[10px] uppercase tracking-[0.35em] text-white/80 md:left-8 md:top-8">
            <span>Collection 01</span>
            <span className="h-16 w-px bg-white/40" />
            <span>Jodhpur Atelier</span>
          </div>
          <div className="absolute bottom-4 left-4 max-w-[18rem] border border-white/30 bg-[#FFFCF7]/90 p-4 text-[#2B2B2B] shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-sm md:bottom-8 md:left-8 md:max-w-[22rem]">
            <p className="font-serif text-3xl leading-none md:text-5xl">{copy?.title ?? 'Jootiya'}</p>
            <p className="mt-3 text-sm leading-6 text-[#6E665D]">{copy?.subtitle ?? 'Hand-finished Mojris shaped by heritage, patience, and a precise editorial eye.'}</p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#B38A4E]">
              Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="relative flex min-h-[32vh] flex-col justify-between border-t border-[#D8CDBE] bg-[#FFFCF7] lg:min-h-[88vh] lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-3 p-4 md:p-8">
            <motion.img {...fadeUp} transition={{ duration: 0.8, delay: 0.1 }} src={products?.[1]?.image ?? ''} alt={products?.[1]?.name ?? 'Mojri detail'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            <motion.img {...fadeUp} transition={{ duration: 0.8, delay: 0.2 }} src={products?.[2]?.image ?? ''} alt={products?.[2]?.name ?? 'Mojri detail'} crossOrigin="anonymous" className="mt-10 aspect-[4/5] w-full object-cover" />
          </div>
          <div className="border-t border-[#D8CDBE] p-4 md:p-8">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#6E665D]">
              <Sparkles size={14} />
              <span>Crafted for ceremony and daily ritual</span>
            </div>
            <p className="mt-4 max-w-md font-serif text-2xl leading-tight text-[#2B2B2B] md:text-4xl">{copy?.headline ?? 'A collectible wardrobe of Jodhpuri craft, rendered with restraint.'}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-[#6E665D]">Featured artisan</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#2B2B2B]">{artisan?.name ?? 'Master artisan'}</p>
                <p className="truncate text-sm text-[#6E665D]">{artisan?.location ?? 'Jodhpur, Rajasthan'}</p>
              </div>
              <div className="h-14 w-14 overflow-hidden rounded-full border border-[#D8CDBE]">
                <img src={artisan?.portraitUrl ?? ''} alt={artisan?.name ?? 'Artisan portrait'} crossOrigin="anonymous" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedMasonry({ className = '' }: SectionProps) {
  const featured = products?.filter((p) => p?.featured)?.slice(0, 4) ?? [];
  return (
    <section className={cn('mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16', className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#6E665D]">Featured drop</p>
          <h2 className="mt-2 font-serif text-3xl text-[#2B2B2B] md:text-5xl">Masonry of signature pairs</h2>
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <ProductCard product={featured?.[0] ?? null} />
        </div>
        <div className="md:col-span-5">
          <div className="grid gap-4">
            <ProductCard product={featured?.[1] ?? null} />
            <div className="grid gap-4 sm:grid-cols-2">
              <ProductCard product={featured?.[2] ?? null} />
              <ProductCard product={featured?.[3] ?? null} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryShowcase({ className = '' }: SectionProps) {
  const categories = ['Mojri', 'Jutti', 'Kolhapuri', 'Accessories'] as const;
  return (
    <section className={cn('border-y border-[#D8CDBE] bg-[#FFFCF7]', className)}>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-4 md:px-8 md:py-14">
        {categories.map((category, index) => (
          <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} className="group flex min-h-40 flex-col justify-between border border-[#D8CDBE] bg-[#F5F1EB] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-xs uppercase tracking-[0.32em] text-[#6E665D]">{String(index + 1).padStart(2, '0')}</p>
              <Leaf size={16} className="text-[#C9A66B]" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-[#2B2B2B]">{category}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6E665D]">Refined silhouettes with hand-finished edges and quiet ornament.</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CraftManifesto({ className = '' }: SectionProps) {
  const copy = editorialCopy?.home?.manifesto ?? {};
  return (
    <section className={cn('bg-[#1F1B17] text-[#FFFCF7]', className)}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Craft manifesto</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">{copy?.title ?? 'Built slowly, worn often, remembered always.'}</h2>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Award size={16} className="text-[#C9A66B]" />
            <span>{copy?.subtitle ?? 'A disciplined balance of comfort, ceremony, and enduring form.'}</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: MapPin, title: 'Jodhpur rooted', text: 'Made with regional knowledge and a measured hand.' },
            { icon: Sparkles, title: 'Soft-gold finish', text: 'Subtle detailing that catches light without noise.' },
            { icon: Mail, title: 'Direct atelier access', text: 'Speak to the studio for sizing, gifting, and curation.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="border border-white/10 bg-white/5 p-5">
                <Icon size={18} className="text-[#C9A66B]" />
                <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ArtisanRibbon({ className = '' }: SectionProps) {
  return (
    <section className={cn('mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16', className)}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {(artisans ?? []).slice(0, 4).map((artisan) => (
          <article key={artisan.id} className="min-w-[16rem] flex-1 border border-[#D8CDBE] bg-[#FFFCF7] p-4">
            <img src={artisan.portraitUrl} alt={artisan.name} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#6E665D]">{artisan.location}</p>
              <h3 className="mt-2 font-serif text-2xl text-[#2B2B2B]">{artisan.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6E665D]">{artisan.story}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NewsletterPanel({ className = '' }: SectionProps) {
  return (
    <section className={cn('border-t border-[#D8CDBE] bg-[#F5F1EB]', className)}>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#6E665D]">Newsletter</p>
          <h2 className="mt-3 font-serif text-3xl text-[#2B2B2B] md:text-5xl">Receive atelier notes, early drops, and private restocks.</h2>
        </div>
        <form className="flex flex-col gap-3 border border-[#D8CDBE] bg-[#FFFCF7] p-4 md:p-6">
          <label className="text-xs uppercase tracking-[0.28em] text-[#6E665D]" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="name@example.com" className="border border-[#D8CDBE] bg-transparent px-4 py-3 text-sm text-[#2B2B2B] outline-none placeholder:text-[#9A9186]" />
          <button type="button" className="inline-flex items-center justify-center gap-2 bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#B38A4E]">
            Subscribe <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </section>
  );
}

export function EditorialHomeSections({ className = '' }: SectionProps) {
  return (
    <div className={cn('bg-[#F5F1EB]', className)}>
      <AtelierTriptych />
      <FeaturedMasonry />
      <CategoryShowcase />
      <CraftManifesto />
      <ArtisanRibbon />
      <NewsletterPanel />
    </div>
  );
}

export default EditorialHomeSections;