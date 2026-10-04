import { useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { shippingRules } from "@/data/mockData";
import type { CartItem, CheckoutValues, Order } from "@/types";

const money = (amount = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-[4px] bg-[#8B0000] px-6 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#650000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B0000] disabled:cursor-not-allowed disabled:opacity-50";
const fallbackImage = "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80";

function CartRows({ items = [] }: { items?: CartItem[] } = {}) {
  const cart = useCart();
  return <ul className="divide-y divide-[#D8CFC3]">
    {items.map((item) => {
      const product = item?.product;
      const quantity = item?.quantity ?? 1;
      const stock = product?.stock?.[item?.size ?? 40] ?? 0;
      const image = /^https?:\/\//.test(product?.image ?? "") ? product?.image : fallbackImage;
      return <li key={item?.id} className="flex gap-4 py-6">
        <Link to={`/product/${product?.slug ?? ""}`} onClick={() => cart?.closeCart()} className="w-24 shrink-0">
          <img src={image ?? fallbackImage} alt={product?.name ?? "Footwear"} crossOrigin="anonymous" className="aspect-[3/4] w-full object-cover" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div><p className="text-xs text-[#665E54]">{product?.collection ?? "SOLE ÉLITE"}</p><h3 className="mt-1 font-['Playfair_Display'] text-lg">{product?.name ?? "Footwear"}</h3><p className="mt-1 text-sm text-[#665E54]">EU {item?.size ?? "—"} · {product?.color ?? "Signature"}</p></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center rounded-[4px] border border-[#D8CFC3]">
              <button type="button" aria-label={`Decrease quantity of ${product?.name ?? "item"}`} disabled={quantity <= 1} onClick={() => cart?.updateQuantity(item?.id ?? "", quantity - 1)} className="p-3 disabled:opacity-30"><Minus size={14} /></button>
              <span className="min-w-6 text-center text-sm" aria-live="polite">{quantity}</span>
              <button type="button" aria-label={`Increase quantity of ${product?.name ?? "item"}`} disabled={quantity >= stock} onClick={() => cart?.updateQuantity(item?.id ?? "", quantity + 1)} className="p-3 disabled:opacity-30"><Plus size={14} /></button>
            </div>
            <span className="text-sm font-bold">{money((product?.price ?? 0) * quantity)}</span>
            <button type="button" aria-label={`Remove ${product?.name ?? "item"}`} onClick={() => cart?.removeFromCart(item?.id ?? "")} className="p-2 text-[#665E54] hover:text-[#8B0000]"><Trash2 size={16} /></button>
          </div>
        </div>
      </li>;
    })}
  </ul>;
}

export function CartSummary({ showItems = true, showCheckout = true, className = "" }: { showItems?: boolean; showCheckout?: boolean; className?: string } = {}) {
  const cart = useCart();
  const items = cart?.cart ?? [];
  const progress = Math.min(100, Math.max(0, ((cart?.subtotal ?? 0) / Math.max(1, cart?.freeShippingThreshold ?? 1)) * 100));
  const delivery = (shippingRules as unknown as { deliveryEstimate?: string })?.deliveryEstimate ?? "Shipping is calculated for your order.";
  if (!items.length) return <div className={`py-16 text-center ${className}`}><ShoppingBag className="mx-auto mb-5 text-[#665E54]" size={32} /><h2 className="font-['Playfair_Display'] text-2xl">Your bag awaits</h2><p className="my-4 text-sm text-[#665E54]">Find a pair worth making room for.</p><Link to="/shop" onClick={() => cart?.closeCart()} className={buttonClass}>Explore collection</Link></div>;
  return <section aria-label="Shopping bag summary" className={`text-[#2B2B2B] ${className}`}>
    {showItems && <CartRows items={items} />}
    <div className="border-t border-[#D8CFC3] pt-5">
      <p className="text-sm text-[#665E54]">{(cart?.amountToFreeShipping ?? 0) > 0 ? `${money(cart?.amountToFreeShipping ?? 0)} away from complimentary shipping.` : "Complimentary shipping is yours."}</p>
      <div role="progressbar" aria-label="Progress to complimentary shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="my-3 h-1 overflow-hidden bg-[#D8CFC3]"><div className="h-full bg-[#8B0000] transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
      <dl className="space-y-3 py-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cart?.subtotal ?? 0)}</dd></div><div className="flex justify-between"><dt>Shipping</dt><dd>{(cart?.shipping ?? 0) === 0 ? "Complimentary" : money(cart?.shipping ?? 0)}</dd></div><div className="flex justify-between border-t border-[#D8CFC3] pt-4 text-lg font-bold"><dt>Total</dt><dd>{money(cart?.total ?? 0)}</dd></div></dl>
      <p className="mb-5 text-xs text-[#665E54]">{delivery}</p>
      {showCheckout && <Link to="/checkout" onClick={() => cart?.closeCart()} className={`${buttonClass} w-full`}>Continue to mock checkout</Link>}
    </div>
  </section>;
}

export function CartDrawer() {
  const cart = useCart();
  return <Dialog.Root open={cart?.isCartOpen ?? false} onOpenChange={(open) => cart?.setIsCartOpen(open)}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-[#D8CFC3] bg-[#FFFCF7] font-['Lora'] text-[#2B2B2B] shadow-xl">
        <header className="flex items-center justify-between border-b border-[#D8CFC3] px-6 py-6"><Dialog.Title className="font-['Playfair_Display'] text-3xl">Your bag <span className="text-lg text-[#665E54]">({cart?.cartCount ?? 0})</span></Dialog.Title><Dialog.Close aria-label="Close shopping bag" className="rounded-[4px] p-2 hover:bg-[#F5F1EB]"><X size={22} /></Dialog.Close></header>
        <Dialog.Description className="sr-only">Review your footwear, adjust quantities, and proceed to a simulated checkout.</Dialog.Description>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8"><CartSummary /></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function CheckoutForm({ className = "" }: { className?: string } = {}) {
  const cart = useCart();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const fields: { name: keyof CheckoutValues; label: string; autoComplete: string; type?: string; minLength?: number }[] = [
    { name: "fullName", label: "Full name", autoComplete: "name", minLength: 2 },
    { name: "email", label: "Email address", autoComplete: "email", type: "email" },
    { name: "address", label: "Street address", autoComplete: "street-address", minLength: 5 },
    { name: "city", label: "City", autoComplete: "address-level2", minLength: 2 },
    { name: "postalCode", label: "Postal code", autoComplete: "postal-code", minLength: 3 },
    { name: "country", label: "Country", autoComplete: "country-name", minLength: 2 },
  ];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !event?.currentTarget?.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    const read = (key: keyof CheckoutValues) => String(data.get(key) ?? "").trim();
    const customer: CheckoutValues = { fullName: read("fullName"), email: read("email"), address: read("address"), city: read("city"), postalCode: read("postalCode"), country: read("country") };
    if (fields.some((field) => read(field?.name).length < (field?.minLength ?? 1))) { toast.error("Please complete each address field without blank spaces."); return; }
    submitting.current = true;
    setBusy(true);
    try {
      const order = cart?.placeOrder(customer);
      if (!order?.id) throw new Error("Your order could not be placed. Please review your bag.");
      cart?.closeCart();
      toast.success("Mock order confirmed. No payment was taken.");
      navigate(`/order-confirmation/${encodeURIComponent(order.id)}`, { replace: true });
    } catch (error) {
      submitting.current = false;
      setBusy(false);
      toast.error(error instanceof Error ? error.message : "Please try again.");
    }
  };
  if (!(cart?.cart?.length ?? 0)) return <CartSummary className={className} />;
  return <form onSubmit={submit} className={`space-y-6 font-['Lora'] ${className}`} aria-busy={busy}>
    <div><h2 className="font-['Playfair_Display'] text-3xl">Delivery details</h2><p className="mt-3 text-sm text-[#665E54]">Demonstration checkout only. No payment or actual delivery. Use fictional contact details.</p></div>
    <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2"><legend className="sr-only">Customer and delivery address</legend>{fields.map((field) => <label key={field?.name} className={`block text-sm ${field?.name === "address" ? "sm:col-span-2" : ""}`}>{field?.label}<input name={field?.name} type={field?.type ?? "text"} autoComplete={field?.autoComplete} required minLength={field?.minLength} maxLength={field?.name === "address" ? 300 : 120} defaultValue={field?.name === "country" ? "India" : ""} className="mt-2 min-h-11 w-full rounded-[4px] border border-[#D8CFC3] bg-[#FFFCF7] px-3 py-2 outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]" /></label>)}</fieldset>
    <button type="submit" disabled={busy} className={`${buttonClass} w-full`}>{busy ? "Confirming…" : `Place mock order · ${money(cart?.total ?? 0)}`}</button>
  </form>;
}

export function OrderConfirmation({ orderId = "", order = null, className = "" }: { orderId?: string; order?: Order | null; className?: string } = {}) {
  const cart = useCart();
  const params = useParams();
  const id = orderId || params?.orderId || params?.id || "";
  const saved = (cart as unknown as { orders?: Order[] })?.orders ?? [];
  const confirmed = order ?? saved.find((entry) => entry?.id === id);
  if (!confirmed) return <section className={`py-16 text-center ${className}`}><h1 className="font-['Playfair_Display'] text-4xl">Order not found</h1><p className="my-5 text-[#665E54]">This order is not available in this browser’s saved history.</p><Link to="/shop" className={buttonClass}>Return to collection</Link></section>;
  return <section className={`mx-auto max-w-2xl py-12 text-[#2B2B2B] ${className}`}><CheckCircle2 size={36} className="mb-6 text-[#8B0000]" /><h1 className="font-['Playfair_Display'] text-4xl">{confirmed?.status === "cancelled" ? "Order cancelled" : "Your mock order is confirmed"}</h1><p className="mt-4 text-[#665E54]">Thank you, {confirmed?.customer?.fullName ?? "guest"}. This is a simulation: no payment was taken and no items will ship.</p><p className="mt-4 break-all text-xs uppercase tracking-widest">Order {confirmed?.id ?? "—"}</p><ul className="my-8 divide-y divide-[#D8CFC3]">{(confirmed?.items ?? []).map((item) => <li key={item?.id} className="flex justify-between gap-4 py-4"><span>{item?.product?.name ?? "Footwear"} · EU {item?.size ?? "—"} × {item?.quantity ?? 0}</span><strong>{money((item?.product?.price ?? 0) * (item?.quantity ?? 0))}</strong></li>)}</ul><p className="mb-8 flex justify-between border-t border-[#D8CFC3] pt-5 font-bold"><span>Total including shipping</span><span>{money(confirmed?.total ?? 0)}</span></p><Link to="/shop" className={buttonClass}>Continue exploring</Link></section>;
}

export default CartDrawer;