import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/products");
        const json = (await res.json()) as { success?: boolean; data?: Product[] };
        if (active && json?.success && Array.isArray(json?.data)) setProducts(json.data);
      } catch {}
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => products.filter((p) => p?.featured ?? false).slice(0, 6), [products]);

  const heroImages = [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <main className="bg-[#FAF7F0] text-[#2B2B2B]">
      <section className="min-h-[100svh] border-b border-[#D8CCB8]">
        <div className="grid min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex items-end overflow-hidden bg-[#0a0a0a]">
            <img src={heroImages[0]} alt="Jootiya heritage lookbook" crossOrigin="anonymous" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/10" />
            <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F4E7D0]">Jodhpur Heritage Footwear</p>
              <h1 className="max-w-xl font-['Playfair_Display'] text-5xl font-light leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Mojris shaped by craft, ceremony, and time.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
                Authentic Jodhpuri silhouettes in warm ivory light, muted gold detail, and terracotta restraint—designed as an editorial storefront for the modern collector.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 border border-[#D8CCB8] bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#76562E]">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/editorial" className="inline-flex items-center gap-2 border border-[#D8CCB8] bg-[#FFFDF8]/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition-colors hover:bg-white">
                  Artisan Journal
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-3 gap-0 border-t border-[#D8CCB8] lg:border-t-0 lg:border-l">
            {heroImages.slice(1).map((src, i) => (
              <div key={src} className={cn("relative overflow-hidden border-b border-[#D8CCB8]", i === 1 && "border-b-0")}>
                <img src={src} alt={`Heritage detail ${i + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CCB8] bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Featured Drop</p>
              <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">A masonry ribbon of signature pairs.</h2>
            </div>
            <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257] transition-colors hover:text-[#2B2B2B] sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
            {(featured.length > 0 ? featured : products.slice(0, 6)).map((product) => (
              <div key={product?.id ?? product?.slug} className="mb-4 break-inside-avoid">
                <ProductCard product={product} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CCB8] bg-[#FAF7F0]">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-[#D8CCB8] p-6 sm:p-10 lg:border-b-0 lg:border-r">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">
              <Leaf className="h-4 w-4" /> Atelier Manifesto
            </p>
            <h2 className="max-w-md font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">
              Crafted in dialogue with the desert, the workshop, and the wearer.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6D6257] sm:text-base">
              Each pair is selected for its hand-finished embroidery, supple leather, and ceremonial balance. The result is a wardrobe object that feels intimate, enduring, and unmistakably Jodhpur.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Hand-finished uppers", "Muted-gold hardware", "Heritage silhouettes", "Limited seasonal releases"].map((item) => (
                <div key={item} className="border border-[#D8CCB8] bg-[#FFFDF8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="relative min-h-[320px] border-b border-[#D8CCB8] sm:border-b-0 sm:border-r">
              <img src={heroImages[1]} alt="Artisan detail" crossOrigin="anonymous" className="h-full w-full object-cover" />
            </div>
            <div className="flex min-h-[320px] flex-col justify-between bg-[#FFFDF8] p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Bodoni Moda Accent</p>
                <p className="mt-4 font-['Playfair_Display'] text-2xl font-light leading-tight">A restrained luxury language with tactile warmth.</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6D6257]">
                <Sparkles className="h-4 w-4 text-[#9A7440]" />
                <span>Scroll reveals, hover lift, and quiet editorial pacing.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D8CCB8] bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border border-[#D8CCB8] bg-[#FAF7F0] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Journal</p>
              <h3 className="mt-3 font-['Playfair_Display'] text-2xl font-light">Notes from the workshop floor.</h3>
              <p className="mt-4 text-sm leading-7 text-[#6D6257]">Stories of craft, provenance, and the rituals that shape each pair before it reaches the wardrobe.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[heroImages[2], heroImages[0]].map((src, idx) => (
                <motion.div key={src} whileHover={{ y: -4 }} className="overflow-hidden border border-[#D8CCB8] bg-[#FFFDF8]">
                  <img src={src} alt={`Journal panel ${idx + 1}`} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7440]">Editorial Note</p>
                    <p className="mt-2 text-sm leading-7 text-[#6D6257]">A study in texture, silhouette, and the quiet confidence of handwork.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF7F0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Newsletter</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">Receive the next drop, first.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D6257]">Private access to new arrivals, artisan stories, and seasonal releases from the Jootiya atelier.</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 border border-[#D8CCB8] bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#76562E]">
            Shop Latest Drop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)} />
    </main>
  );
}

export default Home;