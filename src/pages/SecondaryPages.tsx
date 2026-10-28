import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { CartDrawer } from '@/components/CartDrawer';
import { JourneySections } from '@/components/JourneySections';
import { cn } from '@/lib/utils';
import type { Artisan, Product } from '@/types';

type PageKey = 'product' | 'cart' | 'checkout' | 'artisans' | 'artisan' | 'custom-order' | 'login' | 'not-found';

const assetUrls = [
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
];

const sampleProducts: Product[] = [
  {
    id: 'p1',
    slug: 'marwar-heritage-mojri',
    name: 'Marwar Heritage Mojri',
    category: 'Heritage',
    gender: 'Men',
    price: 4990,
    compareAtPrice: 6490,
    description: 'Hand-finished Jodhpuri mojri in supple leather with tonal embroidery and a refined almond toe.',
    artisan: 'Bhanwar Singh',
    material: 'Vegetable-tanned leather',
    color: 'Sandstone',
    sizes: ['6', '7', '8', '9', '10'],
    image: assetUrls[0] ?? '',
    gallery: [assetUrls[1] ?? '', assetUrls[2] ?? ''],
    rating: 4.8,
    reviewCount: 128,
    availability: 'in_stock',
    featured: true,
    newArrival: false,
    handcrafted: true,
    stock: 12,
    tags: ['handcrafted', 'heritage'],
  },
  {
    id: 'p2',
    slug: 'terracotta-wedding-jutti',
    name: 'Terracotta Wedding Jutti',
    category: 'Wedding',
    gender: 'Women',
    price: 6890,
    description: 'Ceremonial jutti with zari detailing, cushioned lining, and a luminous terracotta finish.',
    artisan: 'Asha Devi',
    material: 'Silk thread, leather',
    color: 'Terracotta',
    sizes: ['5', '6', '7', '8'],
    image: assetUrls[1] ?? '',
    gallery: [assetUrls[3] ?? '', assetUrls[4] ?? ''],
    rating: 4.9,
    reviewCount: 84,
    availability: 'low_stock',
    featured: true,
    newArrival: true,
    handcrafted: true,
    stock: 4,
    tags: ['wedding', 'limited'],
  },
];

const sampleArtisans: Artisan[] = [
  {
    id: 'a1',
    name: 'Bhanwar Singh',
    location: 'Jodhpur, Rajasthan',
    specialty: 'Hand-stitched men’s mojris',
    story: 'A third-generation craftsman shaping formal mojris with precise hand-stitching and a disciplined silhouette.',
    portrait: assetUrls[2] ?? '',
    yearsActive: 28,
    signature: ['Almond toe', 'Mirror stitch'],
  },
  {
    id: 'a2',
    name: 'Asha Devi',
    location: 'Jodhpur, Rajasthan',
    specialty: 'Wedding juttis',
    story: 'Known for ceremonial pairs that balance ornament with comfort, built for long celebrations and heirloom keeping.',
    portrait: assetUrls[3] ?? '',
    yearsActive: 19,
    signature: ['Zari', 'Silk thread'],
  },
];

function Shell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 border-b border-[#CDBB9B] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6E6258]">{eyebrow}</p>
        <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight text-[#2E2B28] sm:text-5xl">{title}</h1>
      </div>
      {children}
    </section>
  );
}

function ProductPage() {
  const product = sampleProducts[0] ?? null;
  return (
    <Shell title={product?.name ?? 'Product'} eyebrow="Editorial product detail">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-md border border-[#CDBB9B] bg-[#FFFDF9]">
          <img
            src={product?.image ?? assetUrls[0] ?? ''}
            alt={product?.name ?? 'Product image'}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">
            <Star className="h-4 w-4 text-[#C1440E]" />
            <span>{product?.category ?? 'Heritage'}</span>
          </div>
          <p className="text-sm leading-7 text-[#6E6258]">{product?.description ?? ''}</p>
          <div className="flex items-center justify-between border-t border-[#CDBB9B] pt-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#6E6258]">Price</p>
              <p className="font-['Bodoni_Moda'] text-3xl text-[#2E2B28]">₹{product?.price?.toLocaleString('en-IN') ?? '0'}</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-md bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#963308]">
              Add to cart
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CartPage() {
  return (
    <Shell title="Cart" eyebrow="Slide-over cart experience">
      <JourneySections />
    </Shell>
  );
}

function CheckoutPage() {
  return (
    <Shell title="Checkout" eyebrow="Secure order flow">
      <JourneySections />
    </Shell>
  );
}

function ArtisansPage() {
  return (
    <Shell title="Artisans" eyebrow="Craft lineage">
      <JourneySections />
    </Shell>
  );
}

function ArtisanPage() {
  const artisan = sampleArtisans[0] ?? null;
  return (
    <Shell title={artisan?.name ?? 'Artisan'} eyebrow="Artisan profile">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-md border border-[#CDBB9B] bg-[#FFFDF9]">
          <img
            src={artisan?.portrait ?? assetUrls[1] ?? ''}
            alt={artisan?.name ?? 'Artisan portrait'}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6E6258]">{artisan?.location ?? ''}</p>
          <p className="text-base leading-7 text-[#6E6258]">{artisan?.story ?? ''}</p>
          <div className="flex flex-wrap gap-2">
            {(artisan?.signature ?? []).map((item) => (
              <span key={item} className="rounded-sm border border-[#CDBB9B] px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2E2B28]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CustomOrderPage() {
  return (
    <Shell title="Custom Order" eyebrow="Bespoke request">
      <JourneySections />
    </Shell>
  );
}

function LoginPage() {
  const [open, setOpen] = useState(true);
  return (
    <Shell title="Login" eyebrow="Account access">
      <div className="flex items-start justify-start">
        <AuthModal open={open} onOpenChange={(next) => setOpen(next)} />
      </div>
    </Shell>
  );
}

function NotFoundPage() {
  return (
    <Shell title="Page not found" eyebrow="Editorial error">
      <div className="flex flex-col gap-4 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] p-6">
        <p className="text-sm leading-7 text-[#6E6258]">The requested section could not be located.</p>
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C1440E]">
          Return home
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Shell>
  );
}

function SecondaryPages() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const page = useMemo<PageKey>(() => {
    const path = location?.pathname ?? '';
    if (path.includes('/cart')) return 'cart';
    if (path.includes('/checkout')) return 'checkout';
    if (path.includes('/artisans/') && path !== '/artisans') return 'artisan';
    if (path.includes('/artisans')) return 'artisans';
    if (path.includes('/custom-order')) return 'custom-order';
    if (path.includes('/login')) return 'login';
    if (path.includes('/product/')) return 'product';
    return 'not-found';
  }, [location?.pathname]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
      <div className={cn('min-h-screen bg-[#F9F5F0] text-[#2E2B28]')}>
        {page === 'product' && <ProductPage />}
        {page === 'cart' && <CartPage />}
        {page === 'checkout' && <CheckoutPage />}
        {page === 'artisans' && <ArtisansPage />}
        {page === 'artisan' && <ArtisanPage />}
        {page === 'custom-order' && <CustomOrderPage />}
        {page === 'login' && <LoginPage />}
        {page === 'not-found' && <NotFoundPage />}
        <div className="fixed bottom-4 right-4 z-40 flex gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2E2B28] shadow-sm transition-colors hover:bg-white"
          >
            <Heart className="h-4 w-4 text-[#C1440E]" />
            Login
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#963308]"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
          </button>
        </div>
        <AuthModal open={authOpen} onOpenChange={(next) => setAuthOpen(next)} />
        <CartDrawer open={cartOpen} onOpenChange={(next) => setCartOpen(next)} />
      </div>
    </motion.div>
  );
}

export { ProductPage, CartPage, CheckoutPage, ArtisansPage, ArtisanPage, CustomOrderPage, LoginPage, NotFoundPage };
export default SecondaryPages;
export { SecondaryPages };
