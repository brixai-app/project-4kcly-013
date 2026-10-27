import { motion } from "framer-motion";
import {
  ArtisanCarousel,
  FeaturedMasonry,
  HomeHero,
} from "@/components/StoreSections";

export function Home({ className = "" }: { className?: string } = {}) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <HomeHero />
      <FeaturedMasonry className="mt-4" />
      <ArtisanCarousel className="mt-4" />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-[#D8CBBB] bg-[#FFFDFC] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6259]">
              Craft Manifesto
            </p>
            <h2 className="mt-4 font-['Bodoni_Moda'] text-4xl font-light tracking-tight text-[#2B2B2B] sm:text-5xl">
              Heritage footwear, composed with restraint and warmth.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D6259] sm:text-base">
              Jootiya pairs Jodhpuri craftsmanship with an editorial retail
              rhythm: tactile materials, precise silhouettes, and a calm
              shopping experience shaped for modern wardrobes.
            </p>
          </div>
          <div className="border border-[#D8CBBB] bg-[#0a0a0a] p-6 text-[#F9F5F0] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#BFA06E]">
              Newsletter
            </p>
            <h3 className="mt-4 font-['Bodoni_Moda'] text-3xl font-light tracking-tight sm:text-4xl">
              Receive the next drop, artisan notes, and private previews.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#D8CBBB]">
              A restrained editorial dispatch for collectors who value craft,
              provenance, and considered design.
            </p>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

export default Home;