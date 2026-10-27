import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";
import { categories, products, artisanStories } from "@/data/mockData";
import {
  HeroBanner,
  ProductGrid,
  ManifestoSection,
  NewsletterSection,
} from "@/components/StorefrontSections";
import { cn } from "@/lib/utils";

export function Home({ className = "" }: { className?: string }) {
  const featuredCategories = (categories ?? []).slice(0, 6);
  const featuredProducts = (products ?? []).filter((product) => product?.featured ?? false).slice(0, 8);
  const featuredStory = (artisanStories ?? [])[0] ?? null;

  return (
    <main className={cn("bg-[#F5F0E6] text-[#2B2B2B]", className)}>
      <HeroBanner />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 border-b border-[#C9A66B]/60 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6D6257]">Curated categories</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-medium tracking-tight sm:text-4xl">Navigate the atelier</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B04E2C]">
            Shop all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {featuredCategories.map((category) => (
            <Link
              key={category}
              to="/shop"
              className="min-w-0 border border-[#C9A66B] bg-[#FFFBF4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#B04E2C] hover:text-[#B04E2C]"
            >
              <span className="block truncate">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#6D6257]">
          <Sparkles className="h-4 w-4 text-[#B04E2C]" />
          <span>Featured drop</span>
        </div>
        <div className="mt-4">
          <ProductGrid className="!px-0" />
        </div>
        {featuredProducts.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/shop/${product.slug}`}
                className="group overflow-hidden border border-[#C9A66B]/70 bg-[#FFFBF4]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6257]">{product.collection}</p>
                  <h3 className="line-clamp-2 font-['Playfair_Display'] text-lg font-medium leading-tight">{product.name}</h3>
                  <p className="text-sm font-semibold text-[#2B2B2B]">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ManifestoSection className="h-full" />
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="border border-[#C9A66B] bg-[#FFFBF4] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6D6257]">Artisan story</p>
            <h3 className="mt-3 font-['Playfair_Display'] text-3xl font-medium tracking-tight">{featuredStory?.name ?? "Master craft lineage"}</h3>
            <p className="mt-3 text-sm leading-7 text-[#6D6257]">{featuredStory?.story ?? "A living archive of hand-cut leather, mirrored embroidery, and Jodhpur workshop discipline."}</p>
            {featuredStory?.image ? (
              <img
                src={featuredStory.image}
                alt={featuredStory.name}
                crossOrigin="anonymous"
                className="mt-5 aspect-[4/5] w-full object-cover"
              />
            ) : null}
            <Link
              to="/artisans"
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#B04E2C]"
            >
              Read the atelier journal <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.aside>
        </div>
      </section>

      <NewsletterSection />
    </main>
  );
}

export default Home;