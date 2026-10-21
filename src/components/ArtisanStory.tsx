import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui/shadcn";
import { Artisan, Product, formatPriceINR } from "@/mock";
import { cn } from "@/lib/utils";

export interface ArtisanStoryProps {
  artisan: Artisan;
  /**
   * Optional subset of products to highlight for this artisan.
   * If omitted, the caller can still showcase the bio without product chips.
   */
  featuredProducts?: Product[];
  /**
   * When true, section will span full viewport height for more immersive hero storytelling.
   */
  fullHeight?: boolean;
  /**
   * Optional section id (e.g. "artisans") so Header can deep-link.
   */
  id?: string;
  className?: string;
}

/**
 * Editorial artisan feature block.
 * NOTE: All data is fully mocked and comes from src/mock.ts. There is **no** backend.
 */
export const ArtisanStory: React.FC<ArtisanStoryProps> = ({
  artisan,
  featuredProducts,
  fullHeight = false,
  id,
  className,
}) => {
  const hasProducts = !!featuredProducts && featuredProducts.length > 0;

  return (
    <section
      id={id}
      className={cn(
        "w-full relative overflow-hidden bg-[#0b1020] text-sand-50", // deep indigo base
        fullHeight ? "min-h-[70vh]" : "py-16 lg:py-20",
        className,
      )}
    >
      {/* Image + color overlay full-bleed background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Workshop image as soft background on larger screens */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center opacity-40 md:opacity-60",
          )}
          style={{ backgroundImage: `url(${artisan.workshopImage})` }}
        />
        {/* Gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050712]/95 via-[#050712]/85 to-transparent" />
        {/* Soft ochre glow accent on the right */}
        <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-gradient-to-tr from-[#e2a94f33] via-[#f7d38b22] to-transparent blur-3xl" />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch py-12",
            fullHeight && "lg:py-20",
          )}
        >
          {/* Left: Portrait & craft snapshot */}
          <div className="lg:col-span-5 min-w-0 flex flex-col gap-6">
            <Card className="bg-[#070a16]/80 border-white/10 backdrop-blur-md text-sand-50 shadow-md">
              <CardContent className="p-5 lg:p-6 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                  {/* Portrait */}
                  <div className="relative w-full sm:w-40 md:w-44 aspect-[4/5] overflow-hidden rounded-3xl border border-white/15 shadow-md">
                    <img
                      src={artisan.portraitImage}
                      alt={artisan.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1">
                      <Badge className="w-fit rounded-full bg-ochre-500/90 text-[#24160b] text-[11px] tracking-wide uppercase">
                        Mojri Artisan
                      </Badge>
                      <span className="text-xs text-sand-100/90 font-medium">
                        {artisan.yearsOfPractice}+ years at the karkhana
                      </span>
                    </div>
                  </div>

                  {/* Region & quick meta */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg lg:text-xl font-semibold tracking-wide font-['Playfair_Display'] text-sand-50 whitespace-normal break-words">
                          {artisan.name}
                        </h3>
                        <Sparkles className="h-4 w-4 text-ochre-300 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-sand-200/80">
                        <MapPin className="h-3.5 w-3.5 text-ochre-300" />
                        <span>{artisan.region}</span>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-sand-100/85">
                      {artisan.bio}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge className="rounded-full bg-deep-indigo-500/30 border-white/20 text-[11px] font-medium text-sand-50 px-3 py-1">
                        Hand-stitched leather
                      </Badge>
                      <Badge className="rounded-full bg-sand-900/40 border-white/15 text-[11px] font-medium text-sand-100 px-3 py-1">
                        Heritage craft
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs text-sand-100/70 leading-relaxed">
                  {artisan.craftNotes}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Long-form story & featured Mojris */}
          <div className="lg:col-span-7 min-w-0 flex flex-col gap-6 lg:gap-7">
            <header className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 w-full">
                <span className="h-px flex-1 bg-gradient-to-r from-ochre-400/70 via-ochre-300/30 to-transparent" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-ochre-200/90 font-medium">
                  Artisan Story
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] leading-tight font-['Playfair_Display'] text-sand-50 whitespace-normal break-words">
                Mojris cut between desert light and palace shadow.
              </h2>

              <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-sand-100/85">
                Each pair from {artisan.name.split(" ")[0]}’s table carries the quiet marks of hand
                work—subtle stitch irregularities, the mellow sheen of naturally cured leather,
                and silhouettes tuned to move between anklets, denim, and everything in between.
              </p>
            </header>

            {/* Narrative paragraphs */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-sand-100/80">
              <p>
                In {artisan.region.split(",")[0]}, mornings begin with tracing paper and chalk. Last
                season’s patterns are laid beside new commissions; soles are checked for flexibility;
                uppers are inspected against slivers of Rajasthan’s changing light.
              </p>
              <p>
                {artisan.name.split(" ")[0]} still cuts most pairs by hand, leaning into instinct more
                than measurement. The curve of each toe, the height of every vamp, is tested on
                relatives’ feet and refined over chai-fuelled arguments.
              </p>
              <p>
                The result is a mojri that refuses to stay ceremonial. These pairs are built for
                boardrooms in Mumbai, cobblestones in Florence, and midnight terraces in Jaipur—soft
                enough for long days, considered enough for the most intimate mehfils.
              </p>
            </div>

            {/* Featured products row */}
            {hasProducts && (
              <div className="mt-2 flex flex-col gap-4">
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold tracking-wide text-sand-50 uppercase">
                      Mojris from this atelier
                    </h3>
                    <p className="text-xs text-sand-100/75">
                      Limited pairs, cut in small batches and finished by hand.
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="border-ochre-400/60 bg-black/10 text-sand-50 hover:bg-ochre-500/10 hover:border-ochre-300 rounded-full px-4 py-2 text-xs font-medium"
                  >
                    <Link to="/catalog" className="flex items-center gap-1.5">
                      <span>View full catalog</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                  {featuredProducts!.slice(0, 3).map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                      className="min-w-0"
                    >
                      <Card className="group h-full overflow-hidden border-white/10 bg-[#050712]/80 backdrop-blur-sm text-sand-50 shadow-sm flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={product.primaryImage}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute left-4 bottom-3 flex flex-col gap-1">
                            <Badge className="rounded-full bg-ochre-500/95 text-[#23160c] text-[10px] tracking-wide uppercase">
                              Limited batch
                            </Badge>
                            {product.highlight && (
                              <span className="text-[11px] text-sand-50/95 whitespace-normal break-words max-w-[14rem]">
                                {product.highlight}
                              </span>
                            )}
                          </div>
                        </div>
                        <CardHeader className="px-4 pt-4 pb-1 flex-1">
                          <CardTitle className="text-sm font-semibold tracking-wide font-['Playfair_Display'] whitespace-normal break-words text-sand-50">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="mt-1 text-xs text-sand-100/75 whitespace-normal break-words">
                            {product.storyIntro}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-ochre-300">
                            {formatPriceINR(product.price)}
                          </span>
                          <Button
                            asChild
                            size="sm"
                            className="rounded-full bg-sand-50 text-[#18110b] hover:bg-ochre-200 px-3 py-1.5 h-8 text-xs font-medium"
                          >
                            <Link to={`/product/${product.id}`} className="flex items-center gap-1.5">
                              <span>View pair</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArtisanStory;