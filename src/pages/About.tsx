import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Leaf, Sparkles, Truck, Users, HelpCircle, ChevronDown, ChevronUp, Globe2, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { masonryConfig, typographyTokens } from '@/data/mockData';

export interface AboutProps {
  className?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 'craft',
    question: 'What makes Jootiya footwear different?',
    answer:
      'Every pair is cut, stitched, and finished in small-batch ateliers using slow, archival techniques. We design around balance: sculptural silhouettes, soft landings, and materials that gain character with every step.',
  },
  {
    id: 'sizing',
    question: 'How does sizing work across collections?',
    answer:
      'We follow European sizing with a modern last that skews true-to-size. For half-sizes or wider feet, we recommend stepping up one size. Editorial capsules may run more tailored; we always include a precise fit note on each product page.',
  },
  {
    id: 'care',
    question: 'How should I care for my Jootiya pair?',
    answer:
      'Brush away surface dust with a soft horsehair brush after each wear, allow shoes to rest with cedar inserts, and avoid direct heat. For leather, use a neutral cream sparingly; for technical meshes, a damp cloth and air-dry is enough.',
  },
  {
    id: 'ethics',
    question: 'Where do you produce and how do you source materials?',
    answer:
      'Our leathers are traceable to certified European and Indian tanneries with strict environmental standards. Final assembly happens across family-owned workshops in Portugal and India where we maintain long-term relationships and fair wages.',
  },
];

export function About({ className = '' }: AboutProps) {
  const [activeFaqId, setActiveFaqId] = useState<string>('craft');

  const heroImage =
    'https://images.unsplash.com/photo-1624289659886-f37f6d061673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8c3RyZWV0JTIwc3R5bGUlMjBsdXh1cnklMjBzbmVha2VycyUyMGF1dHVtbiUyMGVkaXRvcmlhbHxlbnwwfDB8fHwxNzkyMDc3NjAzfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
  const studioImage =
    'https://images.unsplash.com/photo-1618554707482-14854a29f955?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8bHV4dXJ5JTIwc25lYWtlciUyMGVkaXRvcmlhbCUyMGxvb2tib29rJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHwwfHx8MTc5MjA3NzU4NHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
  const materialImage =
    'https://images.unsplash.com/photo-1697086317645-11bd9e74e2cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8aGlnaCUyMGZhc2hpb24lMjBmb290d2VhciUyMGZsYXRsYXklMjBuZXV0cmFsJTIwYmFja2dyb3VuZHxlbnwwfDB8fHwxNzkyMDc3NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';
  const detailImage =
    'https://images.unsplash.com/photo-1638265499174-62c2cb29137a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8MXx8bHV4dXJ5JTIwc25lYWtlciUyMGVkaXRvcmlhbCUyMGxvb2tib29rJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHwwfHx8MTc5MjA3NzU4NHww&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop';

  const columnConfig = masonryConfig?.[0];

  const handleFaqToggle = (id: string) => {
    setActiveFaqId(prev => (prev === id ? '' : id));
  };

  return (
    <main
      className={cn(
        'min-h-screen bg-[#F9F6F2] text-[#2E2B28] pt-20 pb-24',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 space-y-24 lg:space-y-28">
        
        <section className="grid grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <motion.div
            className="col-span-12 lg:col-span-6 flex flex-col justify-between gap-10"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="space-y-6">
              <p className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#6F675E]">
                <span className="h-px w-10 bg-[#D9D1C7]" />
                Since MMXXI · Crafted for the city and the after-hours
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-light tracking-tight"
                style={{ fontFamily: typographyTokens?.displayFamily ?? 'Playfair Display' }}
              >
                The quiet luxury of{' '}
                <span className="underline underline-offset-4 decoration-2 decoration-[#8B0000]">
                  considered
                </span>{' '}
                steps.
              </h1>
              <p className="text-base sm:text-lg text-[#6F675E] max-w-xl leading-relaxed">
                Jootiya began as a sketch on the back of a boarding pass — a silhouette that
                felt equally at home in a gallery, an airport lounge, or an after-midnight
                street. Today, each pair is a love letter to motion: to the way leather softens,
                laces loosen, and cities imprint themselves into our soles.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 border border-[#D9D1C7] rounded-2xl bg-[#FDFBF7] px-6 py-5">
              <div className="space-y-1">
                <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E]">
                  Atelier Hours
                </p>
                <p className="text-2xl font-light">
                  47<span className="text-sm align-top">+</span>
                </p>
                <p className="text-xs text-[#6F675E]">
                  Spent hand-finishing each limited pair.
                </p>
              </div>
              <div className="space-y-1 border-x border-[#E4DDD2] px-4">
                <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E]">
                  Edition Runs
                </p>
                <p className="text-2xl font-light">
                  <span className="text-sm align-top">≤</span>80
                </p>
                <p className="text-xs text-[#6F675E]">
                  Pairs per colorway to preserve rarity.
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E]">
                  Cities in Motion
                </p>
                <p className="text-2xl font-light">
                  23<span className="text-sm align-top">+</span>
                </p>
                <p className="text-xs text-[#6F675E]">
                  Urban landscapes informing every last.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="col-span-12 lg:col-span-6 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div className="relative h-full min-h-[320px] lg:min-h-[460px]">
              <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                <img
                  src={heroImage}
                  alt="Editorial portrait of luxury sneakers in a gallery-like studio"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-black/10 to-transparent mix-blend-multiply" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="backdrop-blur-md bg-black/35 text-white px-5 py-4 rounded-2xl border border-white/15 max-w-xs">
                  <p className="text-xs tracking-[0.24em] uppercase mb-1">Origin Story</p>
                  <p className="text-sm leading-relaxed">
                    Drafted in New Delhi, prototyped in Porto, worn between dusk and first
                    light.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-3">
                  <p className="px-4 py-1.5 text-[11px] tracking-[0.24em] uppercase rounded-full bg-white/10 text-white border border-white/25">
                    Lookbook Volume IV
                  </p>
                  <div className="px-4 py-2.5 rounded-full bg-[#8B0000] text-white text-xs tracking-[0.24em] uppercase">
                    Jootiya Studio · Editioned Footwear
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#6F675E] mb-2">
                Craft, Sourcing & Process
              </p>
              <h2
                className="text-3xl sm:text-4xl font-light tracking-tight"
                style={{ fontFamily: typographyTokens?.displayFamily ?? 'Playfair Display' }}
              >
                Built like an heirloom, worn like a second skin.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#6F675E] md:max-w-md">
              From tanneries with century-old ledgers to future-facing foam labs, each
              collaborator in our chain shares one obsession: how a shoe feels at the end of a
              long night out.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <motion.div
              className="col-span-12 md:col-span-5 lg:col-span-4 space-y-6"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white">
                <img
                  src={studioImage}
                  alt="Craftsman working on sneaker details in studio"
                  crossOrigin="anonymous"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent p-4">
                  <p className="text-[11px] tracking-[0.25em] uppercase text-[#F9F6F2]/80">
                    Studio Porto · Hand-lasting bench
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E1D9CE] bg-white px-4 py-3">
                  <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E] mb-1.5">
                    Last Library
                  </p>
                  <p className="text-xl font-light">27 silhouettes</p>
                  <p className="text-xs text-[#6F675E] mt-1">
                    Iterated around South Asian, European, and hybrid fits.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E1D9CE] bg-white px-4 py-3">
                  <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E] mb-1.5">
                    Wear Testing
                  </p>
                  <p className="text-xl font-light">
                    {columnConfig?.columnCount ?? 8}
                    <span className="text-sm align-top"> weeks</span>
                  </p>
                  <p className="text-xs text-[#6F675E] mt-1">
                    Field tested across monsoon streets and airport marathons.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <article className="h-full rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-start gap-3 mb-4">
                  <Leaf className="w-5 h-5 text-[#8B0000]" />
                  <div>
                    <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                      Tannery Ledger
                    </p>
                    <h3 className="text-lg font-medium mt-1">
                      Traceable hides, low-impact finishes.
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#6F675E] leading-relaxed mb-5">
                  We source from European and Indian tanneries audited for chrome management,
                  water recirculation, and worker safety. Every leather is hand-selected for
                  grain character, then drum-dyed for depth instead of painted to perfection.
                </p>
                <div className="flex items-center justify-between text-xs text-[#6F675E]">
                  <span>Chrome-reduced, metal-free linings on select lines.</span>
                  <span className="px-2 py-1 rounded-full border border-[#E1D9CE]">
                    Tier-1 tanneries
                  </span>
                </div>
              </article>

              <article className="h-full rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col justify-between">
                <div className="flex items-start gap-3 mb-4">
                  <Gauge className="w-5 h-5 text-[#8B0000]" />
                  <div>
                    <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                      Comfort Engineering
                    </p>
                    <h3 className="text-lg font-medium mt-1">
                      Dual-density footbeds, tuned for long nights.
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#6F675E] leading-relaxed mb-5">
                  Underfoot, memory foam layers meet supportive molds, balancing cloud-soft
                  landings with a crisp toe-off. Our development teams log hundreds of
                  kilometres per prototype until a pair feels invisible, then unforgettable.
                </p>
                <ul className="space-y-1.5 text-xs text-[#6F675E]">
                  <li>• Multi-zone cushioning mapped to pressure points.</li>
                  <li>• Moisture-wicking linings for humid evenings.</li>
                  <li>• Rubber compounds tuned for quiet, non-squeak strides.</li>
                </ul>
              </article>

              <motion.article
                className="h-full rounded-2xl border border-[#D9D1C7] bg-white/80 p-6 flex flex-col justify-between sm:col-span-2"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-5 mb-4">
                  <div className="flex-shrink-0 w-full lg:w-1/3 overflow-hidden rounded-xl border border-[#E1D9CE]">
                    <img
                      src={materialImage}
                      alt="Material swatches and sneaker prototypes"
                      crossOrigin="anonymous"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#8B0000]" />
                      <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                        Slow Editions
                      </p>
                    </div>
                    <h3 className="text-lg font-medium">
                      From sketch to street in deliberate, documented steps.
                    </h3>
                    <p className="text-sm text-[#6F675E] leading-relaxed">
                      We chronicle every collection the way others keep photo books — mood,
                      sound, light, the cities they were born in. Each release is treated as a
                      chapter; once it closes, molds are retired or reworked, never mass
                      replicated.
                    </p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#6F675E]">
                  <div className="space-y-1">
                    <dt className="uppercase tracking-[0.2em]">Design Cycle</dt>
                    <dd>9–14 months</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="uppercase tracking-[0.2em]">Prototypes</dt>
                    <dd>11 per flagship silhouette.</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="uppercase tracking-[0.2em]">Rework Rate</dt>
                    <dd>63% of sketches never leave the wall.</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="uppercase tracking-[0.2em]">Ateliers</dt>
                    <dd>4 partner studios across 2 continents.</dd>
                  </div>
                </dl>
              </motion.article>
            </motion.div>
          </div>
        </section>

        
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#6F675E] mb-2">
                House Philosophy
              </p>
              <h2
                className="text-3xl sm:text-4xl font-light tracking-tight"
                style={{ fontFamily: typographyTokens?.accentFamily ?? 'Playfair Display' }}
              >
                Four quiet rules guide every pair we release.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#6F675E] md:max-w-md">
              We call them the Jootiya Lines — not taglines, but constraints. If a sketch
              doesn&apos;t sit within all four, it never leaves the page.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-8 items-stretch">
            <motion.div
              className="col-span-12 lg:col-span-5 relative"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative overflow-hidden rounded-[22px] border border-[#D9D1C7] bg-white">
                <img
                  src={detailImage}
                  alt="Close up of sneaker stitching and leather details"
                  crossOrigin="anonymous"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.36),transparent_50%)]" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-[#F9F6F2]">
                  <div>
                    <p className="tracking-[0.24em] uppercase mb-1">The Jootiya Lines</p>
                    <p className="text-[11px] max-w-xs">
                      Proportion, Patina, Pace, and Poise — principles that hold the collection
                      in tension.
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/25">
                      Internal manifesto · Not for print
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#8B0000]" />
                  <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                    Proportion
                  </p>
                </div>
                <h3 className="text-lg font-medium">Lines that outlive trends.</h3>
                <p className="text-sm text-[#6F675E] leading-relaxed">
                  Every curve, collar, and outsole line is referenced against vintage last
                  libraries and architectural details. We strip away everything ornamental
                  until what&apos;s left feels inevitable.
                </p>
                <p className="text-xs text-[#6F675E] mt-auto">
                  Look for it in: our low-profile foxing and gently squared-off toes.
                </p>
              </div>

              <div className="rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#8B0000]" />
                  <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                    Pace
                  </p>
                </div>
                <h3 className="text-lg font-medium">Releases that breathe.</h3>
                <p className="text-sm text-[#6F675E] leading-relaxed">
                  We design in seasons, not drops — small, contemplative collections that
                  reward repeat wear instead of constant scrolling. Absence is part of the
                  language; when a colorway sells through, it stays archived.
                </p>
                <p className="text-xs text-[#6F675E] mt-auto">
                  Measured, not manic: our calendar leaves room for craft.
                </p>
              </div>

              <div className="rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-5 h-5 text-[#8B0000]" />
                  <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                    Patina
                  </p>
                </div>
                <h3 className="text-lg font-medium">
                  Materials that document where you&apos;ve been.
                </h3>
                <p className="text-sm text-[#6F675E] leading-relaxed">
                  We prefer leathers and textiles that scuff, crease, and soften, telling
                  stories in micro-folds and faded edges. Perfection on day one isn&apos;t the
                  goal; soul on day one hundred is.
                </p>
                <p className="text-xs text-[#6F675E] mt-auto">
                  Think subtle burnishing, not plastic sheen.
                </p>
              </div>

              <div className="rounded-2xl border border-[#D9D1C7] bg-white p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#8B0000]" />
                  <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                    Poise
                  </p>
                </div>
                <h3 className="text-lg font-medium">A posture defined by restraint.</h3>
                <p className="text-sm text-[#6F675E] leading-relaxed">
                  From packaging to product pages, we keep the volume low so form and feeling
                  take the stage. No loud logos, no shouting; every design choice is a quiet
                  invitation to come closer.
                </p>
                <p className="text-xs text-[#6F675E] mt-auto">
                  This is why your pair arrives in an unbranded, reusable cotton dust bag.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        
        <section className="grid grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            className="col-span-12 lg:col-span-5 space-y-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[#6F675E]">
              Press & Mentions
            </p>
            <h2
              className="text-3xl sm:text-4xl font-light tracking-tight"
              style={{ fontFamily: typographyTokens?.displayFamily ?? 'Playfair Display' }}
            >
              A boutique label whispered between stylists, editors and night workers.
            </h2>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#D9D1C7] bg-white px-5 py-4">
                <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E] mb-1">
                  L&apos;Objet Magazine
                </p>
                <p className="text-sm leading-relaxed">
                  &quot;Jootiya builds sneakers the way couturiers build gowns — sculpted,
                  hand-finished, and best discovered in motion rather than on a grid.&quot;
                </p>
              </div>
              <div className="rounded-2xl border border-[#D9D1C7] bg-white px-5 py-4">
                <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E] mb-1">
                  The Night Shift Report
                </p>
                <p className="text-sm leading-relaxed">
                  &quot;From boardrooms to basement venues, their pairs hold their own without
                  demanding the spotlight — the definition of quiet confidence.&quot;
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <span className="px-3 py-1 text-[11px] tracking-[0.24em] uppercase rounded-full border border-[#D9D1C7] bg-white">
                  Independent · Self-funded
                </span>
                <span className="px-3 py-1 text-[11px] tracking-[0.24em] uppercase rounded-full border border-[#D9D1C7] bg-white">
                  Limited Distribution
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 lg:col-span-7 space-y-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#8B0000]" />
                <p className="text-xs tracking-[0.24em] uppercase text-[#6F675E]">
                  Questions, answered softly
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {faqItems.map(item => {
                const isActive = activeFaqId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleFaqToggle(item.id)}
                    className={cn(
                      'w-full text-left rounded-2xl border bg-white px-5 py-4 transition-colors',
                      isActive
                        ? 'border-[#8B0000]/70 bg-[#FDF7F6]'
                        : 'border-[#D9D1C7] hover:border-[#8B0000]/50'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm sm:text-base font-medium">
                        {item.question}
                      </h3>
                      {isActive ? (
                        <ChevronUp className="w-4 h-4 text-[#8B0000] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6F675E] flex-shrink-0" />
                      )}
                    </div>
                    {isActive && (
                      <motion.p
                        className="mt-3 text-sm text-[#6F675E] leading-relaxed"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default About;