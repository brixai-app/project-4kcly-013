import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import {
  X,
  SlidersHorizontal,
  Trash2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  products,
  computeCartTotal,
  formatMoney,
  getProductById,
  createOrder,
  saveOrderToStorage,
  validatePhone,
  validateCardNumber,
  formatCardInput,
} from "../mock";
import { toast } from "sonner";

import type { CartItemInput } from "./MainFeature";

export interface CartItem extends CartItemInput {}

// FILTER DRAWER

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    category: string | null;
    size: number | null;
    color: string | null;
  };
  onApply: (next: { category: string | null; size: number | null; color: string | null }) => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onOpenChange,
  filters,
  onApply,
}) => {
  const [draft, setDraft] = React.useState(filters);

  React.useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const sizes = Array.from(
    new Set(products.flatMap((p) => p.sizes))
  ).sort((a, b) => a - b);
  const colors = Array.from(
    new Set(products.flatMap((p) => p.colors))
  );

  const apply = () => {
    onApply(draft);
    onOpenChange(false);
  };

  const clear = () => {
    const empty = { category: null, size: null, color: null };
    setDraft(empty);
    onApply(empty);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F5F1EB] shadow-[0_0_40px_rgba(0,0,0,0.25)] focus:outline-none">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.12)] px-6 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#7E6B5A]" />
              <Dialog.Title className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#2B2B2B]">
                Refine the edit
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="rounded-full p-1 text-[#2B2B2B] hover:bg-[#F5F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex h-[calc(100%-64px)] flex-col justify-between">
            <div className="overflow-y-auto px-6 py-4 space-y-6">
              <section className="space-y-2">
                <h3 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, category: null }))}
                    className={`rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                      !draft.category
                        ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                        : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDraft((d) => ({ ...d, category: cat }))}
                      className={`rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                        draft.category === cat
                          ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                          : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
              <section className="space-y-2">
                <h3 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, size: null }))}
                    className={`rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                      !draft.size
                        ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                        : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                    }`}
                  >
                    All
                  </button>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setDraft((d) => ({ ...d, size }))}
                      className={`min-w-[40px] rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                        draft.size === size
                          ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                          : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>
              <section className="space-y-2">
                <h3 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
                  Palette
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDraft((d) => ({ ...d, color: null }))}
                    className={`rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                      !draft.color
                        ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                        : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                    }`}
                  >
                    All
                  </button>
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setDraft((d) => ({ ...d, color }))}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-['Inter'] transition-colors ${
                        draft.color === color
                          ? "border-[#2B2B2B] bg-[#2B2B2B] text-[#F5F1EB]"
                          : "border-[rgba(43,43,43,0.25)] bg-white text-[#2B2B2B]"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
            <div className="border-t border-[rgba(43,43,43,0.12)] px-6 py-4 flex items-center justify-between gap-3">
              <button
                onClick={clear}
                className="text-xs font-['Inter'] uppercase tracking-[0.16em] text-[#7E6B5A] hover:text-[#2B2B2B]"
              >
                Clear
              </button>
              <button
                onClick={apply}
                className="inline-flex items-center gap-2 rounded-full bg-[#2B2B2B] px-5 py-2 text-xs font-['Inter'] uppercase tracking-[0.18em] text-[#F5F1EB] hover:bg-black transition-colors"
              >
                Apply filters
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// CART DRAWER

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  onUpdateQuantity: (item: CartItem, qty: number) => void;
  onRemove: (item: CartItem) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onOpenChange,
  cart,
  onUpdateQuantity,
  onRemove,
  onProceedToCheckout,
}) => {
  const total = computeCartTotal(cart);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-[#F5F1EB] shadow-[0_0_40px_rgba(0,0,0,0.25)] focus:outline-none flex flex-col">
          <div className="flex items-center justify-between border-b border-[rgba(43,43,43,0.12)] px-6 py-4">
            <Dialog.Title className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#2B2B2B]">
              Your Jootiya edit
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-full p-1 text-[#2B2B2B] hover:bg-[#F5F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <p className="font-['Inter'] text-sm text-[#7E6B5A]">
                Your edit is empty. Add a pair that feels like a quiet obsession.
              </p>
            ) : (
              cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;
                return (
                  <motion.div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                  >
                    <div className="h-24 w-20 overflow-hidden rounded-xl bg-[#F5F1EB]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-['Inter'] text-[11px] uppercase tracking-[0.16em] text-[#7E6B5A]">
                        {product.category}
                      </p>
                      <p className="font-['Playfair_Display'] text-sm text-[#2B2B2B]">
                        {product.name}
                      </p>
                      <p className="font-['Inter'] text-xs text-[#2B2B2B]">
                        {formatMoney(product.price)}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-[11px] font-['Inter'] text-[#7E6B5A]">
                          <span>EU {item.size}</span>
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="h-3 w-3 rounded-full border border-black/10"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onUpdateQuantity(item, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 rounded-full border border-[rgba(43,43,43,0.25)] text-xs text-[#2B2B2B] disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-['Inter'] text-[#2B2B2B]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item, Math.min(5, item.quantity + 1))
                            }
                            disabled={item.quantity >= 5}
                            className="h-6 w-6 rounded-full border border-[rgba(43,43,43,0.25)] text-xs text-[#2B2B2B] disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemove(item)}
                      className="self-start rounded-full p-1 text-[#7E6B5A] hover:text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
          <div className="border-t border-[rgba(43,43,43,0.12)] px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-['Inter'] text-[#2B2B2B]">
              <span>Subtotal</span>
              <span>{formatMoney(total)}</span>
            </div>
            <button
              onClick={() => {
                if (cart.length === 0) {
                  toast.error("Add a pair to continue.");
                  return;
                }
                onProceedToCheckout();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#BFA06F] px-6 py-3 text-xs font-['Inter'] uppercase tracking-[0.22em] text-[#2B2B2B] shadow-lg hover:bg-[#a58a5c] transition-colors disabled:opacity-50"
              disabled={cart.length === 0}
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// CHECKOUT + CONFIRMATION

interface CheckoutFormProps {
  cart: CartItem[];
  onClearCart: () => void;
  onOrderCreated: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  onClearCart,
  onOrderCreated,
}) => {
  const [shipping, setShipping] = React.useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [card, setCard] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const total = computeCartTotal(cart);

  const isValid = () => {
    const required = [
      shipping.name,
      shipping.addressLine1,
      shipping.city,
      shipping.state,
      shipping.zip,
    ].every(Boolean);
    return required && validatePhone(shipping.phone) && validateCardNumber(card);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      toast.error("Please complete all required details.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const order = createOrder({
        items: cart,
        shippingInfo: shipping,
        paymentInfo: { cardNumber: card },
      });
      saveOrderToStorage(order);
      onClearCart();
      toast.success("Order placed. This is a mock checkout.");
      onOrderCreated(order.id);
      setSubmitting(false);
    }, 800);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-8 bg-[#F5F1EB] min-h-screen">
      <h1 className="mb-6 font-['Playfair_Display'] text-2xl text-[#2B2B2B]">
        Checkout
      </h1>
      <form onSubmit={onSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
            Shipping details
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                Full name
              </label>
              <input
                value={shipping.name}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, name: e.target.value }))
                }
                className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                Address line 1
              </label>
              <input
                value={shipping.addressLine1}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, addressLine1: e.target.value }))
                }
                className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                Address line 2 (optional)
              </label>
              <input
                value={shipping.addressLine2}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, addressLine2: e.target.value }))
                }
                className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                  City
                </label>
                <input
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, city: e.target.value }))
                  }
                  className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                  State
                </label>
                <input
                  value={shipping.state}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, state: e.target.value }))
                  }
                  className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                  ZIP / Postal
                </label>
                <input
                  value={shipping.zip}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, zip: e.target.value }))
                  }
                  className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
                Phone
              </label>
              <input
                value={shipping.phone}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="+12025550123"
                className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
                required
              />
              {shipping.phone && !validatePhone(shipping.phone) && (
                <p className="mt-1 text-xs font-['Inter'] text-red-600">
                  Enter a valid phone with 10–15 digits.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
            Payment (mock only)
          </h2>
          <div className="space-y-2">
            <label className="block text-xs font-['Inter'] text-[#2B2B2B] mb-1">
              Card number
            </label>
            <input
              value={card}
              onChange={(e) => setCard(formatCardInput(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-full border border-[rgba(43,43,43,0.2)] bg-white px-4 py-2 text-sm font-['Inter'] text-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
              required
            />
            {card && !validateCardNumber(card) && (
              <p className="mt-1 text-xs font-['Inter'] text-red-600">
                Card should contain 16 digits.
              </p>
            )}
            <p className="text-[11px] font-['Inter'] text-[#7E6B5A]">
              Payments are not processed in this mock experience.
            </p>
          </div>
        </section>

        <section className="space-y-3 border-t border-[rgba(43,43,43,0.12)] pt-4">
          <div className="flex items-center justify-between text-sm font-['Inter'] text-[#2B2B2B]">
            <span>Order total</span>
            <span>{formatMoney(total)}</span>
          </div>
          <button
            type="submit"
            disabled={!isValid() || submitting || cart.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#BFA06F] px-6 py-3 text-xs font-['Inter'] uppercase tracking-[0.22em] text-[#2B2B2B] shadow-lg hover:bg-[#a58a5c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Place order
            <ArrowRight className="h-4 w-4" />
          </button>
          {cart.length === 0 && (
            <p className="text-xs font-['Inter'] text-[#7E6B5A]">
              Your cart is empty. Add at least one pair to continue.
            </p>
          )}
        </section>
      </form>
    </main>
  );
};

interface OrderConfirmationProps {
  lastOrder: any | null;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  lastOrder,
}) => {
  if (!lastOrder) {
    return (
      <main className="mx-auto max-w-3xl px-6 pb-16 pt-8 bg-[#F5F1EB] min-h-screen">
        <p className="font-['Inter'] text-sm text-[#2B2B2B]">
          We couldn’t find your latest order (mock). Place an order to see the
          confirmation view.
        </p>
      </main>
    );
  }
  const delivery = new Date(lastOrder.deliveryEstimate);
  const formattedDelivery = delivery.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const total = lastOrder.totalPrice;

  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-8 bg-[#F5F1EB] min-h-screen">
      <section className="mb-10 rounded-3xl bg-white px-6 py-8 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
        <p className="font-['Bodoni_Moda'] text-xs tracking-[0.3em] uppercase text-[#7E6B5A] mb-2">
          Thank you
        </p>
        <h1 className="font-['Playfair_Display'] text-2xl text-[#2B2B2B] mb-3">
          Your Jootiya pair is reserved.
        </h1>
        <p className="font-['Inter'] text-sm text-[#2B2B2B]/80 mb-4">
          This is a mock order. In a live experience, your sneakers would now be
          hand-packed in our atelier and prepared for their journey to you.
        </p>
        <p className="font-['Inter'] text-sm text-[#2B2B2B]">
          Estimated arrival between
          <span className="font-semibold"> {formattedDelivery}</span> and a few
          days after, depending on customs.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="font-['Inter'] text-xs tracking-[0.18em] uppercase text-[#7E6B5A]">
          Order summary
        </h2>
        <div className="space-y-3">
          {lastOrder.items.map((item: CartItem) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="h-20 w-16 overflow-hidden rounded-xl bg-[#F5F1EB]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-['Inter'] text-[11px] uppercase tracking-[0.16em] text-[#7E6B5A]">
                    {product.category}
                  </p>
                  <p className="font-['Playfair_Display'] text-sm text-[#2B2B2B]">
                    {product.name}
                  </p>
                  <p className="font-['Inter'] text-xs text-[#2B2B2B]">
                    EU {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-['Inter'] text-[#2B2B2B]">
                  {formatMoney(product.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[rgba(43,43,43,0.12)] pt-4 text-sm font-['Inter'] text-[#2B2B2B]">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      </section>
    </main>
  );
};