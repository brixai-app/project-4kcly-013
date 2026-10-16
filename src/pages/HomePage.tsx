import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui/shadcn";
import { getFeaturedProducts, getLookbookSlides, formatPrice, Product } from "@/mock";

// NOTE: This entire page uses mocked client-only data from src/mock.ts.
// There is NO backend – all products & editorial slides are mock data.

const GOLD = "#BFA06F";

const useAutoplay = (length: number, delayMs: number = 6500) => {
  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!length) return;
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, delayMs);
    return () => window.clearInterval(timer);
  }, [length, delayMs, isPaused]);

  return { index, setIndex, isPaused, setIsPaused };
};

const HeroCarousel: React.FC = () => {
  const slides = React.useMemo(() => getLookbookSlides(), []);
  const { index, setIndex, isPaused, setIsPaused } = useAutoplay(slides.length);

  const active = slides[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  if (!active) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#111111] text-[#F5F1EB]">
      <div
        className="relative flex min-h-[70vh] flex-col lg:min-h-[80vh]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full w-full"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${active.image})`,
                  filter: "grayscale(10%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-end">
            <div className="max-w-xl space-y-6 lg:space-y-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[#BFA06F]">
                Jootiya • Editorial Sneaker Salon
              </p>
              <h1 className="font-['Playfair_Display'] text-4xl font-semibold leading-tight text-[#F5F1EB] sm:text-5xl md:text-6xl">
                A gallery of
                <span className="block font-['Bodoni_Moda'] text-[2.8rem] sm:text-[3.4rem] md:text-[4rem]">
                  considered steps.
                </span>
              </h1>
              <p className="max-w-lg font-['Lato'] text-sm leading-relaxed text-neutral-200 sm:text-base">
                Curated sneakers and footwear for evenings that stretch past midnight and mornings that begin above the city. Shot like editorials, crafted like heirlooms.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-none border border-[rgba(191,160,111,0.7)] bg-[rgba(191,160,111,0.92)] px-7 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#111111] shadow-sm transition-colors hover:bg-[#d4b986] focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
                >
                  <Link to="/catalog">Explore the catalog</Link>
                </Button>
                <button
                  type="button"
                  className="group inline-flex items-center gap-2 border-b border-neutral-400/60 pb-1 text-xs font-medium uppercase tracking-[0.25em] text-neutral-200 transition-colors hover:border-[#BFA06F] hover:text-[#BFA06F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
                  onClick={handleNext}
                >
                  Next story
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.25em] text-neutral-400">
                <span>
                  Slide {index + 1} of {slides.length}
                </span>
                <span className="hidden h-px flex-1 bg-neutral-600/60 sm:block" aria-hidden="true" />
                <span className="hidden sm:block">
                  {isPaused ? "Autoplay paused" : "Autoplay • hover to pause"}
                </span>
              </div>
            </div>

            <div className="mt-10 flex-1 lg:mt-0 lg:max-w-md">
              <Card className="rounded-none border border-neutral-700/70 bg-black/55 backdrop-blur-sm">
                <CardContent className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-['Lato'] text-[0.75rem] uppercase tracking-[0.25em] text-neutral-400">
                        Tonight's pair
                      </p>
                      <h2 className="mt-2 font-['Bodoni_Moda'] text-lg font-semibold text-[#F5F1EB]">
                        {active.headline}
                      </h2>
                      <p className="mt-1 font-['Lato'] text-xs text-neutral-300">
                        {active.subcopy}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label="Previous slide"
                          className="inline-flex h-7 w-7 items-center justify-center border border-neutral-600/70 bg-black/40 text-neutral-200 transition-colors hover:border-[#BFA06F] hover:text-[#BFA06F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label="Next slide"
                          className="inline-flex h-7 w-7 items-center justify-center border border-neutral-600/70 bg-black/40 text-neutral-200 transition-colors hover:border-[#BFA06F] hover:text-[#BFA06F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPaused((p) => !p)}
                        className="text-[0.65rem] uppercase tracking-[0.22em] text-neutral-400 underline-offset-4 hover:text-[#BFA06F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        {isPaused ? "Resume autoplay" : "Pause autoplay"}
                      </button>
                    </div>
                  </div>
                  <p className="max-w-sm border-t border-neutral-700/70 pt-4 font-['Lato'] text-xs leading-relaxed text-neutral-200">
                    Each pair within the Jootiya lookbook is styled as a scene rather than a product: soft light, slow evenings, and textures that reveal themselves only up close.
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-700/70 pt-4">
                    <div className="flex flex-col text-[0.7rem] uppercase tracking-[0.25em] text-neutral-400">
                      <span>Shot in natural light</span>
                      <span>Limited pairs per story</span>
                    </div>
                    <div className="flex gap-1.5">
                      {slides.map((s, i) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setIndex(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          className={`h-1.5 w-5 transition-colors ${
                            i === index
                              ? "bg-[#BFA06F]"
                              : "bg-neutral-600/80 hover:bg-neutral-400/90"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface EditorialTileProps {
  product: Product;
  layout: "vertical" | "horizontal" | "overlay";
}

const EditorialTile: React.FC<EditorialTileProps> = ({ product, layout }) => {
  const image = product.images[0];

  const baseImage = (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative block h-full w-full overflow-hidden bg-[#111111]"
    >
      <div
        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})`, filter: "grayscale(12%)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    </motion.div>
  );

  return (
    <article className="relative flex h-full w-full flex-col overflow-hidden border border-neutral-800/80 bg-[#111111] text-[#F5F1EB] shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
      <div className="relative h-64 w-full sm:h-72 md:h-80 lg:h-96">
        {baseImage}
      </div>
      <div
        className={`relative flex flex-1 flex-col justify-between bg-[#111111] px-5 py-4 sm:px-6 sm:py-5 ${
          layout === "horizontal" ? "md:flex-row md:gap-6" : "gap-3"
        }`}
      >
        <div className="space-y-1.5 md:max-w-xs">
          <p className="font-['Lato'] text-[0.6rem] uppercase tracking-[0.28em] text-neutral-400">
            {product.brand} • {product.category}
          </p>
          <h3 className="font-['Bodoni_Moda'] text-lg font-semibold tracking-wide text-[#F5F1EB]">
            {product.name}
          </h3>
          <p className="font-['Lato'] text-xs leading-relaxed text-neutral-300">
            {product.description.split(".")[0]}.
          </p>
        </div>
        <div className="mt-3 flex flex-col justify-between gap-3 md:mt-0 md:items-end">
          <div className="text-right">
            <p className="font-['Lato'] text-[0.7rem] uppercase tracking-[0.26em] text-neutral-400">
              From
            </p>
            <p className="font-['Playfair_Display'] text-base text-[#BFA06F]">
              {formatPrice(product.price)}
            </p>
          </div>
          <Button
            asChild
            className="rounded-none border border-[#BFA06F]/80 bg-[#BFA06F] px-5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#111111] shadow-sm transition-colors hover:bg-[#d4b986] focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
          >
            <Link to={`/product/${product.id}`}>View story</Link>
          </Button>
        </div>
      </div>
      {layout === "overlay" && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/10 to-transparent px-6 pb-5">
          <div>
            <p className="font-['Lato'] text-[0.6rem] uppercase tracking-[0.28em] text-neutral-300">
              Limited Edition • Lookbook
            </p>
            <p className="font-['Playfair_Display'] text-lg text-[#F5F1EB]">
              {product.name}
            </p>
          </div>
          <p className="font-['Lato'] text-[0.65rem] uppercase tracking-[0.28em] text-[#BFA06F]">
            {formatPrice(product.price)}
          </p>
        </div>
      )}
    </article>
  );
};

const CollectionPreview: React.FC = () => {
  const featured = React.useMemo(() => getFeaturedProducts(6), []);

  if (!featured.length) return null;

  const [primary, secondary, ...rest] = featured;

  return (
    <section className="bg-[#0b0b0b] py-16 text-[#F5F1EB] sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="font-['Lato'] text-[0.65rem] uppercase tracking-[0.3em] text-neutral-400">
              The Curated Six
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#F5F1EB] sm:text-3xl">
              A week in pairs.
            </h2>
            <p className="max-w-xl font-['Lato'] text-xs leading-relaxed text-neutral-300 sm:text-sm">
              Think of it as a visual packing list for a life lived between penthouses, galleries, and quietly lit alleyways. Six silhouettes that dress every hour from first espresso to last rooftop.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 text-left md:items-end md:text-right">
            <p className="max-w-xs font-['Lato'] text-[0.75rem] leading-relaxed text-neutral-300">
              Shot like an editorial and arranged as an asymmetric gallery. Hover, pause, and let each pair tell you where it wants to take you.
            </p>
            <Button
              asChild
              className="rounded-none border border-[#BFA06F]/90 bg-transparent px-6 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#BFA06F] transition-colors hover:bg-[#BFA06F] hover:text-[#111111] focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
            >
              <Link to="/catalog">Enter catalog</Link>
            </Button>
          </div>
        </header>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-6 sm:auto-rows-[280px] md:grid-cols-6 md:auto-rows-[260px]">
          {/* Left tall feature */}
          <div className="md:col-span-3 md:row-span-2">
            <EditorialTile product={primary} layout="vertical" />
          </div>

          {/* Right upper wide tile */}
          {secondary && (
            <div className="md:col-span-3 md:row-span-1">
              <EditorialTile product={secondary} layout="horizontal" />
            </div>
          )}

          {/* Remaining tiles in varied spans */}
          {rest.map((p, i) => (
            <div
              key={p.id}
              className={
                i === 0
                  ? "md:col-span-2 md:row-span-1"
                  : i === 1
                  ? "md:col-span-2 md:row-span-1"
                  : "md:col-span-2 md:row-span-1"
              }
            >
              <EditorialTile
                product={p}
                layout={i === 0 ? "overlay" : i === 1 ? "horizontal" : "vertical"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F1EB]">
      <HeroCarousel />
      <CollectionPreview />
      <section className="border-t border-neutral-900 bg-[#050505] py-14 text-[#F5F1EB] sm:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <p className="font-['Lato'] text-[0.65rem] uppercase tracking-[0.32em] text-neutral-400">
              The Jootiya Edit
            </p>
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#F5F1EB] sm:text-3xl">
              Slow luxury for fast cities.
            </h2>
            <p className="max-w-xl font-['Lato'] text-xs leading-relaxed text-neutral-300 sm:text-sm">
              Jootiya isn’t about hype drops or flashing logos. It’s about the quiet moment when a pair of shoes feels like a memory you haven’t lived yet. We obsess over leather grain, last shapes, and the sound a sole makes on marble.
            </p>
            <p className="max-w-xl font-['Lato'] text-xs leading-relaxed text-neutral-300 sm:text-sm">
              Every collection is photographed as an editorial story, then translated into an intimate digital gallery. Browse, linger, and assemble a rotation that feels as considered as your favorite playlist.
            </p>
          </div>
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="border border-neutral-800 bg-[#0b0b0b] p-4 shadow-[0_16px_35px_rgba(0,0,0,0.6)]">
                <p className="font-['Lato'] text-[0.6rem] uppercase tracking-[0.26em] text-neutral-400">
                  Tactility
                </p>
                <p className="mt-2 font-['Playfair_Display'] text-sm text-[#F5F1EB]">
                  Italian calf, city-proof soles.
                </p>
              </div>
              <div className="border border-neutral-800 bg-[#0b0b0b] p-4 shadow-[0_16px_35px_rgba(0,0,0,0.6)]">
                <p className="font-['Lato'] text-[0.6rem] uppercase tracking-[0.26em] text-neutral-400">
                  Curation
                </p>
                <p className="mt-2 font-['Playfair_Display'] text-sm text-[#F5F1EB]">
                  Fewer pairs, sharper stories.
                </p>
              </div>
              <div className="border border-neutral-800 bg-[#0b0b0b] p-4 shadow-[0_16px_35px_rgba(0,0,0,0.6)]">
                <p className="font-['Lato'] text-[0.6rem] uppercase tracking-[0.26em] text-neutral-400">
                  Ease
                </p>
                <p className="mt-2 font-['Playfair_Display'] text-sm text-[#F5F1EB]">
                  Cart, checkout, done in moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;