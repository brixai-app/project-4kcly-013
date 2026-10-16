import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/shadcn";

// Refined minimal footer for Jootiya
// Pure presentational component; all data/state for the app lives in src/mock.ts

const footerLinks: { label: string; href: string }[] = [
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
  { label: "Care", href: "#" },
  { label: "Contact", href: "#" },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Branding */}
          <div className="space-y-1">
            <p className="text-sm tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-400">
              Jootiya
            </p>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Jootiya 
              <span className="mx-1 text-zinc-400">—</span>
              Luxury Footwear &amp; Sneakers
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="relative pb-0.5 transition-colors duration-150 ease-out hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <span className="inline-flex items-center gap-1">
                  <span>{item.label}</span>
                  <span className="h-px w-3 origin-left scale-x-0 bg-amber-600/80 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-6 border-zinc-200 dark:border-zinc-800" />

        <div className="flex flex-col gap-3 text-[11px] text-zinc-500 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Jootiya Studio. All rights reserved.
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            This is a 100% frontend-only, mock storefront experience — no backend or real payments.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;