import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Separator,
  Badge,
} from "@/components/ui/shadcn";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  type Cart,
  type CartItem,
  type ShippingAddress,
  getCart,
  updateCartItem,
  removeCartItem,
  computeCartTotals,
  getProducts,
  getUser,
  saveUser,
  placeOrder,
  subscribe,
} from "@/mock";

// NOTE: This is a 100% frontend-only mocked checkout experience.
// All cart, user, and order operations are simulated in-memory and via localStorage in src/mock.ts.

const accentColor = "#7a1f2a"; // deep burgundy accent for inline styles when needed

interface ShippingFormState {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const emptyShipping: ShippingFormState = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart>(() => getCart());
  const [shipping, setShipping] = useState<ShippingFormState>(() => {
    const user = getUser();
    if (user?.defaultShipping) {
      const s = user.defaultShipping;
      return {
        fullName: s.fullName,
        phone: s.phone,
        line1: s.line1,
        line2: s.line2 ?? "",
        city: s.city,
        state: s.state,
        postalCode: s.postalCode,
        country: s.country || "India",
      };
    }
    return emptyShipping;
  });
  const [savingUser, setSavingUser] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormState, string>>>({});
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Subscribe to mock.ts pub/sub for live cart updates
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setCart(getCart());
    });
    return unsubscribe;
  }, []);

  const productsById = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getProducts>[number]>();
    getProducts().forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  const totals = useMemo(() => computeCartTotals(cart), [cart]);

  const handleQtyChange = (item: CartItem, delta: number) => {
    const nextQty = item.qty + delta;
    if (nextQty < 1) return;
    updateCartItem(item.productId, item.size, nextQty);
  };

  const handleRemove = (item: CartItem) => {
    removeCartItem(item.productId, item.size);
    toast("Removed from cart", {
      description: "That pair of mojris has slipped out of your cart.",
    });
  };

  const handleShippingChange = (
    field: keyof ShippingFormState,
    value: string
  ) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      // re-validate on change after submit
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const persistShippingToUser = async () => {
    setSavingUser(true);
    try {
      const address: ShippingAddress = {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        line1: shipping.line1.trim(),
        line2: shipping.line2.trim() || undefined,
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim() || "India",
      };
      saveUser({ defaultShipping: address });
    } finally {
      setSavingUser(false);
    }
  };

  const validateShipping = (): boolean => {
    const nextErrors: Partial<Record<keyof ShippingFormState, string>> = {};
    if (!shipping.fullName.trim()) nextErrors.fullName = "Please add a full recipient name.";
    if (!shipping.phone.trim()) nextErrors.phone = "A contact number helps artisans reach you.";
    if (!shipping.line1.trim()) nextErrors.line1 = "Street address is required.";
    if (!shipping.city.trim()) nextErrors.city = "City is required.";
    if (!shipping.state.trim()) nextErrors.state = "State is required.";
    if (!shipping.postalCode.trim()) nextErrors.postalCode = "Postal code is required.";
    if (!shipping.country.trim()) nextErrors.country = "Country is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    setSubmitted(true);
    if (!cart.items.length) {
      toast.error("Your cart is empty", {
        description: "Add a pair of Jodhpur mojris before you check out.",
      });
      return;
    }
    if (!validateShipping()) {
      toast.error("Shipping details incomplete", {
        description: "Please complete the highlighted fields.",
      });
      return;
    }

    setPlacingOrder(true);
    try {
      const address: ShippingAddress = {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim(),
        line1: shipping.line1.trim(),
        line2: shipping.line2.trim() || undefined,
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        postalCode: shipping.postalCode.trim(),
        country: shipping.country.trim() || "India",
      };

      const order = placeOrder(address);
      setLastOrderId(order.id);
      await persistShippingToUser();

      toast.success("Order confirmed — Mojris are being prepared in Jodhpur.", {
        description: `Order #${order.id} is now with the atelier.`,
      });

      // After a short pause, navigate back home
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", {
        description: "The order could not be completed. Please try once more.",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  const hasItems = cart.items.length > 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900 text-stone-900 dark:text-stone-50 pt-6 pb-16 px-6 lg:px-12">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to browsing
          </button>
          <Badge className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-700 text-xs tracking-wide uppercase">
            Handcrafted checkout — mock, no real payments
          </Badge>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_minmax(380px,1.15fr)] gap-8 items-start">
          {/* Order Summary */}
          <motion.section
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight font-serif">
                  Your Mojri Curation
                </h1>
                <p className="text-sm md:text-base text-stone-600 dark:text-stone-300 mt-1">
                  Review each pair before our artisans begin.
                </p>
              </div>
              {hasItems && (
                <div className="text-right text-xs md:text-sm text-stone-600 dark:text-stone-300">
                  <p>
                    {totals.itemCount} {totals.itemCount === 1 ? "pair" : "pairs"} in cart
                  </p>
                  <p className="mt-0.5 font-medium" style={{ color: accentColor }}>
                    ~ {totals.total.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </p>
                </div>
              )}
            </div>

            <Card className="border-stone-200/70 dark:border-stone-700/70 bg-stone-50/70 dark:bg-stone-900/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base md:text-lg font-medium tracking-tight">
                    Order summary
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Mojris are made in small batches. Adjust quantities with care.
                  </CardDescription>
                </div>
              </CardHeader>
              <Separator className="bg-stone-200 dark:bg-stone-800" />
              <CardContent className="pt-4 pb-2">
                <AnimatePresence initial={false}>
                  {cart.items.length === 0 && (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="py-10 flex flex-col items-center justify-center text-center gap-3"
                    >
                      <p className="text-sm md:text-base text-stone-600 dark:text-stone-300 max-w-md">
                        Your cart is currently empty. Begin with a pair that feels like Jodhpur in your hands.
                      </p>
                      <Button
                        variant="outline"
                        className="border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 rounded-full px-6"
                        onClick={() => navigate("/catalog")}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Explore the catalog
                      </Button>
                    </motion.div>
                  )}

                  {cart.items.length > 0 && (
                    <motion.ul
                      key="items-list"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {cart.items.map((item) => {
                        const product = productsById.get(item.productId);
                        if (!product) return null;
                        const lineTotal = item.qty * item.unitPrice;
                        return (
                          <motion.li
                            key={`${item.productId}-${item.size}`}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-4 md:gap-5"
                          >
                            <div className="relative h-20 w-24 md:h-24 md:w-28 overflow-hidden rounded-md bg-stone-200/70 dark:bg-stone-800/70">
                              {product.heroImage && (
                                <img
                                  src={product.heroImage}
                                  alt={product.name}
                                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                />
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1.5">
                                <div>
                                  <p className="text-sm md:text-base font-medium leading-snug">
                                    {product.name}
                                  </p>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                                    <span>
                                      Size <span className="font-medium">{item.size}</span>
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                                    <span>{product.style} • {product.color}</span>
                                    <Badge className="rounded-full bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/20 dark:text-amber-100 dark:border-amber-700 text-[10px] tracking-wide">
                                      Jodhpur atelier
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right text-sm md:text-base">
                                  <p className="font-medium">
                                    {item.unitPrice.toLocaleString("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    })}
                                  </p>
                                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                                    Line total: {lineTotal.toLocaleString("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    })}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center rounded-full border border-stone-300/80 dark:border-stone-700/80 bg-white/70 dark:bg-stone-900/60 px-1.5 py-1 text-xs md:text-sm">
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, -1)}
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Decrease quantity"
                                    disabled={item.qty <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="px-2 min-w-[2rem] text-center font-medium">
                                    {item.qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQtyChange(item, 1)}
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemove(item)}
                                  className="inline-flex items-center gap-1 text-xs md:text-sm text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </CardContent>

              {hasItems && (
                <CardFooter className="border-t border-stone-200/80 dark:border-stone-800/80 pt-4 flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-stone-300">Subtotal</span>
                    <span className="font-medium">
                      {totals.subtotal.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 dark:text-stone-300">Estimated shipping</span>
                    <span className="font-medium">
                      {totals.estimatedShipping.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <Separator className="bg-stone-200 dark:bg-stone-800" />
                  <div className="flex items-center justify-between text-base md:text-lg">
                    <span className="font-medium">Total</span>
                    <span
                      className="font-semibold"
                      style={{ color: accentColor }}
                    >
                      {totals.total.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1">
                    Taxes are indicative. This is a fully mocked checkout; no payment will be processed.
                  </p>
                </CardFooter>
              )}
            </Card>
          </motion.section>

          {/* Shipping + Payment */}
          <motion.section
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="space-y-4"
          >
            <Card className="border-stone-200/70 dark:border-stone-700/70 bg-white/80 dark:bg-stone-950/70 shadow-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-base md:text-lg font-medium tracking-tight">
                  Shipping details
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  We ship from Jodhpur. Share where your mojris are travelling to.
                </CardDescription>
              </CardHeader>
              <Separator className="bg-stone-200 dark:bg-stone-800" />
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                    >
                      Full name
                    </label>
                    <Input
                      id="fullName"
                      value={shipping.fullName}
                      onChange={(e) => handleShippingChange("fullName", e.target.value)}
                      onBlur={persistShippingToUser}
                      className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    />
                    {errors.fullName && (
                      <p
                        id="fullName-error"
                        className="text-xs text-red-600 dark:text-red-400"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      value={shipping.phone}
                      onChange={(e) => handleShippingChange("phone", e.target.value)}
                      onBlur={persistShippingToUser}
                      className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <p
                        id="phone-error"
                        className="text-xs text-red-600 dark:text-red-400"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="line1"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                    >
                      Address line 1
                    </label>
                    <Input
                      id="line1"
                      value={shipping.line1}
                      onChange={(e) => handleShippingChange("line1", e.target.value)}
                      onBlur={persistShippingToUser}
                      className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                      aria-invalid={!!errors.line1}
                      aria-describedby={errors.line1 ? "line1-error" : undefined}
                    />
                    {errors.line1 && (
                      <p
                        id="line1-error"
                        className="text-xs text-red-600 dark:text-red-400"
                      >
                        {errors.line1}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="line2"
                      className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                    >
                      Address line 2 <span className="normal-case text-[11px] text-stone-500">(optional)</span>
                    </label>
                    <Input
                      id="line2"
                      value={shipping.line2}
                      onChange={(e) => handleShippingChange("line2", e.target.value)}
                      onBlur={persistShippingToUser}
                      className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="city"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                      >
                        City
                      </label>
                      <Input
                        id="city"
                        value={shipping.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        onBlur={persistShippingToUser}
                        className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? "city-error" : undefined}
                      />
                      {errors.city && (
                        <p
                          id="city-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="state"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                      >
                        State
                      </label>
                      <Input
                        id="state"
                        value={shipping.state}
                        onChange={(e) => handleShippingChange("state", e.target.value)}
                        onBlur={persistShippingToUser}
                        className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                        aria-invalid={!!errors.state}
                        aria-describedby={errors.state ? "state-error" : undefined}
                      />
                      {errors.state && (
                        <p
                          id="state-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="postalCode"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                      >
                        Postal code
                      </label>
                      <Input
                        id="postalCode"
                        value={shipping.postalCode}
                        onChange={(e) => handleShippingChange("postalCode", e.target.value)}
                        onBlur={persistShippingToUser}
                        className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                        aria-invalid={!!errors.postalCode}
                        aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                      />
                      {errors.postalCode && (
                        <p
                          id="postalCode-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.postalCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="country"
                        className="text-xs font-medium uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300"
                      >
                        Country
                      </label>
                      <Input
                        id="country"
                        value={shipping.country}
                        onChange={(e) => handleShippingChange("country", e.target.value)}
                        onBlur={persistShippingToUser}
                        className="bg-stone-50/70 dark:bg-stone-900/70 border-stone-300/80 dark:border-stone-700/80 focus-visible:ring-stone-400 dark:focus-visible:ring-stone-500"
                        aria-invalid={!!errors.country}
                        aria-describedby={errors.country ? "country-error" : undefined}
                      />
                      {errors.country && (
                        <p
                          id="country-error"
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t border-stone-200/80 dark:border-stone-800/80 pt-4">
                <div className="flex items-center justify-between text-xs md:text-sm text-stone-600 dark:text-stone-300">
                  <span>
                    Details are stored only in your browser as part of this mock experience.
                  </span>
                  {savingUser && (
                    <span className="italic text-[11px] text-stone-500">
                      Saving…
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>

            <motion.div
              layout
              className="flex flex-col gap-3"
            >
              <Button
                size="lg"
                className="w-full rounded-full bg-[--accent-burgundy] hover:bg-[--accent-burgundy-hover] text-sm md:text-base font-medium tracking-wide py-3 shadow-md shadow-stone-700/20 border-none"
                style={{
                  // Using CSS variables to keep Tailwind happy while avoiding too-similar colors with backgrounds
                  // Values chosen to contrast against the light stone background.
                  // @ts-expect-error CSS custom properties
                  "--accent-burgundy": "#7a1f2a",
                  // @ts-expect-error CSS custom properties
                  "--accent-burgundy-hover": "#681925",
                }}
                disabled={!hasItems || placingOrder}
                onClick={handlePlaceOrder}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {placingOrder ? (
                    <span className="h-4 w-4 rounded-full border-2 border-amber-200 border-t-amber-700 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {placingOrder
                    ? "Placing your mock order..."
                    : hasItems
                    ? "Place mock order"
                    : "Add a pair to continue"}
                </span>
              </Button>

              {submitted && !hasItems && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Your cart is empty. Return to the catalog to choose at least one pair before placing an order.
                </p>
              )}

              <AnimatePresence>
                {lastOrderId && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-900/20 px-4 py-3 text-xs md:text-sm text-emerald-900 dark:text-emerald-100"
                  >
                    <p className="font-medium mb-0.5">
                      Order #{lastOrderId} is confirmed.
                    </p>
                    <p>
                      This is a fully mocked confirmation. In a live atelier workflow, this is where your mojris would begin their journey in Jodhpur.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;