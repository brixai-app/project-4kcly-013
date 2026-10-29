import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, MapPin, Phone, Shield, Truck } from 'lucide-react';
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/mockData";
import type { CheckoutForm, Order, OrderItem } from "@/types";

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  paymentMethod: "cod",
};

const storageKey = "jootiya.latestOrder";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, updateItem, removeItem, subtotal } = useCart() as any;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const orderItems: OrderItem[] = useMemo(
    () =>
      (items ?? []).map((item: any) => {
        const product = getProductBySlug(item?.productSlug ?? item?.slug ?? "") ?? null;
        return {
          productId: product?.id ?? item?.productId ?? "",
          name: product?.name ?? item?.name ?? "Mojri",
          price: product?.price ?? item?.price ?? 0,
          quantity: item?.quantity ?? 1,
          size: item?.size,
          color: item?.color,
          image: product?.image ?? item?.image,
        };
      }),
    [items]
  );

  const shipping = subtotal > 0 ? 180 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if ((items?.length ?? 0) === 0) navigate("/catalog", { replace: true });
  }, [items, navigate]);

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 1) {
      ["fullName", "email", "phone", "addressLine1", "city", "state", "postalCode"].forEach((key) => {
        if (!(form as any)?.[key]?.trim?.()) nextErrors[key] = "Required";
      });
      if (!/^\S+@\S+\.\S+$/.test(form.email ?? "")) nextErrors.email = "Enter a valid email";
      if ((form.phone ?? "").replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid phone";
    }
    if (currentStep === 2 && form.paymentMethod === "card") {
      if ((cardNumber.replace(/\s/g, "").length ?? 0) < 16) nextErrors.cardNumber = "Card number incomplete";
      if ((cardName.trim().length ?? 0) < 2) nextErrors.cardName = "Name on card required";
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) nextErrors.cardExpiry = "Use MM/YY";
      if ((cardCvv.replace(/\D/g, "").length ?? 0) < 3) nextErrors.cardCvv = "CVV incomplete";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const persistOrder = () => {
    const order: Order = {
      id: crypto.randomUUID(),
      items: orderItems,
      subtotal,
      shipping,
      total,
      customer: form,
      createdAt: new Date().toISOString(),
      status: "placed",
    };
    localStorage.setItem(storageKey, JSON.stringify(order));
    clearCart?.();
    toast.success("Order placed successfully");
    navigate("/order-confirmation", { replace: true, state: { orderId: order.id } });
  };

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="bg-[#F7F0E3] text-[#211A17]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-sm border border-[#CDBB9D] bg-[#FFFDFC] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Secure checkout</p>
                <h1 className="mt-2 font-['Bodoni_Moda'] text-4xl font-light tracking-tight sm:text-5xl">Complete your order</h1>
              </div>
              <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258] sm:flex">
                <Shield className="h-4 w-4" /> Protected
              </div>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-2 text-xs font-semibold uppercase tracking-[0.22em]">
              {["Shipping", "Payment", "Review"].map((label, index) => (
                <div key={label} className={`rounded-sm border px-3 py-2 ${step >= index + 1 ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] text-[#6F6258]"}`}>
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.28 }}>
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["fullName", "Full name"],
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["addressLine1", "Address line 1"],
                      ["addressLine2", "Address line 2"],
                      ["city", "City"],
                      ["state", "State"],
                      ["postalCode", "Postal code"],
                    ].map(([key, label]) => (
                      <label key={key} className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]">{label}</span>
                        <input
                          value={(form as any)?.[key] ?? ""}
                          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="w-full rounded-sm border border-[#CDBB9D] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#741F2B]"
                        />
                        {errors?.[key] ? <span className="mt-1 block text-xs text-[#741F2B]">{errors[key]}</span> : null}
                      </label>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["cod", "upi", "card"].map((method) => (
                        <button
                          key={method}
                          onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method as CheckoutForm["paymentMethod"] }))}
                          className={`rounded-sm border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] ${form.paymentMethod === method ? "border-[#741F2B] bg-[#741F2B] text-white" : "border-[#CDBB9D] bg-white text-[#6F6258]"}`}
                        >
                          {method === "cod" ? "Cash on delivery" : method === "upi" ? "UPI" : "Card"}
                        </button>
                      ))}
                    </div>

                    {form.paymentMethod === "card" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="sm:col-span-2">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]">Card number</span>
                          <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="w-full rounded-sm border border-[#CDBB9D] bg-white px-4 py-3 text-sm outline-none focus:border-[#741F2B]" />
                          {errors?.cardNumber ? <span className="mt-1 block text-xs text-[#741F2B]">{errors.cardNumber}</span> : null}
                        </label>
                        <label>
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]">Name on card</span>
                          <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full rounded-sm border border-[#CDBB9D] bg-white px-4 py-3 text-sm outline-none focus:border-[#741F2B]" />
                          {errors?.cardName ? <span className="mt-1 block text-xs text-[#741F2B]">{errors.cardName}</span> : null}
                        </label>
                        <label>
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]">Expiry</span>
                          <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY" className="w-full rounded-sm border border-[#CDBB9D] bg-white px-4 py-3 text-sm outline-none focus:border-[#741F2B]" />
                          {errors?.cardExpiry ? <span className="mt-1 block text-xs text-[#741F2B]">{errors.cardExpiry}</span> : null}
                        </label>
                        <label>
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]">CVV</span>
                          <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" className="w-full rounded-sm border border-[#CDBB9D] bg-white px-4 py-3 text-sm outline-none focus:border-[#741F2B]" />
                          {errors?.cardCvv ? <span className="mt-1 block text-xs text-[#741F2B]">{errors.cardCvv}</span> : null}
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="rounded-sm border border-[#CDBB9D] bg-[#faf9f6] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]"><MapPin className="h-4 w-4" /> Shipping</div>
                      <p className="mt-3 text-sm leading-6">{form.fullName ?? ""}</p>
                      <p className="text-sm leading-6">{form.addressLine1 ?? ""} {form.addressLine2 ?? ""}</p>
                      <p className="text-sm leading-6">{form.city ?? ""}, {form.state ?? ""} {form.postalCode ?? ""}</p>
                      <p className="text-sm leading-6">{form.country ?? ""}</p>
                    </div>
                    <div className="rounded-sm border border-[#CDBB9D] bg-[#faf9f6] p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6258]"><CreditCard className="h-4 w-4" /> Payment</div>
                      <p className="mt-3 text-sm leading-6">{form.paymentMethod === "card" ? "Card payment" : form.paymentMethod === "upi" ? "UPI" : "Cash on delivery"}</p>
                    </div>
                    <button onClick={persistOrder} className="inline-flex items-center gap-2 rounded-sm bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#561620]">
                      <CheckCircle2 className="h-4 w-4" /> Place order
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#CDBB9D] pt-5">
              <button onClick={goBack} disabled={step === 1} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258] disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              {step < 3 ? (
                <button onClick={goNext} className="inline-flex items-center gap-2 rounded-sm bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#561620]">
                  Continue <Truck className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </section>

          <aside className="rounded-sm border border-[#CDBB9D] bg-[#FFFDFC] p-5 sm:p-7">
            <h2 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight">Review</h2>
            <div className="mt-5 space-y-4">
              {orderItems.map((item) => (
                <div key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-4 border-b border-[#E6D9C2] pb-4">
                  <div className="h-20 w-16 overflow-hidden rounded-sm bg-[#faf9f6]">
                    <img src={item.image ?? ""} alt={item.name ?? "Product"} crossOrigin="anonymous" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#6F6258]">{item.size ?? "One size"} · {item.color ?? "Default"}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>₹{item.price.toLocaleString("en-IN")}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateItem?.(item.productId, Math.max(1, item.quantity - 1))} className="text-[#6F6258]"><span className="sr-only">Decrease</span><span>-</span></button>
                        <span className="w-5 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateItem?.(item.productId, item.quantity + 1)} className="text-[#6F6258]"><span className="sr-only">Increase</span><span>+</span></button>
                        <button onClick={() => removeItem?.(item.productId)} className="text-[#741F2B]"><span className="sr-only">Remove</span><span>×</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#CDBB9D] pt-5 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#6F6258]">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex items-center justify-between"><span className="text-[#6F6258]">Shipping</span><span>₹{shipping.toLocaleString("en-IN")}</span></div>
              <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#6F6258]">
              <Lock className="h-4 w-4" /> Secure local checkout
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;