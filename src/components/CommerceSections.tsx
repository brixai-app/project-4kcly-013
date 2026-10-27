import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Filter, Heart, Search, Shield, Star, Truck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { products, artisans, reviews, editorial } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

type SectionProps = { className?: string };

function SizeGuide({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#D8CCB9] bg-[#FAF9F6] p-6 text-[#1A1A1A] shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-['Playfair_Display'] text-2xl">Size Guide</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#675F56]">Jodhpuri Mojris are designed for a close, tailored fit.</Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex h-9 w-9 items-center justify-center border border-[#D8CCB9] text-[#1A1A1A]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="mt-5 grid gap-2 text-sm">
            {['UK 5 — 24.5 cm', 'UK 6 — 25.1 cm', 'UK 7 — 25.8 cm', 'UK 8 — 26.5 cm', 'UK 9 — 27.1 cm', 'UK 10 — 27.8 cm'].map((row) => (
              <div key={row} className="flex items-center justify-between border-b border-[#D8CCB9] py-2">
                <span>{row.split(' — ')[0]}</span><span className="text-[#675F56]">{row.split(' — ')[1]}</span>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function HomeEditorial({ className = '' }: SectionProps) {
  const hero = editorial?.hero ?? {};
  const featured = products?.filter((p) => p?.featured)?.slice(0, 5) ?? [];
  const [guideOpen, setGuideOpen] = useState(false);
  return (
    <div className={cn('space-y-16', className)}>
      <section className="relative overflow-hidden border-b border-[#D8CCB9] bg-[#FAF9F6]">
        <div className="relative min-h-[92vh]">
          <img src={hero?.image ?? products?.[0]?.image ?? 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'} alt={hero?.title ?? 'Jootiya atelier'} crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/55 via-[#0a0a0a]/10 to-transparent" />
          <div className="relative z-10 flex min-h-[92vh] flex-col justify-end">
            <div className="grid gap-6 px-5 pb-8 pt-24 md:grid-cols-[1fr_220px] md:px-10 lg:px-16">
              <div className="max-w-4xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F5F1E9]">{hero?.eyebrow ?? 'Jodhpur • Handcrafted Heritage'}</p>
                <h1 className="max-w-4xl font-['Playfair_Display'] text-5xl font-light leading-[0.92] tracking-tight text-white md:text-7xl">{hero?.title ?? 'Mojris shaped like heirlooms, worn like modern ritual.'}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F5F1E9] md:text-base">{hero?.subtitle ?? 'An editorial commerce experience for authentic Jodhpuri craftsmanship, where every pair is cut, stitched, and finished with atelier precision.'}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/shop" className="inline-flex items-center gap-2 bg-[#A94720] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#843616]">
                    Explore Collection <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => setGuideOpen(true)} className="inline-flex items-center gap-2 border border-[#F5F1E9]/60 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                    Size Guide
                  </button>
                </div>
              </div>
              <div className="hidden self-end border-l border-[#F5F1E9]/40 pl-5 text-right text-[#F5F1E9] md:block">
                <p className="text-xs uppercase tracking-[0.35em]">Provenance</p>
                <p className="mt-3 text-sm leading-6">{hero?.rail?.[0] ?? 'Jodhpur atelier lineage'}</p>
                <p className="mt-3 text-sm leading-6">{hero?.rail?.[1] ?? 'Seasonal craft release'}</p>
                <p className="mt-3 text-sm leading-6">{hero?.rail?.[2] ?? 'Ivory, terracotta, antique gold'}</p>
              </div>
            </div>
          </div>
        </div>
        <SizeGuide open={guideOpen} onOpenChange={setGuideOpen} />
      </section>
      <section className="px-5 md:px-10 lg:px-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Featured drop</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light">Staggered masonry, refined by hand</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#A94720] md:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {featured.map((product, index) => <div key={product?.id ?? index} className="mb-4 break-inside-avoid"><ProductCard product={product} masonrySpan={index % 3 === 0 ? 'lg' : 'md'} /></div>)}
        </div>
      </section>
    </div>
  );
}

export function CatalogExperience({ className = '' }: SectionProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => products?.filter((p) => `${p?.name ?? ''} ${p?.category ?? ''} ${p?.collection ?? ''}`.toLowerCase().includes(query.toLowerCase())) ?? [], [query]);
  return (
    <section className={cn('px-5 md:px-10 lg:px-16', className)}>
      <div className="sticky top-0 z-20 mb-6 border border-[#D8CCB9] bg-[#FAF9F6]/95 p-3 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Filter className="h-4 w-4 text-[#675F56]" />
            <h2 className="min-w-0 truncate font-['Playfair_Display'] text-2xl">Catalog</h2>
          </div>
          <div className="flex items-center gap-2 border border-[#D8CCB9] bg-white px-3 py-2">
            <Search className="h-4 w-4 text-[#675F56]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mojris, collections, artisans" className="w-full bg-transparent text-sm outline-none placeholder:text-[#675F56]" />
          </div>
        </div>
      </div>
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
        {filtered.map((product, index) => <div key={product?.id ?? index} className="mb-4 break-inside-avoid"><ProductCard product={product} masonrySpan={index % 4 === 0 ? 'xl' : 'md'} /></div>)}
      </div>
    </section>
  );
}

export function ProductExperience({ className = '' }: SectionProps) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const top = products?.slice(0, 3) ?? [];
  return (
    <section className={cn('grid gap-6 px-5 md:grid-cols-[1.2fr_0.8fr] md:px-10 lg:px-16', className)}>
      <div className="grid gap-4">
        {top.map((product) => (
          <motion.article key={product?.id ?? product?.slug} layout className="overflow-hidden border border-[#D8CCB9] bg-white">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <img src={product?.image ?? ''} alt={product?.name ?? 'Product'} crossOrigin="anonymous" className="h-full min-h-[320px] w-full object-cover" />
              <div className="flex flex-col justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#675F56]">{product?.collection ?? 'Collection'}</p>
                  <h3 className="mt-2 font-['Playfair_Display'] text-3xl font-light">{product?.name ?? 'Mojri'}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#675F56]">{product?.description ?? ''}</p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</p>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#675F56]">{product?.materials?.[0] ?? 'Hand-finished leather'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addItem(product as Product, product?.sizes?.[0] ?? 'UK 8')} className="inline-flex items-center gap-2 bg-[#A94720] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white hover:bg-[#843616]">
                      Quick Add
                    </button>
                    <button onClick={() => navigate(`/product/${product?.slug ?? ''}`)} className="inline-flex items-center gap-2 border border-[#D8CCB9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1A1A1A]">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <aside className="border border-[#D8CCB9] bg-[#F5F1E9] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Craft notes</p>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#1A1A1A]">
          <p>{editorial?.manifesto ?? 'Each pair is shaped through a slow sequence of cutting, embroidery, and finishing, preserving the tactile irregularity that marks true handwork.'}</p>
          <div className="flex items-center gap-2 text-[#A94720]"><Shield className="h-4 w-4" /><span>Authenticity verified</span></div>
          <div className="flex items-center gap-2 text-[#A94720]"><Truck className="h-4 w-4" /><span>India-wide delivery</span></div>
          <div className="flex items-center gap-2 text-[#A94720]"><CheckCircle2 className="h-4 w-4" /><span>Easy size exchange support</span></div>
        </div>
      </aside>
    </section>
  );
}

export function CheckoutExperience({ className = '' }: SectionProps) {
  const latest = reviews?.[0];
  return (
    <section className={cn('grid gap-6 bg-[#1A1A1A] px-5 py-10 text-white md:grid-cols-[0.9fr_1.1fr] md:px-10 lg:px-16', className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D8CCB9]">Checkout confidence</p>
        <h2 className="mt-3 font-['Playfair_Display'] text-4xl font-light">Validated shipping, secure payment, calm completion.</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#D8CCB9]">Cart, address, and payment overlays are designed for fast Indian checkout flows with clear validation and discreet feedback.</p>
      </div>
      <div className="grid gap-4">
        <div className="border border-white/15 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D8CCB9]">Payment methods</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.28em]">
            {['Card', 'UPI', 'COD'].map((m) => <span key={m} className="border border-white/15 px-3 py-2">{m}</span>)}
          </div>
        </div>
        <div className="border border-white/15 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D8CCB9]">Recent review</p>
          <p className="mt-3 text-sm leading-7">{latest?.body ?? 'The finish, fit, and packaging feel unmistakably premium.'}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.28em] text-[#D8CCB9]">{latest?.author ?? 'Verified customer'}</p>
        </div>
      </div>
    </section>
  );
}

export function ArtisanExperience({ className = '' }: SectionProps) {
  const artisan = artisans?.[0];
  return (
    <section className={cn('grid gap-6 px-5 md:grid-cols-[1fr_0.9fr] md:px-10 lg:px-16', className)}>
      <img src={artisan?.image ?? products?.[0]?.image ?? ''} alt={artisan?.name ?? 'Artisan'} crossOrigin="anonymous" className="h-[70vh] w-full object-cover" />
      <div className="flex flex-col justify-between border border-[#D8CCB9] bg-[#FAF9F6] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#675F56]">Artisan portrait</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-4xl font-light">{artisan?.name ?? 'Master artisan'}</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#675F56]">{artisan?.title ?? 'Jodhpur craft lineage'}</p>
          <p className="mt-5 text-sm leading-7 text-[#1A1A1A]">{artisan?.story ?? 'A generational workshop practice where every stitch is guided by touch, memory, and exacting proportion.'}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {(artisan?.specialties ?? ['Embroidery', 'Leather finishing', 'Hand-cut uppers']).map((s) => <span key={s} className="border border-[#D8CCB9] px-3 py-2 text-xs uppercase tracking-[0.28em] text-[#1A1A1A]">{s}</span>)}
        </div>
      </div>
    </section>
  );
}

export default HomeEditorial;