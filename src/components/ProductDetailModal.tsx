import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Circle as ChevronLeft, ChevronRight, Heart, Minus, Plus, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
};

export function ProductDetailModal({
  open = false,
  onOpenChange = () => {},
  product = null,
}: ProductDetailModalProps) {
  const { addItem } = useCart() as any;
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const sizes = product?.sizes?.length ? product.sizes : ["7", "8", "9", "10", "11"];
  const colors = product?.colors?.length ? product.colors : ["Ivory", "Tan", "Black"];
  const gallery = useMemo(
    () => [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[],
    [product]
  );

  useEffect(() => {
    if (!open) return;
    setSelectedSize(sizes?.[0] ?? "");
    setSelectedColor(colors?.[0] ?? "");
    setQuantity(1);
    setAdded(false);
  }, [open, product?.id]);

  const handleAdd = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    addItem?.(product.id, quantity, selectedSize, selectedColor);
    setAdded(true);
    toast.success("Added to cart");
    window.setTimeout(() => setAdded(false), 1400);
  };

  const price = useMemo(
    () => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product?.price ?? 0),
    [product?.price]
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="w-full max-w-6xl overflow-hidden border border-[#D8CBBB] bg-[#FFFDFC] text-[#2B2B2B] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
                  <div className="flex items-center justify-between border-b border-[#D8CBBB] px-4 py-3 sm:px-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">Quick preview</p>
                      <Dialog.Title className="truncate font-['Bodoni_Moda',serif] text-xl font-light tracking-tight sm:text-2xl">
                        {product?.name ?? "Product"}
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:bg-[#BFA06E] hover:text-black"
                        aria-label="Close product preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="grid max-h-[85vh] overflow-y-auto lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="border-b border-[#D8CBBB] lg:border-b-0 lg:border-r">
                      <div className="grid gap-2 p-3 sm:grid-cols-[1.2fr_0.8fr] sm:p-4">
                        <div className="overflow-hidden bg-[#faf9f6]">
                          <img
                            src={gallery?.[0] ?? ""}
                            alt={product?.name ?? "Product image"}
                            crossOrigin="anonymous"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="grid gap-2">
                          {(gallery?.slice(1, 3) ?? []).map((src, index) => (
                            <div key={`${src}-${index}`} className="overflow-hidden bg-[#faf9f6]">
                              <img
                                src={src}
                                alt={`${product?.name ?? "Product"} detail ${index + 2}`}
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5 p-4 sm:p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">
                            {product?.category ?? "Mojri"}
                          </p>
                          <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6259]">
                            <Heart className="h-3.5 w-3.5" />
                            Save
                          </div>
                        </div>
                        <p className="font-['Bodoni_Moda',serif] text-3xl font-light tracking-tight sm:text-4xl">
                          {price}
                        </p>
                        <p className="max-w-xl text-sm leading-6 text-[#6D6259]">
                          {product?.description ?? "Hand-finished Jodhpuri craftsmanship with a refined, heritage-led silhouette."}
                        </p>
                      </div>

                      <div className="grid gap-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">Size</p>
                            <p className="text-xs text-[#6D6259]">{selectedSize || "Select one"}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                  "min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
                                  selectedSize === size
                                    ? "border-[#BFA06E] bg-[#BFA06E] text-black"
                                    : "border-[#D8CBBB] bg-white text-[#2B2B2B] hover:border-[#A88650]"
                                )}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">Color</p>
                            <p className="text-xs text-[#6D6259]">{selectedColor || "Select one"}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                  "min-w-0 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
                                  selectedColor === color
                                    ? "border-[#BFA06E] bg-[#BFA06E] text-black"
                                    : "border-[#D8CBBB] bg-white text-[#2B2B2B] hover:border-[#A88650]"
                                )}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-y border-[#D8CBBB] py-4">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6259]">Quantity</p>
                            <p className="text-sm text-[#6D6259]">Bounded to 1–5</p>
                          </div>
                          <div className="flex items-center border border-[#D8CBBB]">
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              className="inline-flex h-10 w-10 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#faf9f6]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                              className="inline-flex h-10 w-10 items-center justify-center text-[#2B2B2B] transition-colors hover:bg-[#faf9f6]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6D6259]">Artisan</span>
                          <span className="font-medium">{product?.artisanId ?? "Jodhpur atelier"}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAdd}
                          className="inline-flex items-center justify-center gap-2 border border-[#BFA06E] bg-[#BFA06E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#A88650]"
                        >
                          {added ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                          {added ? "Added" : "Add to cart"}
                        </button>
                        <p className="text-xs leading-5 text-[#6D6259]">
                          Securely reserved in your cart. Checkout remains a calm, mocked flow for this storefront.
                        </p>
                      </div>
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