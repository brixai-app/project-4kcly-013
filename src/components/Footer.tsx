import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { artisans, editorialCopy } from '@/data/mockData';
import type { Artisan } from '@/types';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

type ArtisanCardProps = {
  artisan?: Artisan | null;
  className?: string;
  onStory?: (artisan: Artisan) => void;
};

type ArtisanDetailProps = {
  artisan?: Artisan | null;
  className?: string;
};

export function ArtisanCard({ artisan = null, className = '', onStory = () => {} }: ArtisanCardProps) {
  const item = artisan ?? artisans?.[0] ?? null;
  if (!item) return null;
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn('group overflow-hidden rounded-md border border-[#D8CDBE] bg-[#FFFCF7] shadow-[0_10px_30px_rgba(43,43,43,0.06)]', className)}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#F5F1EB]">
        <img
          src={item.portraitUrl}
          alt={item.name}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665D]">{item.location}</p>
          <h3 className="mt-1 truncate font-serif text-xl text-[#2B2B2B]">{item.name}</h3>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-[#6E665D]">{item.specialty}</p>
        <button
          type="button"
          onClick={() => {
            onStory(item);
            toast.message(`Story opened: ${item.name}`);
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:text-[#C9A66B]"
        >
          Read story <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

export function ArtisanDetail({ artisan = null, className = '' }: ArtisanDetailProps) {
  const item = artisan ?? artisans?.[0] ?? null;
  if (!item) return null;
  return (
    <section className={cn('grid gap-6 rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-5 shadow-[0_12px_40px_rgba(43,43,43,0.05)] md:grid-cols-[220px_minmax(0,1fr)]', className)}>
      <div className="overflow-hidden rounded-sm bg-[#F5F1EB]">
        <img
          src={item.portraitUrl}
          alt={item.name}
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Artisan profile</p>
        <h3 className="mt-2 font-serif text-3xl text-[#2B2B2B]">{item.name}</h3>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[#6E665D]">{item.location} · {item.specialty}</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6E665D]">{item.story}</p>
      </div>
    </section>
  );
}

export function Footer({ className = '' }: FooterProps) {
  const year = new Date().getFullYear();
  const featuredArtisan = artisans?.[0] ?? null;
  const links = [
    { label: 'Shop Mojris', to: '/shop' },
    { label: 'Our Story', to: '/' },
    { label: 'Checkout', to: '/checkout' },
  ];
  return (
    <footer className={cn('border-t border-[#D8CDBE] bg-[#F5F1EB] text-[#2B2B2B]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6E665D]">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A66B]" />
                Jootiya atelier
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-[#2B2B2B] sm:text-5xl">
                {editorialCopy?.footerHeadline ?? 'Hand-finished Mojris, shaped for ceremonial days and quiet evenings.'}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#6E665D]">
                {editorialCopy?.footerBody ?? 'Discover a curated archive of authentic Jodhpuri craftsmanship, where every pair carries the grain, patience, and precision of its maker.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-2 rounded-md border border-[#D8CDBE] bg-[#FFFCF7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:border-[#C9A66B] hover:text-[#B38A4E]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Visit</p>
              <div className="mt-4 space-y-3 text-sm text-[#6E665D]">
                <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A66B]" /> Jodhpur, Rajasthan</p>
                <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A66B]" /> +91 98765 43210</p>
                <p className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A66B]" /> concierge@jootiya.com</p>
              </div>
            </div>
            <div className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Follow</p>
              <div className="mt-4 flex items-center gap-3">
                {[
                  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#D8CDBE] text-[#2B2B2B] transition-colors hover:border-[#C9A66B] hover:text-[#B38A4E]"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        {featuredArtisan ? (
          <div className="mt-10">
            <ArtisanDetail artisan={featuredArtisan} />
          </div>
        ) : null}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#D8CDBE] pt-6 text-xs uppercase tracking-[0.24em] text-[#6E665D] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Jootiya. All rights reserved.</p>
          <p>Crafted with editorial restraint and tactile warmth.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;