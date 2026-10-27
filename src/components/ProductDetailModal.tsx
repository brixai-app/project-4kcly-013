import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { ArtisanStory, Product } from "@/types";
import { artisanStories } from "@/data/mockData";

export type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
};

type ProductDetailViewProps = {
  product?: Product | null;
  onAddToCart?: () => void;
  loading?: boolean;
  artisan?: ArtisanStory | null;
};

const fallbackProduct: Product = {
  id: "",
  name: "Mojri",
  slug: "mojri",
  price: 0,
  description: "",
  category: "",
  collection: "",
  material: "",
  color: "",
  sizes: [],
  image: "",
  gallery: [],
  featured: false,
  artisan: "",
  origin: "",
  inStock: true,
};

export function ProductDetailView({ product = fallbackProduct, onAddToCart = () => {}, loading = false, artisan = null }: ProductDetailViewProps) {
  const images = useMemo(() => [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[], [product]);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[0] ?? "");
  const [color, setColor] = useState(product?.color ?? "");

  useEffect(() => {
    setIndex(0);
    setSize(product?.sizes?.[0] ?? "");
    setColor(product?.color ?? "");
  }, [product?.id, product?.sizes, product?.color]);

  const canAdd = Boolean(product?.inStock ?? true) && Boolean(size) && Boolean(color);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4]">
          <div className="aspect-[4/5] w-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={images?.[index] ?? product?.image ?? ""}
                src={images?.[index] ?? product?.image ?? ""}
                alt={product?.name ?? "Product image"}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
          </div>
          {images.length > 1 ? (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
              <button type="button" onClick={() => setIndex((v) => (v - 1 + images.length) % images.length)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A66B] bg-[#FFFBF4]/90 text-[#2B2B2B] backdrop-blur">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setIndex((v) => (v + 1) % images.length)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A66B] bg-[#FFFBF4]/90 text-[#2B2B2B] backdrop-blur">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button key={`${src}-${i}`} type="button" onClick={() => setIndex(i)} className={cn("h-20 w-16 shrink-0 overflow-hidden rounded-md border transition", i === index ? "border-[#B04E2C]" : "border-[#C9A66B]/60")}>
              <img src={src} alt={`${product?.name ?? "Product"} thumbnail ${i + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]">{product?.collection ?? "Collection"}</p>
          <h2 className="font-['Playfair_Display',serif] text-3xl font-light tracking-tight text-[#2B2B2B]">{product?.name ?? "Product"}</h2>
          <p className="text-lg font-semibold text-[#2B2B2B]">₹{Number(product?.price ?? 0).toLocaleString("en-IN")}</p>
          <p className="text-sm leading-6 text-[#6D6257]">{product?.description ?? ""}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Size</span>
            <div className="relative">
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full appearance-none rounded-md border border-[#C9A66B] bg-[#FFFBF4] px-4 py-3 pr-10 text-sm text-[#2B2B2B] outline-none">
                {(product?.sizes ?? []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6D6257]" />
            </div>
          </label>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Color</span>
            <div className="flex flex-wrap gap-2">
              {(product?.color ? [product.color] : []).map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} className={cn("inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]", color === c ? "border-[#B04E2C] bg-[#B04E2C] text-white" : "border-[#C9A66B] bg-[#FFFBF4] text-[#2B2B2B]")}>
                  <span className="h-3 w-3 rounded-full border border-white/70" style={{ backgroundColor: c?.toLowerCase?.() ?? "#b04e2c" }} />
                  <span className="min-w-0 truncate">{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#C9A66B] bg-[#faf9f6] p-4">
          <div className="flex items-center gap-2 text-sm text-[#2B2B2B]">
            <Check className="h-4 w-4 text-[#B04E2C]" />
            <span>{product?.inStock ?? true ? "In stock and ready to ship" : "Currently unavailable"}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#6D6257]">{artisan?.story ?? "Hand-finished by artisans in Jodhpur."}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onAddToCart} disabled={!canAdd || loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#B04E2C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#8F3C22] disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Adding..." : "Add to Cart"}
          </button>
          <p className="text-sm leading-6 text-[#6D6257]">Selected: {size || "—"} / {color || "—"}</p>
        </div>

        {artisan ? (
          <div className="rounded-[18px] border border-[#C9A66B] bg-[#FFFBF4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Artisan</p>
            <p className="mt-1 font-['Playfair_Display',serif] text-xl text-[#2B2B2B]">{artisan.name}</p>
            <p className="text-sm text-[#6D6257]">{artisan.title}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProductDetailModal({ open = false, onOpenChange = () => {}, product = null }: ProductDetailModalProps) {
  const { addItem } = useCart() as { addItem?: (product: Product, options?: { size?: string; color?: string }) => void };
  const [loading, setLoading] = useState(false);
  const artisan = useMemo(() => artisanStories?.find((a) => a?.name?.toLowerCase?.() === product?.artisan?.toLowerCase?.()) ?? artisanStories?.[0] ?? null, [product?.artisan]);

  const handleAdd = () => {
    if (!product) return;
    setLoading(true);
    addItem?.(product, { size: product?.sizes?.[0] ?? "", color: product?.color ?? "" });
    window.setTimeout(() => setLoading(false), 350);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[min(96vw,1100px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] border border-[#C9A66B] bg-[#F5F0E6] shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-[#C9A66B] px-4 py-3">
            <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D6257]">Product Detail</Dialog.Title>
            <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A66B] text-[#2B2B2B]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <div className="max-h-[calc(92vh-56px)] overflow-y-auto p-4 sm:p-6">
            <ProductDetailView product={product} onAddToCart={handleAdd} loading={loading} artisan={artisan} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ProductDetailModal;