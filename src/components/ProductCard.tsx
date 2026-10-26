import React from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";

type ProductCardProps = {
  product?: Product | null;
  className?: string;
};

export function ProductCard({ product = null, className = "" }: ProductCardProps = {}) {
  const { addItem } = useCart?.() ?? {};
  const [open, setOpen] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string>(product?.sizes?.[0] ?? "");

  React.useEffect(() => {
    setSelectedSize(product?.sizes?.[0] ?? "");
  }, [product?.id, product?.sizes]);

  if (!product) return null;

  const sizes = product?.sizes ?? [];
  const canQuickAdd = typeof addItem === "function";
  const priceLabel = `₹${Number(product?.price ?? 0).toLocaleString("en-IN")}`;

  const handleQuickAdd = () => {
    if (!canQuickAdd) return;
    addItem(product, selectedSize ? { size: selectedSize } : undefined);
  };

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn("group flex h-full flex-col overflow-hidden rounded-sm border border-[#CBBCA7] bg-[#FFFDF8]", className)}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block w-full overflow-hidden bg-[#F6F0E5] text-left"
          aria-label={`Preview ${product?.name ?? "product"}`}
        >
          <div className="aspect-[3/4] w-full overflow-hidden">
            <img
              src={product?.image ?? ""}
              alt={product?.name ?? "Product image"}
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[#17130F]/55 via-[#17130F]/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              <Eye className="h-3.5 w-3.5" />
              Quick preview
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              View details
            </span>
          </div>
        </button>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F6254]">
              {product?.collection ?? product?.category ?? "Mojri"}
            </p>
            <h3 className="mt-1 truncate font-serif text-lg font-medium text-[#17130F]">
              {product?.name ?? "Untitled product"}
            </h3>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-[#17130F]">{priceLabel}</p>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!canQuickAdd}
              className={cn(
                "inline-flex items-center gap-2 rounded-sm border border-[#A8472A] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors",
                canQuickAdd ? "bg-[#A8472A] text-white hover:bg-[#84351F]" : "cursor-not-allowed bg-[#CBBCA7] text-white/80"
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick add
            </button>
          </div>

          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-0 rounded-sm border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
                    selectedSize === size
                      ? "border-[#A8472A] bg-[#A8472A] text-white"
                      : "border-[#CBBCA7] bg-transparent text-[#6F6254] hover:border-[#A8472A] hover:text-[#17130F]"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6F6254]">
              <Plus className="h-3.5 w-3.5" />
              One size
            </div>
          )}
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;