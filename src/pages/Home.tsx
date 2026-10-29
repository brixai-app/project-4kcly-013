import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Store, Leaf, Users } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { Artisan, Product } from '@/types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [productsRes, artisansRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/artisans'),
        ]);
        const productsJson = (await productsRes.json().catch(() => ({}))) as { data?: Product[] };
        const artisansJson = (await artisansRes.json().catch(() => ({}))) as { data?: Artisan[] };
        if (!active) return;
        setProducts(Array.isArray(productsJson?.data) ? productsJson.data : []);
        setArtisans(Array.isArray(artisansJson?.data) ? artisansJson.data : []);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => products.filter((p) => p?.featured).slice(0, 6), [products]);
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p?.category).filter(Boolean) as string[])).slice(0, 6),
    [products]
  );
  const featuredArtisans = useMemo(() => artisans.filter((a) => a?.featured).slice(0, 3), [artisans]);

  const heroImage =
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1400&q=85';

  return (
    <main className="bg-[#F5F1EB] text-[#302D29]">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Jodhpuri mojris atelier lookbook"
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#302D29]/30" />
        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-end px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl bg-[#FFFCF7]/92 p-6 backdrop-blur-[2px] sm:p-8 lg:p-10">
            <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6B1E1E]">
              <Sparkles className="h-4 w-4" />
              Jootiya atelier collection
            </p>
            <h1 className="max-w-2xl font-['Bodoni_Moda',serif] text-5xl font-light leading-[0.92] tracking-tight text-[#302D29] sm:text-6xl lg:text-7xl">
              Jodhpuri mojris, cut with ceremonial restraint.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#71695F] sm:text-base">
              Authentic craft, tactile leather, and a quiet editorial system shaped for the modern wardrobe.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#6B1E1E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#501515]"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/artisans"
                className="inline-flex items-center gap-2 border border-[#C9BFB1] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#302D29] transition-colors hover:bg-[#FFFCF7]"
              >
                Meet Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-[#C9BFB1] pb-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6B1E1E]">Featured drop</p>
            <h2 className="mt-2 font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight sm:text-4xl">
              Live pieces from the workshop floor
            </h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6B1E1E] sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 6 }) : featured).map((product, index) =>
            loading ? (
              <div key={index} className="aspect-[3/4] animate-pulse bg-[#FFFCF7] border border-[#C9BFB1]" />
            ) : (
              <motion.div
                key={product?.id ?? index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            )
          )}
        </div>
      </section>

      <section className="border-y border-[#C9BFB1] bg-[#FFFCF7]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="min-w-0 border border-[#C9BFB1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#302D29] transition-colors hover:bg-[#F5F1EB]"
              >
                <span className="block truncate">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6B1E1E]">Artisan chapter</p>
          <h2 className="max-w-xl font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight sm:text-4xl">
            Crafted by hands that understand ceremony, comfort, and permanence.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[#71695F]">
            Each pair is shaped through patient finishing, tonal depth, and a disciplined silhouette that honors Jodhpur’s heritage while remaining unmistakably contemporary.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredArtisans.map((artisan) => (
              <div key={artisan?.id} className="border border-[#C9BFB1] bg-[#FFFCF7] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6B1E1E]">Artisan</p>
                <h3 className="mt-2 font-['Bodoni_Moda',serif] text-xl font-light">{artisan?.name ?? ''}</h3>
                <p className="mt-1 text-sm text-[#71695F]">{artisan?.title ?? artisan?.location ?? ''}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7]">
            <img
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=85"
              alt="Leather craft detail"
              crossOrigin="anonymous"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-5">
              <Store className="h-5 w-5 text-[#6B1E1E]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em]">Live inventory</p>
              <p className="mt-2 text-sm leading-7 text-[#71695F]">Freshly stocked silhouettes with immediate availability and measured stock visibility.</p>
            </div>
            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-5">
              <Leaf className="h-5 w-5 text-[#6B1E1E]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em]">Material story</p>
              <p className="mt-2 text-sm leading-7 text-[#71695F]">Supple leather, hand-finished edges, and tonal linings selected for longevity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#302D29] text-[#FFFCF7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D8C7B3]">Manifesto</p>
            <h2 className="mt-3 font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight sm:text-4xl">
              A luxury storefront built like an atelier folio.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-[#D8C7B3]">
            <p>We keep the interface quiet so the craft can speak: asymmetry, generous breathing room, and a maroon accent that feels ceremonial rather than loud.</p>
            <p>Every interaction is designed to feel tactile, from the slide-over cart to the restrained reveal of each product card.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 border border-[#C9BFB1] bg-[#FFFCF7] p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6B1E1E]">Newsletter</p>
            <h2 className="mt-2 font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight">Receive the next drop, artisan notes, and private request openings.</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-[#6B1E1E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#501515]">
            Shop Latest Drop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default HomePage;