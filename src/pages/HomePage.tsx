import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/shadcn";
import mockStore from "@/mock";

// NOTE: This page consumes a purely frontend mock store from src/mock.ts.
// There is intentionally NO backend – all data is mocked in-browser with
// localStorage persistence for a rich demo experience.

const heroImageUrl =
  "https://images.pexels.com/photos/5875132/pexels-photo-5875132.jpeg?auto=compress&cs=tinysrgb&w=1920";

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
  },
};

const heroTextVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.15, duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

const heroSubVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.35, duration: 0.7, ease: "easeOut" },
  },
};

const heroCtaVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.55, duration: 0.6, ease: "easeOut" },
  },
};

const cardHover = {
  rest: { y: 0, opacity: 1 },
  hover: {
    y: -4,
    opacity: 1,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

const imageHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.4, ease: "easeOut" } },
};

const overlayHover = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Direct snapshot reads – components will be kept in sync by App via
  // useSyncExternalStore; this page itself only needs a static read.
  const featured = mockStore.getFeaturedProducts();
  const artisans = mockStore.getArtisans().slice(0, 3);

  const handleExploreCatalog = () => {
    navigate("/catalog");
  };

  const handleArtisanExplore = (artisanId: string) => {
    mockStore.setSearchArtisan(artisanId);
    navigate("/catalog");
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  // Split featured into asymmetric masonry-style columns
  const leftColumn = featured.filter((_, idx) => idx % 2 === 0);
  const rightColumn = featured.filter((_, idx) => idx % 2 === 1);

  return (
    <motion.main
      className="w-full min-h-screen bg-[#0f0d0a] text-neutral-100 flex flex-col"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[75vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0906] via-[#0b0906]/90 to-[#3b2714]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0906] via-transparent" />
        </motion.div>

        <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12 pt-28 pb-20 flex flex-col justify-center gap-10">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-sm w-max"
            variants={heroSubVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="h-7 w-7 flex items-center justify-center rounded-full bg-[#d98f5f] text-xs font-semibold tracking-[0.18em] uppercase text-[#1c120a]">
              New
            </span>
            <p className="text-xs sm:text-sm tracking-[0.26em] uppercase text-neutral-200/80">
              Rajasthani mojris from the blue city of Jodhpur
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl space-y-6"
            variants={heroTextVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-neutral-50">
              Jootiya — quiet luxury
              <br className="hidden sm:block" />
              carved in leather.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-200/90 max-w-xl leading-relaxed">
              An editorial portrait of Jodhpur&apos;s mojri craft — hand-cut leather, meticulous
              stitch-lines, and silhouettes that move from sandstone courtyards to city terraces
              with effortless grace.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            variants={heroCtaVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="default"
              className="group relative overflow-hidden rounded-full bg-[#d98f5f] px-7 py-2.5 text-sm font-medium tracking-[0.18em] uppercase text-[#1a1009] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#f3a770]"
              onClick={handleExploreCatalog}
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore catalog
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Button>

            <button
              type="button"
              onClick={() => {
                const section = document.getElementById("artisan-stories");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.22em] uppercase text-neutral-200/80 hover:text-neutral-50 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/20 bg-black/40">
                <Sparkles className="h-4 w-4 text-[#f0a15f]" />
              </span>
              Meet the artisans
            </button>
          </motion.div>
        </div>
      </section>

      {/* FEATURED MOJRIS MASONRY GRID */}
      <section className="w-full bg-[#0f0d0a] py-16 sm:py-20 lg:py-24 border-t border-white/5">
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
            <div className="space-y-3 max-w-xl">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-50">
                Featured edits from Jodhpur workshops
              </h2>
              <p className="text-sm sm:text-base text-neutral-300/80 leading-relaxed">
                A rotating curation of limited-edition mojris — each pair stitched within a few
                streets of the Mehrangarh fort, each silhouette carrying the memory of a
                sandstone threshold.
              </p>
            </div>
            <div className="text-xs sm:text-sm tracking-[0.22em] uppercase text-neutral-400 flex items-center gap-3">
              <span className="h-px w-10 bg-neutral-700" />
              Hand-numbered drops, no algorithmic shopping carts.
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left column */}
            <div className="space-y-6 lg:space-y-8">
              {leftColumn.map((product, index) => (
                <motion.article
                  key={product.id}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className={
                    index === 0
                      ? "md:h-[420px] lg:h-[460px]"
                      : "md:h-[360px] lg:h-[380px]"
                  }
                >
                  <Card
                    className="relative h-full overflow-hidden border-neutral-800/80 bg-[#171310]/95 backdrop-blur-sm shadow-[0_22px_60px_rgba(0,0,0,0.7)] cursor-pointer group"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      <motion.div
                        variants={imageHover}
                        className="relative flex-1 overflow-hidden"
                      >
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <motion.div
                          variants={overlayHover}
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
                        <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
                          <div className="space-y-1">
                            <p className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.24em] uppercase text-neutral-300/80">
                              {product.style} mojri
                              {product.isLimitedEdition && (
                                <span className="inline-flex items-center rounded-full bg-[#d98f5f]/90 px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-[#1c120a]">
                                  Limited
                                </span>
                              )}
                            </p>
                            <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-neutral-50">
                              {product.name}
                            </h3>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs text-neutral-300/80 tracking-[0.22em] uppercase">
                              ₹ {product.priceINR.toLocaleString("en-IN")}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase text-neutral-200 border border-white/10">
                              View story
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>

            {/* Right column */}
            <div className="space-y-6 lg:space-y-8 md:pt-10">
              {rightColumn.map((product, index) => (
                <motion.article
                  key={product.id}
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className={
                    index === 0
                      ? "md:h-[360px] lg:h-[380px]"
                      : "md:h-[420px] lg:h-[460px]"
                  }
                >
                  <Card
                    className="relative h-full overflow-hidden border-neutral-800/80 bg-[#171310]/95 backdrop-blur-sm shadow-[0_22px_60px_rgba(0,0,0,0.7)] cursor-pointer group"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      <motion.div
                        variants={imageHover}
                        className="relative flex-1 overflow-hidden"
                      >
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <motion.div
                          variants={overlayHover}
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                        />
                        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                          <div className="space-y-1 max-w-xs">
                            <p className="text-[10px] font-medium tracking-[0.24em] uppercase text-neutral-300/80">
                              Jodhpur workshop edit
                            </p>
                            <h3 className="font-serif text-lg sm:text-xl text-neutral-50">
                              {product.name}
                            </h3>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-xs text-neutral-300/80 tracking-[0.22em] uppercase">
                              ₹ {product.priceINR.toLocaleString("en-IN")}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase text-neutral-50">
                              Discover
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}

              {featured.length === 0 && (
                <p className="text-sm text-neutral-400 max-w-sm">
                  Our current edit is quietly in the making. Refresh in a moment to step into
                  the world of Jodhpur mojris.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ARTISAN STORIES STRIP */}
      <section
        id="artisan-stories"
        className="w-full border-t border-white/5 bg-gradient-to-r from-[#18100b] via-[#130d09] to-[#1c130b] py-16 sm:py-20 lg:py-24"
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16 mb-10 sm:mb-14">
            <div className="max-w-md space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-50">
                Artisan stories from the blue lanes.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300/90 leading-relaxed">
                Each pair of Jootiya carries the signature of a Jodhpur karigar. Follow the
                stitch-lines back to the workshops — from Clock Tower bazaar to the quiet
                courtyards of Rai Ka Bagh.
              </p>
              <p className="text-xs sm:text-sm tracking-[0.22em] uppercase text-neutral-400 flex items-center gap-3">
                <span className="h-px w-10 bg-neutral-600" />
                No algorithms. Just human hands and inherited motifs.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {artisans.map((artisan, index) => (
                <motion.button
                  key={artisan.id}
                  type="button"
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  onClick={() => handleArtisanExplore(artisan.id)}
                  className="group flex flex-col text-left rounded-3xl border border-white/10 bg-black/20 px-4 py-5 sm:px-5 sm:py-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0a15f]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18100b] transition-colors hover:border-[#f0a15f]/70"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-9 w-9 rounded-full border border-white/40 shadow-inner"
                      style={{ backgroundColor: artisan.avatarColor }}
                    />
                    <div className="space-y-0.5">
                      <p className="font-serif text-sm sm:text-base text-neutral-50">
                        {artisan.name}
                      </p>
                      <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-300/80">
                        {artisan.region}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-200/90 leading-relaxed mb-4 line-clamp-3">
                    {artisan.shortBio}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-400">
                      {artisan.yearsOfCraft} years of craft
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2a1b10] px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase text-[#f0a15f] group-hover:bg-[#f0a15f] group-hover:text-[#1b110a] transition-colors">
                      View their edit
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Subtle bottom note */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 mt-2 text-[11px] sm:text-xs text-neutral-400">
            <p>
              This is a fully mocked, frontend-only showcase. All stories, carts, and orders live
              softly in your browser&apos;s local memory.
            </p>
            <button
              type="button"
              onClick={() => mockStore.reset()}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase text-neutral-200 hover:border-[#f0a15f]/70 hover:text-[#f0a15f] transition-colors"
            >
              Reset demo state
            </button>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default HomePage;