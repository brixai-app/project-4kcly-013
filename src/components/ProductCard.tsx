import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, ShoppingBag, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";

type ProductCardProps = {
  product?: Product | null;
  className?: string;
};

export function ProductCard({ product = null, className = "" }: ProductCardProps) {
  const { addItem } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const sizes = product?.sizes ?? [];
  const hasSizes = sizes.length > 0;
  const defaultSize = sizes[0] ?? "";
  const activeSize = selectedSize || defaultSize;

  const priceLabel = useMemo(() => `₹${Number(product?.price ?? 0).toLocaleString("en-IN")}`, [product?.price]);
  const originalLabel = useMemo(
    () => (product?.originalPrice ? `₹${Number(product?.originalPrice ?? 0).toLocaleString("en-IN")}` : ""),
    [product?.originalPrice]
  );

  const handleQuickAdd = () => {
    if (!product || !addItem) return;
    addItem({ productId: product.id, quantity: 1, size: activeSize || null, color: product.color ?? null });
  };

  if (!product) return null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn("group flex h-full flex-col overflow-hidden rounded-sm border border-[#B8AD9D] bg-white", className)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F0]">
          <img
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex items-center gap-1 rounded-sm border border-[#B8AD9D] bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1F1E1C]">
              <Star className="h-3 w-3 fill-[#C9A66B] text-[#C9A66B]" />
              <span>{product.collection ?? "Collection"}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1 rounded-sm border border-[#B8AD9D] bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1F1E1C] transition-colors hover:bg-[#FAF7F0]"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Quick View</span>
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-2 rounded-sm bg-[#C9A66B] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#D8BC89]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Quick Add</span>
            </button>
            <Link
              to={`/shop/${product.slug}`}
              className="inline-flex items-center gap-1 rounded-sm border border-white/70 bg-black/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <span>Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[#514B43]">
              {product.category ?? "Mojri"}
            </p>
            <h3 className="mt-1 line-clamp-2 font-['Playfair_Display'] text-xl font-medium leading-tight text-[#1F1E1C]">
              {product.name}
            </h3>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-[#514B43]">{product.description}</p>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-[#1F1E1C]">{priceLabel}</span>
                {originalLabel ? <span className="text-xs text-[#514B43] line-through">{originalLabel}</span> : null}
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#514B43]">
                {product.inStock ? `${product.stock ?? 0} in stock` : "Sold out"}
              </p>
            </div>

            {hasSizes ? (
              <select
                value={activeSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="max-w-[120px] rounded-sm border border-[#B8AD9D] bg-white px-2 py-2 text-[10px] uppercase tracking-[0.18em] text-[#1F1E1C] outline-none transition-colors focus:border-[#C9A66B]"
                aria-label={`Select size for ${product.name}`}
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            ) : (
              <Link
                to={`/shop/${product.slug}`}
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1F1E1C] transition-colors hover:text-[#C9A66B]"
              >
                <span>View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;