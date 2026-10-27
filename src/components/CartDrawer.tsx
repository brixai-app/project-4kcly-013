import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types";

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
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const product = item?.product;
  const image = product?.image ?? "";
  const name = product?.name ?? "Untitled product";
  const price = product?.price ?? 0;
  const size = item?.selectedSize ?? "One size";
  const color = item?.selectedColor ?? "Natural";
  const quantity = item?.quantity ?? 1;

  return (
    <div className="flex gap-3 border-b border-[#D8CCB8] pb-4">
      <img
        src={image}
        alt={name}
        crossOrigin="anonymous"
        className="h-24 w-20 shrink-0 rounded-sm object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-widest text-[#2B2B2B]">{name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6D6257]">{product?.collection ?? product?.category ?? "Mojri"}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center border border-[#D8CCB8] text-[#6D6257] transition-colors hover:border-[#9A7440] hover:text-[#9A7440]"
            aria-label={`Remove ${name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6D6257]">
          <span>Size {size}</span>
          <span>Color {color}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center border border-[#D8CCB8]">
            <button type="button" onClick={onDecrease} className="flex h-8 w-8 items-center justify-center text-[#2B2B2B]">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 px-2 text-center text-sm text-[#2B2B2B]">{quantity}</span>
            <button type="button" onClick={onIncrease} className="flex h-8 w-8 items-center justify-center text-[#2B2B2B]">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-[#2B2B2B]">₹{(price * quantity).toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ open = false, onOpenChange = () => {} }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items = [], updateQuantity, removeFromCart, subtotal = 0, clearCart } = useCart() ?? {};
  const shippingThreshold = 5000;
  const remaining = Math.max(shippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0), [items]);

  const handleCheckout = () => {
    if (!items?.length) {
      toast.error("Your cart is empty.");
      return;
    }
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
        <Dialog.Content asChild>
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#D8CCB8] bg-[#FFFDF8] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#D8CCB8] px-5 py-4">
              <div className="min-w-0">
                <Dialog.Title className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#2B2B2B]">
                  <ShoppingBag className="h-4 w-4 text-[#9A7440]" />
                  Cart
                </Dialog.Title>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6D6257]">{itemCount} item{itemCount === 1 ? "" : "s"}</p>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center border border-[#D8CCB8] text-[#2B2B2B] transition-colors hover:border-[#9A7440] hover:text-[#9A7440]" aria-label="Close cart">
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items?.length ? (
                  <motion.div layout className="flex flex-col gap-4">
                    {items.map((item) => {
                      const key = `${item?.product?.id ?? "item"}-${item?.selectedSize ?? "na"}-${item?.selectedColor ?? "na"}`;
                      return (
                        <CartLineItem
                          key={key}
                          item={item}
                          onIncrease={() => updateQuantity?.(item?.product?.id ?? "", (item?.quantity ?? 1) + 1, item?.selectedSize, item?.selectedColor)}
                          onDecrease={() => {
                            const next = (item?.quantity ?? 1) - 1;
                            if (next <= 0) {
                              removeFromCart?.(item?.product?.id ?? "", item?.selectedSize, item?.selectedColor);
                              toast.message("Removed from cart");
                              return;
                            }
                            updateQuantity?.(item?.product?.id ?? "", next, item?.selectedSize, item?.selectedColor);
                          }}
                          onRemove={() => {
                            removeFromCart?.(item?.product?.id ?? "", item?.selectedSize, item?.selectedColor);
                            toast.message("Removed from cart");
                          }}
                        />
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center border border-[#D8CCB8] text-[#9A7440]">
                      <ShoppingBag className="h-7 w-7" />
                    </div>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-[#2B2B2B]">Your cart is empty</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6D6257]">Add a pair of handcrafted Mojris to begin your order.</p>
                    <Link to="/shop" onClick={() => onOpenChange(false)} className="mt-5 inline-flex items-center gap-2 border border-[#9A7440] bg-[#9A7440] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#76562E]">
                      Explore Collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-[#D8CCB8] px-5 py-4">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#6D6257]">
                  <span>Free shipping</span>
                  <span>{remaining > 0 ? `₹${remaining.toLocaleString("en-IN")} away` : "Unlocked"}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden bg-[#E9E1D3]">
                  <div className="h-full bg-[#9A7440]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-widest text-[#6D6257]">Subtotal</span>
                <span className="font-semibold text-[#2B2B2B]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearCart?.();
                    toast.success("Cart cleared");
                  }}
                  className="flex-1 border border-[#D8CCB8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition-colors hover:border-[#9A7440] hover:text-[#9A7440]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex flex-1 items-center justify-center gap-2 bg-[#9A7440] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#76562E]"
                >
                  Checkout
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CartDrawer;