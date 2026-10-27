import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";

type ProductCardProps = {
  product?: Product;
  index?: number;
  className?: string;
};

export function ProductCard({ product, index = 0, className = "" }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string>(product?.sizes?.[0] ?? "M");
  const [wishlisted, setWishlisted] = useState(false);
  const imageAspect = index % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]";
  const currency = product?.currency ?? "₹";
  const priceLabel = useMemo(() => `${currency}${Number(product?.price ?? 0).toLocaleString("en-IN")}`, [currency, product?.price]);

  if (!product) return null;

  const handleQuickAdd = () => {
    addToCart?.({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      size,
    });
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn("group relative flex h-full flex-col overflow-hidden border border-[#CFC1AD] bg-[#FFFCF6]", className)}
      >
        <div className={cn("relative overflow-hidden bg-[#faf9f6]", imageAspect)}>
          <img
            src={product.image}
            alt={product.name}
            crossOrigin="anonymous"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 border border-[#CFC1AD] bg-[#FFFCF6] px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-[#2E2E2E] transition-colors hover:bg-[#F5F1E9]"
            >
              <Eye className="h-3.5 w-3.5" />
              Quick Preview
            </button>
            <button
              type="button"
              onClick={() => setWishlisted((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 border px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors",
                wishlisted
                  ? "border-[#8B0000] bg-[#8B0000] text-white hover:bg-[#650000]"
                  : "border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E] hover:bg-[#F5F1E9]"
              )}
            >
              <Heart className={cn("h-3.5 w-3.5", wishlisted && "fill-current")} />
              Save
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F675D]">
              {product.collection ?? product.category}
            </p>
            <Link to={`/product/${product.slug}`} className="mt-1 block min-w-0">
              <h3 className="truncate font-['Playfair_Display'] text-xl font-medium leading-tight text-[#2E2E2E]">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#2E2E2E]">{priceLabel}</p>
            <button
              type="button"
              onClick={() => navigate(`/product/${product.slug}`)}
              className="text-[11px] font-semibold uppercase tracking-widest text-[#8B0000] transition-colors hover:text-[#650000]"
            >
              Details
            </button>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            {(product.sizes?.length ? product.sizes : ["S", "M", "L"]).slice(0, 4).map((itemSize) => (
              <button
                key={itemSize}
                type="button"
                onClick={() => setSize(itemSize)}
                className={cn(
                  "min-w-0 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  size === itemSize
                    ? "border-[#8B0000] bg-[#8B0000] text-white"
                    : "border-[#CFC1AD] bg-transparent text-[#2E2E2E] hover:bg-[#F5F1E9]"
                )}
              >
                {itemSize}
              </button>
            ))}
            <button
              type="button"
              onClick={handleQuickAdd}
              className="ml-auto inline-flex items-center gap-2 border border-[#8B0000] bg-[#8B0000] px-3 py-2 text-[11px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#650000]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export default ProductCard;