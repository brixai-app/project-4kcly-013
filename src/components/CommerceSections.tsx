import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Filter, Search, Sparkles, Truck, Shield, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import mockData from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import { useCart } from '@/context/CartContext';

type SectionProps = { className?: string };

const products = mockData?.products ?? [];
const artisans = mockData?.artisans ?? [];
const editorial = mockData?.editorialContent ?? {};
const categories = mockData?.categories ?? [];
const sizeOptions = mockData?.sizeOptions ?? [];
const sortOptions = mockData?.sortOptions ?? [];
const verifiedImages = mockData?.verifiedImages ?? [];

export function HomeSection({ className = '' }: SectionProps) {
  const heroImage = verifiedImages?.[3] ?? 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80';
  const featured = products?.filter((p) => p?.featured)?.slice(0, 4) ?? [];
  return (
    <section className={cn('bg-[#F9F5F0] text-[#2B2B2B]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-[#BFA6A0] bg-[#FFFDFC]">
          <img src={heroImage} alt="Jodhpur artisan workshop" crossOrigin="anonymous" className="h-[72vh] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/55 via-[#0a0a0a]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-xl border-r border-t border-[#BFA6A0] bg-[#FFFDFC]/95 p-6 backdrop-blur-sm sm:p-8">
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#6F625D]">
              <span className="h-px w-10 bg-[#D9381E]" />
              <span>{editorial?.heroKicker ?? 'Jodhpur craft ledger'}</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl font-light leading-none tracking-tight text-[#2B2B2B] sm:text-6xl">
              {editorial?.heroTitle ?? 'Authentic Mojris, hand-finished in Jodhpur.'}
            </h1>
            <p className="mt-4 max-w-lg font-['Lora'] text-sm leading-7 text-[#6F625D]">
              {editorial?.heroBody ?? 'A luxury storefront for heritage footwear shaped by patient stitching, vegetable-tanned leather, and ceremonial detail.'}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 border border-[#D9381E] bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#B92B17]">
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link to="/journey" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2B2B2B] underline decoration-[#BFA6A0] underline-offset-4">
                Artisan journey
              </Link>
            </div>
          </div>
          <div className="absolute right-4 top-4 hidden w-40 overflow-hidden border border-[#BFA6A0] bg-[#FFFDFC] shadow-sm lg:block">
            <img src={verifiedImages?.[1] ?? heroImage} alt="Mojri detail" crossOrigin="anonymous" className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => <ProductCard key={product?.id ?? product?.name} product={product} />)}
        </div>
      </div>
    </section>
  );
}

export function CatalogSection({ className = '' }: SectionProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('All');
  const [sort, setSort] = useState(sortOptions?.[0]?.value ?? 'featured');
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => products.filter((p) => {
    const matchesQuery = !query || `${p?.name ?? ''} ${p?.category ?? ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || p?.category === category;
    const matchesSize = size === 'All' || (p?.sizes ?? []).includes(size);
    return matchesQuery && matchesCategory && matchesSize;
  }).sort((a, b) => sort === 'price-asc' ? (a?.price ?? 0) - (b?.price ?? 0) : sort === 'price-desc' ? (b?.price ?? 0) - (a?.price ?? 0) : Number(Boolean(b?.featured)) - Number(Boolean(a?.featured))), [query, category, size, sort]);
  return (
    <section className={cn('bg-[#F9F5F0]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="min-w-0 border border-[#BFA6A0] bg-[#FFFDFC] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6F625D]"><Filter size={14} /> Refine</div>
            <div className="mt-4 flex flex-col gap-2.5">
              <label className="flex items-center gap-2 border border-[#BFA6A0] px-3 py-2">
                <Search size={14} className="shrink-0 text-[#6F625D]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mojris" className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-[#6F625D]" />
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[#BFA6A0] bg-transparent px-3 py-2 text-sm outline-none">
                <option>All</option>{categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="border border-[#BFA6A0] bg-transparent px-3 py-2 text-sm outline-none">
                <option>All</option>{sizeOptions.map((o) => <option key={o.value}>{o.label}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-[#BFA6A0] bg-transparent px-3 py-2 text-sm outline-none">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </aside>
          <div className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#6F625D]">Catalog</p>
                <h2 className="font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Curated silhouettes</h2>
              </div>
              <div className="hidden text-xs uppercase tracking-[0.25em] text-[#6F625D] sm:block">{filtered.length} pieces</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => <ProductCard key={product?.id ?? product?.name} product={product} onPreview={setSelected} />)}
            </div>
          </div>
        </div>
      </div>
      <ProductDetailModal product={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </section>
  );
}

export function ProductSection({ className = '' }: SectionProps) {
  const spotlight = products?.[0] ?? null;
  return <section className={cn('bg-[#FFFDFC] py-10', className)}>{spotlight ? <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><ProductCard product={spotlight} /></div> : null}</section>;
}

export function ArtisanSection({ className = '' }: SectionProps) {
  return (
    <section className={cn('bg-[#F9F5F0]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-[#BFA6A0] bg-[#FFFDFC] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#6F625D]">Artisans</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Hands that preserve the line.</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {artisans.slice(0, 2).map((artisan) => (
                <div key={artisan?.id} className="border-t border-[#BFA6A0] pt-4">
                  <img src={artisan?.portrait ?? verifiedImages?.[4] ?? ''} alt={artisan?.name ?? 'Artisan'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
                  <h3 className="mt-3 font-['Playfair_Display'] text-xl text-[#2B2B2B]">{artisan?.name ?? ''}</h3>
                  <p className="text-sm text-[#6F625D]">{artisan?.location ?? ''} · {artisan?.specialty ?? ''}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-[#BFA6A0] bg-[#FFFDFC] p-6">
            <img src={verifiedImages?.[5] ?? 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'} alt="Artisan portrait" crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-4 text-sm leading-7 text-[#6F625D]">{editorial?.artisanBody ?? 'Each pair is shaped through a measured sequence of cutting, embroidery, and finishing that keeps the craft alive.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CheckoutSection({ className = '' }: SectionProps) {
  const { cartItems } = useCart();
  return (
    <section className={cn('bg-[#FFFDFC] py-10', className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border border-[#BFA6A0] p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6F625D]"><Shield size={14} /> Secure checkout</div>
          <p className="mt-3 text-sm leading-7 text-[#6F625D]">Your order is protected with validated shipping details and local cart persistence.</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-[#2B2B2B]"><Truck size={16} /> {cartItems?.length ?? 0} items ready for dispatch</div>
        </div>
      </div>
    </section>
  );
}

export function CustomOrderSection({ className = '' }: SectionProps) {
  const submit = () => toast.success('Custom order request sent');
  return (
    <section className={cn('bg-[#F9F5F0] py-10', className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border border-[#BFA6A0] bg-[#FFFDFC] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#6F625D]">Custom order</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Made for the occasion.</h2>
            <p className="mt-3 text-sm leading-7 text-[#6F625D]">Share your size, palette, and event details. We will respond with a tailored craft proposal.</p>
            <button onClick={() => submit()} className="mt-6 inline-flex items-center gap-2 border border-[#D9381E] bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#B92B17]">
              Request consultation <ArrowRight size={16} />
            </button>
          </div>
          <div className="border border-[#BFA6A0] bg-[#FFFDFC] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[#BFA6A0] p-4"><Sparkles size={16} className="text-[#D9381E]" /><p className="mt-2 text-sm text-[#6F625D]">Bespoke embroidery</p></div>
              <div className="border border-[#BFA6A0] p-4"><Leaf size={16} className="text-[#D9381E]" /><p className="mt-2 text-sm text-[#6F625D]">Vegetable-tanned leather</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sections = { home: HomeSection, catalog: CatalogSection, product: ProductSection, artisan: ArtisanSection, checkout: CheckoutSection, customOrder: CustomOrderSection };
export function CommerceSections() { return null; }
export default sections;
export { sections };
