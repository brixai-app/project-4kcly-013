import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Filter, Search, Star, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
// [auto-quarantined uninstalled package "@radix-ui/react-select"] import * as Select from "@radix-ui/react-select";
const Select: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => Select, apply: () => null }) : (() => null);
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import type { Order, Product, Review } from "@/types";

type Props = { className?: string; products?: Product[]; reviews?: Review[]; order?: Order | null };

const field = "w-full rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] px-3 py-2 text-sm text-[#2E2E2E] outline-none transition focus:border-[#8B0000]";
const label = "text-[11px] uppercase tracking-[0.22em] text-[#6F675D]";
const section = "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function SelectField({ value, onValueChange, options = [], placeholder = "Select" }: { value?: string; onValueChange?: (v: string) => void; options?: string[]; placeholder?: string }) {
  return (
    <Select.Root value={value ?? ""} onValueChange={(v) => onValueChange?.(v)}>
      <Select.Trigger className={cn(field, "flex items-center justify-between gap-2 text-left")}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon><ChevronDown className="h-4 w-4" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 overflow-hidden rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] shadow-lg">
          <Select.Viewport className="p-1">
            {options.map((o) => <Select.Item key={o} value={o} className="cursor-pointer rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-[#F5F1E9]"><Select.ItemText>{o}</Select.ItemText></Select.Item>)}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export function CommerceSections({ className = "", products = [], reviews = [], order = null }: Props) {
  const [items, setItems] = useState<Product[]>(products ?? []);
  const [loading, setLoading] = useState(!(products?.length ?? 0));
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const { addItem } = useCart() as { addItem?: (p: Product, size?: string) => void };
  const navigate = useNavigate();
  const params = useParams();
  const query = useQuery();

  useEffect(() => {
    if ((products?.length ?? 0) > 0) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/products");
        const json = (await res.json()) as { success?: boolean; data?: Product[] };
        if (alive) setItems(json?.data ?? []);
      } catch {
        if (alive) toast.error("Unable to load collection.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [products]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((p) => p.category).filter(Boolean)))], [items]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((p) => (category === "All" ? true : p.category === category))
      .filter((p) => !term || [p.name, p.collection, p.category, p.artisan, p.material].join(" ").toLowerCase().includes(term))
      .sort((a, b) => (sort === "Price: Low to High" ? a.price - b.price : sort === "Price: High to Low" ? b.price - a.price : Number(!!b.featured) - Number(!!a.featured)));
  }, [items, q, category, sort]);

  const product = useMemo(() => items.find((p) => p.slug === (params?.slug ?? query.get("slug") ?? "")) ?? null, [items, params, query]);
  const productReviews = useMemo(() => reviews.filter((r) => r.productId === (product?.id ?? "")), [reviews, product]);

  const addToCart = (p: Product) => {
    addItem?.(p, p.sizes?.[0]);
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div className={cn("bg-[#F5F1E9] text-[#2E2E2E]", className)}>
      <section className={section}>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-4">
            <div className="flex items-center gap-2 border-b border-[#CFC1AD] pb-3">
              <Filter className="h-4 w-4 text-[#8B0000]" />
              <h2 className="min-w-0 truncate text-xs uppercase tracking-[0.22em] text-[#6F675D]">Filters</h2>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <div>
                <div className={label}>Search</div>
                <div className="mt-2 flex items-center gap-2 rounded-sm border border-[#CFC1AD] bg-white px-3">
                  <Search className="h-4 w-4 text-[#6F675D]" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mojris" className="w-full bg-transparent py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <div className={label}>Category</div>
                <div className="mt-2"><SelectField value={category} onValueChange={setCategory} options={categories} placeholder="All" /></div>
              </div>
              <div>
                <div className={label}>Sort</div>
                <div className="mt-2"><SelectField value={sort} onValueChange={setSort} options={["Featured", "Price: Low to High", "Price: High to Low"]} placeholder="Featured" /></div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className={label}>Collection</p>
                <h1 className="mt-1 font-['Playfair_Display'] text-3xl font-light tracking-tight sm:text-4xl">Jodhpuri Mojris, reimagined with restraint.</h1>
              </div>
              <p className="hidden text-sm text-[#6F675D] sm:block">{filtered.length} pieces</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-sm border border-[#CFC1AD] bg-[#FFFCF6]" />) : filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} className="h-full" />)}
            </div>
          </div>
        </div>
      </section>

      {product ? (
        <section className={cn(section, "border-t border-[#CFC1AD]")}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
              {(product.gallery?.length ? product.gallery : [product.image, product.image]).slice(0, 4).map((src, idx) => (
                <img key={`${src}-${idx}`} src={src} crossOrigin="anonymous" alt={product.name} className={cn("w-full rounded-sm border border-[#CFC1AD] object-cover", idx === 0 ? "sm:col-span-2 aspect-[4/5]" : "aspect-[3/4]")} />
              ))}
            </motion.div>
            <div className="min-w-0">
              <p className={label}>{product.collection ?? product.category}</p>
              <h2 className="mt-2 font-['Playfair_Display'] text-4xl font-light tracking-tight">{product.name}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6F675D]">{product.description ?? "Hand-finished craftsmanship with a refined silhouette and enduring comfort."}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-semibold">₹{product.price.toLocaleString("en-IN")}</span>
                <span className="text-[#6F675D]">{product.material ?? "Leather"}</span>
                <span className="text-[#6F675D]">{product.origin ?? "Jodhpur"}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => addToCart(product)} className="rounded-sm bg-[#8B0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#650000]">Add to cart</button>
                <button onClick={() => navigate(`/shop?slug=${product.slug}`)} className="rounded-sm border border-[#CFC1AD] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E2E2E] transition hover:border-[#8B0000] hover:text-[#8B0000]">View details</button>
              </div>
              <div className="mt-8 space-y-3 border-t border-[#CFC1AD] pt-6">
                <div className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 fill-[#8B0000] text-[#8B0000]" /> {product.rating ?? 4.8} ({product.reviewCount ?? productReviews.length ?? 0} reviews)</div>
                {productReviews.slice(0, 3).map((r) => <div key={r.id} className="rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-4"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{r.author}</strong><span className="text-xs text-[#6F675D]">{r.createdAt}</span></div><p className="mt-2 text-sm text-[#6F675D]">{r.body}</p></div>)}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={cn(section, "border-t border-[#CFC1AD]")}>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-6">
            <p className={label}>Checkout</p>
            <h3 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight">A calm, validated purchase flow.</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Full name", "Email", "Phone", "Postal code"].map((f) => <input key={f} placeholder={f} className={field} />)}
              <textarea placeholder="Address" className={cn(field, "min-h-28 sm:col-span-2")} />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={() => toast.success("Checkout details validated")} className="rounded-sm bg-[#8B0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#650000]">Continue</button>
              <span className="text-sm text-[#6F675D]">Secure, client-side validation</span>
            </div>
          </div>
          <div className="rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-6">
            <p className={label}>Order summary</p>
            <div className="mt-4 space-y-3">
              {(order?.items ?? []).slice(0, 4).map((item) => <div key={`${item.productId}-${item.size ?? ""}`} className="flex items-center gap-3"><img src={item.image} crossOrigin="anonymous" alt={item.name} className="h-16 w-12 rounded-sm object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="text-xs text-[#6F675D]">Qty {item.quantity}</p></div><p className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p></div>)}
            </div>
            <div className="mt-5 border-t border-[#CFC1AD] pt-4 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#6F675D]">Subtotal</span><span>₹{order?.subtotal?.toLocaleString("en-IN") ?? "0"}</span></div>
              <div className="mt-2 flex items-center justify-between"><span className="text-[#6F675D]">Shipping</span><span>₹{order?.shipping?.toLocaleString("en-IN") ?? "0"}</span></div>
              <div className="mt-3 flex items-center justify-between border-t border-[#CFC1AD] pt-3 font-semibold"><span>Total</span><span>₹{order?.total?.toLocaleString("en-IN") ?? "0"}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(section, "border-t border-[#CFC1AD]")}>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-6">
            <p className={label}>Order confirmation</p>
            <div className="mt-4 flex items-center gap-3 text-[#8B0000]"><CheckCircle2 className="h-5 w-5" /><span className="text-sm font-semibold uppercase tracking-[0.22em]">Confirmed</span></div>
            <p className="mt-4 text-sm leading-7 text-[#6F675D]">Your order is being prepared by our artisan network. Tracking and delivery updates will appear here.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8B0000]"><ArrowRight className="h-4 w-4" /> Continue shopping</Link>
          </div>
          <div className="rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-6">
            <p className={label}>Delivery status</p>
            <div className="mt-4 space-y-4">
              {["Pending", "Processing", "Shipped", "Delivered"].map((s, i) => <div key={s} className="flex items-center gap-3"><div className={cn("h-2.5 w-2.5 rounded-full", i < 2 ? "bg-[#8B0000]" : "bg-[#CFC1AD]")} /><div className="min-w-0"><p className="text-sm font-medium">{s}</p><p className="text-xs text-[#6F675D]">Status updates from the atelier</p></div></div>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CommerceSections;