import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, X } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

type ProductDetailModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: Product | null;
};

const verifiedFallback = "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80";

export function ProductDetailModal({ open = false, onOpenChange = () => {}, product = null }: ProductDetailModalProps) {
  const { addToCart } = useCart?.() ?? { addToCart: () => {} };
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sizes = useMemo(() => product?.sizes?.filter(Boolean) ?? [], [product?.sizes]);
  const gallery = useMemo(() => {
    const images = [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[];
    return images.length > 0 ? images : [verifiedFallback];
  }, [product?.gallery, product?.image]);

  useEffect(() => {
    setQuantity(1);
    setSize(product?.sizes?.[0] ?? "");
  }, [product?.id, product?.sizes]);

  const handleAdd = () => {
    if (!product) return;
    if ((sizes?.length ?? 0) > 0 && !size) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addToCart?.({
      productId: product.id,
      name: product.name,
      image: product.image ?? verifiedFallback,
      price: product.price,
      quantity,
      size: size || undefined,
    });
    toast.success(`${product.name} added to cart.`);
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
                className="fixed left-1/2 top-1/2 z-50 w-[min(94vw,980px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E] shadow-2xl"
              >
                <div className="grid max-h-[88vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[320px] bg-[#F5F1E9]">
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-none border border-[#CFC1AD] bg-[#FFFCF6]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6F675D] backdrop-blur">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Quick View
                    </div>
                    <div className="grid h-full grid-cols-1 gap-2 p-3 sm:grid-cols-[1fr_88px]">
                      <motion.div className="relative overflow-hidden rounded-sm border border-[#CFC1AD] bg-white">
                        <img
                          src={gallery?.[0] ?? verifiedFallback}
                          alt={product?.name ?? "Product image"}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-y-auto">
                        {gallery.slice(1, 5).map((src, index) => (
                          <motion.button
                            key={`${src}-${index}`}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-[#CFC1AD] bg-white sm:h-24 sm:w-full"
                          >
                            <img src={src} alt={`${product?.name ?? "Product"} ${index + 2}`} crossOrigin="anonymous" className="h-full w-full object-cover" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-5 sm:p-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F675D]">{product?.collection ?? product?.category ?? "Mojri"}</p>
                      <Dialog.Title className="font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2E2E2E]">
                        {product?.name ?? "Selected Piece"}
                      </Dialog.Title>
                      <div className="flex items-center gap-3 text-sm text-[#6F675D]">
                        <span className="font-semibold text-[#2E2E2E]">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: product?.currency ?? "INR",
                            maximumFractionDigits: 0,
                          }).format(product?.price ?? 0)}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#CFC1AD]" />
                        <span>{product?.artisan ?? "Hand-finished by Jodhpur artisans"}</span>
                      </div>
                    </div>

                    <Dialog.Description className="text-sm leading-7 text-[#6F675D]">
                      {product?.description ??
                        "A refined Jodhpuri silhouette shaped in heritage craft, with a balanced profile, supple finish, and ceremonial ease for everyday wear."}
                    </Dialog.Description>

                    <div className="grid gap-3 text-sm text-[#6F675D]">
                      <div className="flex flex-wrap gap-2">
                        <span className="min-w-0 rounded-sm border border-[#CFC1AD] px-3 py-2">
                          Origin: {product?.origin ?? "Jodhpur, Rajasthan"}
                        </span>
                        <span className="min-w-0 rounded-sm border border-[#CFC1AD] px-3 py-2">
                          Material: {product?.material ?? "Leather and woven textile"}
                        </span>
                      </div>
                    </div>

                    {(sizes?.length ?? 0) > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6F675D]">Select Size</p>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setSize(item)}
                              className={cn(
                                "min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                                size === item
                                  ? "border-[#8B0000] bg-[#8B0000] text-white"
                                  : "border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E] hover:border-[#8B0000] hover:text-[#8B0000]"
                              )}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t border-[#CFC1AD] pt-4">
                      <div className="flex items-center gap-2 rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="grid h-9 w-9 place-items-center rounded-sm text-[#2E2E2E] transition hover:bg-[#F5F1E9]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="grid h-9 w-9 place-items-center rounded-sm text-[#2E2E2E] transition hover:bg-[#F5F1E9]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 rounded-sm bg-[#8B0000] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#650000]"
                      >
                        <Check className="h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close quick view"
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-sm border border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E] transition hover:bg-[#F5F1E9]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ProductDetailModal;