import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import ProductDetailModal from "@/components/ProductDetailModal";

type ProductCardProps = {
  product?: Product | null;
  className?: string;
};

export function ProductCard({ product = null, className = "" }: ProductCardProps) {
  const { addToCart, items } = useCart?.() ?? {};
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const inCart = useMemo(() => {
    return (items ?? []).some(
      (item: any) =>
        item?.product?.id === product?.id &&
        (selectedSize ? item?.selectedSize === selectedSize : true) &&
        (selectedColor ? item?.selectedColor === selectedColor : true),
    );
  }, [items, product?.id, selectedColor, selectedSize]);

  if (!product?.id) return null;

  const handleQuickAdd = () => {
    if (!addToCart) return;
    addToCart(product, 1, selectedSize, selectedColor);
  };

  return (
    <>
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className={cn("group relative flex h-full flex-col overflow-hidden border border-[#D8CCB8] bg-[#FFFDF8]", className)}
      >
        <Link to={`/product/${product.slug ?? product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F0]">
            <img
              src={product.image ?? ""}
              alt={product.name ?? "Product image"}
              crossOrigin="anonymous"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/45 via-black/10 to-transparent p-4">
              <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-white/90">
                {product.collection ?? product.category ?? "Mojri"}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(true);
                }}
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6257]">
              {product.category ?? "Footwear"}
            </p>
            <h3 className="mt-1 line-clamp-2 font-['Playfair_Display'] text-xl font-medium leading-tight text-[#2B2B2B]">
              {product.name ?? "Untitled"}
            </h3>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="font-['Bodoni_Moda'] text-lg font-semibold tracking-tight text-[#2B2B2B]">
              ₹{Number(product.price ?? 0).toLocaleString("en-IN")}
            </p>
            <button
              type="button"
              onClick={handleQuickAdd}
              className={cn(
                "inline-flex items-center gap-2 border border-[#9A7440] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#000000] transition-colors hover:bg-[#9A7440] hover:text-white",
                inCart && "bg-[#9A7440] text-white",
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {inCart ? "Added" : "Quick Add"}
            </button>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSelectedSize(product.sizes?.[0] ?? selectedSize)}
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6D6257] transition-colors hover:text-[#2B2B2B]"
            >
              <Heart className="h-3.5 w-3.5" />
              {selectedSize ?? product.sizes?.[0] ?? "Select size"}
            </button>
            <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6D6257]">
              {selectedColor ?? product.colors?.[0] ?? "One tone"}
            </span>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal
        product={product}
        open={open}
        onOpenChange={setOpen}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSelectSize={setSelectedSize}
        onSelectColor={setSelectedColor}
      />
    </>
  );
}

export default ProductCard;