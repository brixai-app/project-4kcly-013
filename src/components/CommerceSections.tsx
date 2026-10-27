import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Filter, Heart, ShoppingBag, Star, Truck, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { categories, heroSlides, products, artisans, shopSortOptions, verifiedImages } from '@/data/mockData';
import type { Artisan, Product, ProductFilters, ShopSortOption } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

type SectionProps = { className?: string };

export function HeroCarousel({ className = '' }: SectionProps) {
  const slide = heroSlides?.[0] ?? { title: 'Jootiya', subtitle: 'Authentic Jodhpuri Mojris', image: verifiedImages?.[0] ?? '' };
  return (
    <section className={cn('relative overflow-hidden border-b border-[#D8CDBB] bg-[#FAF9F6]', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[78vh] gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative flex items-end overflow-hidden">
            <img src={slide.image ?? verifiedImages?.[0] ?? ''} alt={slide.title ?? 'Editorial lookbook'} crossOrigin="anonymous" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-[#FAF9F6]/95 p-5 sm:p-7">
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9A7135]">
                <span className="h-px w-10 bg-[#9A7135]" />
                <span>Verified Craft</span>
                <span className="h-px w-10 bg-[#9A7135]" />
              </div>
              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="font-serif text-5xl font-light tracking-tight text-[#2B2B2B] sm:text-6xl lg:text-7xl">{slide.title ?? 'Jootiya'}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6E665C] sm:text-base">{slide.subtitle ?? 'Authentic Jodhpuri Mojris, hand-finished for ceremonial and everyday elegance.'}</p>
                </div>
                <a href="#shop" className="inline-flex items-center gap-2 border border-[#2B2B2B] bg-[#2B2B2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#9A7135] hover:text-black">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="grid gap-px bg-[#D8CDBB] lg:grid-rows-2">
            {[verifiedImages?.[1], verifiedImages?.[2]].map((src, i) => (
              <div key={String(src ?? i)} className="relative min-h-[38vh] overflow-hidden bg-white">
                <img src={src ?? verifiedImages?.[0] ?? ''} alt={`Editorial detail ${i + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 border border-white/30 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                  Chapter {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductMasonry({ className = '' }: SectionProps) {
  const items = products?.slice(0, 6) ?? [];
  return (
    <section id="shop" className={cn('mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8', className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9A7135]">New Drop</p>
          <h2 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">Masonry of hand-finished pairs</h2>
        </div>
        <a href="#filters" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C] sm:inline-flex">
          Refine <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
        {items.map((product, index) => (
          <div key={product.id} className="mb-4 break-inside-avoid">
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ShopFilters({ filters = { query: '', category: 'All', priceRange: [0, 99999], artisan: '', inStockOnly: false }, onChange = () => {}, sort = shopSortOptions?.[0] ?? { label: 'Featured', value: 'featured' }, onSortChange = () => {} }: { filters?: ProductFilters; onChange?: (next: ProductFilters) => void; sort?: ShopSortOption; onSortChange?: (next: ShopSortOption) => void }) {
  const cats = categories ?? ['All'];
  return (
    <aside id="filters" className="rounded-sm border border-[#D8CDBB] bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]"><Filter className="h-4 w-4" /> Filters</div>
      <div className="mt-4 flex flex-col gap-2.5">
        {cats.map((cat) => (
          <button key={cat} onClick={() => onChange({ ...filters, category: cat })} className={cn('min-w-0 truncate border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] transition', filters.category === cat ? 'border-[#2B2B2B] bg-[#2B2B2B] text-white' : 'border-[#D8CDBB] bg-white text-[#2B2B2B] hover:border-[#9A7135]')}>
            {cat}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2.5">
        {shopSortOptions?.map((opt) => (
          <button key={opt.value} onClick={() => onSortChange(opt)} className={cn('min-w-0 truncate border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] transition', sort.value === opt.value ? 'border-[#9A7135] bg-[#9A7135] text-black' : 'border-[#D8CDBB] bg-white text-[#2B2B2B] hover:border-[#9A7135]')}>
            {opt.label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export function ProductPurchasePanel({ product = null }: { product?: Product | null }) {
  const { addItem } = useCart();
  if (!product) return null;
  return (
    <section className="rounded-sm border border-[#D8CDBB] bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9A7135]">{product.category ?? 'Collection'}</p>
      <h3 className="mt-2 font-serif text-3xl font-light tracking-tight text-[#2B2B2B]">{product.name ?? 'Product'}</h3>
      <p className="mt-3 text-sm leading-6 text-[#6E665C]">{product.description ?? 'Hand-finished craftsmanship with a refined ceremonial silhouette.'}</p>
      <div className="mt-5 flex items-center justify-between border-y border-[#D8CDBB] py-4">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Price</span>
        <span className="font-serif text-2xl text-[#2B2B2B]">₹{product.price?.toLocaleString?.('en-IN') ?? product.price}</span>
      </div>
      <button onClick={() => { addItem(product, 1); toast.success('Added to cart'); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#2B2B2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#9A7135] hover:text-black">
        Add to Cart <ShoppingBag className="h-4 w-4" />
      </button>
    </section>
  );
}

export function ArtisanGrid({ className = '' }: SectionProps) {
  const list = artisans?.slice(0, 4) ?? [];
  return (
    <section className={cn('mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8', className)}>
      <div className="grid gap-4 lg:grid-cols-4">
        {list.map((artisan: Artisan) => (
          <div key={artisan.id} className="border border-[#D8CDBB] bg-white p-4">
            <img src={artisan.image ?? verifiedImages?.[3] ?? ''} alt={artisan.name ?? 'Artisan'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#9A7135]">{artisan.location ?? 'India'}</p>
            <h3 className="mt-2 font-serif text-2xl font-light text-[#2B2B2B]">{artisan.name ?? 'Artisan'}</h3>
            <p className="mt-2 text-sm text-[#6E665C]">{artisan.specialty ?? 'Handcrafted leatherwork'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CartView({ className = '' }: SectionProps) {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  return (
    <div className={cn('space-y-3', className)}>
      {items?.length ? items.map((item) => (
        <div key={`${item.productId}-${item.size ?? 'na'}`} className="flex items-center gap-3 border-b border-[#D8CDBB] pb-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#2B2B2B]">{item.product?.name ?? 'Product'}</p>
            <p className="text-xs text-[#6E665C]">Qty {item.quantity ?? 1}</p>
          </div>
          <button onClick={() => updateQuantity(item.productId, Math.max(0, (item.quantity ?? 1) - 1))} className="text-xs uppercase tracking-[0.22em] text-[#6E665C]">-</button>
          <button onClick={() => updateQuantity(item.productId, (item.quantity ?? 1) + 1)} className="text-xs uppercase tracking-[0.22em] text-[#6E665C]">+</button>
          <button onClick={() => removeItem(item.productId)} className="text-[#6E665C]"><X className="h-4 w-4" /></button>
        </div>
      )) : <p className="text-sm text-[#6E665C]">Your cart is empty.</p>}
      <div className="flex items-center justify-between pt-2 text-sm font-semibold text-[#2B2B2B]">
        <span>Subtotal</span><span>₹{subtotal?.toLocaleString?.('en-IN') ?? subtotal}</span>
      </div>
    </div>
  );
}

export function CheckoutForm({ className = '' }: SectionProps) {
  return <div className={cn('rounded-sm border border-[#D8CDBB] bg-white p-5', className)}><p className="text-sm text-[#6E665C]">Checkout form placeholder</p></div>;
}

export function ConfirmationSummary({ className = '' }: SectionProps) {
  return <div className={cn('rounded-sm border border-[#D8CDBB] bg-white p-5', className)}><p className="text-sm text-[#6E665C]">Confirmation summary placeholder</p></div>;
}

export function CartDrawer({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md border-l border-[#D8CDBB] bg-[#FAF9F6] p-5 shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-[#D8CDBB] pb-4">
            <Dialog.Title className="font-serif text-2xl font-light text-[#2B2B2B]">Cart</Dialog.Title>
            <Dialog.Close className="text-[#6E665C]"><X className="h-5 w-5" /></Dialog.Close>
          </div>
          <div className="mt-5"><CartView /></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const CommerceSections = {
  HeroCarousel,
  ProductMasonry,
  ShopFilters,
  ProductPurchasePanel,
  ArtisanGrid,
  CartView,
  CheckoutForm,
  ConfirmationSummary,
  CartDrawer,
};

export default CommerceSections;
export { CommerceSections };
