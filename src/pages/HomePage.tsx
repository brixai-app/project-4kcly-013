import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Quote, Sparkles } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shadcn";

// NOTE: This entire application is 100% frontend-only and fully mocked.
// All data and state helpers come from src/mock.ts and persist to localStorage.
// There is NO backend involved.
import type { Artisan, Product } from "@/mock";
import { getArtisans, getProducts } from "@/mock";

const heroBackground =
  "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=2000";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardHoverTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [artisanSheetOpen, setArtisanSheetOpen] = useState(false);

  const allProducts = useMemo<Product[]>(() => getProducts(), []);
  const artisans = useMemo<Artisan[]>(() => getArtisans(), []);

  // Pick a highlighted artisan (first for now, could be based on custom flag later)
  const highlightedArtisan = artisans[0];

  const featuredProducts = useMemo(
    () =>
      [...allProducts]
        .sort((a, b) => a.featuredRank - b.featuredRank)
        .slice(0, 6),
    [allProducts]
  );

  const artisanSectionRef = useRef<HTMLDivElement | null>(null);

  // Optional hash navigation from header (e.g., /#artisans)
  useEffect(() => {
    if (location.hash === "#artisans" && artisanSectionRef.current) {
      artisanSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  const handleViewCatalog = () => {
    navigate("/catalog");
  };

  const handleExploreProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleOpenArtisanStory = () => {
    setArtisanSheetOpen(true);
  };

  return (
    <div className="w-full bg-[#0f0b09] text-zinc-100">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[80vh] lg:min-h-[90vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* warm overlay gradient, slightly desaturated */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120806]/95 via-[#1b100c]/80 to-[#3a1b17]/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row gap-16 lg:items-end"
        >
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-4 py-1 text-xs tracking-[0.25em] uppercase text-amber-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
              Handcrafted in Jodhpur, Rajasthan
            </div>

            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] leading-tight max-w-3xl text-amber-50 drop-shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
              Jootiya — Mojris from the blue city, stitched for slow evenings.
            </h1>

            <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-amber-100/80 leading-relaxed">
              A curated edit of authentic Rajasthani mojris, cut and finished in intimate
              Jodhpur ateliers. Each pair carries the memory of Marwar courtyards—barefoot
              steps, quiet rituals, and the soft glint of zardozi under desert light.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-sm tracking-[0.22em] uppercase bg-[#7b1f30] hover:bg-[#8e263a] text-amber-50 border border-amber-300/40 shadow-[0_18px_40px_rgba(0,0,0,0.6)] transition-colors duration-200"
                  onClick={handleViewCatalog}
                >
                  View the catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-sm tracking-[0.22em] uppercase border-amber-200/60 text-amber-100 bg-black/30 hover:bg-black/45 backdrop-blur-sm"
                  onClick={handleOpenArtisanStory}
                >
                  Meet the artisans
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-xs text-amber-100/80">
              <div className="flex items-center gap-2">
                <span className="h-6 w-[1px] bg-amber-300/50" />
                <span>Natural-dyed leathers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-[1px] bg-amber-300/50" />
                <span>Women-led ateliers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-[1px] bg-amber-300/50" />
                <span>Small batch, seasonless drops</span>
              </div>
            </div>
          </div>

          <motion.div
            className="hidden lg:flex flex-1 justify-end"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/40 to-rose-500/10 blur-3xl" />

              <motion.div
                className="relative rounded-3xl bg-black/55 border border-amber-100/15 backdrop-blur-md p-6 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Blue City Edit</p>
                    <p className="font-['Playfair_Display'] text-lg text-amber-50">Featured Mojris</p>
                  </div>
                  <Badge className="rounded-full bg-amber-200 text-[#3b1913] text-[10px] tracking-[0.18em] uppercase px-3 py-1 border border-amber-900/40">
                    Limited
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {featuredProducts.slice(0, 4).map((product) => (
                    <motion.button
                      key={product.id}
                      type="button"
                      className="group relative overflow-hidden rounded-2xl bg-zinc-900/70 border border-amber-100/15 text-left"
                      whileHover={{ y: -3 }}
                      transition={cardHoverTransition}
                      onClick={() => handleExploreProduct(product.id)}
                    >
                      <div
                        className="h-24 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.heroImage || product.images[0]})` }}
                      >
                        <div className="h-full w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[11px] font-medium text-amber-50 truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-amber-200/80">
                          ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="mt-5 text-[11px] text-amber-100/70 leading-relaxed">
                  Every pair in this edit is hand-finished within a few lanes of Mehrangarh Fort,
                  carrying the quiet grain of Jodhpur leather and the memory of courtyard light.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED MASONRY SECTION */}
      <motion.section
        className="w-full py-16 lg:py-24 bg-[#130e0c]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 lg:mb-14">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80 flex items-center gap-2">
                <span className="inline-flex h-1 w-6 rounded-full bg-amber-400" />
                Featured pairs
              </p>
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl text-amber-50">
                A small, deliberate edit of Jodhpur mojris.
              </h2>
              <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
                Curated for different kinds of evenings—bridal rituals, courtyard conversations,
                festival rooftops, and quiet city walks. Each silhouette holds a distinct Marwar
                story in its grain, dye, and stitch.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-amber-100/80">
              <Badge className="rounded-full border border-amber-300/40 bg-amber-950/50 text-amber-100 text-[11px] tracking-[0.18em] uppercase px-3 py-1">
                Zardozi • Gota • Indigo
              </Badge>
              <Badge className="rounded-full border border-rose-200/40 bg-rose-950/40 text-rose-50/90 text-[11px] tracking-[0.18em] uppercase px-3 py-1">
                Jodhpur ateliers only
              </Badge>
            </div>
          </div>

          {/* Asymmetric masonry-like grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-7 auto-rows-[260px] sm:auto-rows-[280px] lg:auto-rows-[320px]">
            {featuredProducts.map((product, index) => {
              const spanClass = (() => {
                if (index === 0) return "sm:row-span-2 xl:row-span-2 xl:col-span-2";
                if (index === 1) return "xl:row-span-2";
                if (index === 4) return "sm:row-span-2";
                return "";
              })();

              return (
                <motion.button
                  key={product.id}
                  type="button"
                  className={`group relative overflow-hidden rounded-3xl border border-amber-100/12 bg-gradient-to-b from-zinc-900/70 via-zinc-900/80 to-black/80 text-left flex flex-col ${spanClass}`}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={cardHoverTransition}
                  onClick={() => handleExploreProduct(product.id)}
                >
                  <div className="relative flex-1 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${product.heroImage || product.images[0]})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <Badge className="rounded-full bg-black/60 text-[10px] uppercase tracking-[0.16em] border border-amber-100/30 text-amber-50/90 px-3 py-1 backdrop-blur-sm">
                        {product.style} • {product.color}
                      </Badge>
                      {index === 0 && (
                        <Badge className="rounded-full bg-[#7b1f30] text-[10px] uppercase tracking-[0.16em] border border-amber-300/50 text-amber-50 px-3 py-1 shadow-[0_10px_25px_rgba(0,0,0,0.65)]">
                          Editor's choice
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <p className="text-xs text-amber-200/80">
                        {product.originCity}, {product.originState}
                      </p>
                      <p className="font-['Playfair_Display'] text-lg sm:text-xl text-amber-50 line-clamp-2">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between gap-2 text-xs text-amber-100/90">
                        <span>₹{product.price.toLocaleString("en-IN")}</span>
                        <span className="flex items-center gap-1 text-amber-200/85">
                          <Sparkles className="h-3 w-3" />
                          {product.craftTechnique.split(" ").slice(0, 2).join(" ")} craft
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-black/80 via-black/70 to-zinc-900/80 border-t border-amber-100/10">
                    <p className="text-[11px] text-amber-100/80 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex flex-col items-end gap-2 min-w-[115px]">
                      <span className="text-[11px] text-amber-200/80 uppercase tracking-[0.18em]">
                        View piece
                      </span>
                      <span className="h-px w-10 bg-amber-300/70 group-hover:w-14 transition-[width] duration-300" />
                    </div>
                  </CardContent>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ARTISAN HIGHLIGHT SECTION */}
      <motion.section
        ref={artisanSectionRef}
        id="artisans"
        className="w-full py-16 lg:py-24 bg-[#0e0a09] border-t border-amber-100/10"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="flex-1 space-y-4 max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80 flex items-center gap-2">
              <span className="inline-flex h-1 w-6 rounded-full bg-amber-400" />
              Atelier stories
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[2.4rem] text-amber-50">
              Behind each pair is a courtyard, a family, a city of blue walls.
            </h2>
            <p className="text-sm sm:text-base text-amber-100/85 leading-relaxed">
              Jootiya works with a small circle of independent Jodhpur ateliers, each with their
              own rhythm—afternoon light, shared chai breaks, and patterns passed down over
              generations. We keep distances short, so stories and stitches travel together.
            </p>

            <div className="pt-4 flex flex-wrap gap-3 text-xs text-amber-100/80">
              <Badge className="rounded-full border border-amber-300/40 bg-amber-950/50 text-amber-100 text-[11px] tracking-[0.18em] uppercase px-3 py-1">
                100% Jodhpur crafted
              </Badge>
              <Badge className="rounded-full border border-emerald-200/40 bg-emerald-950/40 text-emerald-50/90 text-[11px] tracking-[0.18em] uppercase px-3 py-1">
                Slow batch production
              </Badge>
            </div>

            <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} className="pt-6">
              <Button
                variant="outline"
                className="rounded-full border-amber-200/70 bg-black/40 hover:bg-black/60 text-amber-50 px-7 py-5 text-[11px] tracking-[0.2em] uppercase"
                onClick={handleOpenArtisanStory}
              >
                Read the atelier story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {highlightedArtisan && (
            <div className="flex-1 w-full">
              <Card className="relative border border-amber-100/15 bg-gradient-to-br from-zinc-950/90 via-zinc-900/80 to-black/90 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_60%)]" />
                <div className="relative z-10 p-6 sm:p-7 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-amber-100/40 shadow-[0_10px_25px_rgba(0,0,0,0.7)]">
                      <AvatarImage src={highlightedArtisan.avatarUrl} alt={highlightedArtisan.name} />
                      <AvatarFallback className="bg-amber-900/60 text-amber-100">
                        {highlightedArtisan.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-['Playfair_Display'] text-lg text-amber-50">
                        {highlightedArtisan.name}
                      </p>
                      <p className="text-xs text-amber-100/80">
                        {highlightedArtisan.atelierName}
                      </p>
                      <p className="text-[11px] text-amber-200/80">
                        {highlightedArtisan.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap text-[11px] text-amber-100/80">
                    <span>
                      {highlightedArtisan.yearsOfCraft}+ years of craft • Lineage: {highlightedArtisan.lineage}
                    </span>
                  </div>

                  <div className="relative mt-1">
                    <Quote className="absolute -left-1 -top-2 h-6 w-6 text-amber-300/40" />
                    <p className="pl-6 text-sm sm:text-base text-amber-50/90 leading-relaxed">
                      {highlightedArtisan.bioShort}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {highlightedArtisan.specialties.slice(0, 3).map((spec) => (
                      <Badge
                        key={spec}
                        className="border border-amber-300/35 bg-amber-50/5 text-amber-100 text-[10px] tracking-[0.16em] uppercase rounded-full px-3 py-1"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3 text-[11px] text-amber-100/75 leading-relaxed">
                    <p className="line-clamp-3">{highlightedArtisan.bioLong}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </motion.section>

      {/* ARTISAN STORY SHEET (SLIDE-OVER) */}
      {highlightedArtisan && (
        <Sheet open={artisanSheetOpen} onOpenChange={setArtisanSheetOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md lg:max-w-xl bg-[#0d0907] border-l border-amber-100/20 text-amber-50 overflow-y-auto"
          >
            <SheetHeader className="space-y-3 mb-4 pt-4">
              <SheetTitle className="font-['Playfair_Display'] text-2xl text-amber-50 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-900/70 border border-amber-300/50">
                  <Sparkles className="h-4 w-4 text-amber-200" />
                </span>
                {highlightedArtisan.atelierName}
              </SheetTitle>
              <SheetDescription className="text-amber-100/80 text-sm leading-relaxed">
                {highlightedArtisan.location} • {highlightedArtisan.yearsOfCraft}+ years of mojri
                making • Languages: {highlightedArtisan.languages.join(", ")}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 pb-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-amber-100/40">
                  <AvatarImage src={highlightedArtisan.avatarUrl} alt={highlightedArtisan.name} />
                  <AvatarFallback className="bg-amber-900/60 text-amber-100">
                    {highlightedArtisan.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-['Playfair_Display'] text-lg text-amber-50">
                    {highlightedArtisan.name}
                  </p>
                  <p className="text-xs text-amber-100/80">{highlightedArtisan.lineage}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-['Playfair_Display'] text-xl text-amber-50">
                  A courtyard in the blue city
                </h3>
                <p className="text-sm text-amber-100/85 leading-relaxed whitespace-pre-line">
                  {highlightedArtisan.bioLong}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-['Playfair_Display'] text-lg text-amber-50">
                  Making a pair of mojris, step by step
                </h4>
                <div className="relative pl-4 border-l border-amber-100/20 space-y-4">
                  {highlightedArtisan.makingProcessSteps.map((step, index) => (
                    <div key={index} className="relative flex gap-3">
                      <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#7b1f30] border border-amber-200/80 shadow-[0_0_0_4px_rgba(124,31,48,0.5)]" />
                      <div className="ml-3 space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/80">
                          Step {index + 1}
                        </p>
                        <p className="text-sm text-amber-50/90 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {highlightedArtisan.sustainabilityNotes && (
                <div className="space-y-3">
                  <h4 className="font-['Playfair_Display'] text-lg text-amber-50">
                    Sustainability & community
                  </h4>
                  <p className="text-sm text-amber-100/85 leading-relaxed">
                    {highlightedArtisan.sustainabilityNotes}
                  </p>
                </div>
              )}

              {highlightedArtisan.awards.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-['Playfair_Display'] text-lg text-amber-50">Recognitions</h4>
                  <ul className="space-y-2 text-sm text-amber-100/85">
                    {highlightedArtisan.awards.map((award) => (
                      <li key={award} className="flex items-start gap-2">
                        <span className="mt-[6px] h-[3px] w-6 rounded-full bg-amber-300/80" />
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default HomePage;