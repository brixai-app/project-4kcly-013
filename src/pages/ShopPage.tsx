import React from 'react';
import { CatalogSection } from '@/components/CommerceSections';
import { cn } from '@/lib/utils';

export function ShopPage({ className = '' }: { className?: string }) {
  return (
    <main className={cn('bg-[#F9F5F0] text-[#2B2B2B]', className)}>
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#BFA6A0] pb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#6F625D]">
            Jootiya Catalog
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <h1 className="font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B] sm:text-5xl lg:text-6xl">
                Handcrafted Mojris, curated with editorial precision.
              </h1>
              <p className="mt-4 max-w-2xl font-['Lora'] text-sm leading-7 text-[#6F625D] sm:text-base">
                Explore authentic Rajasthani silhouettes, artisan finishes, and occasion-ready pairs from Jodhpur’s finest workshops.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#6F625D]">
              <span className="h-px w-10 bg-[#BFA6A0]" />
              <span>Filter, sort, and discover</span>
            </div>
          </div>
        </div>
        <CatalogSection className="min-w-0" />
      </section>
    </main>
  );
}

export default ShopPage;