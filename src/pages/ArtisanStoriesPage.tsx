import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Clock, Globe2, Heart, Sparkles } from 'lucide-react';
import type { Artisan } from '@/types';
import { cn } from '@/lib/utils';

const fallbackArtisans: Artisan[] = [
  {
    id: 'fallback-1',
    name: 'Bhanwar Singh',
    slug: 'bhanwar-singh',
    title: 'Hand-stitched upper artisan',
    location: 'Jodhpur, Rajasthan',
    bio: 'Generations of handwork shape each curve, stitch, and finish with a disciplined, quiet precision.',
    portrait: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    specialties: ['Hand embroidery', 'Leather finishing', 'Traditional motifs'],
    yearsActive: 24,
    featured: true,
  },
  {
    id: 'fallback-2',
    name: 'Amina Khatri',
    slug: 'amina-khatri',
    title: 'Surface ornamentation specialist',
    location: 'Old City Workshop',
    bio: 'Her atelier balances restraint and richness, layering texture without losing the silhouette’s clarity.',
    portrait: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    specialties: ['Threadwork', 'Bead detailing', 'Pattern drafting'],
    yearsActive: 18,
  },
  {
    id: 'fallback-3',
    name: 'Rafiq Noor',
    slug: 'rafiq-noor',
    title: 'Lasting and finishing master',
    location: 'Mochi Bazaar',
    bio: 'He shapes comfort into form, ensuring every pair carries the poise of a ceremonial object.',
    portrait: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    specialties: ['Last shaping', 'Edge finishing', 'Comfort fitting'],
    yearsActive: 31,
  },
];

export function ArtisanStoriesPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/artisans');
        const json = (await res.json().catch(() => null)) as { success?: boolean; data?: Artisan[] } | null;
        const data = Array.isArray(json?.data) ? json?.data : [];
        if (active) setArtisans(data.length ? data : fallbackArtisans);
      } catch {
        if (active) setArtisans(fallbackArtisans);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => artisans.filter((a) => a?.featured).slice(0, 1)?.[0] ?? artisans?.[0] ?? fallbackArtisans[0], [artisans]);
  const grid = artisans.length ? artisans : fallbackArtisans;

  return (
    <main className="bg-[#F5F1EB] text-[#302D29]">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#71695F]">Artisan stories</p>
            <h1 className="max-w-3xl font-serif text-5xl font-light tracking-tight text-[#302D29] sm:text-6xl lg:text-7xl">
              The ateliers where every Mojri is shaped by hand, memory, and measured patience.
            </h1>
          </div>
          <div className="max-w-xl border border-[#C9BFB1] bg-[#FFFCF7] p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#6B1E1E]" />
              <p className="text-sm leading-6 text-[#71695F]">
                We follow the makers behind each pair: the cutters, stitchers, finishers, and pattern keepers whose work gives Jootiya its quiet authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7]"
          >
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#71695F]">Featured atelier</p>
                <h2 className="mt-4 font-serif text-3xl font-light tracking-tight">{featured?.name ?? 'Master artisan'}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#6B1E1E]">{featured?.title ?? 'Workshop lead'}</p>
                <p className="mt-5 text-sm leading-7 text-[#71695F]">{featured?.bio ?? 'A measured practice of handwork and finish.'}</p>
                <div className="mt-6 space-y-3 text-sm text-[#302D29]">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-[#6B1E1E]" />
                    <span>{featured?.location ?? 'Jodhpur, Rajasthan'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#6B1E1E]" />
                    <span>{featured?.yearsActive ?? 0} years of practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#6B1E1E]" />
                    <span>{featured?.specialties?.join(' · ') ?? 'Traditional craft disciplines'}</span>
                  </div>
                </div>
                <a
                  href="#artisan-grid"
                  className="mt-8 inline-flex items-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#501515]"
                >
                  Explore makers
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="min-h-[420px]">
                <img
                  src={featured?.portrait ?? fallbackArtisans[0].portrait ?? ''}
                  alt={featured?.name ?? 'Artisan portrait'}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.article>

          <aside className="space-y-4 border border-[#C9BFB1] bg-[#FFFCF7] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#71695F]">Workshop interlude</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Camera className="mt-1 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                <p className="text-sm leading-7 text-[#71695F]">
                  Every portrait is paired with a verified workshop image or a deterministic craft fallback, preserving the editorial tone without visual noise.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                <p className="text-sm leading-7 text-[#71695F]">
                  The sequence is intentionally asymmetrical: a narrative lead, a tactile image, then a measured field of makers.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="artisan-grid" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#71695F]">Provenance field</p>
            <h2 className="mt-2 font-serif text-3xl font-light tracking-tight">Makers, methods, and the quiet discipline of finish</h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-6 text-[#71695F] md:block">
            A restrained masonry reveal keeps the page tactile and editorial while remaining accessible and easy to scan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {grid.map((artisan, index) => (
            <motion.article
              key={artisan?.id ?? `${artisan?.slug ?? 'artisan'}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={cn('overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7]', index % 3 === 0 ? 'md:translate-y-6' : '')}
            >
              <img
                src={artisan?.portrait ?? fallbackArtisans[index % fallbackArtisans.length]?.portrait ?? ''}
                alt={artisan?.name ?? 'Artisan portrait'}
                crossOrigin="anonymous"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-2xl font-light">{artisan?.name ?? 'Artisan'}</h3>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#6B1E1E]">{artisan?.title ?? 'Workshop specialist'}</p>
                  </div>
                  <span className="shrink-0 text-xs uppercase tracking-[0.28em] text-[#71695F]">{artisan?.yearsActive ?? 0} yrs</span>
                </div>
                <p className="text-sm leading-7 text-[#71695F]">{artisan?.bio ?? 'A maker whose practice is rooted in precision and tradition.'}</p>
                <div className="flex flex-wrap gap-2">
                  {(artisan?.specialties ?? ['Handwork', 'Finish', 'Pattern']).slice(0, 3).map((item) => (
                    <span key={item} className="border border-[#C9BFB1] px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-[#302D29]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#C9BFB1] bg-[#FFFCF7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#71695F]">Video treatment</p>
            <h2 className="font-serif text-3xl font-light tracking-tight">A moving study of hands, tools, and the final polish</h2>
            <p className="text-sm leading-7 text-[#71695F]">
              Replace this frame with a short atelier film when available. The layout is prepared for accessible playback and a calm editorial rhythm.
            </p>
          </div>
          <div className="overflow-hidden border border-[#C9BFB1] bg-[#302D29]">
            <div className="flex min-h-[280px] items-center justify-center p-8 text-center text-[#FFFCF7]">
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#FFFCF7]/30">
                  <ArrowRight className="h-5 w-5 rotate-45" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9BFB1]">Atelier film placeholder</p>
                <p className="text-sm leading-6 text-[#FFFCF7]/80">A quiet frame for future workshop footage, interviews, and process notes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? <span className="sr-only">Loading artisan stories</span> : null}
    </main>
  );
}

export default ArtisanStoriesPage;