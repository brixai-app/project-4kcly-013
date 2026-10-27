import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, CreditCard, Truck, Shield, MapPin } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import type { PaymentMethod, ShippingDetails } from "@/types";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart() as {
    items?: Array<{ product?: { id?: string; name?: string; price?: number }; quantity?: number }>;
    subtotal?: number;
    clearCart?: () => void;
  };

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const shippingFee = useMemo(() => (subtotal ?? 0) > 4999 ? 0 : 199, [subtotal]);
  const total = (subtotal ?? 0) + shippingFee;

  const updateField = (key: keyof ShippingDetails, value: string) =>
    setShipping((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const required: Array<keyof ShippingDetails> = [
      "fullName",
      "email",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];
    const missing = required.find((key) => !shipping?.[key]?.trim?.());
    if (missing) {
      toast.error("Please complete all shipping details.");
      return false;
    }
    if (!items?.length) {
      toast.error("Your cart is empty.");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      const payload = {
        items: items ?? [],
        shipping,
        paymentMethod,
        subtotal: subtotal ?? 0,
        shippingFee,
        total,
      };
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { success?: boolean; data?: { id?: string }; message?: string } | null;
      if (!response.ok || !data?.success) throw new Error(data?.message ?? "Unable to place order.");
      clearCart?.();
      toast.success("Order placed successfully.");
      navigate(`/confirmation/${data?.data?.id ?? "order"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF7F0] text-[#2B2B2B]">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9A7440]">Secure checkout</p>
            <h1 className="font-['Playfair_Display'] text-4xl font-light tracking-tight md:text-5xl">Complete your order</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6D6257]">
              Confirm your shipping details and choose a payment method for your handcrafted Jodhpuri Mojris.
            </p>
          </div>

          <div className="grid gap-4 border border-[#D8CCB8] bg-[#FFFDF8] p-6 md:grid-cols-2">
            {[
              { icon: MapPin, title: "Shipping", text: "Ivory-toned delivery across India." },
              { icon: CreditCard, title: "Payment", text: "Mocked client-side payment flow." },
              { icon: Truck, title: "Dispatch", text: "Carefully packed and tracked." },
              { icon: Shield, title: "Security", text: "Protected checkout experience." },
            ].map((item) => (
              <div key={item.title} className="flex min-w-0 items-start gap-3">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7440]" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6D6257]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-light">Shipping details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["fullName", "Full name"],
                ["email", "Email address"],
                ["phone", "Phone number"],
                ["addressLine1", "Address line 1"],
                ["city", "City"],
                ["state", "State"],
                ["postalCode", "Postal code"],
                ["country", "Country"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-[#6D6257]">{label}</span>
                  <input
                    value={shipping?.[key as keyof ShippingDetails] ?? ""}
                    onChange={(e) => updateField(key as keyof ShippingDetails, e.target.value)}
                    className="w-full border border-[#D8CCB8] bg-[#FAF7F0] px-3 py-3 text-sm outline-none transition focus:border-[#9A7440]"
                    type="text"
                    autoComplete="off"
                  />
                </label>
              ))}
              <label className="md:col-span-2 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-[#6D6257]">Address line 2</span>
                <input
                  value={shipping?.addressLine2 ?? ""}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  className="w-full border border-[#D8CCB8] bg-[#FAF7F0] px-3 py-3 text-sm outline-none transition focus:border-[#9A7440]"
                  type="text"
                  autoComplete="off"
                />
              </label>
            </div>
          </div>

          <div className="border border-[#D8CCB8] bg-[#FFFDF8] p-6">
            <h2 className="font-['Playfair_Display'] text-2xl font-light">Payment method</h2>
            <div className="mt-4 space-y-3">
              {[
                ["upi", "UPI"],
                ["card", "Card"],
                ["cod", "Cash on delivery"],
              ].map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-3 border border-[#D8CCB8] px-4 py-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === value}
                    onChange={() => setPaymentMethod(value as PaymentMethod)}
                    className="h-4 w-4 accent-[#9A7440]"
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit border border-[#D8CCB8] bg-[#FFFDF8] p-6 md:sticky md:top-6">
          <h2 className="font-['Playfair_Display'] text-2xl font-light">Order summary</h2>
          <div className="mt-5 space-y-4">
            {(items ?? []).map((item, index) => (
              <div key={`${item?.product?.id ?? index}`} className="flex items-start justify-between gap-4 border-b border-[#D8CCB8] pb-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item?.product?.name ?? "Product"}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6D6257]">Qty {item?.quantity ?? 1}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold">₹{((item?.product?.price ?? 0) * (item?.quantity ?? 1)).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-[#D8CCB8] pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#6D6257]">Subtotal</span>
              <span className="font-medium">₹{(subtotal ?? 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6D6257]">Shipping</span>
              <span className="font-medium">{shippingFee === 0 ? "Free" : `₹${shippingFee.toLocaleString("en-IN")}`}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#D8CCB8] pt-3 text-base">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void placeOrder()}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-[#9A7440] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:bg-[#76562E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing order" : "Place order"}
            <CheckCircle2 className="h-4 w-4" />
          </button>
        </aside>
      </section>
    </main>
  );
}

export default CheckoutPage;