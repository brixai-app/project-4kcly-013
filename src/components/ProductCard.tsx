import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, Plus, ShoppingBag } from 'lucide-react';
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product?: Product;
  className?: string;
};

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addToCart } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const [favored, setFavored] = useState(false);

  const inStock = product?.inStock ?? true;
  const priceLabel = useMemo(
    () => `₹${Number(product?.price ?? 0).toLocaleString("en-IN")}`,
    [product?.price]
  );

  if (!product) return null;

  const handleQuickAdd = () => {
    if (!inStock) return;
    addToCart?.(product, product?.sizes?.[0] ?? undefined);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn(
          "group relative overflow-hidden rounded-[18px] border border-[#C9A66B]/70 bg-[#FFFBF4] shadow-[0_10px_30px_rgba(43,43,43,0.06)]",
          className
        )}
      >
        <button
          type="button"
          onClick={() => setFavored((v) => !v)}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#C9A66B]/70 bg-[#FFFBF4]/90 text-[#2B2B2B] backdrop-blur-sm transition hover:bg-[#B04E2C] hover:text-white"
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-4 w-4", favored && "fill-current")} />
        </button>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full text-left"
          aria-label={`Preview ${product?.name ?? "product"}`}
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0E6]">
            <img
              src={product?.image ?? ""}
              alt={product?.name ?? "Product image"}
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2B2B2B]/45">
                <span className="rounded-md border border-white/40 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
                  Out of stock
                </span>
              </div>
            )}
          </div>
        </button>

        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6D6257]">
                {product?.collection ?? "Collection"}
              </p>
              <h3 className="truncate font-['Playfair_Display',serif] text-lg font-medium text-[#2B2B2B]">
                {product?.name ?? "Untitled"}
              </h3>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[#2B2B2B]">{priceLabel}</p>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-[#6D6257]">
            {product?.description ?? ""}
          </p>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:text-[#B04E2C]"
            >
              <Eye className="h-4 w-4" />
              Quick preview
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!inStock}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition",
                inStock
                  ? "border-[#B04E2C] bg-[#B04E2C] text-white hover:bg-[#8F3C22]"
                  : "cursor-not-allowed border-[#C9A66B]/50 bg-[#F5F0E6] text-[#6D6257]"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Quick add</span>
              <Plus className="h-4 w-4 sm:hidden" />
            </button>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;