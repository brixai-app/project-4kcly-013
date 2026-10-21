import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
} from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";
import { Product, artisans, formatPriceINR, useCart } from "@/mock";
import { toast } from "sonner";

export interface ProductCardProps {
  product: Product;
  className?: string;
  /**
   * When true, renders a slightly more prominent treatment (used for hero/featured rows)
   */
  featured?: boolean;
}

// Map internal color tokens to display labels and swatch classes
const COLOR_META: Record<
  string,
  { label: string; swatchClass: string; badgeClass: string }
> = {
  "deep-indigo": {
    label: "Deep Indigo",
    swatchClass: "bg-[#1f2341]",
    badgeClass:
      "border-indigo-500/40 text-indigo-900 dark:text-indigo-100 bg-indigo-50/80 dark:bg-indigo-500/20",
  },
  "warm-ochre": {
    label: "Warm Ochre",
    swatchClass: "bg-[#c27a32]",
    badgeClass:
      "border-amber-500/40 text-amber-900 dark:text-amber-100 bg-amber-50/80 dark:bg-amber-500/20",
  },
  "sand-beige": {
    label: "Sand Beige",
    swatchClass: "bg-[#d0b89f]",
    badgeClass:
      "border-amber-300/50 text-stone-900 dark:text-stone-50 bg-amber-50/70 dark:bg-amber-500/10",
  },
  marigold: {
    label: "Marigold",
    swatchClass: "bg-[#e09a28]",
    badgeClass:
      "border-orange-400/60 text-orange-900 dark:text-orange-50 bg-orange-50/80 dark:bg-orange-500/20",
  },
};

const cardMotion = {
  initial: { y: 0, opacity: 0.92, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  whileHover: {
    y: -6,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
  },
  transition: {
    type: "spring",
    stiffness: 230,
    damping: 22,
    mass: 0.9,
  },
};

const imageMotion = {
  whileHover: { scale: 1.03 },
  transition: { type: "spring", stiffness: 220, damping: 24 },
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  featured,
}) => {
  const { addToCart, cart } = useCart();

  const artisan = artisans.find((a) => a.id === product.artisanId);

  const uniqueColors = Array.from(
    new Set(product.variants.map((v) => v.color)),
  );

  const handleQuickAdd = () => {
    // Choose first available variant for quick-add
    const variant = product.variants[0];
    if (!variant) return;

    addToCart(product.id, { size: variant.size, color: variant.color }, 1);

    const existingLine = cart.find(
      (item) =>
        item.productId === product.id &&
        item.variant.size === variant.size &&
        item.variant.color === variant.color,
    );

    const actionLabel = existingLine ? "Updated cart" : "Added to cart";

    toast.success(actionLabel, {
      description: `${product.name} · ${variant.size} · ${COLOR_META[variant.color]?.label ?? variant.color}`,
    });
  };

  const isLowStock = product.variants.some((v) => v.stock > 0 && v.stock <= 2);
  const isInStock = product.variants.some((v) => v.stock > 0);

  return (
    <motion.div
      className={cn("h-full", className)}
      initial={cardMotion.initial}
      whileHover={cardMotion.withinHover}
    >
      <Card
        className={cn(
          "group flex h-full flex-col overflow-hidden border border-slate-200/70 bg-gradient-to-b from-stone-50/90 via-white to-stone-50/60 shadow-sm transition-[box-shadow,transform,border-color,background] duration-200 dark:border-slate-800/80 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-900/60",
          featured &&
            "border-amber-300/70 bg-gradient-to-b from-amber-50/80 via-white to-stone-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900",
        )}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200/60 dark:bg-slate-800/60">
            <motion.img
              src={product.primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-110"
              whileHover={imageMotion.withinHover}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10 opacity-70 mix-blend-multiply" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 text-xs font-medium text-stone-50">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-['Playfair_Display'] text-[0.8rem] tracking-[0.08em] uppercase text-amber-100">
                  Jootiya · {artisan?.region ?? "Rajasthan"}
                </span>
                <span className="whitespace-normal break-words text-[0.85rem] font-semibold">
                  {product.name}
                </span>
              </div>
              {featured && (
                <div className="flex items-center gap-1 rounded-full bg-amber-100/90 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-amber-900 shadow-sm dark:bg-amber-400/90 dark:text-amber-950">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured</span>
                </div>
              )}
            </div>
          </div>
        </Link>

        <CardHeader className="flex flex-col gap-2 px-4 pt-4 md:px-5 md:pt-5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="whitespace-normal break-words text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {product.name}
            </CardTitle>
            <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {formatPriceINR(product.price)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
            <CardDescription className="whitespace-normal break-words text-xs text-slate-600 dark:text-slate-300">
              {artisan ? `${artisan.name} · ${artisan.region}` : "Rajasthan Atelier"}
            </CardDescription>
            {isInStock ? (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-50/80 px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-emerald-900 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-100">
                {isLowStock ? "Limited" : "In Studio"}
              </span>
            ) : (
              <span className="rounded-full border border-slate-400/60 bg-slate-100/80 px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-slate-700 dark:border-slate-500 dark:bg-slate-800/80 dark:text-slate-200">
                Waitlist
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-1 md:px-5 md:pb-4">
          {product.highlight && (
            <p className="line-clamp-3 text-[0.8rem] leading-relaxed text-slate-700 dark:text-slate-200">
              {product.highlight}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {uniqueColors.slice(0, 3).map((colorKey) => {
              const meta = COLOR_META[colorKey] ?? COLOR_META["sand-beige"];
              return (
                <Badge
                  key={colorKey}
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium",
                    meta.badgeClass,
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3 w-3 rounded-full border border-white/60 shadow-sm",
                      meta.swatchClass,
                    )}
                  />
                  <span>{meta.label}</span>
                </Badge>
              );
            })}
            {uniqueColors.length > 3 && (
              <span className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                +{uniqueColors.length - 3} more tones
              </span>
            )}
          </div>

          {product.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {product.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-[0.7rem] uppercase tracking-[0.14em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100/90 bg-stone-50/70 px-4 py-3 md:px-5 dark:border-slate-800/80 dark:bg-slate-900/80">
          <Button
            type="button"
            size="sm"
            disabled={!isInStock}
            onClick={handleQuickAdd}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-50 shadow-sm transition-[background-color,color,box-shadow] duration-200 hover:bg-slate-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300",
              !isInStock &&
                "cursor-not-allowed bg-slate-300 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-700",
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{isInStock ? "Add to Cart" : "Join Waitlist"}</span>
          </Button>

          <Link
            to={`/product/${product.id}`}
            className="text-[0.75rem] font-medium uppercase tracking-[0.16em] text-slate-700 underline-offset-4 hover:text-amber-700 hover:underline dark:text-slate-200 dark:hover:text-amber-300"
          >
            View details
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;