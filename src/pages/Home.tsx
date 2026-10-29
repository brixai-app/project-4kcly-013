import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, Shield, Truck } from 'lucide-react';
import { heroSlides, artisans, collections, products } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export default function Home() {
  const featured = products?.filter((product) => product?.featured)?.slice(0, 4) ?? [];
  const artisan = artisans?.[0] ?? null;
  const slide = heroSlides?.[0] ?? null;
  const collection = collections?.[0] ?? null;

  return (
    <main className="bg-[#F7F0E3] text-[#211A17]">
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={slide?.image ?? "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"}
            alt={slide?.title ?? "Jootiya editorial hero"}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/55 via-[#0a0a0a]/20 to-transparent" />
        </div>
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 border border-white/30 bg-[#FFFDFC]/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Authentic Jodhpuri Mojris
              </div>
              <h1 className="font-['Bodoni_Moda'] text-5xl font-light leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {slide?.title ?? "Collector-grade mojris, shaped by craft and provenance."}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/82 sm:text-base">
                {slide?.subtitle ??
                  "A luxury editorial storefront for hand-finished Jodhpuri mojris, where atelier stories, tactile materials, and refined silhouettes meet."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 border border-[#741F2B] bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#561620]"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/artisans"
                  className="inline-flex items-center gap-2 border border-white/35 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Meet Artisans
                </Link>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="ml-auto w-full max-w-md border border-white/25 bg-[#FFFDFC]/12 p-5 text-white backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">Featured Collection</p>
                  <p className="mt-2 truncate font-['Bodoni_Moda'] text-2xl font-light">{collection?.name ?? "The Atelier Edit"}</p>
                </div>
                <Leaf className="h-5 w-5 shrink-0 text-[#D8C08A]" />
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-white/82">
                <p>{collection?.description ?? "A restrained curation of ceremonial and everyday mojris, finished with handwork and quiet opulence."}</p>
                <div className="grid gap-2 border-t border-white/20 pt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#D8C08A]" />
                    <span>Verified artisan provenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#D8C08A]" />
                    <span>Carefully packed, nationwide delivery</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {featured.map((product, index) => (
              <div key={product?.id ?? index} className={cn(index === 0 ? "sm:col-span-2" : "")}>
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-between border border-[#CDBB9D] bg-[#FFFDFC] p-6"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6F6258]">Provenance-led selection</p>
              <h2 className="mt-3 font-['Bodoni_Moda'] text-3xl font-light leading-tight">
                Crafted for ceremony, travel, and the everyday ritual of dressing well.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#6F6258]">
                Each pair is selected for silhouette, finish, and comfort, then presented with the restraint of a collector’s archive.
              </p>
            </div>
            <Link
              to="/catalog"
              className="mt-8 inline-flex w-fit items-center gap-2 border border-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B] transition-colors hover:bg-[#741F2B] hover:text-white"
            >
              Browse all mojris
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#CDBB9D] bg-[#FFFDFC]">
        <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="border-b border-[#CDBB9D] p-6 lg:border-b-0 lg:border-r"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6F6258]">Artisan story</p>
            <h2 className="mt-3 font-['Bodoni_Moda'] text-4xl font-light leading-tight">
              {artisan?.name ?? "Master artisans preserving Jodhpur’s footwear heritage."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#6F6258]">
              {artisan?.story ??
                "Our makers work with time-honored techniques, balancing structure, softness, and ornament with a disciplined hand."}
            </p>
            <Link
              to="/artisans"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B]"
            >
              Read the atelier story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid gap-0 sm:grid-cols-2"
          >
            {[0, 1].map((index) => {
              const image = heroSlides?.[index + 1]?.image ?? products?.[index]?.image ?? "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80";
              return (
                <div key={index} className="aspect-[4/5] border-b border-[#CDBB9D] sm:border-b-0 sm:border-r last:border-r-0">
                  <img src={image} alt={`Atelier view ${index + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover" />
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="border border-[#CDBB9D] bg-[#741F2B] px-6 py-8 text-white"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">Manifesto</p>
            <p className="mt-4 max-w-2xl font-['Bodoni_Moda'] text-3xl font-light leading-tight sm:text-4xl">
              We honor the mojri as a living object: functional, ceremonial, and deeply rooted in place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-[#CDBB9D] bg-[#FFFDFC] p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6F6258]">Newsletter</p>
            <h3 className="mt-3 font-['Bodoni_Moda'] text-3xl font-light">Receive first access to new drops and atelier notes.</h3>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 border border-[#CDBB9D] bg-[#F7F0E3] px-4 py-3 text-sm text-[#211A17] outline-none placeholder:text-[#6F6258]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border border-[#741F2B] bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#561620]"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
export { Home };
