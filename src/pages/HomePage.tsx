import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button, Badge, Card, CardContent } from "@/components/ui/shadcn";
import { useHomeFeatured, useCatalog, formatPriceINR } from "@/mock";
import ArtisanStory from "@/components/ArtisanStory";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

// NOTE: This entire page is FRONTEND-ONLY and FULLY MOCKED.
// All products, artisans, and cart interactions are powered by the mock store in src/mock.ts
// with browser localStorage persistence. There is NO backend.

const heroTextVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const heroSubtleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.7, ease: "easeOut" } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.6, ease: "easeOut" },
  }),
};

const HomePage: React.FC = () => {
  const { featuredProducts, artisans } = useHomeFeatured();
  const { products } = useCatalog();

  const primaryArtisan = artisans[0];
  const secondaryArtisan = artisans[1];

  const heroFeatured = featuredProducts[0];
  const galleryFeatured = featuredProducts.slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[color:var(--sand)] text-[color:var(--ink-soft)]">
      {/* HERO SECTION */}
      <section className="w-full min-h-[80vh] relative overflow-hidden bg-[color:var(--ink-deep)] text-sand">
        {/* Background image & overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[url('/src/assets/hero-mojri.jpg')] bg-cover bg-center opacity-80 mix-blend-normal" />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(8,21,48,0.85)] via-[rgba(8,21,48,0.9)] to-[rgba(63,43,27,0.9)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,170,0.12),_transparent_55%)]" />
        </div>

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-end">
            <motion.div
              className="flex-1 min-w-0 max-w-3xl"
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
            >
              <p className="uppercase tracking-[0.35em] text-[0.78rem] lg:text-xs text-[color:var(--sand-soft)] mb-4">
                Jootiya • Rajasthani Mojris Curated
              </p>
              <h1 className="font-['Playfair_Display'] text-[2.5rem] sm:text-[3rem] lg:text-[3.75rem] leading-tight text-sand whitespace-normal break-words">
                Quietly opulent mojris, 
                <span className="text-[color:var(--ochre-rich)]"> hand-finished</span> in the old cities
                of Rajasthan.
              </h1>
              <p className="mt-6 text-sm sm:text-base lg:text-lg text-[color:var(--sand-soft)] max-w-2xl leading-relaxed">
                Jootiya curates limited runs from independent ateliers across Jaipur and Jodhpur —
                slip-on silhouettes, archival embroideries and leather that softens with every mehfil.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-full bg-[color:var(--ochre-rich)] hover:bg-[color:var(--ochre-deep)] text-[color:var(--ink-deep)] px-7 py-2.5 text-sm font-medium tracking-wide shadow-md shadow-[rgba(0,0,0,0.22)] transition-colors"
                >
                  <Link to="/catalog" aria-label="Browse the curated mojri catalog">
                    <span className="flex items-center gap-2">
                      Browse the catalog
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </Button>

                <Link
                  to="#artisans"
                  className="text-sm font-medium text-[color:var(--sand-soft)] hover:text-[color:var(--sand)] underline-offset-4 decoration-[rgba(255,214,170,0.45)] hover:decoration-[rgba(255,214,170,0.9)] transition-colors"
                >
                  Meet the artisans
                </Link>
              </div>

              <motion.div
                className="mt-10 flex flex-wrap gap-6 text-xs sm:text-sm text-[color:var(--sand-soft)]"
                variants={heroSubtleVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex flex-col gap-1 min-w-[140px]">
                  <span className="uppercase tracking-[0.24em] text-[0.68rem] text-[color:var(--sand-muted)]">
                    Edited drops
                  </span>
                  <span>Under 50 pairs per style — once gone, they aren&apos;t restocked.</span>
                </div>
                <div className="flex flex-col gap-1 min-w-[160px]">
                  <span className="uppercase tracking-[0.24em] text-[0.68rem] text-[color:var(--sand-muted)]">
                    Jaipur &amp; Jodhpur
                  </span>
                  <span>Each pair tagged with its originating atelier and story.</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero highlight card */}
            {heroFeatured && (
              <motion.div
                className="w-full max-w-md lg:max-w-sm xl:max-w-md flex-shrink-0"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
              >
                <Card className="bg-[rgba(9,18,40,0.88)]/90 border-[rgba(255,214,170,0.24)]/80 backdrop-blur-md text-sand shadow-xl">
                  <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="rounded-full bg-[color:var(--ochre-soft)] text-[color:var(--ink-deep)] text-[0.7rem] uppercase tracking-[0.2em] px-3 py-1 border-0">
                        Featured drop
                      </Badge>
                      <span className="text-xs text-[color:var(--sand-muted)]">
                        {formatPriceINR(heroFeatured.price)}
                      </span>
                    </div>

                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-[rgba(19,27,52,0.9)] border border-[rgba(255,214,170,0.18)]">
                      <div
                        className="w-full h-full bg-cover bg-center scale-105 hover:scale-[1.08] transition-transform duration-500 ease-out"
                        style={{ backgroundImage: `url(${heroFeatured.primaryImage})` }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h2 className="font-['Playfair_Display'] text-lg sm:text-xl text-sand whitespace-normal break-words">
                        {heroFeatured.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[color:var(--sand-soft)] leading-relaxed">
                        {heroFeatured.storyIntro}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs sm:text-[0.78rem] text-[color:var(--sand-soft)]">
                      <span>Hand-cut, hand-embroidered uppers from Jaipur.</span>
                      <Link
                        to={`/product/${heroFeatured.id}`}
                        className="underline-offset-4 decoration-[rgba(255,214,170,0.5)] hover:decoration-[rgba(255,214,170,0.95)] text-[color:var(--sand)] whitespace-nowrap"
                      >
                        View story
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY / STORYTELLING STRIP */}
      <section className="w-full py-14 lg:py-18 bg-[color:var(--sand)]">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-10 lg:gap-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="uppercase tracking-[0.28em] text-[0.7rem] text-[color:var(--ink-muted)] mb-3">
                Edited for long evenings
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[2.2rem] text-[color:var(--ink-deep)] leading-snug whitespace-normal break-words">
                From mehfil floors to marble courtyards.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[color:var(--ink-soft)] max-w-xl leading-relaxed">
                An asymmetric edit of mojris that move away from stacked grids — think courtly silhouettes,
                marigold-dyed leathers and sand-beige neutrals, designed to flex from sherwani to denim.
              </p>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 flex-wrap"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[color:var(--ink-muted)]">
                <span className="inline-flex h-6 w-6 rounded-full border border-[color:var(--ink-soft)]/30 bg-[color:var(--sand-soft)]" />
                <span>Leather lined, cushioned for all-day wear</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[color:var(--ink-muted)]">
                <span className="inline-flex h-6 w-6 rounded-full border border-[color:var(--ochre-deep)]/40 bg-[color:var(--ochre-soft)]" />
                <span>Each drop signed by its originating atelier</span>
              </div>
            </motion.div>
          </div>

          {/* Asymmetric masonry-like gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-7">
            {/* Left tall feature */}
            <motion.div
              className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 md:gap-5 min-w-0"
              variants={fadeInUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              {galleryFeatured[0] && (
                <div className="flex-1 min-h-[260px] rounded-[1.5rem] overflow-hidden bg-[color:var(--sand-soft)] border border-[color:var(--ink-soft)]/15 shadow-sm shadow-[rgba(15,23,42,0.05)] flex flex-col">
                  <div
                    className="w-full h-56 sm:h-64 md:h-72 bg-cover bg-center"
                    style={{ backgroundImage: `url(${galleryFeatured[0].primaryImage})` }}
                  />
                  <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-['Playfair_Display'] text-lg text-[color:var(--ink-deep)] whitespace-normal break-words">
                        {galleryFeatured[0].name}
                      </h3>
                      <Badge className="rounded-full bg-[color:var(--ink-deep)] text-[color:var(--sand-soft)] border-0 text-[0.7rem] uppercase tracking-[0.16em]">
                        Jaipur
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                      {galleryFeatured[0].storyIntro}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs sm:text-sm text-[color:var(--ink-soft)]">
                      <span>{formatPriceINR(galleryFeatured[0].price)}</span>
                      <Link
                        to={`/product/${galleryFeatured[0].id}`}
                        className="underline underline-offset-4 decoration-[color:var(--ink-soft)]/40 hover:decoration-[color:var(--ink-deep)] text-[color:var(--ink-deep)] font-medium"
                      >
                        View pair
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Middle staggered columns with cards */}
            <motion.div
              className="md:col-span-7 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 min-w-0"
              variants={fadeInUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {galleryFeatured[1] && (
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="h-40 sm:h-44 rounded-[1.4rem] overflow-hidden bg-[url('/src/assets/gallery-1.jpg')] bg-cover bg-center shadow-md shadow-[rgba(15,23,42,0.16)]" />
                  <Card className="border-[color:var(--ink-soft)]/12 bg-[color:var(--sand-soft)]/70 backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col gap-2.5">
                      <h3 className="font-['Playfair_Display'] text-base text-[color:var(--ink-deep)] whitespace-normal break-words">
                        Marigold Bazaar edit
                      </h3>
                      <p className="text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                        Ochre and marigold tones that nod to market garlands and late afternoon light.
                      </p>
                      <Link
                        to={`/product/${galleryFeatured[1].id}`}
                        className="mt-1 text-xs font-medium text-[color:var(--ink-deep)] underline underline-offset-4 decoration-[color:var(--ochre-soft)] hover:decoration-[color:var(--ochre-rich)]"
                      >
                        Explore Marigold Bazaar
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}

              {galleryFeatured[2] && (
                <div className="flex flex-col gap-4 min-w-0 mt-2 sm:mt-8">
                  <Card className="border-[color:var(--ink-soft)]/12 bg-[color:var(--sand)]">
                    <CardContent className="p-4 flex flex-col gap-2.5">
                      <h3 className="font-['Playfair_Display'] text-base text-[color:var(--ink-deep)] whitespace-normal break-words">
                        Thar sand neutrals
                      </h3>
                      <p className="text-xs sm:text-sm text-[color:var(--ink-muted)] leading-relaxed">
                        Sand-beige silhouettes that keep the focus on drape and jewellery, not footwear.
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--ink-soft)]">
                        Perfect with wide-leg trousers, saris, and relaxed linen.
                      </p>
                    </CardContent>
                  </Card>
                  <div className="h-44 sm:h-48 rounded-[1.4rem] overflow-hidden bg-[url('/src/assets/gallery-2.jpg')] bg-cover bg-center shadow-md shadow-[rgba(15,23,42,0.16)]" />
                </div>
              )}
            </motion.div>

            {/* Right slim narrative column */}
            <motion.div
              className="hidden lg:flex lg:col-span-3 flex-col gap-4 min-w-0"
              variants={fadeInUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full border-[color:var(--ink-soft)]/10 bg-[color:var(--ink-deep)] text-[color:var(--sand-soft)] flex flex-col">
                <CardContent className="p-4 xl:p-5 flex flex-col gap-3 flex-1">
                  <p className="uppercase tracking-[0.28em] text-[0.68rem] text-[color:var(--sand-muted)]">
                    Styling notes
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    We recommend sizing down half a size for a glove-like fit, especially for pairs with
                    embroidered uppers that relax with wear.
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    Each mojri ships in a breathable cotton dust bag — pack them flat between saris and
                    shawls; they take less space than a single heel.
                  </p>
                  <div className="mt-auto pt-2 text-[0.7rem] text-[color:var(--sand-muted)] flex flex-col gap-1.5">
                    <span>— Curated by the Jootiya studio in collaboration with independent ateliers.</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS STRIP (using ProductCard) */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-14 lg:py-16 bg-[color:var(--sand-soft)]/80">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="font-['Playfair_Display'] text-xl sm:text-2xl text-[color:var(--ink-deep)] whitespace-normal break-words">
                  This week&apos;s Jaipur &amp; Jodhpur pairs
                </h2>
                <p className="text-sm text-[color:var(--ink-muted)] max-w-xl">
                  A rotating edit of three silhouettes we keep reaching for — stitched, burnished and
                  ready to step out in.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[color:var(--ink-soft)]/40 text-[color:var(--ink-deep)] bg-[color:var(--sand)] hover:bg-[color:var(--sand-soft)] px-5 py-2 text-xs sm:text-sm font-medium"
              >
                <Link to="/catalog">View the full catalog</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-5 lg:gap-7">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <motion.div
                  key={product.id}
                  className="min-w-0"
                  variants={fadeInUp}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <ProductCard
                    product={product}
                    featured={index === 1}
                    className={cn(
                      index === 1
                        ? "bg-[color:var(--sand)] border-[color:var(--ochre-soft)]/60 shadow-md shadow-[rgba(148,121,74,0.2)]"
                        : "bg-[color:var(--sand)] border-[color:var(--ink-soft)]/12",
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARTISAN HIGHLIGHT SECTION */}
      {primaryArtisan && (
        <section id="artisans" className="w-full bg-[color:var(--ink-deep)] text-[color:var(--sand)] py-16 lg:py-20">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col gap-12">
            <motion.div
              className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-10"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="max-w-xl">
                <p className="uppercase tracking-[0.3em] text-[0.7rem] text-[color:var(--sand-muted)] mb-3">
                  The hands behind each pair
                </p>
                <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[2.3rem] text-[color:var(--sand)] leading-snug whitespace-normal break-words">
                  In the lanes of {primaryArtisan.region.split(",")[0]}.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-[color:var(--sand-soft)] max-w-xl leading-relaxed">
                  We work in small batches with ateliers like {primaryArtisan.name.split(" ")[0]}
                  &apos;s — spaces where pattern blocks are passed down, not printed, and every pair carries the
                  imprint of its maker.
                </p>
              </div>

              <div className="flex flex-col gap-3 text-xs sm:text-sm text-[color:var(--sand-muted)] max-w-md">
                <p>
                  Each order ships with a story card detailing the origin of your pair — the artisan, the
                  motif, and the neighbourhood it was crafted in.
                </p>
                <p>
                  Because this entire experience is fully mocked and browser-only, your artisan stories and
                  orders live in your own localStorage, never on a server.
                </p>
              </div>
            </motion.div>

            <ArtisanStory
              artisan={primaryArtisan}
              featuredProducts={products.filter((p) => p.artisanId === primaryArtisan.id)}
              fullHeight={false}
              className="rounded-[1.75rem] overflow-hidden border border-[color:var(--sand-muted)]/30 bg-[radial-gradient(circle_at_top,_rgba(255,214,170,0.22),_rgba(7,17,37,1))]"
            />

            {secondaryArtisan && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <ArtisanStory
                  artisan={secondaryArtisan}
                  featuredProducts={products.filter((p) => p.artisanId === secondaryArtisan.id)}
                  fullHeight={false}
                  className="rounded-[1.75rem] overflow-hidden border border-[color:var(--sand-muted)]/26 bg-[radial-gradient(circle_at_top,_rgba(162,128,75,0.28),_rgba(7,17,37,1))] mt-2"
                />
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;