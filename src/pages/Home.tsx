import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import EditorialSections from '@/components/EditorialSections';
import Footer, { ArtisanCard, ArtisanDetail } from '@/components/Footer';
import { artisans } from '@/data/mockData';
import { cn } from '@/lib/utils';

type HomeProps = { className?: string };

export function Home({ className = '' }: HomeProps) {
  return (
    <main className={cn('bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <EditorialSections />
    </main>
  );
}

type ArtisansPageProps = { className?: string };

export function ArtisansPage({ className = '' }: ArtisansPageProps) {
  const navigate = useNavigate();
  const params = useParams<{ artisanId?: string }>();
  const artisanId = params?.artisanId ?? '';
  const artisan = artisans?.find((item) => item?.id === artisanId) ?? artisans?.[0] ?? null;

  if (!artisanId || !artisan) {
    return (
      <main className={cn('bg-[#F5F1EB] px-4 py-10 text-[#2B2B2B] sm:px-6 lg:px-8', className)}>
        <section className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6E665D]">Artisans</p>
              <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-light tracking-tight sm:text-5xl">The makers behind every pair</h1>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(artisans ?? []).map((item) => (
              <button
                key={item?.id}
                type="button"
                onClick={() => navigate(`/artisans/${item?.id ?? ''}`)}
                className="group overflow-hidden rounded-md border border-[#D8CDBE] bg-[#FFFCF7] text-left shadow-[0_10px_30px_rgba(43,43,43,0.06)] transition-transform duration-300 hover:-translate-y-1"
              >
                <ArtisanCard artisan={item} />
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={cn('bg-[#F5F1EB] px-4 py-10 text-[#2B2B2B] sm:px-6 lg:px-8', className)}>
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-md border border-[#D8CDBE] bg-[#FFFCF7] shadow-[0_18px_50px_rgba(43,43,43,0.08)]">
          <ArtisanDetail artisan={artisan} />
        </div>
        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-6 shadow-[0_18px_50px_rgba(43,43,43,0.08)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6E665D]">Atelier note</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-light tracking-tight">Craft, memory, and the quiet precision of handwork</h2>
          <p className="mt-4 text-sm leading-7 text-[#6E665D]">
            {artisan?.story ?? ''}
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-[#6E665D]">
            <MapPin className="h-4 w-4 text-[#C9A66B]" />
            <span>{artisan?.location ?? ''}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-8 inline-flex items-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#B38A4E]"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.aside>
      </section>
    </main>
  );
}

export default Home;