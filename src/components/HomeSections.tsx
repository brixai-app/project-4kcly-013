import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sparkles, Truck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

type HomeSectionsProps = {
  className?: string;
  featuredProducts?: Product[];
};

const verifiedImages = [
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
];

const fallbackProducts: Product[] = [
  { id: '1', name: 'Mehrab Mojri', slug: 'mehrab-mojri', price: 3499, category: 'Mojris', collection: 'Heritage Drop', image: verifiedImages[0], featured: true, inStock: true },
  { id: '2', name: 'Saffron Stitch', slug: 'saffron-stitch', price: 4299, category: 'Mojris', collection: 'Crafted Edit', image: verifiedImages[1], featured: true, inStock: true },
  { id: '3', name: 'Noor Weave', slug: 'noor-weave', price: 3899, category: 'Mojris', collection: 'Atelier Series', image: verifiedImages[2], featured: true, inStock: true },
  { id: '4', name: 'Jharokha Pair', slug: 'jharokha-pair', price: 4599, category: 'Mojris', collection: 'Signature', image: verifiedImages[6], featured: true, inStock: true },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#CFC1AD] bg-[#F5F1E9]">
      <div className="mx-auto grid min-h-[88vh] max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex items-end px-5 py-8 sm:px-8 lg:px-10">
          <div className="absolute inset-0">
            <img
              src={verifiedImages[3]}
              alt="Jodhpuri craftsmanship"
              crossOrigin="anonymous"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/55 via-[#0a0a0a]/20 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Jootiya</p>
            <h1 className="font-['Playfair_Display'] text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
              Heritage Mojris, reimagined with editorial restraint.
            </h1>
            <p className="mt-5 max-w-lg font-['Lora'] text-base leading-7 text-white/85 sm:text-lg">
              Authentic Jodhpuri footwear shaped by handwoven textures, crimson accents, and a quiet luxury language built for modern rituals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-[#8B0000] bg-[#8B0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#650000]"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <span className="text-xs uppercase tracking-[0.28em] text-white/70">Verified artisan imagery</span>
            </div>
          </div>
        </div>
        <div className="relative flex items-end bg-[#FFFCF6] px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full border border-[#CFC1AD] bg-[#FFFCF6] p-5 shadow-[0_18px_60px_rgba(46,46,46,0.08)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F675D]">Provenance</p>
                <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2E2E2E]">
                  Crafted in the rhythm of Jodhpur.
                </h2>
              </div>
              <div className="hidden shrink-0 border-l border-[#CFC1AD] pl-4 text-right text-[10px] uppercase tracking-[0.3em] text-[#6F675D] sm:block">
                Jodhpuri
                <br />
                Mojri
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[verifiedImages[4], verifiedImages[5]].map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={cn('overflow-hidden border border-[#CFC1AD]', index === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]')}
                >
                  <img src={src} alt="Craft detail" crossOrigin="anonymous" className="h-full w-full object-cover object-center" />
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-[#6F675D]">
              <span className="h-px flex-1 bg-[#CFC1AD]" />
              <span className="inline-flex items-center gap-2 uppercase tracking-[0.28em]">
                <Sparkles size={14} /> Hand-finished
              </span>
              <span className="h-px flex-1 bg-[#CFC1AD]" />
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-24 w-full bg-gradient-to-t from-[#F5F1E9] to-transparent lg:block" />
    </section>
  );
}

export function FeaturedMasonry({ products = fallbackProducts }: { products?: Product[] }) {
  const items = (products?.length ? products : fallbackProducts).slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F675D]">Featured drop</p>
          <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2E2E2E] sm:text-4xl">
            A staggered gallery of signature pairs.
          </h2>
        </div>
        <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8B0000] sm:inline-flex">
          Shop latest <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className={cn(index % 2 === 0 ? 'md:mt-10' : 'md:mt-0')}
          >
            <ProductCard product={product} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CraftManifesto() {
  return (
    <section className="border-y border-[#CFC1AD] bg-[#FFFCF6]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F675D]">Craft manifesto</p>
            <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2E2E2E] sm:text-4xl">
              Built from texture, balance, and the discipline of handwork.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#6F675D]">
            <Leaf size={14} className="text-[#8B0000]" />
            Natural materials
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Artisan-led', 'Each pair is shaped with a measured, human touch.'],
            ['Comfort first', 'Soft interiors and balanced silhouettes for long wear.'],
            ['Crimson finish', 'A restrained accent language that feels ceremonial.'],
          ].map(([title, body]) => (
            <div key={title} className="border border-[#CFC1AD] bg-[#F5F1E9] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8B0000]">{title}</p>
              <p className="mt-3 font-['Lora'] text-sm leading-7 text-[#6F675D]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterBand() {
  return (
    <section className="bg-[#F5F1E9]">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F675D]">Newsletter</p>
          <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2E2E2E]">
            Receive new drops, artisan notes, and private access.
          </h2>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 border border-[#8B0000] bg-[#8B0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#650000]"
        >
          Browse shop <Truck size={16} />
        </Link>
      </div>
    </section>
  );
}

export function HomeExperience({ className = '', featuredProducts = fallbackProducts }: HomeSectionsProps) {
  return (
    <div className={cn('bg-[#F5F1E9] text-[#2E2E2E]', className)}>
      <HeroSection />
      <FeaturedMasonry products={featuredProducts} />
      <CraftManifesto />
      <NewsletterBand />
    </div>
  );
}

export default HomeExperience;