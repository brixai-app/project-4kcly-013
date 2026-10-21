import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shadcn";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";

import { useCart, formatPriceINR } from "@/mock";
import { cn } from "@/lib/utils";

export interface CartDrawerProps {
  /**
   * Controls the sheet open state. Header owns the trigger and passes state down.
   */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// NOTE: This CartDrawer is fully FRONTEND-ONLY and uses mocked cart state
// from src/mock.ts persisted in localStorage. There is NO backend.

const itemMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useCart();

  const subtotal = cartSubtotal;
  const shippingFee = subtotal >= 6000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;

  const handleIncrement = (id: string, currentQty: number, maxQty: number) => {
    if (currentQty >= maxQty) {
      toast("Available pair limit reached", {
        description: "This size and color combination is currently at full capacity.",
      });
      return;
    }
    const nextQty = currentQty + 1;
    updateCartQuantity(id, nextQty);
    toast.success("Cart updated", {
      description: `Quantity adjusted to ${nextQty}.`,
    });
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty <= 1) {
      removeFromCart(id);
      toast("Pair removed", {
        description: "This mojri has been taken out of your curation.",
      });
      return;
    }
    const nextQty = currentQty - 1;
    updateCartQuantity(id, nextQty);
    toast.success("Cart updated", {
      description: `Quantity adjusted to ${nextQty}.`,
    });
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast("Pair removed", {
      description: "We have gently unpinned this mojri from your selection.",
    });
  };

  const handleCheckout = () => {
    if (!cart.length) {
      toast("Your curation is empty", {
        description: "Add a pair that feels like you before proceeding to checkout.",
      });
      return;
    }
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex h-full w-full flex-col border-l border-border/60 bg-background/95/",
          "sm:max-w-md backdrop-blur-md px-0"
        )}
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 text-left">
              <SheetTitle className="font-['Playfair_Display'] text-xl tracking-wide text-foreground">
                Your curation
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                A preview of pairs handpicked from our Rajasthani ateliers.
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border/60 bg-background/80 hover:bg-accent"
              onClick={() => onOpenChange(false)}
              aria-label="Close cart drawer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <Separator className="mb-2" />

        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollArea className="flex-1 px-6 pb-4 pt-2">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border/70 bg-muted/60">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-['Playfair_Display'] text-base text-foreground">
                    Your curation is waiting.
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Explore the catalog to begin pairing silhouettes, colors, and stories that feel like you.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-900/40 bg-amber-50/70 text-amber-900 hover:bg-amber-100"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/catalog");
                  }}
                >
                  Browse mojris
                </Button>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      {...itemMotion}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex gap-3 rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm"
                    >
                      <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 space-y-0.5">
                            <p className="text-xs font-medium text-foreground whitespace-normal break-words">
                              {item.name}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                              Size {item.variant.size} • {formatColorLabel(item.variant.color)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="ml-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-border/70 bg-background px-2 py-1 text-[11px] text-foreground">
                            {formatPriceINR(item.price)}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background px-1 py-0.5">
                              <button
                                type="button"
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-foreground hover:bg-muted/80"
                                onClick={() => handleDecrement(item.id, item.quantity)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-[1.5rem] text-center text-[11px] font-medium text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-foreground hover:bg-muted/80"
                                onClick={() => handleIncrement(item.id, item.quantity, item.maxQuantity)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            {item.quantity >= item.maxQuantity && (
                              <span className="text-[10px] text-amber-800">
                                Atelier limit reached
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </ScrollArea>

          <div className="border-t border-border/70 bg-background/95 px-6 pb-6 pt-4">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatPriceINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0
                    ? subtotal === 0
                      ? "—"
                      : "Complimentary"
                    : formatPriceINR(shippingFee)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-medium text-foreground">Estimated total</span>
                <span className="font-semibold text-foreground">{formatPriceINR(total)}</span>
              </div>
              <p className="pt-1 text-[10px] leading-relaxed text-muted-foreground">
                Taxes and duties are indicative and calculated at checkout. This is a fully mocked
                client-side experience – no real payments are processed.
              </p>
            </div>

            <Button
              size="sm"
              className={cn(
                "mt-4 h-10 w-full rounded-full bg-indigo-950 text-[12px] font-medium tracking-[0.18em] uppercase",
                "text-amber-50 hover:bg-indigo-900"
              )}
              onClick={handleCheckout}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function formatColorLabel(color: string): string {
  switch (color) {
    case "deep-indigo":
      return "Deep indigo";
    case "warm-ochre":
      return "Warm ochre";
    case "sand-beige":
      return "Sand beige";
    case "marigold":
      return "Marigold";
    default:
      return color;
  }
}

export default CartDrawer;