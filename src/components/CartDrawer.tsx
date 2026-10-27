import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export function CartDrawer({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void } = {}) {
  const navigate = useNavigate();
  const { cartItems = [], products = [], updateQuantity, removeFromCart, selectedSize, setSelectedSize } = useCart() as any;
  const items = cartItems ?? [];
  const productList = products ?? [];
  const subtotal = items.reduce((sum: number, item: any) => {
    const product = productList.find((p: any) => p?.id === item?.productId);
    return sum + (product?.price ?? 0) * (item?.quantity ?? 0);
  }, 0);
  const shippingThreshold = 2500;
  const remaining = Math.max(shippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
    toast.message("Proceeding to checkout");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#D8CBBB] bg-[#FFFDFC] shadow-2xl outline-none">
          <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} transition={{ duration: 0.28, ease: "easeOut" }} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#D8CBBB] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Bodoni_Moda'] text-2xl font-light tracking-tight text-[#2B2B2B]">Your Cart</Dialog.Title>
                <p className="text-xs uppercase tracking-[0.24em] text-[#6D6259]">{items.length} item{items.length === 1 ? "" : "s"}</p>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:bg-[#BFA06E] hover:text-black">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center border border-[#D8CBBB] bg-[#F9F5F0] text-[#BFA06E]">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <h3 className="font-['Bodoni_Moda'] text-2xl font-light text-[#2B2B2B]">Your cart is empty</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6D6259]">Discover handcrafted Jodhpuri Mojris and add a pair to begin your order.</p>
                    <button onClick={() => { onOpenChange(false); navigate("/shop"); }} className="mt-6 inline-flex items-center gap-2 border border-[#BFA06E] bg-[#BFA06E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#A88650]">
                      Explore Collection
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item: any) => {
                      const product = productList.find((p: any) => p?.id === item?.productId);
                      if (!product) return null;
                      const size = item?.size ?? selectedSize?.[product?.id] ?? product?.sizes?.[0] ?? "One Size";
                      return (
                        <motion.div key={`${item?.productId}-${size}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-3 border border-[#D8CBBB] bg-white p-3">
                          <img src={product?.image ?? ""} alt={product?.name ?? "Product"} crossOrigin="anonymous" className="h-24 w-20 shrink-0 object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#2B2B2B]">{product?.name ?? ""}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6D6259]">{product?.category ?? ""}</p>
                              </div>
                              <button onClick={() => removeFromCart?.(product?.id, size)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CBBB] text-[#6D6259] transition-colors hover:bg-[#F9F5F0] hover:text-[#2B2B2B]">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#6D6259]">
                              <span className="border border-[#D8CBBB] px-2 py-1">Size {size}</span>
                              <span className="border border-[#D8CBBB] px-2 py-1">Qty {item?.quantity ?? 1}</span>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity?.(product?.id, Math.max((item?.quantity ?? 1) - 1, 0), size)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]">
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-8 text-center text-sm font-medium text-[#2B2B2B]">{item?.quantity ?? 1}</span>
                                <button onClick={() => updateQuantity?.(product?.id, (item?.quantity ?? 1) + 1, size)} className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm font-semibold text-[#2B2B2B]">₹{((product?.price ?? 0) * (item?.quantity ?? 1)).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#D8CBBB] bg-[#F9F5F0] px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[#6D6259]">Subtotal</span>
                <span className="font-semibold text-[#2B2B2B]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="mb-3">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6D6259]">
                  <span>Complimentary shipping</span>
                  <span>{remaining > 0 ? `₹${remaining.toLocaleString("en-IN")} away` : "Unlocked"}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-white">
                  <div className="h-full bg-[#BFA06E]" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { onOpenChange(false); navigate("/shop"); }} className="flex-1 border border-[#D8CBBB] bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:bg-[#F9F5F0]">
                  Continue Shopping
                </button>
                <button onClick={handleCheckout} disabled={items.length === 0} className={cn("flex-1 inline-flex items-center justify-center gap-2 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition-colors", items.length === 0 ? "cursor-not-allowed border-[#D8CBBB] bg-[#D8CBBB]/40 text-[#6D6259]" : "border-[#BFA06E] bg-[#BFA06E] text-black hover:bg-[#A88650]")}>
                  Checkout
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;