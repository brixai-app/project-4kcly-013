import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, CreditCard, FileText, Lock, Package, ShoppingBag, Truck, User } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import type { CustomOrderRequest, Order } from '@/types';

type SectionProps = { className?: string };
type FormState = { name: string; email: string; phone: string; address: string; card: string; expiry: string; cvv: string; notes: string; budget: string; measurements: string };

const shell = 'bg-[#F5F1EB] text-[#302D29]';
const panel = 'bg-[#FFFCF7] border border-[#C9BFB1]';
const input = 'w-full rounded-sm border border-[#C9BFB1] bg-[#FFFCF7] px-3 py-2 text-sm text-[#302D29] outline-none transition focus:border-[#6B1E1E]';
const label = 'text-[11px] uppercase tracking-[0.24em] text-[#71695F]';

const useLiveOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    let active = true;
    fetch('/api/orders').then(r => r.json()).then((res) => active && setOrders(res?.data ?? [])).catch(() => active && setOrders([]));
    return () => { active = false; };
  }, []);
  return orders;
};

function SectionCard({ className = '', children }: React.PropsWithChildren<SectionProps>) {
  return <section className={`${panel} ${className} rounded-sm p-5 md:p-6`}>{children}</section>;
}

function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const total = subtotal + (subtotal > 0 ? 250 : 0);
  return (
    <div className={`${shell} min-h-screen px-4 py-8 md:px-8`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <SectionCard className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className={label}>Cart</p>
              <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight md:text-5xl">Your selected pairings</h1>
            </div>
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Checkout <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {items?.length ? items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-[#C9BFB1] pb-4 last:border-b-0">
                <img src={item.image} alt={item.name} crossOrigin="anonymous" className="h-24 w-20 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#71695F]">{item.size ?? 'One size'} · {item.color ?? 'Neutral'}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="h-8 w-8 border border-[#C9BFB1]">-</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 border border-[#C9BFB1]">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-xs uppercase tracking-[0.22em] text-[#6B1E1E]">Remove</button>
                  </div>
                </div>
                <div className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            )) : <div className="py-16 text-center text-sm text-[#71695F]">Your cart is empty.</div>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => clearCart()} className="border border-[#C9BFB1] px-4 py-2 text-xs uppercase tracking-[0.22em]">Clear cart</button>
            <button onClick={() => setOpen(true)} className="border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white">Proceed to checkout</button>
          </div>
        </SectionCard>
        <SectionCard className="space-y-4">
          <p className={label}>Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{subtotal > 0 ? '250' : '0'}</span></div>
            <div className="flex justify-between border-t border-[#C9BFB1] pt-2 font-semibold"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
          <button onClick={() => setOpen(true)} className="w-full border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-3 text-xs uppercase tracking-[0.22em] text-white">Secure checkout</button>
        </SectionCard>
      </div>
      <CheckoutSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}

function CheckoutSheet({ open = false, onOpenChange = () => {} }: { open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', address: '', card: '', expiry: '', cvv: '', notes: '', budget: '', measurements: '' });
  const submit = async () => {
    if (!form.name || !form.email || !form.address || !form.card || !form.expiry || !form.cvv) return toast.error('Please complete all required fields.');
    if (form.card.replace(/\s/g, '').length < 12) return toast.error('Enter a valid card number.');
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return toast.error('Use MM/YY expiry format.');
    if (form.cvv.length < 3) return toast.error('Enter a valid CVV.');
    const payload: Partial<Order> = { items, subtotal, shipping: subtotal > 0 ? 250 : 0, total: subtotal + (subtotal > 0 ? 250 : 0), shippingAddress: form.address, paymentMethod: 'Card' };
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(r => r.json()).catch(() => null);
    if (res?.success) { toast.success('Order placed successfully.'); clearCart(); onOpenChange(false); } else toast.error(res?.message ?? 'Checkout failed.');
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-[#F5F1EB] p-5 shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-[#C9BFB1] pb-4">
            <div>
              <p className={label}>Checkout</p>
              <h2 className="font-['Bodoni_Moda'] text-3xl font-light">Secure payment</h2>
            </div>
            <button onClick={() => onOpenChange(false)} className="text-xs uppercase tracking-[0.22em] text-[#71695F]">Close</button>
          </div>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input className={input} placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              <input className={input} placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <input className={input} placeholder="Shipping address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-3">
              <input className={input} placeholder="Card number" value={form.card} onChange={(e) => setForm((p) => ({ ...p, card: e.target.value }))} />
              <input className={input} placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm((p) => ({ ...p, expiry: e.target.value }))} />
              <input className={input} placeholder="CVV" value={form.cvv} onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value }))} />
            </div>
            <textarea className={`${input} min-h-28`} placeholder="Delivery notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <div className="flex items-center justify-between border-t border-[#C9BFB1] pt-4 text-sm">
              <span>Total</span><span className="font-semibold">₹{(subtotal + (subtotal > 0 ? 250 : 0)).toLocaleString('en-IN')}</span>
            </div>
            <button onClick={submit} className="inline-flex w-full items-center justify-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-3 text-xs uppercase tracking-[0.22em] text-white">
              Pay now <Lock size={14} />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CheckoutPage() {
  const orders = useLiveOrders();
  return (
    <div className={`${shell} min-h-screen px-4 py-8 md:px-8`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard className="space-y-4">
          <p className={label}>Checkout</p>
          <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight">Finalize your order</h1>
          <div className="space-y-3 text-sm text-[#71695F]">
            <div className="flex items-center gap-2"><CreditCard size={16} /> Card validation and address confirmation</div>
            <div className="flex items-center gap-2"><Truck size={16} /> Insured delivery across India</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Immediate confirmation on success</div>
          </div>
        </SectionCard>
        <SectionCard className="space-y-4">
          <p className={label}>Recent orders</p>
          <div className="space-y-3">
            {orders?.slice(0, 4)?.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-[#C9BFB1] pb-3 text-sm last:border-b-0">
                <div>
                  <p className="font-semibold">Order {order.id}</p>
                  <p className="text-[#71695F]">{order.status}</p>
                </div>
                <p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p>
              </div>
            )) ?? null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function DashboardPage() {
  const orders = useLiveOrders();
  return (
    <div className={`${shell} min-h-screen px-4 py-8 md:px-8`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionCard className="space-y-4">
          <p className={label}>Dashboard</p>
          <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight">Workroom overview</h1>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><User size={16} /> Account profile</div>
            <div className="flex items-center gap-2"><Package size={16} /> Orders and fulfillment</div>
            <div className="flex items-center gap-2"><FileText size={16} /> Bespoke request queue</div>
          </div>
        </SectionCard>
        <SectionCard className="space-y-3">
          <p className={label}>Live orders</p>
          {orders?.length ? orders.map((order) => <div key={order.id} className="flex justify-between border-b border-[#C9BFB1] py-3 text-sm last:border-b-0"><span>{order.status}</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>) : <p className="text-sm text-[#71695F]">No orders yet.</p>}
        </SectionCard>
      </div>
    </div>
  );
}

function CustomOrderPage() {
  const [form, setForm] = useState<CustomOrderRequest>({ id: '', name: '', email: '', phone: '', occasion: '', notes: '', budget: 0, preferredColors: [], preferredMaterials: [] });
  const submit = async () => {
    if (!form.name || !form.email) return toast.error('Name and email are required.');
    if ((form.budget ?? 0) < 0) return toast.error('Budget must be valid.');
    const res = await fetch('/api/custom-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }).then(r => r.json()).catch(() => null);
    if (res?.success) toast.success('Custom request submitted.'); else toast.error(res?.message ?? 'Request failed.');
  };
  return (
    <div className={`${shell} min-h-screen px-4 py-8 md:px-8`}>
      <div className="mx-auto max-w-4xl">
        <SectionCard className="space-y-5">
          <p className={label}>Custom order</p>
          <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight">Commission a bespoke pair</h1>
          <div className="grid gap-4 md:grid-cols-2">
            <input className={input} placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className={input} placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            <input className={input} placeholder="Phone" value={form.phone ?? ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            <input className={input} placeholder="Occasion" value={form.occasion ?? ''} onChange={(e) => setForm((p) => ({ ...p, occasion: e.target.value }))} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className={input} placeholder="Budget" value={String(form.budget ?? '')} onChange={(e) => setForm((p) => ({ ...p, budget: Number(e.target.value) || 0 }))} />
            <input className={input} placeholder="Measurements" value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
          <textarea className={`${input} min-h-32`} placeholder="Notes, colors, materials" value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <button onClick={submit} className="inline-flex items-center gap-2 border border-[#6B1E1E] bg-[#6B1E1E] px-4 py-3 text-xs uppercase tracking-[0.22em] text-white">
            Submit request <ArrowRight size={14} />
          </button>
        </SectionCard>
      </div>
    </div>
  );
}

export { CartPage, CheckoutPage, DashboardPage, CustomOrderPage };
export default CartPage;