import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HomeEditorial, ArtisanStoriesView } from '@/components/JourneyViews';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { featuredProducts, mockData } from '@/data/mockData';
import type { Product } from '@/types';

export function Home() {
  const [activeProduct, setActiveProduct] = React.useState<Product | null>(null);
  const featured = (featuredProducts ?? mockData?.products ?? []).slice(0, 4);

  return (
    <main className="bg-[#F7F0E4] text-[#2B1715]">
      <HomeEditorial />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#765F55]">Featured drop</p>
            <h2 className="mt-2 font-serif text-3xl font-light tracking-tight sm:text-4xl">Hand-finished pairs with a quiet, ceremonial presence.</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#741F2B]">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <button key={product.id} type="button" className="text-left" onClick={() => setActiveProduct(product)}>
              <ProductCard product={product} />
            </button>
          ))}
        </div>
      </section>
      <ArtisanStoriesView />
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 border border-[#CDBB9F] bg-[#FFFDF8] p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#741F2B]">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">Newsletter</p>
            </div>
            <h3 className="mt-3 font-serif text-3xl font-light tracking-tight">Receive the next atelier release and private restocks.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#765F55]">A restrained note from Jootiya: new silhouettes, artisan stories, and first access to limited bridal and occasion pairs.</p>
          </div>
          <form className="flex flex-col gap-3 self-end">
            <input type="email" placeholder="Email address" className="h-12 w-full border border-[#CDBB9F] bg-transparent px-4 text-sm outline-none placeholder:text-[#765F55]" />
            <button type="submit" className="inline-flex h-12 items-center justify-center bg-[#741F2B] px-5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#57151F]">
              Join the list
            </button>
          </form>
        </div>
      </section>
      <ProductDetailModal open={Boolean(activeProduct)} onOpenChange={(open) => !open && setActiveProduct(null)} product={activeProduct} />
    </main>
  );
}

export default Home;