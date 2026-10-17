import React from "react";
import { motion } from "framer-motion";
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/shadcn";
import { Instagram, Facebook, Globe2, ArrowUpRight } from "lucide-react";

// NOTE: This component is 100% frontend-only and purely presentational.
// All data such as social links here is mocked on the client – there is NO backend.

const footerMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200/70 bg-neutral-50/95 text-neutral-900 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95 dark:text-neutral-100">
      {/* Inner rhythm container but full-width section */}
      <motion.div
        className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-6 py-10 lg:px-12 lg:py-12"
        {...footerMotion}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Top row: brand + tagline + social */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-baseline gap-3">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-700/80 dark:text-amber-400/80">
                Jodhpur · Mojri Atelier
              </span>
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
              Jootiya
              <span className="ml-3 inline-block align-middle text-xs font-medium uppercase tracking-[0.22em] text-amber-700/90 dark:text-amber-400/90">
                Footnotes of Marwar
              </span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-700/90 dark:text-neutral-300/90">
              An editorial ode to Rajasthani mojris from the blue lanes of Jodhpur —
              celebrating hand-stitched silhouettes, heirloom motifs and everyday quiet luxury.
              This is a fully mocked, frontend-only experience: no servers, just stories.
            </p>
          </div>

          {/* Social cluster */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <span className="text-xs font-medium tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              FOLLOW THE CRAFT
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-neutral-300 bg-neutral-50 text-neutral-900 hover:border-amber-700/80 hover:bg-amber-50/80 hover:text-amber-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-amber-400/80 dark:hover:bg-amber-950/60 dark:hover:text-amber-200"
                    aria-label="Mock Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-neutral-900 text-xs text-neutral-50">
                  Mock link — Instagram editorial feed
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-neutral-300 bg-neutral-50 text-neutral-900 hover:border-amber-700/80 hover:bg-amber-50/80 hover:text-amber-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-amber-400/80 dark:hover:bg-amber-950/60 dark:hover:text-amber-200"
                    aria-label="Mock Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-neutral-900 text-xs text-neutral-50">
                  Mock link — Facebook craft diary
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-neutral-300 bg-neutral-50 text-neutral-900 hover:border-emerald-700/80 hover:bg-emerald-50/80 hover:text-emerald-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-emerald-400/80 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
                    aria-label="Mock website"
                  >
                    <Globe2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-neutral-900 text-xs text-neutral-50">
                  Mock link — Studio journal from Jodhpur
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <Separator className="border-neutral-200/80 dark:border-neutral-800" />

        {/* Middle row: small navigation + note */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              EDITORIAL INDEX
            </span>
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:bg-neutral-100/80 hover:text-amber-900 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-amber-300"
            >
              Lookbook
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:bg-neutral-100/80 hover:text-amber-900 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-amber-300"
            >
              Artisan Map
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-700 hover:bg-neutral-100/80 hover:text-amber-900 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:hover:text-amber-300"
            >
              Care Notes
            </Button>
          </div>

          <div className="flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-300">
            <ArrowUpRight className="mt-[2px] h-3 w-3 text-amber-700/90 dark:text-amber-400/90" />
            <p className="max-w-md leading-relaxed">
              Every mojri in Jootiya is a story first and a product later. This interface is a
              dramatized, mock storefront — feel free to wander, add to cart, and checkout purely
              for the joy of it.
            </p>
          </div>
        </div>

        <Separator className="border-neutral-200/80 dark:border-neutral-800" />

        {/* Bottom row: legal + copyright */}
        <div className="flex flex-col gap-4 text-[11px] text-neutral-500 md:flex-row md:items-center md:justify-between dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tracking-[0.18em]">
              © {year} Jootiya — Mock Luxury Mojri Editorial
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-[11px] uppercase tracking-[0.18em] text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
            >
              Privacy
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-7 px-2 text-[11px] uppercase tracking-[0.18em] text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
            >
              Terms
            </Button>
            <span className="hidden h-3 w-px bg-neutral-300 md:inline-block dark:bg-neutral-700" />
            <span className="leading-relaxed">
              Crafted as a 100% frontend-only mock — no orders are processed, no data leaves your
              browser.
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;