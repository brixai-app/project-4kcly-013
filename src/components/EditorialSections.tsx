import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Heart, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import mockData from '@/data/mockData';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

type SectionProps = { className?: string };

const slides = mockData?.heroSlides ?? [];
const products = mockData?.products ?? [];
const artisans = mockData?.artisans ?? [];

function SectionShell({ children, className = '' }: React.PropsWithChildren<SectionProps>) {
  return <section className={cn('px-4 sm:px-6 lg:px-8', className)}>{children}</section>;
}

export function HeroSlider({ className = '' }: SectionProps) {
  const [active, setActive] = useState(0);
  const slide = slides?.[active % Math.max(slides.length, 1)] ?? {
    imageUrl: products?.[0]?.imageUrl ?? 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    title: 'Handcrafted Mojris from Jodhpur',
    subtitle: 'Ivory light, leather warmth, and ceremonial detail.',
  };
  return (
    <SectionShell className={cn('pt-4', className)}>
      <div className="relative overflow-hidden border border-[#CFC2B2] bg-[#FFFDF7]">
        <div className="grid min-h-[88vh] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex items-end p-6 sm:p-10 lg:p-14">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/55 via-[#0a0a0a]/10 to-transparent" />
            <img src={slide?.imageUrl ?? ''} alt={slide?.title ?? 'Hero slide'} crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative z-10 max-w-2xl text-[#FFFDF7]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#F5F1EB]/90">Jootiya / Atelier Lookbook</p>
              <h1 className="font-['Playfair_Display'] text-5xl font-light leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">{slide?.title ?? 'Handcrafted Mojris from Jodhpur'}</h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-[#F5F1EB]/90 sm:text-base">{slide?.subtitle ?? 'Ivory light, leather warmth, and ceremonial detail.'}</p>
              <div className="mt-8 flex items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 border border-[#FFFDF7] bg-[#E07A5F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#C85F45]">
                  Explore Collection <ArrowRight size={16} />
                </Link>
                <button onClick={() => setActive((p) => (p + 1) % Math.max(slides.length, 1))} className="inline-flex items-center gap-2 border border-[#FFFDF7]/70 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#FFFDF7] transition hover:bg-[#FFFDF7]/10">
                  Next Chapter <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between border-t border-[#CFC2B2] bg-[#F5F1EB] p-6 sm:p-10 lg:border-t-0 lg:border-l">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Chapter Index</p>
              <div className="flex flex-col gap-2.5">
                {(slides ?? []).map((s: any, i: number) => (
                  <button key={s?.title ?? i} onClick={() => setActive(i)} className={cn('flex min-w-0 items-center justify-between border px-4 py-3 text-left transition', i === active ? 'border-[#2B2B2B] bg-[#FFFDF7]' : 'border-[#CFC2B2] bg-transparent hover:bg-[#FFFDF7]')}>
                    <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">{s?.title ?? `Slide ${i + 1}`}</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-[#CFC2B2] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Craft Notes</p>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#2B2B2B]">{slide?.subtitle ?? 'A tactile edit of ceremonial silhouettes, hand-finished seams, and quiet luxury.'}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function FeaturedGallery({ className = '' }: SectionProps) {
  const featured = useMemo(() => products?.filter((p: Product) => p?.featured || p?.newArrival)?.slice(0, 5) ?? [], []);
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 md:grid-cols-12">
        {featured.map((product, index) => (
          <div key={product?.id ?? index} className={cn('md:col-span-4', index === 0 ? 'md:col-span-7' : index === 3 ? 'md:col-span-5' : 'md:col-span-4')}>
            <ProductCard product={product} priority={index === 0} />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ArtisanStoryTeaser({ className = '' }: SectionProps) {
  const artisan = artisans?.[0] ?? {};
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-[#CFC2B2] bg-[#FFFDF7] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Artisan Story</p>
          <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">{artisan?.name ?? 'Master artisan'}</h2>
          <p className="mt-3 text-sm uppercase tracking-[0.28em] text-[#6F655C]">{artisan?.location ?? 'Jodhpur, Rajasthan'}</p>
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#2B2B2B]">{artisan?.story ?? 'Each pair is shaped by hand, burnished to a soft sheen, and finished with the patience of a family workshop.'}</p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">
            Meet the collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-hidden border border-[#CFC2B2] bg-[#FFFDF7]">
          <img src={artisan?.portraitUrl ?? products?.[1]?.imageUrl ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'} alt={artisan?.name ?? 'Artisan portrait'} crossOrigin="anonymous" className="h-full w-full object-cover" />
        </div>
      </div>
    </SectionShell>
  );
}

export function CatalogWorkspace({ className = '' }: SectionProps) {
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border border-[#CFC2B2] bg-[#FFFDF7] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Catalog Workspace</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {(mockData?.categoryEdits ?? []).slice(0, 5).map((group: any) => (
              <div key={group?.key ?? group?.label} className="border border-[#CFC2B2] p-3">
                <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">{group?.label ?? 'Filter'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(group?.options ?? []).slice(0, 4).map((opt: any) => (
                    <button key={opt?.value ?? opt?.label} className="border border-[#CFC2B2] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:bg-[#F5F1EB]">
                      <span className="min-w-0 truncate">{opt?.label ?? 'Option'}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products?.slice(0, 6).map((product: Product, index: number) => (
            <ProductCard key={product?.id ?? index} product={product} priority={index < 2} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function ProductExperience({ className = '' }: SectionProps) {
  const navigate = useNavigate();
  const { addItem } = useCart() as any;
  const product = products?.[0];
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden border border-[#CFC2B2] bg-[#FFFDF7]">
          <img src={product?.gallery?.[0] ?? product?.imageUrl ?? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'} alt={product?.name ?? 'Featured product'} crossOrigin="anonymous" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-between border border-[#CFC2B2] bg-[#FFFDF7] p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Product Experience</p>
            <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">{product?.name ?? 'Signature Mojri'}</h2>
            <p className="mt-3 text-sm leading-6 text-[#2B2B2B]">{product?.description ?? 'A refined silhouette with hand-stitched edges, supple lining, and a ceremonial finish.'}</p>
            <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#2B2B2B]">
              <span>₹{product?.price?.toLocaleString?.() ?? '0'}</span>
              {product?.originalPrice ? <span className="text-[#6F655C] line-through">₹{product?.originalPrice?.toLocaleString?.() ?? '0'}</span> : null}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => { addItem?.(product, 1); toast.success('Added to cart'); }} className="inline-flex items-center gap-2 border border-[#E07A5F] bg-[#E07A5F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#C85F45]">
              <ShoppingBag size={16} /> Quick Add
            </button>
            <button onClick={() => navigate('/shop')} className="inline-flex items-center gap-2 border border-[#CFC2B2] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:bg-[#F5F1EB]">
              View Shop <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function CheckoutExperience({ className = '' }: SectionProps) {
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#CFC2B2] bg-[#FFFDF7] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Checkout Experience</p>
          <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">Seamless, tactile, and quietly assured.</h2>
          <div className="mt-6 space-y-4 text-sm text-[#2B2B2B]">
            <div className="flex items-start gap-3"><Truck size={18} className="mt-0.5 shrink-0 text-[#E07A5F]" /><p>Careful packing and tracked dispatch for every handcrafted pair.</p></div>
            <div className="flex items-start gap-3"><Heart size={18} className="mt-0.5 shrink-0 text-[#E07A5F]" /><p>Local cart persistence keeps your selections intact between visits.</p></div>
            <div className="flex items-start gap-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-[#E07A5F]" /><p>Custom requests are welcomed with validation and direct confirmation.</p></div>
          </div>
        </div>
        <div className="border border-[#CFC2B2] bg-[#F5F1EB] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Order Flow</p>
          <div className="mt-5 flex flex-col gap-3">
            {['Add to cart', 'Review details', 'Submit request', 'Receive confirmation'].map((step, i) => (
              <div key={step} className="flex items-center gap-3 border border-[#CFC2B2] bg-[#FFFDF7] px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center border border-[#CFC2B2] text-xs font-semibold">{i + 1}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function ArtisanProfiles({ className = '' }: SectionProps) {
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="grid gap-4 md:grid-cols-3">
        {(artisans ?? []).slice(0, 3).map((artisan: any, index: number) => (
          <div key={artisan?.id ?? index} className="border border-[#CFC2B2] bg-[#FFFDF7] p-5">
            <img src={artisan?.portraitUrl ?? products?.[index]?.imageUrl ?? 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'} alt={artisan?.name ?? 'Artisan'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            <h3 className="mt-4 font-['Playfair_Display'] text-2xl font-light text-[#2B2B2B]">{artisan?.name ?? 'Artisan'}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[#6F655C]">{artisan?.location ?? 'Jodhpur'}</p>
            <p className="mt-3 text-sm leading-6 text-[#2B2B2B]">{artisan?.specialty ?? artisan?.story ?? 'Hand-finished craftsmanship with a quiet, exacting eye.'}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function CustomOrderExperience({ className = '' }: SectionProps) {
  return (
    <SectionShell className={cn('py-8 sm:py-12', className)}>
      <div className="border border-[#CFC2B2] bg-[#FFFDF7] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F655C]">Custom Order Experience</p>
            <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">Commission a pair for a ceremony, wedding, or private edit.</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 border border-[#E07A5F] bg-[#E07A5F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#C85F45]">
            Start Request <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

const sectionRegistry = {
  HeroSlider,
  FeaturedGallery,
  ArtisanStoryTeaser,
  CatalogWorkspace,
  ProductExperience,
  CheckoutExperience,
  ArtisanProfiles,
  CustomOrderExperience,
};

export default sectionRegistry;
export { sectionRegistry };
