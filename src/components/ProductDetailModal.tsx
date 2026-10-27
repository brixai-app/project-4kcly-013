import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type ProductDetailModalProps = {
  product?: Product | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ProductDetailModal({
  product = null,
  open = false,
  onOpenChange = () => {},
}: ProductDetailModalProps) {
  const { addItem } = useCart() as {
    addItem?: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  };
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);

  const sizes = useMemo(() => product?.sizes ?? ["7", "8", "9", "10", "11"], [product?.sizes]);
  const colors = useMemo(() => product?.colors ?? ["Tan", "Brown", "Black"], [product?.colors]);

  useEffect(() => {
    if (!open) return;
    setSelectedSize(product?.sizes?.[0] ?? "");
    setSelectedColor(product?.colors?.[0] ?? "");
    setLoading(false);
  }, [open, product?.id, product?.sizes, product?.colors]);

  const handleAdd = async () => {
    if (!product) return;
    if ((product?.sizes?.length ?? 0) > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if ((product?.colors?.length ?? 0) > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    addItem?.(product, 1, selectedSize || undefined, selectedColor || undefined);
    toast.success("Added to cart.");
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B] shadow-2xl"
              >
                <div className="grid max-h-[88vh] md:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative min-h-[320px] bg-[#FAF7F0]">
                    <img
                      src={product?.image ?? "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"}
                      alt={product?.name ?? "Product preview"}
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#D8CCB8] bg-[#FFFDF8]/90 text-[#2B2B2B] transition hover:border-[#9A7440] hover:text-[#9A7440]"
                        aria-label="Close preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-5 md:p-7">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#6D6257]">
                        <span>{product?.collection ?? product?.category ?? "Heritage Collection"}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span>Quick Preview</span>
                      </div>
                      <Dialog.Title className="font-['Playfair_Display'] text-3xl font-normal tracking-tight text-[#2B2B2B] md:text-4xl">
                        {product?.name ?? "Selected Mojri"}
                      </Dialog.Title>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-[#9A7440]">
                          ₹{Number(product?.price ?? 0).toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-[#6D6257]">
                          <Star className="h-4 w-4 fill-current text-[#9A7440]" />
                          <span>{product?.rating?.toFixed(1) ?? "4.8"}</span>
                          <span>·</span>
                          <span>{product?.reviewCount ?? 0} reviews</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-[#6D6257]">
                      {product?.description ?? "An artisanal Jodhpuri silhouette shaped in a refined heritage palette."}
                    </p>

                    <div className="space-y-3">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-[#6D6257]">Size</div>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition",
                              selectedSize === size
                                ? "border-[#9A7440] bg-[#9A7440] text-black"
                                : "border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B] hover:border-[#9A7440]"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-[#6D6257]">Color</div>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition",
                              selectedColor === color
                                ? "border-[#9A7440] bg-[#9A7440] text-black"
                                : "border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B] hover:border-[#9A7440]"
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-sm border border-[#D8CCB8] bg-[#FAF7F0] p-4">
                      <div className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7440]" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#2B2B2B]">Heritage craftsmanship</div>
                          <div className="mt-1 text-sm leading-6 text-[#6D6257]">
                            Hand-finished detailing, secure checkout, and curated packaging for every order.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleAdd}
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#9A7440] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#76562E] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {loading ? "Adding..." : "Add to Cart"}
                      </button>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-sm border border-[#D8CCB8] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#2B2B2B] transition hover:border-[#9A7440] hover:text-[#9A7440]"
                        >
                          Continue Browsing
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ProductDetailModal;