import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Truck, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import type {
  CheckoutFormState,
  ShippingMethod,
  ShippingMethodId,
  PaymentMethodId,
  CheckoutValidationError,
  CartTotals,
} from '@/types';

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Signature on delivery, climate-compensated ground shipping.',
    amount: 0,
    estimatedDaysMin: 4,
    estimatedDaysMax: 7,
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Priority dispatch with next-business-day handling.',
    amount: 990,
    estimatedDaysMin: 1,
    estimatedDaysMax: 3,
  },
];

const initialForm: CheckoutFormState = {
  shipping: {
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
  },
  shippingMethodId: 'standard',
  paymentMethodId: 'card',
  agreeToTerms: false,
  subscribeToNewsletter: true,
};

function validateEmail(value: string): boolean {
  if (!value) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

function validatePostalCode(value: string): boolean {
  if (!value) return false;
  const cleaned = value.replace(/\s+/g, '');
  return cleaned.length >= 4 && cleaned.length <= 10;
}

function validateRequired(value: string): boolean {
  return value.trim().length > 1;
}

function getFieldError(field: string, value: string): string {
  if (field === 'email') {
    if (!value) return 'Email is required';
    if (!validateEmail(value)) return 'Enter a valid email address';
    return '';
  }
  if (field === 'postalCode') {
    if (!value) return 'Postal code is required';
    if (!validatePostalCode(value)) return 'Enter a valid postal or ZIP code';
    return '';
  }
  if (['fullName', 'addressLine1', 'city', 'state', 'country'].includes(field)) {
    if (!validateRequired(value)) return 'This field is required';
  }
  if (field === 'phone' && !value) {
    return 'Phone number is required for delivery updates';
  }
  return '';
}

export interface CheckoutProps {
  className?: string;
}

export function Checkout({ className = '' }: CheckoutProps) {
  const navigate = useNavigate();
  const cart = useCart();
  const [form, setForm] = useState<CheckoutFormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const resolvedItems = useMemo(() => cart.getResolvedItems(products), [cart, cart.state.items]);
  const activeShipping = useMemo<ShippingMethod | undefined>(
    () => shippingMethods.find(m => m.id === form.shippingMethodId),
    [form.shippingMethodId]
  );
  const totals: CartTotals = useMemo(
    () => cart.getTotals(products, activeShipping),
    [cart, cart.state.items, activeShipping]
  );

  useEffect(() => {
    const nextErrors: Record<string, string> = {};
    Object.entries(form.shipping).forEach(([key, value]) => {
      const message = getFieldError(key, value ?? '');
      if (message) nextErrors[key] = message;
    });
    if (!form.agreeToTerms) {
      nextErrors.agreeToTerms = 'You must agree to the terms to complete your order';
    }
    setErrors(nextErrors);
  }, [form]);

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleFieldChange = (field: keyof CheckoutFormState['shipping'], value: string) => {
    setForm(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: value,
      },
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleShippingMethodChange = (id: ShippingMethodId) => {
    setForm(prev => ({ ...prev, shippingMethodId: id }));
  };

  const handlePaymentMethodChange = (id: PaymentMethodId) => {
    setForm(prev => ({ ...prev, paymentMethodId: id }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      addressLine1: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      agreeToTerms: true,
    });
    if (!isFormValid) {
      const list: CheckoutValidationError[] = Object.entries(errors).map(([field, message]) => ({
        field,
        message,
      }));
      toast.error('Please correct the highlighted details.', {
        description: list[0]?.message ?? 'Some required fields are missing or invalid.',
      });
      return;
    }
    if (resolvedItems.length === 0) {
      toast.error('Your cart is empty', {
        description: 'Add a pair to your cart before checking out.',
      });
      navigate('/shop');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      const orderId = `JT-${Math.floor(Math.random() * 899999 + 100000)}`;
      cart.clearCart();
      toast.success('Order placed with Jootiya', {
        description: `Your order ${orderId} has been confirmed. A confirmation email has been sent to ${form.shipping.email}.`,
      });
      setForm(initialForm);
      navigate('/');
    } catch {
      toast.error('Unable to complete checkout', {
        description: 'Please try again in a moment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field: string) => {
    if (!touched[field]) return null;
    const message = errors[field];
    if (!message) return null;
    return (
      <p className="mt-1 text-xs text-[#8B0000] flex items-center gap-1">
        <Info className="h-3 w-3" />
        <span>{message}</span>
      </p>
    );
  };

  return (
    <div className={cn('min-h-screen bg-[#F9F6F2] flex flex-col', className)}>
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 pt-28 pb-16 flex-1">
        <div className="grid grid-cols-12 gap-10 lg:gap-12">
          <section className="col-span-12 lg:col-span-7 space-y-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6F675E]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to curation</span>
            </button>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-[#6F675E]">
                Checkout
              </p>
              <h1 className="font-[Playfair Display] text-4xl md:text-5xl tracking-tight text-[#2E2B28]">
                The final fitting.
              </h1>
              <p className="text-sm md:text-base text-[#6F675E] max-w-xl">
                A few refined details and your Jootiya pair is ready to leave the atelier.
                Shipping is fully insured &amp; carbon-aware.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="border border-[#D9D1C7] rounded-2xl bg-[#FFFFFF]/80 backdrop-blur-sm p-6 md:p-7 space-y-6">
                <h2 className="font-[Playfair Display] text-xl tracking-tight text-[#2E2B28]">
                  Shipping details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={form.shipping.fullName}
                      onChange={e => handleFieldChange('fullName', e.target.value)}
                      onBlur={() => handleBlur('fullName')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="Name on the doorbell"
                    />
                    {renderError('fullName')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.shipping.email}
                      onChange={e => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="For order confirmations"
                    />
                    {renderError('email')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.shipping.phone}
                      onChange={e => handleFieldChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="For delivery updates"
                    />
                    {renderError('phone')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Country / Region
                    </label>
                    <input
                      type="text"
                      value={form.shipping.country}
                      onChange={e => handleFieldChange('country', e.target.value)}
                      onBlur={() => handleBlur('country')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                    />
                    {renderError('country')}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Address line 1
                    </label>
                    <input
                      type="text"
                      value={form.shipping.addressLine1}
                      onChange={e => handleFieldChange('addressLine1', e.target.value)}
                      onBlur={() => handleBlur('addressLine1')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="Apartment, suite, floor"
                    />
                    {renderError('addressLine1')}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Address line 2
                    </label>
                    <input
                      type="text"
                      value={form.shipping.addressLine2 ?? ''}
                      onChange={e => handleFieldChange('addressLine2', e.target.value)}
                      onBlur={() => handleBlur('addressLine2')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="Building, landmark (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.shipping.city}
                      onChange={e => handleFieldChange('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                    />
                    {renderError('city')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={form.shipping.state}
                      onChange={e => handleFieldChange('state', e.target.value)}
                      onBlur={() => handleBlur('state')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                    />
                    {renderError('state')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={form.shipping.postalCode}
                      onChange={e => handleFieldChange('postalCode', e.target.value)}
                      onBlur={() => handleBlur('postalCode')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                    />
                    {renderError('postalCode')}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-[0.16em] uppercase text-[#6F675E]">
                      Notes to atelier
                    </label>
                    <input
                      type="text"
                      value={form.shipping.notes ?? ''}
                      onChange={e => handleFieldChange('notes', e.target.value)}
                      onBlur={() => handleBlur('notes')}
                      className="mt-1 w-full rounded-xl border border-[#D9D1C7] bg-[#F9F6F2] px-3 py-2.5 text-sm text-[#2E2B28] placeholder:text-[#B1A89E] focus:outline-none focus:ring-1 focus:ring-[#8B0000]/80"
                      placeholder="Gate code, delivery preferences (optional)"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#D9D1C7] rounded-2xl bg-[#FFFFFF]/80 backdrop-blur-sm p-6 md:p-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="font-[Playfair Display] text-lg tracking-tight text-[#2E2B28]">
                      Shipping method
                    </h2>
                    <div className="space-y-3">
                      {shippingMethods.map(method => {
                        const active = form.shippingMethodId === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handleShippingMethodChange(method.id)}
                            className={cn(
                              'w-full text-left border rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition-colors',
                              active
                                ? 'border-[#8B0000] bg-[#8B0000]/5'
                                : 'border-[#D9D1C7] hover:border-[#8B0000]/60'
                            )}
                          >
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-[#2E2B28] flex items-center gap-2">
                                <Truck className="h-4 w-4 text-[#6F675E]" />
                                {method.label}
                              </p>
                              <p className="text-xs text-[#6F675E]">{method.description}</p>
                              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6F675E]">
                                {method.estimatedDaysMin}–{method.estimatedDaysMax} business days
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-[#2E2B28]">
                              {method.amount === 0 ? 'Complimentary' : `₹${(method.amount / 100).toFixed(2)}`}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-[Playfair Display] text-lg tracking-tight text-[#2E2B28]">
                      Payment
                    </h2>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('card')}
                        className={cn(
                          'w-full text-left border rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition-colors',
                          form.paymentMethodId === 'card'
                            ? 'border-[#8B0000] bg-[#8B0000]/5'
                            : 'border-[#D9D1C7] hover:border-[#8B0000]/60'
                        )}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#2E2B28] flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#6F675E]" />
                            Card at checkout
                          </p>
                          <p className="text-xs text-[#6F675E]">
                            Secure payment is simulated in this atelier preview.
                          </p>
                        </div>
                        <Shield className="h-4 w-4 text-[#6F675E]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePaymentMethodChange('cod')}
                        className={cn(
                          'w-full text-left border rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition-colors',
                          form.paymentMethodId === 'cod'
                            ? 'border-[#8B0000] bg-[#8B0000]/5'
                            : 'border-[#D9D1C7] hover:border-[#8B0000]/60'
                        )}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#2E2B28]">Cash on delivery</p>
                          <p className="text-xs text-[#6F675E]">
                            Settle upon arrival with our delivery partner.
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="pt-2 space-y-3">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreeToTerms}
                          onChange={e =>
                            setForm(prev => ({ ...prev, agreeToTerms: e.target.checked }))
                          }
                          onBlur={() => handleBlur('agreeToTerms')}
                          className="mt-0.5 h-4 w-4 rounded border-[#D9D1C7] text-[#8B0000] focus:ring-[#8B0000]"
                        />
                        <span className="text-xs text-[#2E2B28] leading-relaxed">
                          I confirm that my shipping details are correct and agree to Jootiya&apos;s
                          atelier terms of sale and delivery.
                        </span>
                      </label>
                      {renderError('agreeToTerms')}
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.subscribeToNewsletter}
                          onChange={e =>
                            setForm(prev => ({ ...prev, subscribeToNewsletter: e.target.checked }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-[#D9D1C7] text-[#8B0000] focus:ring-[#8B0000]"
                        />
                        <span className="text-xs text-[#6F675E] leading-relaxed">
                          Receive occasional drop alerts and editorial stories from Jootiya. No
                          seasonal spam, only considered releases.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6F675E] hover:text-[#2E2B28]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue browsing</span>
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || submitting || resolvedItems.length === 0}
                  className={cn(
                    'inline-flex items-center justify-center gap-3 rounded-full px-8 py-3 text-xs font-semibold tracking-[0.26em] uppercase transition-colors',
                    'bg-[#8B0000] text-[#FFFFFF]',
                    'hover:bg-[#6F0000]',
                    (submitting || !isFormValid || resolvedItems.length === 0) &&
                      'opacity-70 cursor-not-allowed'
                  )}
                >
                  <span>{submitting ? 'Processing' : 'Place order'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </section>

          <aside className="col-span-12 lg:col-span-5 lg:border-l lg:border-[#D9D1C7] lg:pl-8 space-y-6 lg:space-y-7">
            <div className="border border-[#D9D1C7] rounded-2xl bg-[#FFFFFF] p-5 md:p-6 space-y-4">
              <h2 className="font-[Playfair Display] text-lg tracking-tight text-[#2E2B28]">
                Atelier summary
              </h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {resolvedItems.length === 0 && (
                  <p className="text-sm text-[#6F675E]">
                    Your tray is empty. Curate a pair from the shop before finalising checkout.
                  </p>
                )}
                {resolvedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border-b last:border-b-0 border-[#F0E7DC] pb-3 last:pb-0"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#D9D1C7] bg-[#F9F6F2]">
                      <img
                        src={item.product.images[0]?.url ?? 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85'}
                        crossOrigin="anonymous"
                        alt={item.product.images[0]?.alt ?? item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-[#2E2B28] line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#6F675E]">
                        {item.size.sizeLabel} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#2E2B28]">
                      ₹{(item.lineTotal / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-2 text-sm text-[#6F675E]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{(totals.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? 'Complimentary' : `₹${(totals.shipping / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>₹{(totals.tax / 100).toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#8B0000]">
                    <span>Atelier courtesy</span>
                    <span>-₹{(totals.discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#E5DCD1] flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#6F675E]">Total</span>
                  <span className="text-base font-semibold text-[#2E2B28]">
                    ₹{(totals.grandTotal / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#6F675E]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  Every Jootiya pair ships with breathable dust bags and an archival box, designed to
                  live on your shelf, not in recycling.
                </span>
              </div>
            </div>

            <div className="border border-dashed border-[#D9D1C7] rounded-2xl bg-[#F9F6F2] p-4 md:p-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[#6F675E]">
                Atelier assurance
              </p>
              <ul className="space-y-2 text-xs text-[#6F675E]">
                <li>· Complimentary returns on unworn pairs within 14 days of delivery.</li>
                <li>· One-time size exchange for all sneakers and loafers in core collections.</li>
                <li>· Dedicated concierge for care, fit, and styling questions post-purchase.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;