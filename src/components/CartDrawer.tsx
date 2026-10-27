import React, { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

type CartDrawerProps = { open?: boolean; onOpenChange?: (open: boolean) => void };
type CartRouteProps = { className?: string };

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeItem, subtotal = 0, clearCart } = useCart() as any;
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const shipping = subtotal >= 12000 ? 0 : items.length > 0 ? 350 : 0;
  const total = subtotal + shipping;
  const progress = useMemo(() => Math.min(100, (subtotal / 12000) * 100), [subtotal]);
  const remaining = Math.max(0, 12000 - subtotal);

  useEffect(() => {
    if (!open) setPendingRemove(null);
  }, [open]);

  const confirmRemove = (productId: string) => {
    removeItem?.(productId);
    setPendingRemove(null);
    toast.success("Removed from cart");
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
    toast.message("Proceeding to checkout");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#CFC1AD] bg-[#FFFCF6] shadow-2xl outline-none">
          <motion.div initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 24, opacity: 0 }} className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#CFC1AD] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="font-['Playfair_Display'] text-2xl text-[#2E2E2E]">Cart</Dialog.Title>
                <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F675D]">
                  {items.length > 0 ? `${items.length} item${items.length === 1 ? "" : "s"}` : "Your selection is empty"}
                </Dialog.Description>
              </div>
              <Dialog.Close className="inline-flex h-10 w-10 items-center justify-center border border-[#CFC1AD] text-[#2E2E2E] transition-colors hover:bg-[#8B0000] hover:text-white">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="h-10 w-10 text-[#6F675D]" />
                  <div>
                    <p className="font-['Playfair_Display'] text-2xl text-[#2E2E2E]">Your cart is empty</p>
                    <p className="mt-2 text-sm leading-6 text-[#6F675D]">Discover handcrafted Jodhpuri mojris and add your first pair.</p>
                  </div>
                  <Link to="/shop" onClick={() => onOpenChange(false)} className="inline-flex items-center gap-2 border border-[#8B0000] bg-[#8B0000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#650000]">
                    Explore Collection <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-sm border border-[#CFC1AD] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F675D]">Shipping progress</p>
                      <p className="text-xs text-[#6F675D]">{remaining > 0 ? `₹${remaining.toLocaleString()} away from free shipping` : "Free shipping unlocked"}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden bg-[#F5F1E9]">
                      <div className="h-full bg-[#8B0000]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {items.map((item: any) => (
                      <motion.div key={`${item.productId ?? item.name}-${item.size ?? "one"}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} className="flex gap-3 border border-[#CFC1AD] bg-white p-3">
                        <img src={item.image ?? ""} alt={item.name ?? "Cart item"} crossOrigin="anonymous" className="h-24 w-20 shrink-0 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-['Playfair_Display'] text-lg text-[#2E2E2E]">{item.name ?? "Item"}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6F675D]">{item.size ? `Size ${item.size}` : "One size"}</p>
                            </div>
                            <button type="button" onClick={() => setPendingRemove(item.productId ?? item.name ?? null)} className="inline-flex h-8 w-8 items-center justify-center border border-[#CFC1AD] text-[#6F675D] transition-colors hover:border-[#8B0000] hover:text-[#8B0000]">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[#2E2E2E]">₹{Number(item.price ?? 0).toLocaleString()}</p>
                            <div className="flex items-center border border-[#CFC1AD]">
                              <button type="button" onClick={() => updateQuantity?.(item.productId, Math.max(1, (item.quantity ?? 1) - 1))} className="inline-flex h-8 w-8 items-center justify-center text-[#2E2E2E] transition-colors hover:bg-[#F5F1E9]">
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-9 text-center text-sm text-[#2E2E2E]">{item.quantity ?? 1}</span>
                              <button type="button" onClick={() => updateQuantity?.(item.productId, (item.quantity ?? 1) + 1)} className="inline-flex h-8 w-8 items-center justify-center text-[#2E2E2E] transition-colors hover:bg-[#F5F1E9]">
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="border-t border-[#CFC1AD] bg-[#F5F1E9] p-5">
              <div className="space-y-2 text-sm text-[#2E2E2E]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#CFC1AD] pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => clearCart?.()} className="inline-flex flex-1 items-center justify-center gap-2 border border-[#CFC1AD] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E2E2E] transition-colors hover:bg-white">
                  Clear
                </button>
                <button type="button" onClick={handleCheckout} className="inline-flex flex-1 items-center justify-center gap-2 border border-[#8B0000] bg-[#8B0000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#650000]">
                  Checkout <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <Dialog.Close asChild>
            <button type="button" className="sr-only">Close</button>
          </Dialog.Close>

          <Dialog.Description className="sr-only">Shopping cart drawer</Dialog.Description>

          <AnimatePresence>
            {pendingRemove ? (
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-[#CFC1AD] bg-[#FFFCF6] p-5 outline-none">
                  <Dialog.Title className="font-['Playfair_Display'] text-2xl text-[#2E2E2E]">Remove item?</Dialog.Title>
                  <p className="mt-2 text-sm leading-6 text-[#6F675D]">This item will be removed from your cart.</p>
                  <div className="mt-5 flex gap-3">
                    <button type="button" onClick={() => setPendingRemove(null)} className="flex-1 border border-[#CFC1AD] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E2E2E]">
                      Cancel
                    </button>
                    <button type="button" onClick={() => confirmRemove(pendingRemove)} className="flex-1 border border-[#8B0000] bg-[#8B0000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                      Remove
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            ) : null}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CartRoute({ className = "" }: CartRouteProps) {
  return <div className={cn("min-h-[40vh]", className)} />;
}

export default CartDrawer;