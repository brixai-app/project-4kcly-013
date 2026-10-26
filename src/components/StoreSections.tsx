import React from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { ArrowRight, Filter, Search, ShoppingBag, Sparkles, Truck, X } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { products, artisans, editorialCopy, verifiedImages, categories } from "@/data/mockData";
import type { Product, FilterState, Artisan, ShippingInfo, PaymentInfo, Order } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

type SectionProps = { className?: string };
type FilterDrawerProps = { open?: boolean; onOpenChange?: (open: boolean) => void; filters?: FilterState; onChange?: (next: FilterState) => void };
type GalleryProps = { product?: Product | null; onOpenProduct?: (product: Product) => void };
type CheckoutProps = { onSubmit?: (shipping: ShippingInfo, payment: PaymentInfo) => void };
type CartRouteProps = { onCheckout?: () => void };
type ConfirmationProps = { order?: Order | null };

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.7, ease: "easeOut" } };

const Img = ({ src, alt, className = "" }: { src?: string; alt?: string; className?: string }) => (
  <img src={src ?? verifiedImages?.[0] ?? ""} alt={alt ?? ""} crossOrigin="anonymous" className={cn("h-full w-full object-cover", className)} />
);

export function HeroSection({ className = "" }: SectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-[#FAF7F0]", className)}>
      <div className="grid min-h-[92vh] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[60vh] lg:min-h-[92vh]">
          <img src={verifiedImages?.[0]} alt="Jodhpur-made mojris editorial hero" className="absolute inset-0" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          <div className="absolute left-4 top-4 border border-white/40 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white backdrop-blur-sm md:left-8 md:top-8">Jootiya / Heritage Lookbook</div>
          <div className="absolute bottom-4 left-4 max-w-[18rem] border border-white/35 bg-[#FAF7F0]/92 p-4 text-[#1F1E1C] md:bottom-8 md:left-8 md:max-w-[22rem] md:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">{editorialCopy?.heroEyebrow ?? "Authentic Jodhpur craft"}</p>
            <h1 className="font-serif text-5xl font-light leading-[0.92] tracking-tight md:text-7xl">{editorialCopy?.heroTitle ?? "Mojris, made with memory."}</h1>
            <p className="mt-4 text-sm leading-6 text-[#514B43]">{editorialCopy?.heroBody ?? "Warm ivory tailoring, hand-finished leather, and ceremonial detail shaped for modern wardrobes."}</p>
            <Link to="/shop" className="mt-5 inline-flex items-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#D8BC89]">
              Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 border-t border-[#B8AD9D] bg-[#FAF7F0] p-5 md:p-8 lg:border-l lg:border-t-0">
          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">Collection Index</p>
            <div className="space-y-3">
              {(categories ?? []).slice(0, 5).map((c) => <div key={c} className="flex items-center justify-between border-b border-[#B8AD9D]/70 pb-2 text-sm"><span className="min-w-0 truncate">{c}</span><span className="text-[#514B43]">0{(categories ?? []).indexOf(c) + 1}</span></div>)}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {(products ?? []).slice(0, 2).map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group grid grid-cols-[92px_1fr] gap-3 border border-[#B8AD9D] bg-white p-2 transition hover:-translate-y-0.5">
                <div className="aspect-[3/4] overflow-hidden"><img src={p.image} alt={p.name} className="transition duration-500 group-hover:scale-105" crossOrigin="anonymous" /></div>
                <div className="flex min-w-0 flex-col justify-between py-1">
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-[0.3em] text-[#514B43]">{p.collection}</p>
                    <h3 className="mt-1 truncate font-serif text-lg text-[#1F1E1C]">{p.name}</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1F1E1C]">₹{p.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LookbookStrip({ className = "" }: SectionProps) {
  return <section className={cn("overflow-hidden border-y border-[#B8AD9D] bg-white", className)}><div className="flex gap-3 overflow-x-auto p-3 md:p-4">{(products ?? []).slice(0, 5).map((p) => <Link key={p.id} to={`/product/${p.slug}`} className="min-w-[14rem] flex-1 border border-[#B8AD9D] bg-[#FAF7F0] p-2"><div className="aspect-[4/5] overflow-hidden"><img src={p.image} alt={p.name} className="transition duration-500 hover:scale-105" crossOrigin="anonymous" /></div><div className="mt-2 flex items-end justify-between gap-3"><div className="min-w-0"><p className="truncate text-[10px] uppercase tracking-[0.3em] text-[#514B43]">{p.category}</p><h3 className="truncate font-serif text-base">{p.name}</h3></div><p className="shrink-0 text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</p></div></Link>)}</div></section>;
}

export function ProductGridSection({ className = "" }: SectionProps) {
  return <section className={cn("bg-[#FAF7F0] px-4 py-10 md:px-8 md:py-14", className)}><div className="mx-auto max-w-7xl"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">Featured Drop</p><h2 className="mt-2 font-serif text-3xl font-light md:text-5xl">Asymmetric mojri masonry</h2></div><Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#1F1E1C]"><span>View all</span><ArrowRight size={14} /></Link></div><div className="columns-1 gap-4 md:columns-2 xl:columns-3">{(products ?? []).map((p) => <div key={p.id} className="mb-4 break-inside-avoid"><ProductCard product={p} /></div>)}</div></div></section>;
}

export function ArtisanMasonry({ className = "" }: SectionProps) {
  return <section className={cn("bg-white px-4 py-10 md:px-8 md:py-14", className)}><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]"><div className="space-y-4"><p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">Artisan Story</p><h2 className="font-serif text-3xl font-light md:text-5xl">Hands that keep the city stitched to its craft.</h2><p className="max-w-xl text-sm leading-7 text-[#514B43]">{editorialCopy?.artisanBody ?? "Each pair is shaped by Jodhpur workshops where leather, embroidery, and patience meet."}</p></div><div className="grid gap-4 sm:grid-cols-2">{(artisans ?? []).slice(0, 4).map((a: Artisan, i) => <motion.article key={a.id} {...fade} className={cn("border border-[#B8AD9D] bg-[#FAF7F0] p-4", i === 0 && "sm:col-span-2")}><div className="flex items-start gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden border border-[#B8AD9D]"><img src={a.portrait ?? verifiedImages?.[(i + 1) % (verifiedImages?.length ?? 1)]} alt={a.name} crossOrigin="anonymous" /></div><div className="min-w-0"><h3 className="truncate font-serif text-2xl">{a.name}</h3><p className="text-xs uppercase tracking-[0.28em] text-[#514B43]">{a.specialty}</p><p className="mt-2 text-sm leading-6 text-[#514B43]">{a.bio}</p></div></div></motion.article>)}</div></div></section>;
}

export function FilterDrawer({ open = false, onOpenChange = () => {}, filters, onChange = () => {} }: FilterDrawerProps) {
  const next = (patch: Partial<FilterState>) => onChange({ ...(filters ?? { query: "", categories: [], collections: [], priceRange: [0, 5000], inStockOnly: false, artisanIds: [] }), ...patch });
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" /><Dialog.Content className="fixed right-0 top-0 z-50 h-full w-[92vw] max-w-sm overflow-y-auto border-l border-[#B8AD9D] bg-[#FAF7F0] p-5 shadow-2xl outline-none"><div className="mb-5 flex items-center justify-between"><Dialog.Title className="font-serif text-2xl">Filters</Dialog.Title><Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#B8AD9D]"><X size={16} /></Dialog.Close></div><div className="flex flex-col gap-2.5"><label className="flex items-center gap-2 border border-[#B8AD9D] bg-white px-3 py-2"><Search size={14} /><input value={filters?.query ?? ""} onChange={(e) => next({ query: e.target.value })} placeholder="Search mojris" className="w-full bg-transparent text-sm outline-none" /></label><button onClick={() => next({ inStockOnly: !(filters?.inStockOnly ?? false) })} className="border border-[#B8AD9D] px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.28em]">{filters?.inStockOnly ? "In stock only" : "Show all stock"}</button><div className="flex flex-wrap gap-2">{(categories ?? []).map((c) => <button key={c} onClick={() => next({ categories: (filters?.categories ?? []).includes(c) ? (filters?.categories ?? []).filter((x) => x !== c) : [...(filters?.categories ?? []), c] })} className={cn("min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em]", (filters?.categories ?? []).includes(c) ? "border-[#C9A66B] bg-[#C9A66B]" : "border-[#B8AD9D] bg-white")}><span className="block max-w-[11rem] truncate">{c}</span></button>)}</div></div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function ProductGalleryPanel({ product = null, onOpenProduct = () => {} }: GalleryProps) {
  const p = product ?? products?.[0] ?? null;
  if (!p) return null;
  return <section className="bg-[#FAF7F0] px-4 py-8 md:px-8"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2 aspect-[4/5] overflow-hidden border border-[#B8AD9D]"><img src={p.image} alt={p.name} crossOrigin="anonymous" /></div>{(p.images ?? [p.image]).slice(0, 3).map((src, i) => <button key={src + i} onClick={() => onOpenProduct(p)} className="aspect-[4/5] overflow-hidden border border-[#B8AD9D]"><img src={src} alt={`${p.name} ${i + 1}`} crossOrigin="anonymous" /></button>)}</div><div className="sticky top-4 h-fit border border-[#B8AD9D] bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">{p.collection}</p><h2 className="mt-2 font-serif text-4xl font-light">{p.name}</h2><p className="mt-4 text-sm leading-7 text-[#514B43]">{p.description}</p><div className="mt-5 flex items-center gap-3"><p className="text-xl font-semibold">₹{p.price.toLocaleString("en-IN")}</p><p className="text-sm text-[#514B43]">{p.inStock ? `${p.stock} in stock` : "Sold out"}</p></div><button onClick={() => onOpenProduct(p)} className="mt-6 inline-flex items-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black"><ShoppingBag size={14} />Quick preview</button></div></div></section>;
}

export function CheckoutFormSection({ onSubmit = () => {} }: CheckoutProps) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); toast.success("Checkout details captured"); onSubmit({ fullName: "", phone: "", email: "", addressLine1: "", city: "", state: "", postalCode: "", country: "India" }, { method: "cod" }); };
  return <section className="bg-white px-4 py-10 md:px-8"><form onSubmit={submit} className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.8fr]"><div className="grid gap-3 border border-[#B8AD9D] bg-[#FAF7F0] p-5"><h2 className="font-serif text-3xl">Shipping details</h2><div className="grid gap-3 sm:grid-cols-2">{["fullName","phone","email","addressLine1","city","state","postalCode","country"].map((k) => <input key={k} placeholder={k} className="border border-[#B8AD9D] bg-white px-3 py-3 text-sm outline-none" />)}</div></div><div className="grid gap-3 border border-[#B8AD9D] bg-[#FAF7F0] p-5"><h2 className="font-serif text-3xl">Payment</h2><button type="submit" className="inline-flex items-center justify-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black">Place order <ArrowRight size={14} /></button></div></form></section>;
}

export function CartRoutePanel({ onCheckout = () => {} }: CartRouteProps) {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  return <section className="bg-[#FAF7F0] px-4 py-10 md:px-8"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.7fr]"><div className="space-y-3">{(items ?? []).map((item) => { const p = products?.find((x) => x.id === item.productId); if (!p) return null; return <div key={`${item.productId}-${item.size ?? "na"}`} className="grid grid-cols-[88px_1fr_auto] gap-3 border border-[#B8AD9D] bg-white p-2"><div className="aspect-[3/4] overflow-hidden"><img src={p.image} alt={p.name} crossOrigin="anonymous" /></div><div className="min-w-0"><h3 className="truncate font-serif text-xl">{p.name}</h3><p className="text-xs uppercase tracking-[0.28em] text-[#514B43]">{p.collection}</p><div className="mt-3 flex items-center gap-2"><button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="border border-[#B8AD9D] px-2 py-1 text-xs">-</button><span className="text-sm">{item.quantity}</span><button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="border border-[#B8AD9D] px-2 py-1 text-xs">+</button></div></div><div className="flex flex-col items-end justify-between"><button onClick={() => removeItem(item.productId)} className="text-xs uppercase tracking-[0.28em] text-[#514B43]">Remove</button><p className="text-sm font-semibold">₹{(p.price * item.quantity).toLocaleString("en-IN")}</p></div></div>; })}</div><div className="sticky top-4 h-fit border border-[#B8AD9D] bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">Summary</p><div className="mt-3 flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div><button onClick={onCheckout} className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-[#C9A66B] bg-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black">Checkout <Truck size={14} /></button></div></div></section>;
}

export function ConfirmationPanel({ order = null }: ConfirmationProps) {
  if (!order) return null;
  return <section className="bg-white px-4 py-10 md:px-8"><div className="mx-auto max-w-3xl border border-[#B8AD9D] bg-[#FAF7F0] p-6 text-center"><Sparkles className="mx-auto mb-3" /><p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#514B43]">Order confirmed</p><h2 className="mt-2 font-serif text-4xl">#{order.orderNumber}</h2><p className="mt-3 text-sm text-[#514B43]">Your mojris are now being prepared with care.</p></div></section>;
}

export function StoreSections() {
  return null;
}

export default StoreSections;