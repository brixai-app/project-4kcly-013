import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ShoppingBag, Sparkles, Truck, Shield, Star, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import mockData, { artisans, editorial, products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import type { Artisan, Product } from "@/types";

const img = (src?: string) => src ?? "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80";

export function HomeHero({ className = "" }: { className?: string } = {}) {
  const hero = editorial?.[0] ?? { title: "Jootiya", subtitle: "Jodhpuri Mojris", image: img(products?.[0]?.image) };
  return (
    <section className={cn("relative overflow-hidden bg-[#F9F5F0]", className)}>
      <div className="grid min-h-[88vh] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[56vh] lg:min-h-[88vh]">
          <img src={img(hero?.image)} alt={hero?.title ?? "Editorial hero"} crossOrigin="anonymous" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
        </div>
        <div className="relative flex items-end bg-[#FFFDFC] px-5 py-8 sm:px-8 lg:px-10">
          <div className="max-w-xl border border-[#D8CBBB] bg-[#FFFDFC] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:p-8 lg:-ml-24">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6259]">01 / Atelier Collection</p>
            <h1 className="mt-4 font-['Bodoni_Moda',serif] text-5xl font-light tracking-tight text-[#2B2B2B] sm:text-6xl lg:text-7xl">
              {hero?.title ?? "Jootiya"}
            </h1>
            <p className="mt-4 max-w-md font-['Inter',sans-serif] text-sm leading-7 text-[#6D6259]">
              {hero?.subtitle ?? "Authentic Jodhpuri Mojris shaped by heritage craft, tactile borders, and a quiet modernity."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 border border-[#BFA06E] bg-[#BFA06E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#A88650]">
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs uppercase tracking-[0.3em] text-[#6D6259]">Hand-finished in Rajasthan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedMasonry({ className = "" }: { className?: string } = {}) {
  const featured = (products ?? []).filter((p) => p?.featured).slice(0, 4);
  return (
    <section className={cn("bg-[#F9F5F0] px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6259]">02 / Featured Edit</p>
            <h2 className="mt-2 font-['Bodoni_Moda',serif] text-3xl font-light text-[#2B2B2B] sm:text-4xl">Masonry of craft and silhouette</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] sm:inline-flex">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {featured.map((product, index) => (
            <div key={product?.id} className={cn("lg:col-span-6", index === 0 && "lg:col-span-7", index === 3 && "lg:col-span-5")}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArtisanCarousel({ className = "" }: { className?: string } = {}) {
  return (
    <section className={cn("bg-[#111111] px-4 py-14 text-white sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">03 / Artisan Voices</p>
            <h2 className="mt-2 font-['Bodoni_Moda',serif] text-3xl font-light sm:text-4xl">The hands behind the pair</h2>
          </div>
          <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/60 sm:flex"><Sparkles className="h-4 w-4" /> Provenance</div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {(artisans ?? []).map((artisan: Artisan) => (
            <article key={artisan?.id} className="min-w-[280px] max-w-[320px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <img src={img(artisan?.image)} alt={artisan?.name ?? "Artisan"} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">{artisan?.location ?? "Rajasthan"}</p>
                <h3 className="mt-2 font-['Bodoni_Moda',serif] text-2xl font-light">{artisan?.name ?? "Artisan"}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{artisan?.bio ?? ""}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CatalogControlsGrid({ className = "" }: { className?: string } = {}) {
  const { addItem } = useCart();
  return (
    <section className={cn("bg-[#F9F5F0] px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border border-[#D8CBBB] bg-[#FFFDFC] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6259]">04 / Filters</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {(mockData?.categories ?? []).map((category: string) => (
              <button key={category} className="min-w-0 border border-[#D8CBBB] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:border-[#BFA06E] hover:bg-[#F9F5F0]">
                <span className="block truncate">{category}</span>
              </button>
            ))}
          </div>
        </aside>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(products ?? []).slice(0, 6).map((product: Product) => (
            <div key={product?.id} className="group relative">
              <ProductCard product={product} />
              <button
                onClick={() => {
                  addItem?.(product?.id ?? "");
                  toast.success("Added to cart");
                }}
                className="absolute bottom-4 left-4 right-4 translate-y-2 border border-[#BFA06E] bg-[#BFA06E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                Quick Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductPageComposition({ className = "" }: { className?: string } = {}) {
  return <div className={cn("bg-[#F9F5F0]", className)}><CatalogControlsGrid /></div>;
}

export function CheckoutJourney({ className = "" }: { className?: string } = {}) {
  return (
    <section className={cn("bg-[#FFFDFC] px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#D8CBBB] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6259]">05 / Checkout Journey</p>
          <h2 className="mt-3 font-['Bodoni_Moda',serif] text-3xl font-light text-[#2B2B2B]">A calm ledger from cart to confirmation</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShoppingBag, title: "Cart", text: "Review sizes, colors, and quantities." },
              { icon: Truck, title: "Shipping", text: "Enter delivery details with ease." },
              { icon: Shield, title: "Payment", text: "Mocked secure flow with clear status." },
            ].map((step) => (
              <div key={step.title} className="border border-[#D8CBBB] p-4">
                <step.icon className="h-5 w-5 text-[#BFA06E]" />
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6D6259]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[#D8CBBB] bg-[#111111] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Order Review</p>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>₹0</span></div>
            <div className="flex items-center justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-white"><span>Total</span><span>₹0</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ArtisanStories({ className = "" }: { className?: string } = {}) {
  return (
    <section className={cn("bg-[#F9F5F0] px-4 py-14 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#D8CBBB] bg-[#FFFDFC] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6259]">06 / Artisan Stories</p>
          <h2 className="mt-3 font-['Bodoni_Moda',serif] text-3xl font-light text-[#2B2B2B]">From workshop to wardrobe</h2>
          <p className="mt-4 text-sm leading-7 text-[#6D6259]">Each pair is shaped through patient cutting, hand-stitching, and finishing that honors the rhythm of Jodhpur craft.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(artisans ?? []).slice(0, 2).map((artisan) => (
            <article key={artisan?.id} className="border border-[#D8CBBB] bg-[#FFFDFC] p-4">
              <img src={img(artisan?.image)} alt={artisan?.name ?? "Artisan story"} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
              <h3 className="mt-4 font-['Bodoni_Moda',serif] text-2xl font-light text-[#2B2B2B]">{artisan?.name ?? "Artisan"}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6D6259]">{artisan?.title ?? ""}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutStorySection({ className = "" }: { className?: string } = {}) {
  return (
    <section className={cn("bg-[#111111] px-4 py-14 text-white sm:px-6 lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">07 / About Jootiya</p>
          <h2 className="mt-3 font-['Bodoni_Moda',serif] text-4xl font-light sm:text-5xl">Heritage footwear, edited for now</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">Warm ivory canvases, muted-gold detailing, and tactile borders frame a refined commerce experience rooted in authentic Jodhpuri Mojris.</p>
        </div>
        <div className="border border-white/10 p-5">
          <div className="flex items-center gap-3 text-sm text-white/75"><MapPin className="h-4 w-4 text-[#BFA06E]" /> Jodhpur, Rajasthan</div>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/75"><Clock className="h-4 w-4 text-[#BFA06E]" /> Crafted in small batches</div>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/75"><Star className="h-4 w-4 text-[#BFA06E]" /> Editorial commerce experience</div>
        </div>
      </div>
    </section>
  );
}

export const sectionRegistry = {
  HomeHero,
  FeaturedMasonry,
  ArtisanCarousel,
  CatalogControlsGrid,
  ProductPageComposition,
  CheckoutJourney,
  ArtisanStories,
  AboutStorySection,
};

export default sectionRegistry;