import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArtisanStoryList } from '@/components/HeritageExperiences';
import { editorialStories } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function ArtisanStoriesPage() {
  const leadStory = editorialStories?.[0] ?? null;

  return (
    <main className="bg-[#F5F0E6] text-[#2B2B2B]">
      <section className="border-b border-[#C9A66B]/70 bg-[#FFF9F0]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6F655B]">
              <BookOpen className="h-4 w-4" />
              Artisan Stories
            </p>
            <h1 className="max-w-3xl font-['Playfair_Display'] text-5xl font-light tracking-tight md:text-6xl">
              The makers behind every Jodhpuri Mojri.
            </h1>
            <p className="mt-5 max-w-2xl font-['Lora'] text-base leading-8 text-[#6F655B] md:text-lg">
              A quiet archive of ateliers, family workshops, and hand-finished traditions that shape the Jootiya collection.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-[#7B2D26] bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#61211C]"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 border border-[#C9A66B] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:bg-[#FFF9F0]"
              >
                Bespoke Orders <Compass className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="border border-[#C9A66B] bg-[#FFF9F0] p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6F655B]">Featured Story</p>
            <div className="mt-4 space-y-4">
              <p className="font-['Playfair_Display'] text-2xl font-light">{leadStory?.title ?? 'Heritage in motion'}</p>
              <p className="font-['Lora'] text-sm leading-7 text-[#6F655B]">{leadStory?.excerpt ?? 'Craft, memory, and material converge in a measured editorial portrait of the atelier.'}</p>
              <div className="border-t border-[#C9A66B]/70 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F655B]">Provenance</p>
                <p className="mt-2 text-sm leading-7 text-[#2B2B2B]">{leadStory?.provenance ?? 'Jodhpur, Rajasthan'}</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className={cn('mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8')}>
        <ArtisanStoryList className="w-full" />
      </section>
    </main>
  );
}

export default ArtisanStoriesPage;