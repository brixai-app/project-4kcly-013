import React, { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { getProductBySlug, products } from "@/data/mockData";
import { cn } from "@/lib/utils";

type CartDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type CartRouteProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const fallbackProduct = products?.[0] ?? null;

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateItemQuantity, removeItem, clearCart } = useCart() as any;

  const enrichedItems = useMemo(
    () =>
      (items ?? []).map((item: any) => {
        const product = getProductBySlug?.(item?.productId ?? "") ?? fallbackProduct;
        return { ...item, product };
      }),
    [items]
  );

  const subtotal = useMemo(
    () =>
      enrichedItems.reduce((sum: number, item: any) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0), 0),
    [enrichedItems]
  );
  const shipping = subtotal > 0 ? 249 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleQty = (productId: string, size: string | undefined, color: string | undefined, next: number) => {
    if (next < 1) return;
    updateItemQuantity?.(productId, size, color, next);
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open ? (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-[#CDBB9D] bg-[#FFFDFC] text-[#211A17] shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-[#CDBB9D] px-5 py-4">
                    <div className="min-w-0">
                      <Dialog.Title className="font-['Bodoni_Moda'] text-2xl font-light tracking-tight">
                        Cart
                      </Dialog.Title>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6F6258]">
                        {enrichedItems.length} item{enrichedItems.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9D] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white"
                        aria-label="Close cart"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {enrichedItems.length === 0 ? (
                      <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
                        <div className="flex h-14 w-14 items-center justify-center border border-[#CDBB9D] text-[#741F2B]">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div className="max-w-sm">
                          <h3 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight">Your cart is empty</h3>
                          <p className="mt-2 text-sm leading-6 text-[#6F6258]">
                            Continue browsing the collection and add a pair of handcrafted mojris to begin.
                          </p>
                        </div>
                        <Link
                          to="/catalog"
                          onClick={() => onOpenChange(false)}
                          className="inline-flex items-center gap-2 border border-[#741F2B] bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#561620]"
                        >
                          Explore collection <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {enrichedItems.map((item: any) => (
                          <div key={`${item?.productId ?? "item"}-${item?.size ?? "na"}-${item?.color ?? "na"}`} className="flex gap-3 border-b border-[#CDBB9D]/70 pb-4">
                            <img
                              src={item?.product?.image ?? fallbackProduct?.image ?? ""}
                              alt={item?.product?.name ?? "Product image"}
                              crossOrigin="anonymous"
                              className="h-24 w-20 shrink-0 border border-[#CDBB9D] object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-[#211A17]">{item?.product?.name ?? "Mojri"}</p>
                                  <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-[#6F6258]">
                                    {item?.product?.collection ?? "Collection"}
                                  </p>
                                </div>
                                <p className="shrink-0 text-sm font-semibold text-[#211A17]">
                                  ₹{(item?.product?.price ?? 0).toLocaleString("en-IN")}
                                </p>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-[#6F6258]">
                                <span className="border border-[#CDBB9D] px-2 py-1">Size {item?.size ?? "—"}</span>
                                <span className="border border-[#CDBB9D] px-2 py-1">Color {item?.color ?? "—"}</span>
                              </div>
                              <div className="mt-3 flex items-center justify-between gap-3">
                                <div className="flex items-center border border-[#CDBB9D]">
                                  <button
                                    type="button"
                                    onClick={() => handleQty(item?.productId, item?.size, item?.color, (item?.quantity ?? 1) - 1)}
                                    className="flex h-9 w-9 items-center justify-center text-[#211A17] transition hover:bg-[#F7F0E3]"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="min-w-10 px-3 text-center text-sm font-medium">{item?.quantity ?? 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleQty(item?.productId, item?.size, item?.color, (item?.quantity ?? 1) + 1)}
                                    className="flex h-9 w-9 items-center justify-center text-[#211A17] transition hover:bg-[#F7F0E3]"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem?.(item?.productId, item?.size, item?.color)}
                                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#741F2B] transition hover:text-[#561620]"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#CDBB9D] bg-[#faf9f6] px-5 py-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[#6F6258]">Subtotal</span>
                        <span className="font-semibold text-[#211A17]">₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6F6258]">Shipping</span>
                        <span className="font-semibold text-[#211A17]">{shipping > 0 ? `₹${shipping.toLocaleString("en-IN")}` : "Calculated at checkout"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6F6258]">Tax</span>
                        <span className="font-semibold text-[#211A17]">₹{tax.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#CDBB9D] pt-3 text-base">
                        <span className="font-semibold text-[#211A17]">Total</span>
                        <span className="font-semibold text-[#211A17]">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[#6F6258]">
                      Secure checkout, size validation, and order confirmation are handled in the next step.
                    </p>
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="inline-flex items-center justify-center gap-2 border border-[#741F2B] bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#561620]"
                      >
                        Proceed to checkout <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => clearCart?.()}
                        className="inline-flex items-center justify-center gap-2 border border-[#CDBB9D] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211A17] transition hover:bg-[#F7F0E3]"
                      >
                        <Check className="h-4 w-4" />
                        Clear cart
                      </button>
                    </div>
                  </div>
                </motion.aside>
              </Dialog.Content>
            </>
          ) : null}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CartRoute({ open = true, onOpenChange = () => {} }: CartRouteProps) {
  return <CartDrawer open={open} onOpenChange={onOpenChange} />;
}

export default CartDrawer;