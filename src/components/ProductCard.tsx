import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, ShoppingBag, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { MojriProduct } from "@/types";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product?: MojriProduct | null;
  className?: string;
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80";

export function ProductCard({ product = null, className = "" }: ProductCardProps) {
  const { addItem } = useCart?.() ?? {};
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const safeProduct = product ?? {
    id: "placeholder",
    name: "Jootiya Signature Mojri",
    slug: "jootiya-signature-mojri",
    price: 0,
    description: "",
    category: "Mojri",
    collection: "Atelier",
    artisanId: "",
    image: FALLBACK_IMAGE,
    gallery: [],
    sizes: [],
    colors: [],
    featured: false,
    inStock: false,
    provenance: "",
    care: "",
  };

  const imageSrc = useMemo(() => {
    const src = safeProduct?.image?.trim() || FALLBACK_IMAGE;
    return imageError ? FALLBACK_IMAGE : src;
  }, [safeProduct?.image, imageError]);

  const handleQuickAdd = () => {
    if (!safeProduct?.inStock) return;
    addItem?.(safeProduct.id, 1, safeProduct.sizes?.[0], safeProduct.colors?.[0]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#CDBB9D] bg-[#FFFDFC]", className)}
    >
      <Link to={`/product/${safeProduct?.slug ?? ""}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F0E3]">
          <img
            src={imageSrc}
            alt={safeProduct?.name ?? "Product image"}
            crossOrigin="anonymous"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#211A17]/70 via-[#211A17]/10 to-transparent p-4 text-white">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
                {safeProduct?.collection ?? "Collection"}
              </p>
              <h3 className="mt-1 truncate font-['Bodoni_Moda'] text-xl font-light tracking-tight">
                {safeProduct?.name ?? "Untitled"}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-white/85">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{safeProduct?.featured ? "Featured" : "Editions"}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6F6258]">
              {safeProduct?.category ?? "Mojri"}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#211A17]">
              {safeProduct?.description ?? ""}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#741F2B]">
            ₹{Number(safeProduct?.price ?? 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className={cn("text-[10px] font-semibold uppercase tracking-[0.24em]", safeProduct?.inStock ? "text-[#6F6258]" : "text-[#741F2B]")}>
            {safeProduct?.inStock ? "Available" : "Sold Out"}
          </p>
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${safeProduct?.slug ?? ""}`}
              className="inline-flex items-center gap-1 border border-[#CDBB9D] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#211A17] transition-colors hover:bg-[#F7F0E3]"
            >
              Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!safeProduct?.inStock}
              className="inline-flex items-center gap-1 bg-[#741F2B] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#561620] disabled:cursor-not-allowed disabled:bg-[#CDBB9D]"
            >
              {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
              {added ? "Added" : "Quick Add"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;