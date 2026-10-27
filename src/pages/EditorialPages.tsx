import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Star } from 'lucide-react';
import type { Order } from "@/types";
import { cn } from "@/lib/utils";

type StoryCard = {
  title: string;
  body: string;
  image: string;
  meta: string;
};

const storyCards: StoryCard[] = [
  {
    title: "The Jodhpur Workshop",
    body: "Hand-finished uppers, patient stitching, and a silhouette shaped by desert light.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    meta: "Craft chapter 01",
  },
  {
    title: "Heritage in Motion",
    body: "A restrained palette of ivory, terracotta, and muted gold frames the ritual of dressing well.",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    meta: "Craft chapter 02",
  },
  {
    title: "The Artisan Hand",
    body: "Every pair carries the quiet asymmetry of a human touch and the discipline of tradition.",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    meta: "Craft chapter 03",
  },
];

const receiptItems = [
  { label: "Order status", value: "Confirmed" },
  { label: "Dispatch window", value: "2–4 business days" },
  { label: "Support", value: "help@jootiya.com" },
];

function StoryChapter({ title = "", body = "", image = "", meta = "" }: StoryCard) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group overflow-hidden border border-[#D8CCB8] bg-[#FFFDF8]"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9A7440]">{meta}</p>
        <h3 className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#2B2B2B]">{title}</h3>
        <p className="text-sm leading-7 text-[#6D6257]">{body}</p>
      </div>
    </motion.article>
  );
}

export function ArtisanStoriesPage() {
  const chapters = useMemo(() => storyCards, []);
  return (
    <main className="bg-[#FAF7F0] text-[#2B2B2B]">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative overflow-hidden border border-[#D8CCB8] bg-[#FFFDF8]"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
            alt="Heritage mojri lookbook"
            crossOrigin="anonymous"
            className="h-full min-h-[32rem] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/55 via-[#0a0a0a]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#F3E6CF]">Artisan stories</p>
            <h1 className="max-w-xl font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#FFFDF8] md:text-7xl">
              Mojris shaped by memory, precision, and desert craft.
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#F3E6CF]">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Jodhpur, Rajasthan
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Seasonal journal
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col justify-between gap-6 border border-[#D8CCB8] bg-[#FFFDF8] p-6 md:p-8">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Provenance folio</p>
            <h2 className="max-w-lg font-['Playfair_Display'] text-4xl font-medium tracking-tight text-[#2B2B2B] md:text-5xl">
              A quiet archive of makers, materials, and ritual dressing.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[#6D6257]">
              Jootiya pairs warm ivory spreads with disciplined typography and tactile motion, presenting each pair as a cultural object rather than a commodity.
            </p>
          </div>
          <div className="space-y-4 border-t border-[#D8CCB8] pt-6">
            {receiptItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]">{item.label}</span>
                <span className="text-sm font-medium text-[#2B2B2B]">{item.value}</span>
              </div>
            ))}
          </div>
          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 border border-[#9A7440] bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#76562E]"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Journal panels</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-medium tracking-tight text-[#2B2B2B] md:text-4xl">
              Chapters from the atelier
            </h2>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257] md:flex">
            <Star className="h-4 w-4 text-[#9A7440]" />
            Hand-finished editions
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {chapters.map((card) => (
            <StoryChapter key={card.title} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function OrderConfirmationPage({ order = null }: { order?: Order | null }) {
  const safeOrder = order ?? null;
  return (
    <main className="bg-[#FAF7F0] px-4 py-10 text-[#2B2B2B] md:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-4xl border border-[#D8CCB8] bg-[#FFFDF8] p-6 md:p-10"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9A7440]">Receipt</p>
        <h1 className="mt-3 font-['Playfair_Display'] text-4xl font-medium tracking-tight md:text-5xl">
          Your order is confirmed.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#6D6257]">
          Thank you for choosing Jootiya. Your selected mojris are being prepared with care and will be dispatched within the stated window.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-[#D8CCB8] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D6257]">Order ID</p>
            <p className="mt-2 break-words text-sm font-medium text-[#2B2B2B]">{safeOrder?.id ?? "Pending allocation"}</p>
          </div>
          <div className="border border-[#D8CCB8] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D6257]">Total</p>
            <p className="mt-2 text-sm font-medium text-[#2B2B2B]">₹{safeOrder?.total?.toLocaleString("en-IN") ?? "0"}</p>
          </div>
          <div className="border border-[#D8CCB8] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6D6257]">Status</p>
            <p className="mt-2 text-sm font-medium text-[#2B2B2B]">{safeOrder?.status ?? "confirmed"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/shop"
            className={cn(
              "inline-flex items-center gap-2 border border-[#9A7440] bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#76562E]"
            )}
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-[#D8CCB8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition-colors hover:border-[#9A7440] hover:text-[#9A7440]"
          >
            Return home
          </Link>
        </div>
      </motion.section>
    </main>
  );
}

export default ArtisanStoriesPage;