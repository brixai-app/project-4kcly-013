import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, X, MapPin, Clock, Sparkles, Play, Shield, ChevronRight } from 'lucide-react';
import { artisans } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function ArtisanStoriesPage() {
  const [active, setActive] = useState(artisans?.[0] ?? null);
  const [open, setOpen] = useState(false);

  const activeGallery = useMemo(() => {
    const base = active?.portrait ?? "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80";
    return [base, ...(active?.techniques?.slice(0, 2)?.map((t) => `https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80 ?? "artisan"}-${t}`)}/1200/800`) ?? [])];
  }, [active]);

  return (
    <main className="bg-[#F7F0E3] text-[#211A17]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#6F6258]">
              <Sparkles className="h-4 w-4" />
              <span>Artisan Stories</span>
            </div>
            <h1 className="max-w-3xl font-['Bodoni_Moda'] text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
              Portraits of the hands behind every Jodhpuri Mojri.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#6F6258] sm:text-base">
              Explore the makers, workshops, and inherited techniques that shape each pair with provenance, patience, and cultural respect.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {activeGallery?.slice(0, 3)?.map((src, index) => (
              <motion.div key={src} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }} className={cn("overflow-hidden border border-[#CDBB9D] bg-[#FFFDFC]", index === 0 ? "sm:col-span-2 sm:row-span-2" : "")}>
                <img src={src} alt={active?.name ?? "Artisan portrait"} crossOrigin="anonymous" className="h-full w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="space-y-3 border border-[#CDBB9D] bg-[#FFFDFC] p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="min-w-0 truncate font-['Bodoni_Moda'] text-2xl font-light">Workshop Index</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-[#6F6258]">{artisans?.length ?? 0}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {artisans?.map((artisan) => {
                const selected = active?.id === artisan.id;
                return (
                  <button
                    key={artisan.id}
                    type="button"
                    onClick={() => {
                      setActive(artisan);
                      setOpen(true);
                    }}
                    className={cn(
                      "flex items-center justify-between gap-3 border px-3 py-3 text-left transition-colors",
                      selected ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] bg-transparent hover:bg-[#faf9f6]"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold uppercase tracking-[0.18em]">{artisan.name}</span>
                      <span className={cn("block truncate text-xs", selected ? "text-white/80" : "text-[#6F6258]")}>{artisan.specialty}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="grid gap-4">
            {artisans?.slice(0, 3)?.map((artisan, index) => (
              <motion.article
                key={artisan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className={cn("grid gap-4 border border-[#CDBB9D] bg-[#FFFDFC] p-4 md:grid-cols-[0.9fr_1.1fr]", index % 2 === 1 ? "md:grid-cols-[1.1fr_0.9fr]" : "")}
              >
                <img src={artisan.portrait} alt={artisan.name} crossOrigin="anonymous" className={cn("h-full w-full object-cover", index % 2 === 1 ? "md:order-2" : "")} />
                <div className="flex min-w-0 flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#6F6258]">
                      <MapPin className="h-4 w-4" />
                      <span>{artisan.location}</span>
                    </div>
                    <h3 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight">{artisan.name}</h3>
                    <p className="text-sm leading-7 text-[#6F6258]">{artisan.story}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {artisan.techniques?.slice(0, 3)?.map((technique) => (
                      <span key={technique} className="border border-[#CDBB9D] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#6F6258]">
                        {technique}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(artisan);
                      setOpen(true);
                    }}
                    className="inline-flex w-fit items-center gap-2 border border-[#741F2B] bg-[#741F2B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#561620]"
                  >
                    Read Story
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-[#CDBB9D] bg-[#FFFDFC] shadow-2xl outline-none">
            <div className="flex items-center justify-between border-b border-[#CDBB9D] px-5 py-4">
              <div>
                <Dialog.Title className="font-['Bodoni_Moda'] text-3xl font-light">{active?.name ?? "Artisan"}</Dialog.Title>
                <Dialog.Description className="text-xs uppercase tracking-[0.28em] text-[#6F6258]">
                  {active?.specialty ?? "Craft narrative"}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9D] text-[#211A17]">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-6 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {activeGallery?.map((src) => (
                  <img key={src} src={src} alt={active?.name ?? "Artisan gallery"} crossOrigin="anonymous" className="h-56 w-full object-cover" />
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#6F6258]">
                    <Clock className="h-4 w-4" />
                    <span>{active?.yearsActive ?? 0}+ years</span>
                  </div>
                  <p className="text-sm leading-7 text-[#6F6258]">{active?.story ?? ""}</p>
                </div>
                <div className="space-y-3 border border-[#CDBB9D] bg-[#faf9f6] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#6F6258]">
                    <Shield className="h-4 w-4" />
                    <span>Craft details</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#6F6258]">
                    {active?.techniques?.map((technique) => (
                      <li key={technique} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 bg-[#741F2B]" />
                        <span>{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border border-[#CDBB9D] bg-[#211A17] p-4 text-white">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/70">
                  <Play className="h-4 w-4" />
                  <span>Mock video treatment</span>
                </div>
                <div className="mt-3 aspect-video overflow-hidden border border-white/20 bg-black">
                  <img src={active?.portrait ?? "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"} alt={active?.name ?? "Artisan video still"} crossOrigin="anonymous" className="h-full w-full object-cover opacity-90" />
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
export { ArtisanStoriesPage };
