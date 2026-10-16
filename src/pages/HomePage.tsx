import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Separator,
} from "@/components/ui/shadcn";
import { ArrowRight } from "lucide-react";
import { Product, formatMoney } from "@/mock";

// NOTE: This page is 100% frontend-only and relies entirely on mock data/state
// defined in src/mock.ts. There is **no backend**; navigation simply routes to
// the Catalog page with query params for a rich SPA experience.

export interface HomePageProps {
  featuredProducts: Product[];
}

const heroTextVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } },
};

const heroSubVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.8, ease: [0.19, 1, 0.22, 1] } },
};

const heroCtaVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};

const HomePage: React.FC<HomePageProps> = ({ featuredProducts }) => {
  const navigate = useNavigate();

  const heroProduct = React.useMemo(
    () =>
      featuredProducts.find((p) => p.featured && p.images?.[0]) ||
      featuredProducts[0],
    [featuredProducts]
  );

  const secondaryHighlights = React.useMemo(
    () => featuredProducts.filter((p) => p.id !== heroProduct?.id).slice(0, 6),
    [featuredProducts, heroProduct]
  );

  const handleViewProduct = (productId: string) => {
    // Navigate to catalog with preselected product via query param
    navigate(`/catalog?featuredId=${encodeURIComponent(productId)}`);
  };

  const handleExploreCatalog = () => {
    navigate("/catalog");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f3ee] via-[#f8f5f1] to-[#f1ede8] text-neutral-900 dark:from-[#050505] dark:via-[#0a0705] dark:to-[#050505]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-neutral-200/70 dark:border-neutral-800/80">
        {/* Background image */}
        {heroProduct && heroProduct.images[0] && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.22),_transparent_55%)] opacity-70 mix-blend-multiply dark:opacity-90" />
            <div
              className="absolute inset-0 bg-cover bg-center opacity-85 dark:opacity-70"
              style={{
                backgroundImage: `url(${heroProduct.images[0].url})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3ee] via-[#f7f3ee]/75 to-transparent dark:from-black dark:via-black/75" />
          </div>
        )}

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-16 sm:px-8 md:flex-row md:items-end md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
          {/* Left: Copy */}
          <div className="z-10 max-w-xl md:flex-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroTextVariant}
              className="inline-flex items-center gap-3 rounded-full border border-amber-500/30 bg-neutral-50/80 px-3 py-1 text-xs tracking-[0.2em] text-neutral-800 shadow-sm backdrop-blur-sm dark:border-amber-400/40 dark:bg-neutral-900/80 dark:text-neutral-100"
            >
              <span className="h-1 w-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-300" />
              <span className="uppercase">Maison Jootiya Lookbook // 2024</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={heroTextVariant}
              className="mt-6 font-['Playfair_Display'] text-4xl leading-tight tracking-tight text-neutral-900 sm:text-5xl md:text-6xl md:leading-[1.05] dark:text-neutral-50"
            >
              Quietly {" "}
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-300 dark:via-amber-200 dark:to-amber-100">
                louder
              </span>
              . Crafted for the slow arrival.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={heroSubVariant}
              className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-700 sm:text-base sm:leading-relaxed dark:text-neutral-200"
            >
              Jootiya curates sculptural sneakers and considered leather forms for
              the rooms where conversation drops to a hush. Each pair is drawn
              like architecture and finished like a photograph.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroCtaVariant}
              className="mt-7 flex flex-wrap items-center gap-4"
            >
              <Button
                variant="default"
                onClick={handleExploreCatalog}
                className="group relative overflow-hidden rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium tracking-wide text-neutral-50 shadow-md shadow-neutral-900/25 transition-colors duration-200 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:shadow-black/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore the catalog
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/40 to-amber-400/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </Button>

              {heroProduct && (
                <button
                  type="button"
                  onClick={() => handleViewProduct(heroProduct.id)}
                  className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-neutral-900 transition-colors duration-150 hover:text-amber-700 dark:text-neutral-100 dark:hover:text-amber-300"
                >
                  View {heroProduct.brand} {heroProduct.name}
                  <span className="h-px w-8 bg-neutral-500 transition-all duration-150 group-hover:w-11 group-hover:bg-amber-600 dark:bg-neutral-300 dark:group-hover:bg-amber-300" />
                </button>
              )}
            </motion.div>
          </div>

          {/* Right: Hero product card */}
          {heroProduct && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="z-10 mt-8 w-full max-w-sm md:mt-0 md:flex-1 md:self-stretch"
            >
              <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-50/90 shadow-[0_18px_55px_rgba(15,23,42,0.24)] backdrop-blur-sm transition-shadow duration-200 hover:shadow-[0_26px_70px_rgba(15,23,42,0.32)] dark:border-neutral-800/90 dark:bg-neutral-900/80 dark:shadow-[0_18px_60px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {heroProduct.images[0] && (
                    <img
                      src={heroProduct.images[0].url}
                      alt={heroProduct.images[0].alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                  <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-200/80">
                        Featured silhouette
                      </p>
                      <p className="mt-1 font-['Playfair_Display'] text-lg text-neutral-50">
                        {heroProduct.brand}
                      </p>
                      <p className="text-sm text-neutral-200">
                        {heroProduct.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-amber-300/90">
                        {heroProduct.category}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-neutral-50">
                        {formatMoney(heroProduct.price, heroProduct.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="border-amber-500/40" />

                <CardContent className="flex flex-col gap-3 px-4 py-4 sm:px-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {heroProduct.badges.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="border-amber-500/40 bg-amber-50/40 px-2 py-0.5 text-[11px] font-medium tracking-[0.16em] text-amber-800 backdrop-blur-sm dark:border-amber-300/50 dark:bg-amber-500/15 dark:text-amber-200"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                      Edit. {new Date(heroProduct.releaseDate).getFullYear()}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-200">
                    {heroProduct.editorialCopy}
                  </p>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-300">
                      {heroProduct.origin}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleViewProduct(heroProduct.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-900 transition-colors duration-150 hover:text-amber-700 dark:text-neutral-100 dark:hover:text-amber-300"
                    >
                      View piece
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Brand manifesto / craftsmanship */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-400 dark:from-amber-300 dark:via-amber-200 dark:to-amber-100" />
              <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-600 dark:text-neutral-400">
                The Jootiya Manifesto
              </p>
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl leading-snug text-neutral-900 sm:text-3xl md:text-[2.15rem] dark:text-neutral-50">
              Footwear as architecture for the body, drawn in lines of leather,
              shadow and silence.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem] sm:leading-relaxed dark:text-neutral-200">
              We work with ateliers across Italy, Portugal and Spain, where last
              makers and colorists have spent decades learning how light moves
              across leather. Every Jootiya silhouette begins as a pencil
              drawing on translucent paper before being transferred into form.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem] sm:leading-relaxed dark:text-neutral-200">
              Our palette stays deliberately quiet: bone, onyx, cacao, chalk. It
              lets your movement carry the volume while the shoes hold the
              frame. No logos shouting, only proportions whispered at the edge
              of perception.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative rounded-3xl border border-neutral-200/80 bg-neutral-50/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-[0_22px_60px_rgba(0,0,0,0.75)]"
          >
            <div className="absolute inset-x-5 top-5 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-300">
                Materials, not seasons
              </span>
              <span className="h-px w-10 bg-amber-600/70 dark:bg-amber-300/70" />
            </div>

            <div className="mt-8 space-y-4 text-sm text-neutral-700 dark:text-neutral-200">
              <p>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  Italian calfskin & patina labs —
                </span>{" "}
                Each hide is hand-selected for grain consistency. Our patina
                partners in Marche hand-dye gradients over multiple days,
                allowing pigment to sink, settle and only then be burnished.
              </p>
              <p>
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  Silent engineering —
                </span>{" "}
                Lightweight cup soles and beveled waists are tuned for how the
                shoes sound when they cross stone. It&apos;s luxury you feel under
                dim light, never forced into the frame.
              </p>
              <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500 dark:text-neutral-400">
                Every pair numbered. Every stitch accounted for.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Asymmetric masonry highlights */}
      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 sm:pb-20 md:pb-24">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-400 dark:from-amber-300 dark:via-amber-200 dark:to-amber-100" />
              <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-600 dark:text-neutral-400">
                Lookbook Highlights
              </p>
            </div>
            <h3 className="font-['Playfair_Display'] text-xl text-neutral-900 sm:text-2xl dark:text-neutral-50">
              Eight silhouettes in quiet conversation.
            </h3>
          </div>
          <Button
            variant="ghost"
            onClick={handleExploreCatalog}
            className="hidden rounded-full border border-neutral-300/70 bg-neutral-50/60 px-4 py-1.5 text-xs font-medium tracking-[0.18em] text-neutral-800 shadow-sm transition-colors duration-150 hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-200 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 md:inline-flex"
          >
            Browse full catalog
          </Button>
        </div>

        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="columns-1 gap-5 sm:columns-2 md:columns-3"
        >
          {secondaryHighlights.map((product, index) => (
            <motion.article
              key={product.id}
              variants={cardVariants}
              className={`mb-5 break-inside-avoid ${
                index % 3 === 0
                  ? "md:translate-y-3"
                  : index % 3 === 1
                  ? "md:-translate-y-1"
                  : "md:translate-y-6"
              }`}
            >
              <Card className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-50/90 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-shadow duration-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.22)] dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:shadow-[0_18px_60px_rgba(0,0,0,0.75)]">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/5] overflow-hidden">
                    {product.images[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                      />
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-80" />

                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-300">
                        {product.brand}
                      </p>
                      <p className="mt-1 font-['Playfair_Display'] text-[1.1rem] text-neutral-50">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-amber-300">
                        {product.category}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-neutral-50">
                        {formatMoney(product.price, product.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <CardHeader className="px-4 pb-2 pt-3 sm:px-5 sm:pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.badges.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="border-amber-500/40 bg-amber-50/60 px-2 py-0.5 text-[10px] font-medium tracking-[0.16em] text-amber-800 backdrop-blur-sm dark:border-amber-300/50 dark:bg-amber-500/10 dark:text-amber-200"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                      {new Date(product.releaseDate).getFullYear()}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-0 sm:px-5">
                  <p className="line-clamp-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-200">
                    {product.editorialCopy}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
                      <span>{product.origin.replace("Made in ", "")}</span>
                      <span className="h-px w-6 bg-neutral-300 dark:bg-neutral-600" />
                      <span>
                        {product.sizes.length} sizes 
                        <span className="mx-1 h-0.5 w-1 rounded-full bg-amber-600 align-middle dark:bg-amber-300" />
                        {product.colors.length} colors
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleViewProduct(product.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-neutral-300/70 bg-neutral-50/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-900 shadow-sm transition-colors duration-150 hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-200 dark:hover:border-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900"
                    >
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;