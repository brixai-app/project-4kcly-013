import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Mail, Phone, Shield, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import type { CheckoutFormValues, Product } from '@/types';

export function OrderConfirmationPanel({
  orderId = '',
  total = 0,
  email = '',
}: {
  orderId?: string;
  total?: number;
  email?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-sm border border-[#C9A66B] bg-[#FFF9F0] p-8 text-center text-[#2B2B2B]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#7B2D26] bg-[#7B2D26] text-white">
        <Check className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <p className="font-['Playfair_Display'] text-4xl font-light tracking-tight">Order confirmed</p>
        <p className="font-['Lora'] text-sm leading-6 text-[#6F655B]">
          Your Jootiya order has been placed successfully. A confirmation has been sent to {email || 'your email'}.
        </p>
      </div>
      <div className="grid w-full gap-3 border-t border-[#C9A66B] pt-5 text-left sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Order ID</p>
          <p className="mt-1 font-['Lora'] text-sm text-[#2B2B2B]">{orderId || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Total</p>
          <p className="mt-1 font-['Lora'] text-sm text-[#2B2B2B]">₹{total.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
}

export function CheckoutForm({
  className = '',
  onSuccess,
}: {
  className?: string;
  onSuccess?: (orderId: string) => void;
}) {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: '',
    paymentMethod: 'card',
  });

  const shippingCost = subtotal > 12000 ? 0 : 250;
  const total = subtotal + shippingCost;

  const cartProducts = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p: Product) => p.id === item.productId);
          return product ? { ...product, quantity: item.quantity, size: item.size } : null;
        })
        .filter(Boolean) as Array<Product & { quantity: number; size?: string }>,
    [items]
  );

  const update = (key: keyof CheckoutFormValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const required: Array<keyof CheckoutFormValues> = [
      'fullName',
      'email',
      'phone',
      'addressLine1',
      'city',
      'state',
      'postalCode',
      'country',
      'paymentMethod',
    ];
    const missing = required.find((key) => !String(values[key] ?? '').trim());
    if (missing) return `Please complete ${String(missing).replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
    if (!/^\+?[0-9\s-]{10,15}$/.test(values.phone.trim())) return 'Please enter a valid phone number.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) return 'Please enter a valid email address.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    const nextOrderId = `JT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setOrderId(nextOrderId);
    setConfirmed(true);
    clearCart();
    setLoading(false);
    toast.success('Order placed successfully.');
    onSuccess?.(nextOrderId);
    navigate('/order-confirmation', { state: { orderId: nextOrderId, total, email: values.email } });
  };

  if (confirmed) return <OrderConfirmationPanel orderId={orderId} total={total} email={values.email} />;

  return (
    <form onSubmit={handleSubmit} className={`grid gap-8 lg:grid-cols-[1.15fr_0.85fr] ${className}`}>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B]">Checkout</p>
          <p className="max-w-xl font-['Lora'] text-sm leading-6 text-[#6F655B]">
            Secure your pair with a refined checkout experience tailored for heritage craftsmanship.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['fullName', 'Full name'],
            ['email', 'Email address'],
            ['phone', 'Phone number'],
            ['country', 'Country'],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">{label}</span>
              <input
                value={(values as Record<string, string>)[key] ?? ''}
                onChange={(e) => update(key as keyof CheckoutFormValues, e.target.value)}
                className="w-full rounded-sm border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 font-['Lora'] text-sm text-[#2B2B2B] outline-none transition focus:border-[#7B2D26]"
                type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
              />
            </label>
          ))}
        </div>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Address line 1</span>
          <input value={values.addressLine1} onChange={(e) => update('addressLine1', e.target.value)} className="w-full rounded-sm border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 font-['Lora'] text-sm outline-none focus:border-[#7B2D26]" />
        </label>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Address line 2</span>
          <input value={values.addressLine2 ?? ''} onChange={(e) => update('addressLine2', e.target.value)} className="w-full rounded-sm border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 font-['Lora'] text-sm outline-none focus:border-[#7B2D26]" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          {['city', 'state', 'postalCode'].map((key) => (
            <label key={key} className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">{key}</span>
              <input value={(values as Record<string, string>)[key] ?? ''} onChange={(e) => update(key as keyof CheckoutFormValues, e.target.value)} className="w-full rounded-sm border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 font-['Lora'] text-sm outline-none focus:border-[#7B2D26]" />
            </label>
          ))}
        </div>
        <label className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Notes</span>
          <textarea value={values.notes ?? ''} onChange={(e) => update('notes', e.target.value)} rows={4} className="w-full rounded-sm border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 font-['Lora'] text-sm outline-none focus:border-[#7B2D26]" />
        </label>
      </div>

      <aside className="space-y-5 rounded-sm border border-[#C9A66B] bg-[#FFF9F0] p-5">
        <div className="space-y-3 border-b border-[#C9A66B] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6F655B]">Order review</p>
          <div className="space-y-3">
            {cartProducts.map((product) => (
              <div key={product.id} className="flex gap-3">
                <img src={product.image} alt={product.name} crossOrigin="anonymous" className="h-16 w-12 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-['Lora'] text-sm text-[#2B2B2B]">{product.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6F655B]">{product.category}</p>
                </div>
                <p className="font-['Lora'] text-sm text-[#2B2B2B]">×{product.quantity}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm text-[#2B2B2B]">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex items-center justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'Complimentary' : `₹${shippingCost.toLocaleString('en-IN')}`}</span></div>
          <div className="flex items-center justify-between border-t border-[#C9A66B] pt-3 text-base font-semibold"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
        <div className="space-y-3 border-t border-[#C9A66B] pt-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6F655B]"><Truck className="h-4 w-4" /> Complimentary shipping over ₹12,000</div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6F655B]"><Shield className="h-4 w-4" /> Secure payment processing</div>
        </div>
        <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#61211C] disabled:cursor-not-allowed disabled:opacity-70">
          <CreditCard className="h-4 w-4" />
          {loading ? 'Processing' : 'Place order'}
        </button>
      </aside>
    </form>
  );
}

export default CheckoutForm;