import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ArrowRight, ChevronRight, Filter, Heart, MapPin, Sparkles, Store, Truck } from 'lucide-react';
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { artisanStories, categories, products } from "@/data/mockData";
import type { ArtisanStory, Product } from "@/types";

type SectionProps = { className?: string };
type DrawerProps = { open?: boolean; onOpenChange?: (open: boolean) => void; story?: ArtisanStory | null };

export function HeroBanner({ className = "" }: SectionProps) {
  const featured = products?.find((p) => p?.featured) ?? products?.[0];
  return (
    <section className={cn("relative overflow-hidden bg-[#F5F0E6] text-[#2B2B2B]", className)}>
      <div className="mx-auto grid min-h-[82vh] max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1.15fr_0.85fr] md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#0f0f0f]">
          <img src={featured?.image ?? ""} alt={featured?.name ?? "Jootiya hero"} crossOrigin="anonymous" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <div className="max-w-xl text-white">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E7C98A]">Jootiya / Jodhpur atelier</p>
              <h1 className="font-serif text-5xl font-light tracking-tight md:text-7xl">Heritage Mojris, reimagined with quiet opulence.</h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/80 md:text-base">Handcrafted Rajasthani footwear shaped in parchment light, terracotta warmth, and gold-threaded provenance.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-md bg-[#B04E2C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#8F3C22]">
                  Explore Collection <ArrowRight size={16} />
                </Link>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#E7C98A]"><Sparkles size={14} /> Limited artisan editions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-5 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6257]">Featured pair</p>
            <h2 className="mt-3 font-serif text-3xl font-light tracking-tight">{featured?.name ?? "Signature Mojri"}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6D6257]">{featured?.description ?? "A refined silhouette with hand-finished detailing and enduring comfort."}</p>
            <div className="mt-6 flex items-center justify-between border-t border-[#C9A66B]/60 pt-4">
              <span className="text-lg font-semibold">₹{featured?.price?.toLocaleString?.("en-IN") ?? "0"}</span>
              <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#B04E2C]">
                Shop latest drop <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[products?.[1], products?.[2]].filter(Boolean).map((p) => (
              <div key={p?.id} className="overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4]">
                <img src={p?.image ?? ""} alt={p?.name ?? ""} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#6D6257]">{p?.collection ?? "Collection"}</p>
                  <h3 className="mt-2 font-serif text-xl">{p?.name ?? ""}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({ className = "" }: SectionProps) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8", className)}><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6257]">Curated selection</p><h2 className="mt-2 font-serif text-3xl font-light tracking-tight">Mojris with atelier precision</h2></div><Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#B04E2C]">View all <ArrowRight size={16} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products?.slice(0, 6)?.map((product) => <ProductCard key={product?.id} product={product} />)}</div></section>;
}

export function FiltersPanel({ className = "" }: SectionProps) {
  return <aside className={cn("rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-4", className)}><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]"><Filter size={14} /> Refine</div><div className="mt-4 flex flex-col gap-2.5">{categories?.slice(0, 6)?.map((c) => <button key={c} className="min-w-0 rounded-md border border-[#C9A66B]/70 px-3 py-2 text-left text-sm text-[#2B2B2B] transition hover:bg-[#F5F0E6]"><span className="block truncate">{c}</span></button>)}</div></aside>;
}

export function CartView({ className = "" }: SectionProps) {
  const { cart } = useCart();
  return <section className={cn("rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-5", className)}><div className="flex items-center justify-between"><h3 className="font-serif text-2xl">Cart preview</h3><span className="text-sm text-[#6D6257]">{cart?.itemCount ?? 0} items</span></div><div className="mt-4 flex flex-col gap-3">{cart?.items?.slice(0, 3)?.map((item) => <div key={`${item?.productId}-${item?.size ?? "na"}`} className="flex items-center gap-3"><img src={item?.image ?? ""} alt={item?.name ?? ""} crossOrigin="anonymous" className="h-16 w-12 rounded-md object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item?.name ?? ""}</p><p className="text-xs text-[#6D6257]">Qty {item?.quantity ?? 0}</p></div><span className="text-sm font-semibold">₹{((item?.price ?? 0) * (item?.quantity ?? 0)).toLocaleString("en-IN")}</span></div>)}</div></section>;
}

export function ArtisanList({ className = "" }: SectionProps) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8", className)}><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6257]">Artisan voices</p><h2 className="mt-2 font-serif text-3xl font-light tracking-tight">The hands behind the pair</h2></div></div><div className="grid gap-4 md:grid-cols-3">{artisanStories?.slice(0, 3)?.map((story) => <ArtisanStoryCard key={story?.id} story={story} />)}</div></section>;
}

function ArtisanStoryCard({ story }: { story: ArtisanStory }) {
  return <Dialog><DialogTrigger asChild><button className="group overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] text-left"><img src={story?.image ?? ""} alt={story?.name ?? ""} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="p-4"><p className="text-xs uppercase tracking-[0.28em] text-[#6D6257]">{story?.location ?? "Jodhpur"}</p><h3 className="mt-2 font-serif text-2xl">{story?.name ?? ""}</h3><p className="mt-2 text-sm text-[#6D6257]">{story?.title ?? ""}</p></div></button></DialogTrigger><ArtisanStoryDrawer story={story} /></Dialog>;
}

export function ArtisanStoryDrawer({ open = false, onOpenChange = () => {}, story = null }: DrawerProps) {
  return <DialogContent className="fixed right-0 top-0 h-full w-[92vw] max-w-xl overflow-y-auto border-l border-[#C9A66B] bg-[#FFFBF4] p-6 shadow-2xl outline-none"><DialogTitle className="font-serif text-3xl">{story?.name ?? "Artisan story"}</DialogTitle><div className="mt-4 space-y-4"><img src={story?.image ?? ""} alt={story?.name ?? ""} crossOrigin="anonymous" className="aspect-[4/5] w-full rounded-[18px] object-cover" /><p className="text-sm leading-7 text-[#6D6257]">{story?.story ?? ""}</p><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]"><MapPin size={14} /> {story?.location ?? "Jodhpur"}</div></div></DialogContent>;
}

export function ManifestoSection({ className = "" }: SectionProps) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8", className)}><div className="grid gap-6 rounded-[18px] border border-[#C9A66B] bg-[#0f0f0f] p-6 text-white md:grid-cols-[1.2fr_0.8fr] md:p-8"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E7C98A]">Manifesto</p><h2 className="mt-3 font-serif text-4xl font-light tracking-tight md:text-5xl">Crafted for ceremony, worn for every day.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">Each pair is shaped by regional technique, tactile materials, and a restrained palette that lets the workmanship speak first.</p></div><div className="grid gap-3 text-sm text-white/80"><div className="flex items-center gap-3"><Truck size={16} className="text-[#E7C98A]" /> Careful dispatch from Jodhpur</div><div className="flex items-center gap-3"><Heart size={16} className="text-[#E7C98A]" /> Hand-finished artisan detailing</div><div className="flex items-center gap-3"><Store size={16} className="text-[#E7C98A]" /> Heritage silhouettes, modern fit</div></div></div></section>;
}

export function NewsletterSection({ className = "" }: SectionProps) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8", className)}><div className="rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6D6257]">Newsletter</p><div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h2 className="font-serif text-3xl font-light tracking-tight">Receive the next drop, quietly.</h2><p className="mt-2 max-w-xl text-sm leading-7 text-[#6D6257]">Early access to new silhouettes, artisan notes, and limited releases.</p></div><form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"><input type="email" placeholder="Email address" className="min-w-0 flex-1 rounded-md border border-[#C9A66B] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#6D6257]" /><button type="button" className="inline-flex items-center justify-center rounded-md bg-[#B04E2C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#8F3C22]">Subscribe</button></form></div></div></section>;
}

export default ProductGrid;
// Auto-synthesized missing component export
export const ProductDetailView: any = (props: any) => props?.children || null;
