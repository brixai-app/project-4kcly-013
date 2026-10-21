import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Info, Loader2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Separator, Switch } from '@/components/ui/shadcn';
import {
  useStore,
  getCartLines,
  getCartTotals,
  formatCurrency,
  formatDate,
  MAX_CART_QUANTITY,
} from '@/mock';
import type { Address, CheckoutErrors, PaymentMethod } from '@/mock';

export function CheckoutPage() {
  const cart = useStore(state => state.cart);
  const products = useStore(state => state.products);
  const draft = useStore(state => state.checkoutDraft);
  const checkoutKey = useStore(state => state.checkoutKey);
  const orders = useStore(state => state.orders);
  const lastOrderId = useStore(state => state.lastOrderId);
  const isPlacingOrder = useStore(state => state.isPlacingOrder);
  const storageStatus = useStore(state => state.storageStatus);
  const updateDraft = useStore(state => state.updateCheckoutDraft);
  const placeOrder = useStore(state => state.placeOrder);
  const openCart = useStore(state => state.openCart);
  const reducedMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const submissionLock = useRef(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const lines = useMemo(() => getCartLines(cart, products), [cart, products]);
  const totals = useMemo(() => getCartTotals(cart, products), [cart, products]);
  const order = orders.find(entry => entry.id === lastOrderId);
  const completedOrder = cart.length === 0 ? order : undefined;
  const stockChanged = lines.length !== cart.length || lines.some(line =>
    line.quantity > line.availableStock || line.quantity > MAX_CART_QUANTITY || line.quantity < 1,
  );
  const busy = submitting || isPlacingOrder;
  const summaryItems = completedOrder ? completedOrder.items : lines.map(line => ({
    productId: line.productId,
    name: line.product.name,
    size: line.size,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
    image: line.product.images[0],
  }));
  const summaryTotals = completedOrder?.totals ?? totals;

  function clearError(key: keyof CheckoutErrors) {
    setErrors(current => ({ ...current, [key]: undefined }));
    setSubmissionMessage('');
  }

  function updateAddress(key: keyof Omit<Address, 'country'>, value: string) {
    updateDraft({ address: { [key]: value } });
    clearError(key === 'line2' ? 'line1' : key);
  }

  function choosePayment(paymentMethod: PaymentMethod) {
    updateDraft({ paymentMethod });
    clearError('paymentMethod');
  }

  function addressField(
    key: keyof Omit<Address, 'country'>,
    label: string,
    autoComplete: string,
    options: { optional?: boolean; maxLength?: number; inputMode?: 'text' | 'tel' | 'numeric'; type?: string } = {},
  ) {
    const error = errors[key === 'line2' ? 'line1' : key];
    return (
      <div className="min-w-0 space-y-2">
        <label htmlFor={`checkout-${key}`} className="text-sm font-medium">
          {label}{options.optional && <span className="ml-2 font-normal text-muted-foreground">Optional</span>}
        </label>
        <Input
          id={`checkout-${key}`}
          name={key}
          autoComplete={autoComplete}
          type={options.type ?? 'text'}
          inputMode={options.inputMode}
          required={!options.optional}
          maxLength={options.maxLength ?? 100}
          value={draft.address[key]}
          onChange={event => updateAddress(key, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `checkout-${key}-error` : undefined}
          className="h-12 bg-background"
        />
        {error && <p id={`checkout-${key}-error`} className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionLock.current || busy) return;
    submissionLock.current = true;
    setSubmitting(true);
    setErrors({});
    setSubmissionMessage('');
    try {
      // The centralized action validates the latest inventory and atomically creates the demo order.
      const result = placeOrder(draft, checkoutKey);
      if (!result.ok || !result.order) {
        setErrors(result.errors ?? {});
        setSubmissionMessage(result.message);
        toast.error(result.message);
        requestAnimationFrame(() => {
          const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
          (target ?? formRef.current?.querySelector<HTMLElement>('[data-checkout-error]'))?.focus();
        });
        return;
      }
      toast.success(result.message);
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    } catch {
      const message = 'The simulated checkout could not finish. Review your bag before trying again.';
      setSubmissionMessage(message);
      toast.error(message);
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  }

  if (!cart.length && !completedOrder) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto flex min-h-[65vh] w-full max-w-[1600px] flex-col items-start justify-center gap-6 px-6 py-20 lg:px-12">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Your next chapter</p>
          <h1 className="font-serif text-4xl md:text-6xl">A little room for tradition.</h1>
          <p className="text-muted-foreground">Your bag is empty. Discover the Mojri collection before checking out.</p>
          <Button asChild className="h-12 bg-[#a83d29] px-6 text-white hover:bg-[#87301f]"><Link to="/catalog">Explore Mojris <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-background text-foreground"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-12 lg:py-16">
        <Link to="/catalog" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to the collection</Link>
        <header className="mb-10 mt-6 space-y-4 lg:mb-14">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Jootiya · The final stitch</p>
          <h1 className="break-words font-serif text-4xl md:text-6xl">{completedOrder ? 'A story, beautifully begun.' : 'Make it yours.'}</h1>
          <p className="text-muted-foreground">Simulated checkout. No real payment, shipment or backend request is made.</p>
        </header>

        {storageStatus === 'memory-only' && (
          <div role="status" className="mb-8 flex items-start gap-3 rounded-md border border-border bg-muted p-4 text-sm">
            <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>Browser storage is unavailable. Your bag and demo order remain available while this page stays open, but may be lost on refresh.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <section className="min-w-0 lg:col-span-7" aria-label={completedOrder ? 'Order confirmation' : 'Checkout details'}>
            {completedOrder ? (
              <div role="status" className="space-y-7 border-t border-border py-8">
                <CheckCircle2 className="h-10 w-10 text-[#a83d29] dark:text-[#edaa91]" aria-hidden="true" />
                <h2 className="font-serif text-3xl">Your demo order is confirmed.</h2>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">Order reference</p>
                  <p className="break-words text-2xl font-medium">{completedOrder.reference}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(completedOrder.createdAt)} · Simulated order</p>
                </div>
                <p className="leading-relaxed text-muted-foreground">No money was collected and nothing will be shipped. Your contact and address details have been cleared. This confirmation remains available when you return during this session; save the reference for your own records.</p>
                <Button asChild className="h-12 bg-[#a83d29] px-6 text-white hover:bg-[#87301f]"><Link to="/catalog">Continue exploring <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate className="space-y-10" aria-busy={busy}>
                <fieldset disabled={busy} className="min-w-0 space-y-6">
                  <legend className="mb-6 font-serif text-2xl">01 — Contact</legend>
                  <p className="text-sm leading-relaxed text-muted-foreground">Required fields are marked by their labels; only address line 2 is optional. Personal details stay in memory for this session only, are not saved with orders, and are never sent anywhere.</p>
                  <div className="space-y-2">
                    <label htmlFor="checkout-email" className="text-sm font-medium">Email address</label>
                    <Input id="checkout-email" name="email" type="email" autoComplete="email" required maxLength={254} value={draft.email} onChange={event => { updateDraft({ email: event.target.value }); clearError('email'); }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'checkout-email-error' : undefined} className="h-12 bg-background" />
                    {errors.email && <p id="checkout-email-error" className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  {addressField('phone', 'Indian mobile number', 'tel', { type: 'tel', inputMode: 'tel', maxLength: 20 })}
                </fieldset>
                <Separator />
                <fieldset disabled={busy} className="min-w-0 space-y-6">
                  <legend className="mb-6 font-serif text-2xl">02 — Shipping address</legend>
                  {addressField('fullName', 'Full name', 'shipping name')}
                  {addressField('line1', 'House / flat and street', 'shipping address-line1', { maxLength: 200 })}
                  {addressField('line2', 'Area / landmark', 'shipping address-line2', { optional: true, maxLength: 200 })}
                  <div className="grid min-w-0 gap-6 sm:grid-cols-2">
                    {addressField('city', 'City', 'shipping address-level2', { maxLength: 80 })}
                    {addressField('state', 'State / union territory', 'shipping address-level1', { maxLength: 80 })}
                    {addressField('postalCode', 'PIN code', 'shipping postal-code', { inputMode: 'numeric', maxLength: 6 })}
                    <div className="space-y-2"><label htmlFor="checkout-country" className="text-sm font-medium">Country</label><Input id="checkout-country" name="country" value="India" readOnly autoComplete="shipping country-name" className="h-12 bg-muted" /><p className="text-xs text-muted-foreground">Indian addresses only for this demo.</p></div>
                  </div>
                </fieldset>
                <Separator />
                <fieldset disabled={busy} className="min-w-0 space-y-5" aria-describedby="payment-description">
                  <legend className="mb-5 font-serif text-2xl">03 — A payment rehearsal</legend>
                  <p id="payment-description" className="text-sm text-muted-foreground">Choose a demo option. Do not enter card, bank or UPI details. No payment is processed.</p>
                  <div className="flex flex-wrap gap-3" role="group" aria-label="Simulated payment method">
                    <Button type="button" variant={draft.paymentMethod === 'demo-upi' ? 'default' : 'outline'} aria-pressed={draft.paymentMethod === 'demo-upi'} onClick={() => choosePayment('demo-upi')} className="h-auto min-h-11 whitespace-normal rounded-full px-5 py-3">{draft.paymentMethod === 'demo-upi' && <Check className="mr-2 h-4 w-4" />}Demo UPI</Button>
                    <Button type="button" variant={draft.paymentMethod === 'demo-card' ? 'default' : 'outline'} aria-pressed={draft.paymentMethod === 'demo-card'} onClick={() => choosePayment('demo-card')} className="h-auto min-h-11 whitespace-normal rounded-full px-5 py-3">{draft.paymentMethod === 'demo-card' && <Check className="mr-2 h-4 w-4" />}Demo card</Button>
                    <Button type="button" variant={draft.paymentMethod === 'demo-cod' ? 'default' : 'outline'} aria-pressed={draft.paymentMethod === 'demo-cod'} onClick={() => choosePayment('demo-cod')} className="h-auto min-h-11 whitespace-normal rounded-full px-5 py-3">{draft.paymentMethod === 'demo-cod' && <Check className="mr-2 h-4 w-4" />}Demo cash on delivery</Button>
                  </div>
                  {errors.paymentMethod && <p role="alert" className="text-sm text-destructive">{errors.paymentMethod}</p>}
                  <div className="flex items-start gap-3 rounded-md border border-border p-4">
                    <Switch id="checkout-acknowledgement" checked={draft.acceptedDemo} onCheckedChange={checked => { updateDraft({ acceptedDemo: checked }); clearError('acceptedDemo'); }} aria-invalid={Boolean(errors.acceptedDemo)} aria-describedby={errors.acceptedDemo ? 'checkout-acknowledgement-error' : undefined} className="mt-0.5 shrink-0" />
                    <label htmlFor="checkout-acknowledgement" className="cursor-pointer text-sm leading-relaxed">I understand this is a fictional browser-only order. No payment is collected and no goods will be delivered.</label>
                  </div>
                  {errors.acceptedDemo && <p id="checkout-acknowledgement-error" className="text-sm text-destructive">{errors.acceptedDemo}</p>}
                </fieldset>
                {(stockChanged || errors.cart || submissionMessage) && (
                  <div role="alert" tabIndex={-1} data-checkout-error className="space-y-3 rounded-md border border-destructive/40 p-4 text-sm">
                    <p>{errors.cart || (stockChanged ? 'Availability has changed. Review your bag and adjust quantities before continuing.' : submissionMessage)}</p>
                    {(stockChanged || errors.cart) && <Button type="button" variant="outline" onClick={openCart}>Review your bag</Button>}
                  </div>
                )}
                <Button type="submit" disabled={busy || stockChanged} className="h-auto min-h-14 w-full whitespace-normal bg-[#a83d29] px-6 py-4 text-white hover:bg-[#87301f]">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />}
                  {busy ? 'Placing simulated order…' : `Place demo order · ${formatCurrency(totals.total)}`}
                </Button>
                <p className="text-center text-xs leading-relaxed text-muted-foreground">No payment details. No account required. No real transaction.</p>
              </form>
            )}
          </section>

          <aside className="min-w-0 lg:col-span-5" aria-labelledby="checkout-summary-title">
            <div className="rounded-sm border border-border bg-muted/40 p-5 sm:p-8 lg:sticky lg:top-8">
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <h2 id="checkout-summary-title" className="font-serif text-2xl">{completedOrder ? 'Your order' : 'In your bag'}</h2>
                <span className="text-sm text-muted-foreground">{summaryTotals.itemCount} {summaryTotals.itemCount === 1 ? 'pair' : 'pairs'}</span>
              </div>
              <ul className="my-7 space-y-6" aria-label="Order items">
                {summaryItems.map(item => (
                  <li key={`${item.productId}:${item.size}`} className="flex min-w-0 items-start gap-4">
                    <img src={item.image.src} alt={item.image.alt} onError={event => { if (event.currentTarget.getAttribute('src') !== item.image.fallback) event.currentTarget.src = item.image.fallback; }} className="h-28 w-20 shrink-0 rounded-sm bg-muted object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="break-words font-serif text-lg">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">EU {item.size} · Quantity {item.quantity}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} / pair</p>
                      <p className="text-sm font-medium">{formatCurrency(item.lineTotal)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {!completedOrder && <Button type="button" variant="outline" className="mb-6 min-h-11 w-full" onClick={openCart}>Edit your bag</Button>}
              <Separator />
              <dl className="space-y-4 py-6 text-sm">
                <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{formatCurrency(summaryTotals.subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Demo shipping</dt><dd>{summaryTotals.shipping === 0 ? 'Complimentary' : formatCurrency(summaryTotals.shipping)}</dd></div>
                <div className="flex justify-between gap-4 border-t border-border pt-5 text-lg font-medium"><dt>Total <span className="text-xs font-normal text-muted-foreground">INR</span></dt><dd>{formatCurrency(summaryTotals.total)}</dd></div>
              </dl>
              {!completedOrder && totals.freeShippingRemaining > 0 && <p className="mb-5 text-xs leading-relaxed text-muted-foreground">Add {formatCurrency(totals.freeShippingRemaining)} for complimentary demo shipping.</p>}
              <div className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p>Illustrative products and pricing. The total is a simulation, not an amount charged.</p></div>
            </div>
          </aside>
        </div>
      </div>
    </motion.main>
  );
}

export default CheckoutPage;