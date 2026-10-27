import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroCarousel, ProductMasonry, ArtisanGrid } from '@/components/CommerceSections';
import { verifiedImages, heroSlides, artisans } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function Home() {
  const storyCards = [
    {
      title: 'The atelier edit',
      text: 'A restrained journal of hand-finished Jodhpuri Mojris, cut in warm ivory and charcoal with fine gold detailing.',
      icon: Sparkles,
    },
    {
      title: 'Craft lineage',
      text: 'Verified craft photography and artisan profiles frame each pair with provenance, material, and making notes.',
      icon: Leaf,
    },
    {
      title: 'Signature fit',
      text: 'Elegant silhouettes, considered sizing, and a quiet purchase flow designed for modern ceremonial dressing.',
      icon: Award,
    },
  ];

  return (
    <main className="bg-[#FAF9F6] text-[#2B2B2B]">
      <section className="border-b border-[#D8CDBB]">
        <HeroCarousel className="mx-auto max-w-[1600px]" />
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">
              <span className="h-px w-10 bg-[#9A7135]" />
              Featured drop
            </div>
            <h2 className="max-w-2xl font-['Playfair_Display'] text-4xl font-light tracking-tight sm:text-5xl">
              Mojris composed like heirlooms, photographed like editorial objects.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#6E665C] sm:text-base">
              Explore a curated selection of authentic Jodhpuri silhouettes, from ceremonial classics to pared-back daily pairs, all presented with a warm-ivory luxury sensibility.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {storyCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -2 }}
                  className="border border-[#D8CDBB] bg-white p-5"
                >
                  <Icon className="mb-4 h-5 w-5 text-[#9A7135]" />
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.22em]">{card.title}</h3>
                  <p className="text-sm leading-6 text-[#6E665C]">{card.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">
        <ProductMasonry className="border-t border-[#D8CDBB] pt-8" />
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-t border-[#D8CDBB] pt-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">
              <span className="h-px w-10 bg-[#9A7135]" />
              Artisan stories
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl font-light tracking-tight sm:text-5xl">
              The hands behind the finish.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#6E665C] sm:text-base">
              Meet the makers, workshops, and regional techniques that shape the collection. Each profile is paired with verified imagery and concise craft notes.
            </p>
            <Link
              to="/journey"
              className={cn(
                'inline-flex items-center gap-2 border border-[#2B2B2B] bg-[#2B2B2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#9A7135] hover:border-[#9A7135] hover:text-black'
              )}
            >
              Explore the journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden border border-[#D8CDBB] bg-white">
              <img src={verifiedImages?.[0] ?? heroSlides?.[0]?.image ?? ''} alt="Jootiya atelier detail" crossOrigin="anonymous" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden border border-[#D8CDBB] bg-white">
              <img src={verifiedImages?.[1] ?? heroSlides?.[1]?.image ?? ''} alt="Jootiya craft detail" crossOrigin="anonymous" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="border-t border-[#D8CDBB] pt-8">
          <ArtisanGrid className="bg-transparent" />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-t border-[#D8CDBB] pt-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="border border-[#D8CDBB] bg-white p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">
              <span className="h-px w-10 bg-[#9A7135]" />
              Newsletter
            </div>
            <h2 className="font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">
              A quiet note from the atelier.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#6E665C]">
              Receive first access to new drops, artisan features, and ceremonial styling edits.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 border border-[#D8CDBB] bg-[#FAF9F6] px-4 py-3 text-sm outline-none placeholder:text-[#6E665C]/70 focus:border-[#9A7135]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border border-[#9A7135] bg-[#9A7135] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#765326] hover:border-[#765326] hover:text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden border border-[#D8CDBB] bg-white">
              <img src={verifiedImages?.[2] ?? heroSlides?.[2]?.image ?? ''} alt="Editorial footwear detail" crossOrigin="anonymous" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden border border-[#D8CDBB] bg-white">
              <img src={verifiedImages?.[3] ?? heroSlides?.[0]?.image ?? ''} alt="Luxury craft detail" crossOrigin="anonymous" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;