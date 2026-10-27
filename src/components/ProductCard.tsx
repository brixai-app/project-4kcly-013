import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Star } from 'lucide-react';
import { toast } from "sonner";
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
  const inStock = product?.inStock ?? true;

  const priceLabel = useMemo(() => `₹${Number(product?.price ?? 0).toLocaleString("en-IN")}`, [product?.price]);

  if (!product) return null;

  const handleQuickAdd = () => {
    if (!inStock) {
      toast.error("This pair is currently out of stock.");
      return;
    }
    if (hasSizes && !selectedSize) {
      setOpen(true);
      toast.message("Select a size to continue.");
      return;
    }
    addItem?.(product.id, 1, selectedSize || undefined);
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={cn("group relative flex h-full flex-col overflow-hidden border border-[#D8CBBB] bg-[#FFFDFC]", className)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F5F0]">
          <img
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="border border-[#D8CBBB] bg-[#FFFDFC]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
              {inStock ? "In stock" : "Sold out"}
            </span>
            {typeof product.rating === "number" ? (
              <span className="inline-flex items-center gap-1 border border-[#D8CBBB] bg-[#FFFDFC]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
                <Star className="h-3 w-3 fill-[#BFA06E] text-[#BFA06E]" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/35 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 border border-[#FFFDFC] bg-[#FFFDFC] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#000000]"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick Preview
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-2 border border-[#BFA06E] bg-[#BFA06E] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#000000]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/product/${product.slug}`} className="block min-w-0 truncate font-serif text-lg font-light tracking-tight text-[#2B2B2B]">
                {product.name}
              </Link>
              <p className="mt-1 truncate text-[11px] uppercase tracking-[0.22em] text-[#6D6259]">{product.category}</p>
            </div>
            <p className="shrink-0 font-semibold text-[#2B2B2B]">{priceLabel}</p>
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-[#6D6259]">{product.description}</p>

          {hasSizes ? (
            <div className="mt-auto flex flex-wrap gap-2">
              {sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors",
                    selectedSize === size
                      ? "border-[#BFA06E] bg-[#BFA06E] text-[#000000]"
                      : "border-[#D8CBBB] bg-[#FFFDFC] text-[#2B2B2B]"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-auto text-[10px] uppercase tracking-[0.22em] text-[#6D6259]">One refined fit</div>
          )}
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;