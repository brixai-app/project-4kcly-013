import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";

import {
  getCart,
  hydrateCartWithProducts,
  updateCartItemQty,
  removeCartItem,
  getCartCount,
  getCartSubtotal,
  formatPrice,
  clearCart,
  canPlaceOrder,
  ShippingInfo,
  PaymentInfo,
  validateShippingInfo,
  validatePaymentInfo,
  placeOrder,
  getLastOrder,
  formatDate,
} from "./mock";

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Separator,
} from "@/components/ui/shadcn";

// NOTE: This entire app is mock-driven and fully client-side; there is NO backend.
// Cart and orders are persisted using localStorage via helpers in src/mock.ts.

// -----------------------------
// Layout Wrapper to handle scroll to top on route change
// -----------------------------

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

// -----------------------------
// Cart Drawer & Helpers
// -----------------------------

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [cartVersion, setCartVersion] = useState(0);

  const cartItems = useMemo(
    () => hydrateCartWithProducts(getCart()),
    [cartVersion]
  );
  const subtotal = useMemo(() => getCartSubtotal(), [cartVersion]);

  const handleQtyChange = (productId: string, size: string, qty: number) => {
    updateCartItemQty(productId, size, qty);
    setCartVersion((v) => v + 1);
  };

  const handleRemove = (productId: string, size: string) => {
    removeCartItem(productId, size);
    setCartVersion((v) => v + 1);
  };

  const handleCheckout = () => {
    if (!cartItems.length) {
      toast("Your cart is empty.");
      return;
    }
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <AnimatePresence>
          {open && (
            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 40 }}
                className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#F5F1EB] dark:bg-neutral-900 shadow-2xl border-l border-neutral-200/80 dark:border-neutral-800 flex flex-col"
              >
                <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800">
                  <div>
                    <Dialog.Title className="text-lg font-semibold tracking-wide text-neutral-900 dark:text-neutral-50 font-['Playfair_Display']">
                      Your Selection
                    </Dialog.Title>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Curate, refine, and proceed to a seamless checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="rounded-full p-2 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-[#BFA06F]/60"
                    aria-label="Close cart"
                  >
                    <X className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-4">
                      Your cart is currently empty. Begin with a pair that feels inevitable.
                    </p>
                  ) : (
                    cartItems.map((item) => {
                      const product = item.product;
                      if (!product) return null;
                      return (
                        <div
                          key={`${item.productId}-${item.size}`}
                          className="flex gap-3 border-b border-neutral-200/70 dark:border-neutral-800 pb-3 last:border-0"
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200/70 dark:bg-neutral-800">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-1">
                                  {product.brand}
                                </div>
                                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 line-clamp-2 font-['Bodoni_Moda']">
                                  {product.name}
                                </h3>
                              </div>
                              <button
                                onClick={() => handleRemove(item.productId, item.size)}
                                className="p-1 rounded-full hover:bg-neutral-200/80 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4 text-neutral-500" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                              <span>Size {item.size}</span>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="uppercase tracking-[0.18em]">Qty</span>
                                <select
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQtyChange(
                                      item.productId,
                                      item.size,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="h-7 rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 text-xs focus-visible:outline-none focus-visible:ring focus-visible:ring-[#BFA06F]/60"
                                >
                                  {[1, 2, 3, 4, 5].map((q) => (
                                    <option key={q} value={q} className="text-neutral-900">
                                      {q}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Line total:{" "}
                                <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                                  {formatPrice(product.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <footer className="border-t border-neutral-200/80 dark:border-neutral-800 px-6 py-4 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    Duties and taxes are estimated at checkout. Shipping is calculated based on your destination and preferred pace.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-neutral-400/60 text-neutral-800 hover:bg-neutral-200/70 dark:border-neutral-600 dark:text-neutral-50 dark:hover:bg-neutral-800 rounded-full text-xs tracking-[0.18em] uppercase"
                      onClick={() => onOpenChange(false)}
                    >
                      Continue Browsing
                    </Button>
                    <Button
                      className="flex-1 bg-[#BFA06F] hover:bg-[#b2945a] text-neutral-900 rounded-full text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2 shadow-md shadow-[#BFA06F]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCheckout}
                      disabled={!cartItems.length}
                    >
                      Proceed
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </footer>
              </motion.aside>
            </Dialog.Content>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// -----------------------------
// Checkout Page (Inline Route)
// -----------------------------

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartVersion, setCartVersion] = useState(0);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    address: "",
    email: "",
    phone: "",
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [shippingErrors, setShippingErrors] = useState<
    Partial<Record<keyof ShippingInfo, string>>
  >({});
  const [paymentErrors, setPaymentErrors] = useState<
    Partial<Record<keyof PaymentInfo, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);

  const cartItems = useMemo(
    () => hydrateCartWithProducts(getCart()),
    [cartVersion]
  );
  const subtotal = useMemo(() => getCartSubtotal(), [cartVersion]);

  useEffect(() => {
    // Trigger hydration when arriving on page
    setCartVersion((v) => v + 1);
  }, []);

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    const next = { ...shipping, [field]: value };
    setShipping(next);
    const validation = validateShippingInfo(next);
    setShippingErrors(validation.errors);
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    const sanitized =
      field === "cardNumber" || field === "cvv"
        ? value.replace(/[^0-9]/g, "")
        : value;
    const next = { ...payment, [field]: sanitized };
    setPayment(next);
    const validation = validatePaymentInfo(next);
    setPaymentErrors(validation.errors);
  };

  const canSubmit = useMemo(
    () => canPlaceOrder(getCart(), shipping, payment),
    [shipping, payment, cartVersion]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const currentCart = getCart();
    const result = placeOrder(currentCart, shipping, payment);

    if (!result.success || !result.order) {
      setSubmitting(false);
      toast.error(result.error ?? "Unable to place order.");
      return;
    }

    toast.success("Order placed – a quiet luxury on its way.");

    // Wait a bit for UX, then navigate
    setTimeout(() => {
      setSubmitting(false);
      navigate("/order-confirmation", { replace: true });
    }, 600);
  };

  if (!cartItems.length) {
    return (
      <main className="min-h-[60vh] px-4 sm:px-6 lg:px-10 py-10 bg-[#F5F1EB] dark:bg-neutral-900 flex flex-col items-start justify-center">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 font-['Playfair_Display'] tracking-wide mb-3">
            Your cart is empty.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
            Begin again with a pair that feels inevitable.
          </p>
          <Button
            className="bg-[#BFA06F] hover:bg-[#b2945a] text-neutral-900 rounded-full text-xs tracking-[0.18em] uppercase px-6 py-2"
            onClick={() => navigate("/catalog")}
          >
            Explore Catalog
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] px-4 sm:px-6 lg:px-10 py-10 bg-[#F5F1EB] dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-3 lg:items-start">
        {/* Forms */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-8 bg-white/70 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl px-6 sm:px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 font-['Playfair_Display'] tracking-wide mb-2">
              Checkout
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              A few quiet details before your pair leaves the atelier.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
              Shipping
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Full name
                </label>
                <Input
                  value={shipping.name}
                  onChange={(e) => handleShippingChange("name", e.target.value)}
                  placeholder="As it appears on your residence"
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    shippingErrors.name
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {shippingErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{shippingErrors.name}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Address
                </label>
                <Input
                  value={shipping.address}
                  onChange={(e) => handleShippingChange("address", e.target.value)}
                  placeholder="Street, city, region, postal code"
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    shippingErrors.address
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {shippingErrors.address && (
                  <p className="mt-1 text-xs text-red-600">{shippingErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Email
                </label>
                <Input
                  value={shipping.email}
                  onChange={(e) => handleShippingChange("email", e.target.value)}
                  type="email"
                  placeholder="For confirmations and digital receipts"
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    shippingErrors.email
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {shippingErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{shippingErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Phone
                </label>
                <Input
                  value={shipping.phone}
                  onChange={(e) => handleShippingChange("phone", e.target.value)}
                  inputMode="tel"
                  placeholder="Digits only"
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    shippingErrors.phone
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {shippingErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{shippingErrors.phone}</p>
                )}
              </div>
            </div>
          </section>

          <Separator className="bg-neutral-200/80 dark:bg-neutral-800" />

          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
              Payment
            </h2>
            <div className="grid gap-4 sm:grid-cols-3 items-end">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Card number
                </label>
                <Input
                  value={payment.cardNumber}
                  onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                  inputMode="numeric"
                  placeholder="16 digits"
                  maxLength={19}
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 tracking-[0.28em] ${
                    paymentErrors.cardNumber
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {paymentErrors.cardNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {paymentErrors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  Expiry
                </label>
                <Input
                  value={payment.expiry}
                  onChange={(e) => handlePaymentChange("expiry", e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    paymentErrors.expiry
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {paymentErrors.expiry && (
                  <p className="mt-1 text-xs text-red-600">{paymentErrors.expiry}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium tracking-[0.16em] uppercase text-neutral-700 dark:text-neutral-200 mb-1">
                  CVV
                </label>
                <Input
                  value={payment.cvv}
                  onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="3 digits"
                  className={`rounded-full bg-transparent border-neutral-300 dark:border-neutral-700 text-sm px-4 py-2 ${
                    paymentErrors.cvv
                      ? "border-red-500 focus-visible:ring-red-500/50"
                      : "focus-visible:ring-[#BFA06F]/60"
                  }`}
                />
                {paymentErrors.cvv && (
                  <p className="mt-1 text-xs text-red-600">{paymentErrors.cvv}</p>
                )}
              </div>

              <div className="sm:col-span-3 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                This is a fully mocked checkout – no real payment is processed. Card details never leave your browser and exist purely for demonstration.
              </div>
            </div>
          </section>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
              By placing your order you confirm the details above and consent to receiving updates about your shipment.
            </p>
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="bg-[#BFA06F] hover:bg-[#b2945a] text-neutral-900 rounded-full text-xs tracking-[0.18em] uppercase px-7 py-2 flex items-center gap-2 shadow-md shadow-[#BFA06F]/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing order" : "Place order"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        {/* Order Summary */}
        <section className="space-y-4">
          <Card className="bg-white/80 dark:bg-neutral-950/80 border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-start justify-between gap-3 text-xs text-neutral-700 dark:text-neutral-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-['Bodoni_Moda'] text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {product.brand} • Size {item.size} • Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Separator className="bg-neutral-200/80 dark:bg-neutral-800" />
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                <span>Estimated duties &amp; taxes</span>
                <span>Included</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-2 border-t border-dashed border-neutral-200/80 dark:border-neutral-800">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
                Total
              </span>
              <span className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                {formatPrice(subtotal)}
              </span>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
};

// -----------------------------
// Order Confirmation (Inline Route)
// -----------------------------

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const lastOrder = getLastOrder();

  if (!lastOrder) {
    return (
      <main className="min-h-[60vh] px-4 sm:px-6 lg:px-10 py-10 bg-[#F5F1EB] dark:bg-neutral-900 flex flex-col items-start justify-center">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 font-['Playfair_Display'] tracking-wide mb-3">
            No order found.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
            Your confirmation awaits a completed checkout.
          </p>
          <Button
            className="bg-[#BFA06F] hover:bg-[#b2945a] text-neutral-900 rounded-full text-xs tracking-[0.18em] uppercase px-6 py-2"
            onClick={() => navigate("/catalog")}
          >
            Return to catalog
          </Button>
        </div>
      </main>
    );
  }

  const itemCount = lastOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-[70vh] px-4 sm:px-6 lg:px-10 py-10 bg-[#F5F1EB] dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-950/80 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl px-6 sm:px-10 py-10 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              Order confirmed
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 font-['Playfair_Display'] tracking-wide mb-3">
              Thank you for choosing Jootiya.
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xl">
              Your pair is now being prepared. You will receive a succinct confirmation at{" "}
              <span className="font-medium">{lastOrder.shippingInfo.email}</span> within the next few minutes.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-neutral-700 dark:text-neutral-200">
            <div>
              <span className="uppercase tracking-[0.18em] text-[11px] text-neutral-500 dark:text-neutral-400">
                Order
              </span>
              <div className="font-mono text-xs mt-1 break-all">{lastOrder.id}</div>
            </div>
            <div>
              <span className="uppercase tracking-[0.18em] text-[11px] text-neutral-500 dark:text-neutral-400">
                Placed
              </span>
              <p className="mt-1 text-sm">{formatDate(lastOrder.orderDate)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
              Journey details
            </h2>
            <div className="rounded-2xl border border-dashed border-neutral-300/80 dark:border-neutral-800 px-5 py-4 text-sm text-neutral-700 dark:text-neutral-200 bg-white/40 dark:bg-neutral-900/60">
              <p>
                Estimated arrival:{" "}
                <span className="font-semibold">
                  {formatDate(lastOrder.estimatedDelivery)}
                </span>
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Our ateliers dispatch within 24 hours. You will receive discreet updates as your pair crosses each threshold.
              </p>
            </div>

            <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
              <div>
                <h3 className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-1">
                  Shipping to
                </h3>
                <p>{lastOrder.shippingInfo.name}</p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {lastOrder.shippingInfo.address}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                  {lastOrder.shippingInfo.phone}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-700 dark:text-neutral-200">
              Your selection
            </h2>
            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200 max-h-60 overflow-y-auto pr-1">
              {lastOrder.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800 pb-2 last:border-0"
                >
                  <div className="text-xs">
                    <p className="font-['Bodoni_Moda'] text-sm">
                      {hydrateCartWithProducts([item])[0]?.product?.name ??
                        "Selected pair"}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Size {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-200">
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                <span>Pieces</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                <span>Total investment</span>
                <span>{formatPrice(lastOrder.totalPrice)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
          <p>
            A copy of this confirmation has been sent to{" "}
            <span className="font-medium">{lastOrder.shippingInfo.email}</span>.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full text-[11px] tracking-[0.18em] uppercase border-neutral-400/70 dark:border-neutral-700"
              onClick={() => navigate("/catalog")}
            >
              Continue browsing
            </Button>
            <Button
              className="rounded-full text-[11px] tracking-[0.18em] uppercase bg-[#BFA06F] hover:bg-[#b2945a] text-neutral-900 flex items-center gap-2"
              onClick={() => {
                clearCart();
                navigate("/", { replace: true });
              }}
            >
              Back to home
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

// -----------------------------
// Root App Shell with Routing
// -----------------------------

const AppShell: React.FC = () => {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCountVersion, setCartCountVersion] = useState(0);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        setCartCountVersion((v) => v + 1);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const cartCount = useMemo(() => getCartCount(), [cartCountVersion]);

  return (
    <div className="min-h-screen bg-[#F5F1EB] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 flex flex-col">
      <ScrollToTop />
      <Header
        onCartClick={() => setCartOpen(true)}
        cartCount={cartCount}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
        </Routes>
      </AnimatePresence>

      <Footer />

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <Toaster richColors position="top-center" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;