import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { products } from '@/data/mockData';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export interface HomeProps {
  className?: string;
}

export function Home({ className = '' }: HomeProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featured = useMemo<Product[]>(() => {
    return products.filter(p => p.featured).slice(0, 4);
  }, []);

  const heroProduct = useMemo<Product | undefined>(() => featured[0] ?? products[0], [featured]);

  const previewGrid = useMemo<Product[]>(() => {
    return products.slice(0, 6);
  }, []);

  const handleExplore = () => {
    navigate('/shop');
  };

  const handleExploreProduct = (id: string) => {
    navigate(`/shop?productId=${encodeURIComponent(id)}`);
  };

  return (
    <div className={cn('bg-[#F9F6F2] min-h-screen', className)}>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 space-y-20">
        <section className="grid gap-6 md:grid-cols-[3fr,2fr]">
          <div className="relative overflow-hidden rounded-[16px] bg-white">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85"
                alt="Editorial footwear lookbook"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="relative flex h-full flex-col justify-between bg-gradient-to-tr from-black/60 via-black/20 to-transparent p-8 text-white">
              <div className="max-w-xl space-y-4">
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#F9F6F2]/80">
                  Jootiya / Seasonal Edit
                </p>
                <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl tracking-tight">
                  The Architectural Heel Collection
                </h1>
                <p className="mt-3 max-w-md font-['Lora'] text-sm md:text-base text-[#F9F6F2]/80">
                  Sculptural lines, quiet leather, and silhouettes that move from gallery to midnight effortlessly.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleExplore}
                  className="inline-flex items-center gap-2 rounded-md bg-[#BFA06A] px-6 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-black transition-colors hover:bg-[#A88955]"
                >
                  Explore collection
                  <ArrowRight className="h-4 w-4" />
                </button>
                {heroProduct && (
                  <button
                    type="button"
                    onClick={() => handleExploreProduct(heroProduct.id)}
                    className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#F9F6F2]/80 hover:text-white"
                  >
                    View featured pair
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative flex-1 overflow-hidden rounded-[16px] bg-white">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
                alt="Minimalist interior with shoes"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#F9F6F2]/80">
                    Atelier Series
                  </p>
                  <p className="font-['Playfair_Display'] text-xl text-white">
                    Hand-finished in Napoli
                  </p>
                </div>
                <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#F9F6F2]/70">
                  Limited runs only
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-[16px] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
                  alt="Sneaker editorial closeup"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="overflow-hidden rounded-[16px] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                  alt="Heels on marble plinth"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6F675E]">
                Featured drops
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl tracking-tight text-[#2E2B28]">
                Curated introductions
              </h2>
            </div>
            <button
              type="button"
              onClick={handleExplore}
              className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#2E2B28] hover:text-[#A88955]"
            >
              Shop all
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {featured.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(prev => (prev === product.id ? null : prev))}
                className="min-w-[220px] max-w-xs flex-1"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6F675E]">
                The Jootiya edit
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl tracking-tight text-[#2E2B28]">
                A preview of the rooms
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
                {previewGrid.slice(0, 3).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {previewGrid.slice(3, 6).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;