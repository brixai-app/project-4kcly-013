import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/shadcn";

// NOTE: This app currently uses a fully client-side mocked data layer in src/mock.ts
// There is NO backend; cart and orders are persisted only in localStorage.

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[rgba(43,43,43,0.15)] bg-[#F5F1EB] text-[#2B2B2B] dark:border-[rgba(245,241,235,0.14)] dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Upper section: tagline + minimal links */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-600 dark:text-neutral-400">
              Jootiya Editorial Footwear
            </p>
            <p className="font-['Lato'] text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 sm:text-base">
              Crafted for the quietly discerning. Limited-run sneakers and footwear
              designed to move effortlessly from gallery light to midnight cities.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-['Lato'] uppercase tracking-[0.22em] text-neutral-700 dark:text-neutral-300">
            <Link
              to="/"
              className="relative inline-flex items-center border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#BFA06F] hover:text-[#BFA06F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1EB] dark:focus-visible:ring-offset-neutral-950"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="relative inline-flex items-center border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#BFA06F] hover:text-[#BFA06F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1EB] dark:focus-visible:ring-offset-neutral-950"
            >
              Catalog
            </Link>
            <button
              type="button"
              className="relative inline-flex cursor-default items-center border-b border-transparent pb-0.5 text-left text-neutral-500 transition-colors duration-200 dark:text-neutral-400"
              aria-label="All experiences are simulated with client-side mock data"
            >
              Mock Experience
            </button>
          </nav>
        </div>

        <Separator className="bg-[rgba(43,43,43,0.08)] dark:bg-[rgba(245,241,235,0.1)]" />

        {/* Lower section: legal line */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-['Lato'] text-xs text-neutral-600 dark:text-neutral-400">
            © {currentYear} Jootiya. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-['Lato'] text-[11px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-[3px] w-[3px] rounded-full bg-[#BFA06F]" aria-hidden="true" />
              Client-only luxury prototype
            </span>
            <button
              type="button"
              className="inline-flex items-center border-b border-transparent pb-0.5 text-neutral-700 transition-colors duration-200 hover:border-[#BFA06F] hover:text-[#BFA06F] dark:text-neutral-200"
              aria-label="All orders and cart data are stored locally in this browser via mock state"
            >
              Local mock data · No live payments
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;