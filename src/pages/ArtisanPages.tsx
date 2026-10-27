import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { artisans, products, getArtisanBySlug } from '@/data/mockData';
import { ArtisanCard, ArtisanDetail } from '@/components/Footer';
import { cn } from '@/lib/utils';

export function ArtisanIndexPage({ className = '' }: { className?: string }) {
  const featuredArtisans = artisans ?? [];
  const featuredProducts = products?.filter((product) => product?.artisan) ?? [];

  return (
    <main className={cn('bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Artisan Profiles</p>
            <h1 className="max-w-3xl font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#2B2B2B] sm:text-6xl lg:text-7xl">
              The hands behind every Jodhpuri silhouette.
            </h1>
            <p className="max-w-2xl font-['Lora'] text-base leading-7 text-[#6F665B]">
              Meet the makers shaping heritage leatherwork with patient stitching, hand-finished edges, and a quiet devotion to form.
            </p>
          </div>
          <div className="border border-[#D8C9B4] bg-[#FFFCF7] p-5 shadow-[0_18px_40px_rgba(43,43,43,0.06)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#D8C9B4] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Featured Makers</p>
                <p className="mt-2 font-['Playfair_Display'] text-2xl font-light text-[#2B2B2B]">Craft lineage</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A66B]">{featuredArtisans.length} profiles</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {featuredArtisans.slice(0, 4).map((artisan) => (
                <Link
                  key={artisan?.id}
                  to={`/artisans/${artisan?.slug ?? ''}`}
                  className="min-w-0 border border-[#D8C9B4] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:border-[#C9A66B] hover:text-[#A7834D]"
                >
                  <span className="block max-w-[12rem] truncate">{artisan?.name ?? ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredArtisans.map((artisan, index) => (
            <motion.div
              key={artisan?.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <ArtisanCard artisan={artisan} className="h-full" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#D8C9B4] bg-[#FFFCF7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Selected Work</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">Related pieces from the atelier floor.</h2>
            <p className="max-w-xl font-['Lora'] text-base leading-7 text-[#6F665B]">
              Explore products shaped by the same makers, materials, and finishing rituals.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product?.id}
                to={`/shop?product=${product?.slug ?? ''}`}
                className="group border border-[#D8C9B4] bg-[#F5F1EB] p-4 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="aspect-[3/4] overflow-hidden border border-[#D8C9B4] bg-[#FFFCF7]">
                  <img
                    src={product?.image ?? ''}
                    alt={product?.name ?? ''}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-[#2B2B2B]">{product?.name ?? ''}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F665B]">{product?.artisan ?? ''}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#2B2B2B]">₹{product?.price?.toLocaleString?.('en-IN') ?? ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function ArtisanDetailPage({ className = '' }: { className?: string }) {
  const { slug = '' } = useParams();
  const artisan = getArtisanBySlug(slug) ?? artisans?.[0] ?? null;
  const relatedProducts = products?.filter((product) => product?.artisan === artisan?.name) ?? [];

  return (
    <main className={cn('bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Artisan Detail</p>
            <h1 className="font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#2B2B2B]">{artisan?.name ?? ''}</h1>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A7834D]">{artisan?.title ?? ''}</p>
            <div className="flex flex-col gap-2 text-sm text-[#6F665B]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C9A66B]" />
                <span>{artisan?.location ?? ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C9A66B]" />
                <span>{artisan?.yearsActive ? `${artisan.yearsActive} years active` : 'Heritage workshop'}</span>
              </div>
            </div>
          </div>
          <div className="border border-[#D8C9B4] bg-[#FFFCF7] p-5 shadow-[0_18px_40px_rgba(43,43,43,0.06)]">
            <ArtisanDetail artisan={artisan} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F665B]">Related Products</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light text-[#2B2B2B]">Pieces from this workshop</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A7834D]">
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product?.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="border border-[#D8C9B4] bg-[#FFFCF7] p-4"
            >
              <Link to={`/shop?product=${product?.slug ?? ''}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden border border-[#D8C9B4] bg-[#F5F1EB]">
                  <img
                    src={product?.image ?? ''}
                    alt={product?.name ?? ''}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.18em]">{product?.name ?? ''}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F665B]">{product?.category ?? ''}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">₹{product?.price?.toLocaleString?.('en-IN') ?? ''}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ArtisanIndexPage;