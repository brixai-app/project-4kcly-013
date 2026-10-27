import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types";
import { cn } from "@/lib/utils";

type CartDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function CartLineItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: (productId: string, size?: string, color?: string) => void;
  onDecrease: (productId: string, size?: string, color?: string) => void;
  onRemove: (productId: string, size?: string, color?: string) => void;
}) {
  return (
    <div className="flex gap-3 border-b border-[#C9A66B]/30 py-4">
      <img
        src={item.image ?? ""}
        alt={item.name ?? "Cart item"}
        crossOrigin="anonymous"
        className="h-24 w-20 shrink-0 rounded-[14px] object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-base text-[#2B2B2B]">{item.name ?? ""}</p>
            <p className="mt-1 truncate text-[11px] uppercase tracking-[0.24em] text-[#6D6257]">
              {item.size ?? "One size"} · {item.color ?? "Natural"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.productId ?? "", item.size, item.color)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#C9A66B]/40 text-[#6D6257] transition hover:border-[#B04E2C] hover:text-[#B04E2C]"
            aria-label={`Remove ${item.name ?? "item"}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center border border-[#C9A66B]/40">
            <button
              type="button"
              onClick={() => onDecrease(item.productId ?? "", item.size, item.color)}
              className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition hover:bg-[#F5F0E6]"
              aria-label={`Decrease quantity of ${item.name ?? "item"}`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 px-3 text-center text-sm font-medium text-[#2B2B2B]">
              {item.quantity ?? 1}
            </span>
            <button
              type="button"
              onClick={() => onIncrease(item.productId ?? "", item.size, item.color)}
              className="inline-flex h-9 w-9 items-center justify-center text-[#2B2B2B] transition hover:bg-[#F5F0E6]"
              aria-label={`Increase quantity of ${item.name ?? "item"}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#2B2B2B]">₹{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const subtotal = cart?.subtotal ?? 0;
  const itemCount = cart?.itemCount ?? 0;
  const freeShippingThreshold = 5000;
  const remaining = Math.max(freeShippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-[#C9A66B]/40 bg-[#FFFBF4] shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-[#C9A66B]/30 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="font-serif text-2xl text-[#2B2B2B]">Your Cart</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.24em] text-[#6D6257]">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A66B]/40 text-[#2B2B2B] transition hover:border-[#B04E2C] hover:text-[#B04E2C]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5">
            <AnimatePresence initial={false}>
              {cart?.items?.length ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="pb-4"
                >
                  {cart.items.map((item) => (
                    <CartLineItem
                      key={`${item.productId ?? ""}-${item.size ?? ""}-${item.color ?? ""}`}
                      item={item}
                      onIncrease={increaseQuantity}
                      onDecrease={decreaseQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex h-full flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A66B]/40 text-[#B04E2C]">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <p className="font-serif text-2xl text-[#2B2B2B]">Your cart is empty</p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#6D6257]">
                    Add handcrafted Mojris to begin your order.
                  </p>
                  <Dialog.Close asChild>
                    <Link
                      to="/shop"
                      className="mt-6 inline-flex items-center gap-2 border border-[#B04E2C] bg-[#B04E2C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#8F3C22]"
                    >
                      Explore Collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Dialog.Close>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-[#C9A66B]/30 px-5 py-4">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[#6D6257]">
                <span>Free shipping progress</span>
                <span>{remaining > 0 ? `₹${remaining.toLocaleString("en-IN")} away` : "Unlocked"}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F0E6]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-[#B04E2C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#C9A66B]/30 pb-4">
              <span className="text-sm uppercase tracking-[0.24em] text-[#6D6257]">Subtotal</span>
              <span className="text-lg font-semibold text-[#2B2B2B]">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Dialog.Close asChild>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 border border-[#C9A66B]/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition hover:border-[#B04E2C] hover:text-[#B04E2C]"
                >
                  Continue Shopping
                </Link>
              </Dialog.Close>

              <button
                type="button"
                onClick={() => {
                  if (!cart?.items?.length) return;
                  clearCart();
                }}
                className={cn(
                  "inline-flex items-center justify-center gap-2 border border-[#B04E2C] bg-[#B04E2C] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#8F3C22]",
                  !cart?.items?.length && "cursor-not-allowed opacity-50"
                )}
                disabled={!cart?.items?.length}
              >
                Place Order Intent
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;