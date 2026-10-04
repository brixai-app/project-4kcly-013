import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Eye, Sliders, X, Search, ArrowRight } from 'lucide-react';
import { products as catalogProducts, categories, sizeOptions, sortOptions } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import type { Product, CatalogFilters, Category, Size, CatalogSort } from "@/types";

const emptyFilters: CatalogFilters = { search: "", categories: [], sizes: [], minPrice: null, maxPrice: null, sort: "featured", inStockOnly: false };
const filterKeys = ["q", "category", "size", "min", "max", "sort", "stock"];
const money = (value = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const fieldClass = "w-full rounded-[4px] border border-[#D8CFC3] bg-[#FFFCF7] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8B0000]";
const fallbackImage = "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80";

export interface ProductCardProps { product?: Product; className?: string }
export function ProductCard({ product, className = "" }: ProductCardProps = {}) {
  const cart = useCart();
  const reduceMotion = useReducedMotion();
  if (!product) return null;
  const saved = cart?.isWishlisted?.(product?.id ?? "") ?? false;
  const available = (product?.sizes ?? []).some(size => (product?.stock?.[size] ?? 0) > 0);
  const preview = () => cart?.openPreview?.(product);
  return (
    <article className={`group min-w-0 text-[#2B2B2B] ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#E9E2D8]">
        <Link to={`/product/${product?.slug ?? ""}`} className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B0000]" aria-label={`Discover ${product?.name ?? "shoe"}`}>
          <img src={product?.image || fallbackImage} crossOrigin="anonymous" alt={product?.name ?? "Luxury footwear"} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
        </Link>
        <motion.button type="button" aria-label={`${saved ? "Remove" : "Save"} ${product?.name ?? "shoe"} ${saved ? "from" : "to"} wishlist`} aria-pressed={saved} onClick={() => cart?.toggleWishlist?.(product?.id ?? "")} whileTap={reduceMotion ? undefined : { scale: 0.85 }} className="absolute right-3 top-3 rounded-[4px] bg-[#FFFCF7]/95 p-2.5 text-[#8B0000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B0000]">
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </motion.button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-0 gap-2 opacity-100 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button type="button" disabled={!available} onClick={preview} className="flex-1 rounded-[4px] bg-[#8B0000] px-3 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#650000] disabled:cursor-not-allowed disabled:bg-[#665E54]">{available ? "Quick add" : "Sold out"}</button>
          <button type="button" onClick={preview} aria-label={`Preview ${product?.name ?? "shoe"}`} className="rounded-[4px] bg-[#FFFCF7] px-3 text-[#2B2B2B] hover:bg-[#F5F1EB]"><Eye size={18} /></button>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0"><Link to={`/product/${product?.slug ?? ""}`} className="font-['Playfair_Display'] text-lg hover:text-[#8B0000]">{product?.name ?? "Untitled"}</Link><p className="mt-1 text-xs text-[#665E54]">{product?.collection ?? product?.category ?? ""}</p></div>
        <span className="shrink-0 pt-1 text-sm font-bold">{money(product?.price ?? 0)}</span>
      </div>
    </article>
  );
}

export interface FilterDrawerProps { open?: boolean; onOpenChange?: (open: boolean) => void; filters?: CatalogFilters; onChange?: (filters: CatalogFilters) => void; resultCount?: number }
export function FilterDrawer({ open = false, onOpenChange = () => {}, filters = emptyFilters, onChange = () => {}, resultCount = 0 }: FilterDrawerProps = {}) {
  const reduceMotion = useReducedMotion();
  const toggleCategory = (value: Category) => onChange({ ...filters, categories: (filters?.categories ?? []).includes(value) ? (filters?.categories ?? []).filter(item => item !== value) : [...(filters?.categories ?? []), value] });
  const toggleSize = (value: Size) => onChange({ ...filters, sizes: (filters?.sizes ?? []).includes(value) ? (filters?.sizes ?? []).filter(item => item !== value) : [...(filters?.sizes ?? []), value] });
  const changePrice = (key: "minPrice" | "maxPrice", value: string) => onChange({ ...filters, [key]: value === "" ? null : Math.max(0, Number(value) || 0) });
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content asChild>
          <motion.div initial={{ x: reduceMotion ? 0 : "100%" }} animate={{ x: 0 }} transition={{ duration: 0.25 }} className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#D8CFC3] bg-[#FFFCF7] text-[#2B2B2B] shadow-xl">
            <div className="flex items-start justify-between border-b border-[#D8CFC3] p-6"><div><Dialog.Title className="font-['Playfair_Display'] text-3xl">Refine your selection</Dialog.Title><Dialog.Description className="mt-2 text-sm text-[#665E54]">Find your fit. Filters update the collection instantly.</Dialog.Description></div><Dialog.Close className="ml-3 p-1" aria-label="Close filters"><X size={22} /></Dialog.Close></div>
            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <fieldset><legend className="mb-4 text-xs font-semibold uppercase tracking-widest">Category</legend><div className="space-y-3">{(categories ?? []).map(category => <label key={category?.value} className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={(filters?.categories ?? []).includes(category?.value)} onChange={() => toggleCategory(category?.value)} className="h-4 w-4 accent-[#8B0000]" />{category?.label ?? ""}</label>)}</div></fieldset>
              <fieldset><legend className="mb-4 text-xs font-semibold uppercase tracking-widest">EU size</legend><div className="grid grid-cols-4 gap-2">{(sizeOptions ?? []).map(size => <button type="button" key={size} aria-pressed={(filters?.sizes ?? []).includes(size)} onClick={() => toggleSize(size)} className={`rounded-[4px] border px-3 py-2 text-sm ${(filters?.sizes ?? []).includes(size) ? "border-[#8B0000] bg-[#8B0000] text-white" : "border-[#D8CFC3] hover:border-[#8B0000]"}`}>{size}</button>)}</div></fieldset>
              <fieldset><legend className="mb-4 text-xs font-semibold uppercase tracking-widest">Price range · INR</legend><div className="grid grid-cols-2 gap-3"><label className="space-y-2 text-sm"><span>Minimum</span><input type="number" min="0" step="1" value={filters?.minPrice ?? ""} onChange={event => changePrice("minPrice", event?.currentTarget?.value ?? "")} className={fieldClass} /></label><label className="space-y-2 text-sm"><span>Maximum</span><input type="number" min="0" step="1" value={filters?.maxPrice ?? ""} onChange={event => changePrice("maxPrice", event?.currentTarget?.value ?? "")} className={fieldClass} /></label></div></fieldset>
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={filters?.inStockOnly ?? false} onChange={event => onChange({ ...filters, inStockOnly: event?.currentTarget?.checked ?? false })} className="h-4 w-4 accent-[#8B0000]" />Available now only</label>
            </div>
            <div className="flex items-center gap-4 border-t border-[#D8CFC3] p-6"><button type="button" onClick={() => onChange({ ...emptyFilters, search: filters?.search ?? "", sort: filters?.sort ?? "featured" })} className="text-xs uppercase tracking-widest underline underline-offset-4">Reset filters</button><Dialog.Close className="flex-1 rounded-[4px] bg-[#8B0000] px-4 py-3 text-xs uppercase tracking-widest text-white hover:bg-[#650000]">View {resultCount} results</Dialog.Close></div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export interface CatalogSectionProps { products?: Product[]; title?: string; limit?: number; className?: string }
export function CatalogSection({ products = catalogProducts, title = "The collection", limit, className = "" }: CatalogSectionProps = {}) {
  const [params, setParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const priceParam = (key: string) => { const value = params?.get(key); return value !== null && value !== "" && Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : null; };
  const filters: CatalogFilters = {
    search: params?.get("q") ?? "",
    categories: (params?.get("category") ?? "").split(",").filter(value => (categories ?? []).some(category => category?.value === value)) as Category[],
    sizes: (params?.get("size") ?? "").split(",").map(Number).filter(value => (sizeOptions ?? []).includes(value as Size)) as Size[],
    minPrice: priceParam("min"), maxPrice: priceParam("max"),
    sort: (sortOptions ?? []).some(option => option?.value === params?.get("sort")) ? params?.get("sort") as CatalogSort : "featured",
    inStockOnly: params?.get("stock") === "1",
  };
  const updateFilters = (next: CatalogFilters) => {
    const nextParams = new URLSearchParams(params);
    filterKeys.forEach(key => nextParams.delete(key));
    const values = { q: next?.search ?? "", category: (next?.categories ?? []).join(","), size: (next?.sizes ?? []).join(","), min: next?.minPrice?.toString() ?? "", max: next?.maxPrice?.toString() ?? "", sort: next?.sort === "featured" ? "" : next?.sort ?? "", stock: next?.inStockOnly ? "1" : "" };
    Object.entries(values).forEach(([key, value]) => { if (value) nextParams.set(key, value); });
    nextParams.delete("page");
    setParams(nextParams, { replace: true });
  };
  const results = useMemo(() => {
    const query = (filters?.search ?? "").trim().toLowerCase();
    return (products ?? []).filter(product => {
      const sizes = filters?.sizes?.length ? filters?.sizes : product?.sizes ?? [];
      return `${product?.name ?? ""} ${product?.collection ?? ""} ${product?.category ?? ""} ${product?.color ?? ""}`.toLowerCase().includes(query) && (!filters?.categories?.length || filters?.categories?.includes(product?.category)) && (!filters?.sizes?.length || sizes.some(size => (product?.sizes ?? []).includes(size) && (product?.stock?.[size] ?? 0) > 0)) && (filters?.minPrice === null || (product?.price ?? 0) >= (filters?.minPrice ?? 0)) && (filters?.maxPrice === null || (product?.price ?? 0) <= (filters?.maxPrice ?? Infinity)) && (!filters?.inStockOnly || sizes.some(size => (product?.stock?.[size] ?? 0) > 0));
    }).sort((a, b) => filters?.sort === "price-asc" ? (a?.price ?? 0) - (b?.price ?? 0) : filters?.sort === "price-desc" ? (b?.price ?? 0) - (a?.price ?? 0) : filters?.sort === "newest" ? Number(b?.isNew ?? false) - Number(a?.isNew ?? false) : Number(b?.featured ?? false) - Number(a?.featured ?? false));
  }, [products, params?.toString()]);
  const chips = [
    ...(filters?.search ? [{ label: `Search: ${filters?.search}`, remove: () => updateFilters({ ...filters, search: "" }) }] : []),
    ...(filters?.categories ?? []).map(value => ({ label: (categories ?? []).find(category => category?.value === value)?.label ?? value, remove: () => updateFilters({ ...filters, categories: (filters?.categories ?? []).filter(item => item !== value) }) })),
    ...(filters?.sizes ?? []).map(value => ({ label: `EU ${value}`, remove: () => updateFilters({ ...filters, sizes: (filters?.sizes ?? []).filter(item => item !== value) }) })),
    ...(filters?.minPrice !== null ? [{ label: `From ${money(filters?.minPrice ?? 0)}`, remove: () => updateFilters({ ...filters, minPrice: null }) }] : []),
    ...(filters?.maxPrice !== null ? [{ label: `Up to ${money(filters?.maxPrice ?? 0)}`, remove: () => updateFilters({ ...filters, maxPrice: null }) }] : []),
    ...(filters?.inStockOnly ? [{ label: "Available now", remove: () => updateFilters({ ...filters, inStockOnly: false }) }] : []),
  ];
  return (
    <section className={`bg-[#F5F1EB] px-5 py-12 font-['Lora'] text-[#2B2B2B] md:px-10 md:py-20 ${className}`} aria-label={title}>
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#D8CFC3] pb-6"><h2 className="font-['Playfair_Display'] text-4xl tracking-tight md:text-5xl">{title}</h2><p role="status" className="text-sm text-[#665E54]">{results?.length ?? 0} pieces</p></div>
        <div className="mb-6 flex flex-wrap items-center gap-4"><label className="relative min-w-48 flex-1"><Search size={16} className="absolute left-3 top-3 text-[#665E54]" /><input type="search" aria-label="Search collection" placeholder="Find your next signature pair" value={filters?.search ?? ""} onChange={event => updateFilters({ ...filters, search: event?.currentTarget?.value ?? "" })} className={`${fieldClass} pl-10`} /></label><button type="button" onClick={() => setFilterOpen(true)} className="flex items-center gap-2 rounded-[4px] border border-[#D8CFC3] px-4 py-2 text-xs uppercase tracking-widest"><Sliders size={16} />Filters{chips?.length ? ` (${chips?.length})` : ""}</button><select aria-label="Sort collection" value={filters?.sort ?? "featured"} onChange={event => updateFilters({ ...filters, sort: event?.currentTarget?.value as CatalogSort })} className={`${fieldClass} !w-auto`}>{(sortOptions ?? []).map(option => <option key={option?.value} value={option?.value}>{option?.label ?? ""}</option>)}</select></div>
        {chips?.length > 0 && <div className="mb-8 flex flex-wrap gap-2">{chips.map(chip => <button key={chip?.label} type="button" onClick={chip?.remove} aria-label={`Remove ${chip?.label}`} className="flex items-center gap-2 rounded-[4px] border border-[#D8CFC3] px-3 py-2 text-xs">{chip?.label}<X size={13} /></button>)}<button type="button" onClick={() => updateFilters(emptyFilters)} className="px-3 text-xs underline underline-offset-4">Clear all</button></div>}
        {results?.length ? <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 lg:grid-cols-4">{results.slice(0, limit === undefined ? results?.length : Math.max(0, limit)).map(product => <ProductCard key={product?.id} product={product} />)}</div> : <div className="py-24 text-center"><h3 className="font-['Playfair_Display'] text-3xl">A different direction, perhaps.</h3><p className="mt-3 text-sm text-[#665E54]">No pieces match this selection. Try widening your search.</p><button type="button" onClick={() => updateFilters(emptyFilters)} className="mx-auto mt-6 flex items-center gap-3 text-xs uppercase tracking-widest text-[#8B0000]">Explore all pieces<ArrowRight size={16} /></button></div>}
      </div>
      <FilterDrawer open={filterOpen} onOpenChange={setFilterOpen} filters={filters} onChange={updateFilters} resultCount={results?.length ?? 0} />
    </section>
  );
}

export default ProductCard;