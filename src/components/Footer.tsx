import React from "react";
import { Separator } from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "w-full border-t border-neutral-200/70 dark:border-neutral-800/80 bg-[#f6f0e8] dark:bg-slate-950/95 text-neutral-800 dark:text-neutral-100",
        "mt-16",
        className,
      )}
    >
      {/* Subtle divider to echo editorial layouts */}
      <Separator className="w-full border-neutral-200/70 dark:border-neutral-800/80" />

      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-12 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand & story */}
          <div className="md:col-span-5 flex flex-col gap-3 min-w-0">
            <div className="text-2xl tracking-wide font-semibold font-['Playfair_Display'] text-[#1e2240] dark:text-slate-50">
              Jootiya
            </div>
            <p className="text-sm leading-relaxed text-neutral-700/90 dark:text-neutral-300">
              A curated salon of Rajasthani mojris, crafted by hand in small ateliers across
              Jaipur and Jodhpur. Each pair celebrates leather, pattern, and the quiet rituals of
              dressing well.
            </p>
          </div>

          {/* Navigation columns */}
          <div className="md:col-span-4 flex flex-col sm:flex-row gap-8 min-w-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium tracking-[0.18em] uppercase text-neutral-600 dark:text-neutral-400 mb-3">
                Explore
              </h3>
              <nav className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 hover:text-[#9a6a32] dark:hover:text-amber-300 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 hover:text-[#9a6a32] dark:hover:text-amber-300 transition-colors"
                >
                  Catalog
                </a>
                <a
                  href="/cart"
                  className="inline-flex items-center gap-1.5 hover:text-[#9a6a32] dark:hover:text-amber-300 transition-colors"
                >
                  Cart
                </a>
                <a
                  href="/#artisans"
                  className="inline-flex items-center gap-1.5 hover:text-[#9a6a32] dark:hover:text-amber-300 transition-colors"
                >
                  Artisan stories
                </a>
              </nav>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium tracking-[0.18em] uppercase text-neutral-600 dark:text-neutral-400 mb-3">
                Care & Details
              </h3>
              <ul className="flex flex-col gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-baseline gap-2">
                  <span className="h-[3px] w-[3px] rounded-full bg-neutral-500/60 dark:bg-neutral-400/70" />
                  <span>Handcrafted in Rajasthan, India</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="h-[3px] w-[3px] rounded-full bg-neutral-500/60 dark:bg-neutral-400/70" />
                  <span>Responsibly sourced leathers</span>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="h-[3px] w-[3px] rounded-full bg-neutral-500/60 dark:bg-neutral-400/70" />
                  <span>Limited, small-batch editions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter & socials (purely visual, no backend) */}
          <div className="md:col-span-3 flex flex-col gap-3 min-w-0">
            <h3 className="text-xs font-medium tracking-[0.18em] uppercase text-neutral-600 dark:text-neutral-400">
              Stay close to the atelier
            </h3>
            <p className="text-sm text-neutral-700/90 dark:text-neutral-300 mb-1">
              Receive occasional studio notes on new drops, care rituals, and journeys across
              Rajasthan. Entirely optional, forever respectful.
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              This is a frontend-only demo. Subscribing here does not send data to any server.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <SocialLink href="https://instagram.com" label="Instagram" />
              <SocialLink href="https://pinterest.com" label="Pinterest" />
              <SocialLink href="mailto:studio@jootiya.in" label="Email Studio" />
            </div>
          </div>
        </div>

        <Separator className="w-full border-neutral-200/70 dark:border-neutral-800/80" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
          <p>
            © {currentYear} Jootiya. A lovingly crafted mock storefront celebrating Rajasthani
            mojris. Frontend-only; all data is stored in your browser.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Crafted for exploration.</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300/70 dark:border-neutral-700/80 px-3 py-1 text-[11px] tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9a6a32]" />
              <span className="font-medium">Mock Experience</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-medium tracking-wide uppercase inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-200 hover:text-[#9a6a32] dark:hover:text-amber-300 border-b border-transparent hover:border-[#9a6a32]/70 dark:hover:border-amber-300/70 transition-colors"
    >
      <span className="h-[3px] w-[3px] rounded-full bg-neutral-500/70 dark:bg-neutral-300" />
      {label}
    </a>
  );
};

export default Footer;