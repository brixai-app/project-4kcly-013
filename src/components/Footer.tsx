import React from "react";
import { Mail, Phone, MapPin, Instagram, Lamp, Youtube } from "lucide-react";
import {
  Button,
  Separator,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Badge,
} from "@/components/ui/shadcn";

// NOTE: This app is 100% frontend-only. All data and interactions here are purely
// mocked on the client with no backend.

const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/jootiya.mojris",
    icon: Instagram,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    href: "https://pinterest.com/jootiya-mojris",
    // lucide-react does not expose a Pinterest icon; use a visually light placeholder.
    icon: Lamp,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@jootiya-studio",
    icon: Youtube,
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-200/70 bg-gradient-to-b from-stone-50 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-950 dark:to-black text-neutral-800 dark:text-stone-200">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Atelier Contact */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-3">
              <span className="tracking-[0.25em] uppercase text-xs text-neutral-500 dark:text-stone-400">
                Jootiya Atelier
              </span>
              <Separator className="w-8 bg-neutral-300/80 dark:bg-stone-700" />
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold font-['Playfair_Display'] tracking-tight text-neutral-900 dark:text-stone-50">
              Quiet luxury, stitched in the blue city.
            </h2>

            <p className="max-w-xl text-sm md:text-[15px] leading-relaxed text-neutral-700/90 dark:text-stone-300/90">
              Jootiya is a slow-footwear studio dedicated solely to authentic Rajasthani
              mojris. Each pair is cut, embroidered, and finished in intimate ateliers
              across Jodhpur&apos;s older quarters.
            </p>

            <div className="space-y-2 text-sm md:text-[15px]">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-stone-300">
                <Mail className="h-4 w-4 text-neutral-500 dark:text-stone-400" />
                <a
                  href="mailto:atelier@jootiya.in"
                  className="underline-offset-4 hover:underline decoration-neutral-400 dark:decoration-stone-500"
                >
                  atelier@jootiya.in
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-stone-300">
                <Phone className="h-4 w-4 text-neutral-500 dark:text-stone-400" />
                <a
                  href="tel:+919810123456"
                  className="underline-offset-4 hover:underline decoration-neutral-400 dark:decoration-stone-500"
                >
                  +91 98101 23456
                </a>
              </div>
              <div className="flex items-start gap-2 text-neutral-700 dark:text-stone-300">
                <MapPin className="h-4 w-4 mt-0.5 text-neutral-500 dark:text-stone-400" />
                <p>
                  Old City &amp; Navchokiya ateliers,
                  <br />
                  Jodhpur, Rajasthan, India
                </p>
              </div>
            </div>
          </div>

          {/* Social & Authenticity */}
          <div className="w-full lg:w-[360px] space-y-6">
            <div className="space-y-3">
              <p className="text-xs tracking-[0.24em] uppercase text-neutral-500 dark:text-stone-500">
                Find us between arches &amp; alleys
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Tooltip key={social.id}>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="group h-9 rounded-full border-neutral-300/70 bg-neutral-50/60 text-neutral-800 hover:bg-[#7a1f2a] hover:text-amber-50 hover:border-[#7a1f2a] dark:bg-stone-900/80 dark:text-stone-100 dark:border-stone-700 dark:hover:bg-[#a43a3a] dark:hover:border-[#a43a3a] px-3 text-xs font-medium tracking-wide transition-colors duration-200"
                        >
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5" />
                              <span>{social.label}</span>
                            </span>
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border-neutral-200/80 bg-neutral-50/95 text-neutral-800 dark:bg-stone-900/95 dark:text-stone-100"
                      >
                        <p className="text-xs">
                          Open curated mojri edits on {social.label}.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-neutral-200/80 dark:bg-stone-800" />

            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-500/40 bg-amber-50/60 px-3 py-1.5 shadow-[0_0_25px_rgba(0,0,0,0.02)] dark:bg-zinc-900/70 dark:border-amber-400/40">
                <Badge
                  variant="outline"
                  className="border-amber-500/70 bg-amber-100/70 text-[10px] font-semibold tracking-[0.18em] uppercase text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"
                >
                  Handcrafted in Jodhpur
                </Badge>
                <span className="text-[11px] text-neutral-800 dark:text-stone-200">
                  Each pair is signed at the atelier.
                </span>
              </div>

              <p className="text-xs md:text-[13px] leading-relaxed text-neutral-700/90 dark:text-stone-300/90">
                <span className="font-medium text-neutral-900 dark:text-stone-50">
                  Authenticity pledge:
                </span>{" "}
                Every Jootiya mojri is made in limited batches, documented with its
                artisan, technique, and place of making. We do not work with
                mass-produced replicas or factory knock-offs.
              </p>
            </div>
          </div>
        </div>

        <Separator className="mt-10 mb-6 bg-neutral-200/80 dark:bg-stone-800" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] md:text-xs text-neutral-600 dark:text-stone-400">
          <p>
            © {currentYear} Jootiya Studio. A mock, frontend-only editorial experience
            celebrating Rajasthani mojris from Jodhpur.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <p className="italic">
              Built as a design-forward prototype with client-side mocks—no backend,
              no tracking.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;