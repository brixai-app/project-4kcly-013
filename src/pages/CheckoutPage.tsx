import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Loader2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge, Button, Card, CardContent, DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger, Input, Label, Separator,
} from '@/components/ui/shadcn';
import {
  DEMO_NOTICE, EMPTY_ADDRESS, PAYMENT_METHODS, ROUTES, SHIPPING_POLICY,
  calculateTotals, formatPrice, placeOrder, prefillCustomer, retryPersistence,
  setOverlay, updateCheckout, useMockStore,
} from '@/mock';
import type { ShippingAddress, Totals } from '@/mock';

function TotalsBreakdown({ totals }: { totals: Readonly<Totals> }) {
  return (
    <dl className="space-y-4 text-sm">
      <div className="flex justify-between gap-4"><dt>Subtotal · {totals.units} {totals.units === 1 ? 'pair' : 'pairs'}</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
      <div className="flex justify-between gap-4"><dt>Simulated shipping</dt><dd>{totals.shipping ? formatPrice(totals.shipping) : 'Complimentary'}</dd></div>
      <Separator className="bg-current/15" />
      <div className="flex justify-between gap-4 text-lg font-medium"><dt>Demo total</dt><dd>{formatPrice(totals.total)}</dd></div>
      <p className="text-xs leading-relaxed opacity-75">All amounts are in INR. This is a demonstration total, not a charge.</p>
    </dl>
  );
}

export function CheckoutPage() {
  const state = useMockStore();
  const { checkout, cart, products, users, orders, storageError } = state;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);
  const orderReference = params.get('order');
  const hasOrderReference = params.has('order');
  const order = hasOrderReference ? orders.find((item) => item.id === orderReference) : undefined;
  const totals = calculateTotals(cart, products);
  const busy = checkout.submitting;
  const errors = checkout.errors;
  const surface = 'border-[#ded3c5] bg-[#fffdf8] text-[#352b28] shadow-none dark:border-[#59463e] dark:bg-[#2c2421] dark:text-[#f5ecdf]';
  const primary = 'bg-[#682f3e] text-white hover:bg-[#512331] focus-visible:ring-[#925568] dark:bg-[#e7c2bd] dark:text-[#35212a] dark:hover:bg-[#f1d4ce]';

  useEffect(() => {
    document.title = hasOrderReference ? 'Your demo receipt | Jootiya' : 'Guest checkout | Jootiya';
    if (hasOrderReference) headingRef.current?.focus();
  }, [hasOrderReference, orderReference]);

  function focusErrors() {
    requestAnimationFrame(() => {
      const invalid = formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]');
      if (invalid) invalid.focus();
      else errorRef.current?.focus();
    });
  }

  function fillSavedCustomer(id: string) {
    const result = prefillCustomer(id);
    if (!result.ok) { toast.error(result.error); return; }
    const address = useMockStore.getState().checkout.address;
    Object.keys(EMPTY_ADDRESS).forEach((key) => {
      const input = formRef.current?.elements.namedItem(key);
      if (input instanceof HTMLInputElement) input.value = address[key as keyof ShippingAddress];
    });
    toast.success('Saved shipping details filled in. Please review them.');
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || useMockStore.getState().checkout.submitting) return;
    submittingRef.current = true;
    try {
      const data = new FormData(event.currentTarget);
      const address: ShippingAddress = {
        fullName: String(data.get('fullName') ?? ''), email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''), line1: String(data.get('line1') ?? ''),
        line2: String(data.get('line2') ?? ''), city: String(data.get('city') ?? ''),
        state: String(data.get('state') ?? ''), postalCode: String(data.get('postalCode') ?? ''), country: 'India',
      };
      const saved = updateCheckout({ address });
      if (!saved.ok) { toast.error(saved.error); focusErrors(); return; }
      const result = placeOrder(useMockStore.getState().checkout.idempotencyKey);
      if (!result.ok) { toast.error(result.error); focusErrors(); return; }
      toast.success('Demo order confirmed. No payment was charged.');
      navigate(`${ROUTES.checkout}?order=${encodeURIComponent(result.value.id)}`, { replace: true });
    } catch {
      toast.error('Checkout could not finish. Please review your bag and try again.');
    } finally {
      submittingRef.current = false;
    }
  }

  function field(name: keyof ShippingAddress, label: string, autoComplete: string, type = 'text', optional = false) {
    const error = errors[name];
    return (
      <div className="min-w-0 space-y-2">
        <Label htmlFor={`shipping-${name}`} className="text-sm">{label}{optional && <span className="ml-2 text-xs opacity-65">Optional</span>}</Label>
        <Input
          id={`shipping-${name}`} name={name} type={type} autoComplete={autoComplete}
          defaultValue={checkout.address[name]} required={!optional} readOnly={name === 'country'}
          aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : name === 'phone' ? 'phone-hint' : undefined}
          inputMode={name === 'postalCode' ? 'numeric' : name === 'phone' ? 'tel' : name === 'email' ? 'email' : undefined}
          maxLength={name === 'postalCode' ? 6 : name === 'email' ? 254 : name === 'phone' ? 20 : name === 'line1' || name === 'line2' ? 200 : 100}
          className="h-12 border-[#d8cbbd] bg-transparent text-base focus-visible:ring-[#925568] dark:border-[#705c50]"
          onBlur={(event) => {
            if (name === 'country') return;
            const result = updateCheckout({ address: { [name]: event.currentTarget.value } });
            if (!result.ok) toast.error(result.error);
          }}
        />
        {name === 'phone' && !error && <p id="phone-hint" className="text-xs opacity-70">Indian mobile number; +91 is optional.</p>}
        {error && <p id={`${name}-error`} className="text-sm text-[#8c3048] dark:text-[#f1afb9]">{error}</p>}
      </div>
    );
  }

  if (hasOrderReference && !order) {
    return (
      <section className="w-full bg-[#f5efe5] px-6 py-24 text-[#352b28] dark:bg-[#211c19] dark:text-[#f5ecdf] lg:px-12">
        <p className="mb-5 text-xs uppercase tracking-[0.24em]">Jootiya · browser-saved receipts</p>
        <h1 ref={headingRef} tabIndex={-1} className="font-serif text-4xl outline-none md:text-6xl">This receipt is not available.</h1>
        <p className="mt-6 max-w-prose leading-relaxed opacity-75">The reference may be incorrect, or this order was saved in a different browser. Receipts are stored only on the device where the demo order was placed.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button asChild className={primary}><Link to={ROUTES.catalog}>Explore the collection</Link></Button>
          {cart.length > 0 && <Button asChild variant="outline"><Link to={ROUTES.checkout}>Return to checkout</Link></Button>}
        </div>
      </section>
    );
  }

  if (order) {
    return (
      <section className="w-full bg-[#f5efe5] text-[#352b28] dark:bg-[#211c19] dark:text-[#f5ecdf]">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-24">
          <CheckCircle2 className="mb-6 h-10 w-10 text-[#682f3e] dark:text-[#e7c2bd]" aria-hidden="true" />
          <Badge variant="outline" className="mb-5 border-current/25 text-inherit">Demonstration confirmed</Badge>
          <h1 ref={headingRef} tabIndex={-1} className="font-serif text-4xl outline-none md:text-6xl">A little piece of Jodhpur.</h1>
          <p className="mt-5 max-w-prose leading-relaxed opacity-80">Thank you, {order.address.fullName}. Your demo receipt is saved in this browser. No payment is charged and no shipment is initiated. No confirmation email is sent.</p>
          <p className="mt-5 break-all text-xs opacity-70">Reference: {order.id} · <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <Card className={`${surface} min-w-0 lg:col-span-7`}>
              <CardContent className="space-y-7 p-6 md:p-8">
                <h2 className="font-serif text-2xl">Your chosen pairs</h2>
                {order.items.map((item) => (
                  <div key={`${item.productId}:${item.size}`} className="flex min-w-0 gap-4 border-b border-current/10 pb-6">
                    <img src={item.image} alt={item.name} className="h-28 w-20 shrink-0 rounded-sm bg-[#eadfce] object-cover" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Link to={ROUTES.product(item.slug)} className="font-serif text-xl underline-offset-4 hover:underline">{item.name}</Link>
                      <p className="text-sm opacity-75">{item.color} · EU {item.size} · Quantity {item.quantity}</p>
                      <p className="text-xs opacity-70">{item.artisanName}</p>
                      <p className="text-sm">{formatPrice(item.unitPrice)} per pair · {formatPrice(item.lineTotal)}</p>
                    </div>
                  </div>
                ))}
                <TotalsBreakdown totals={order.totals} />
              </CardContent>
            </Card>
            <div className="min-w-0 space-y-6 lg:col-span-5">
              <Card className={surface}>
                <CardContent className="space-y-6 p-6 md:p-8">
                  <h2 className="font-serif text-2xl">Delivery details · demo only</h2>
                  <address className="break-words text-sm not-italic leading-7">
                    {order.address.fullName}<br />{order.address.line1}<br />
                    {order.address.line2 && <>{order.address.line2}<br /></>}
                    {order.address.city}, {order.address.state} {order.address.postalCode}<br />
                    {order.address.country}<br />{order.address.phone}<br />{order.address.email}
                  </address>
                  <Separator className="bg-current/15" />
                  <p className="text-sm leading-relaxed"><strong>{PAYMENT_METHODS.find((method) => method.id === order.paymentMethod)?.label ?? 'Demo payment'}</strong><br />Status: simulated. No money collected.</p>
                </CardContent>
              </Card>
              <Button asChild className={`${primary} h-12 w-full`}><Link to={ROUTES.catalog}>Continue shopping <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <p className="text-xs leading-relaxed opacity-70">Keep this URL to revisit your receipt in this browser. Clearing site data removes saved orders.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!cart.length) {
    return (
      <section className="w-full bg-[#f5efe5] px-6 py-24 text-[#352b28] dark:bg-[#211c19] dark:text-[#f5ecdf] lg:px-12">
        <ShoppingBag className="mb-6 h-9 w-9" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-6xl">Your next heirloom awaits.</h1>
        <p className="mt-5 leading-relaxed opacity-75">Your bag is empty. Choose a pair and a size before checking out.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild className={primary}><Link to={ROUTES.catalog}>Discover the collection <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          {checkout.lastOrderId && <Button asChild variant="outline"><Link to={`${ROUTES.checkout}?order=${encodeURIComponent(checkout.lastOrderId)}`}>View last demo receipt</Link></Button>}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f5efe5] text-[#352b28] dark:bg-[#211c19] dark:text-[#f5ecdf]">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-12 lg:py-20">
        <Link to={ROUTES.catalog} className="mb-8 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to the collection</Link>
        <p className="text-xs uppercase tracking-[0.24em]">A considered purchase</p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl">The final details.</h1>
        <p className="mt-5 max-w-prose text-sm leading-7 opacity-80">Guest checkout, entirely in your browser. No payment is charged and no shipment is initiated. Never enter real card or UPI credentials.</p>
        <div ref={errorRef} tabIndex={-1} aria-live="polite" className="mt-6 space-y-2 outline-none">
          {(storageError || errors.storage) && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-[#a36b58] p-4 text-sm">
              <p className="min-w-0 flex-1">{storageError || errors.storage} Your bag has not been intentionally cleared.</p>
              <Button type="button" variant="outline" onClick={() => { const result = retryPersistence(); if (!result.ok) toast.error(result.error); else toast.success('Saved data reloaded. Please review checkout.'); }}>Retry storage</Button>
            </div>
          )}
          {errors.cart && <p role="alert" className="text-sm text-[#8c3048] dark:text-[#f1afb9]">{errors.cart} <Button variant="link" className="text-inherit underline" onClick={() => setOverlay('cart', true)}>Review bag</Button></p>}
          {Object.keys(errors).some((key) => key !== 'storage' && key !== 'cart') && <p role="alert" className="text-sm text-[#8c3048] dark:text-[#f1afb9]">Please check the highlighted fields below.</p>}
        </div>
        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <form ref={formRef} onSubmit={submit} noValidate aria-busy={busy} className="min-w-0 space-y-6 lg:col-span-7">
            <Card className={surface}>
              <CardContent className="p-6 md:p-8">
                <div className="mb-8 flex w-full flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl">01 / Shipping details</h2>
                  {users.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button type="button" variant="outline" disabled={busy}>Use saved customer <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="max-h-72 max-w-[calc(100vw-3rem)] overflow-y-auto">
                        {users.map((user) => <DropdownMenuItem key={user.id} onSelect={() => fillSavedCustomer(user.id)} className="flex flex-col items-start gap-1"><span>{user.name}</span><span className="break-all text-xs opacity-70">{user.email}</span></DropdownMenuItem>)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <fieldset disabled={busy} className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
                  <legend className="sr-only">Indian shipping address</legend>
                  {field('fullName', 'Full name', 'shipping name')}
                  {field('email', 'Email address', 'email', 'email')}
                  {field('phone', 'Mobile number', 'shipping tel', 'tel')}
                  {field('country', 'Country', 'shipping country-name')}
                  <div className="min-w-0 sm:col-span-2">{field('line1', 'Street address', 'shipping address-line1')}</div>
                  <div className="min-w-0 sm:col-span-2">{field('line2', 'Apartment, landmark or building', 'shipping address-line2', 'text', true)}</div>
                  {field('city', 'City', 'shipping address-level2')}
                  {field('state', 'State / union territory', 'shipping address-level1')}
                  {field('postalCode', 'PIN code', 'shipping postal-code')}
                </fieldset>
                <p className="mt-6 text-xs leading-relaxed opacity-70">India-only demo checkout. Details are saved locally on this device, not sent to a server. Use fictional contact information for this demonstration.</p>
              </CardContent>
            </Card>
            <Card className={surface}>
              <CardContent className="space-y-6 p-6 md:p-8">
                <h2 className="font-serif text-2xl">02 / Simulated payment</h2>
                <div className="grid gap-3" role="group" aria-label="Choose a demonstration payment method" aria-describedby="payment-notice">
                  {PAYMENT_METHODS.map((method) => (
                    <Button key={method.id} type="button" variant="outline" disabled={busy} aria-pressed={checkout.paymentMethod === method.id}
                      className={`h-auto min-h-20 justify-start gap-4 whitespace-normal px-5 py-4 text-left transition-colors ${checkout.paymentMethod === method.id ? 'border-[#682f3e] bg-[#f0e1dd] text-[#502332] hover:bg-[#e9d6d0] dark:border-[#e7c2bd] dark:bg-[#493038] dark:text-[#f5ecdf]' : 'border-current/20 bg-transparent hover:bg-[#ece2d5] dark:hover:bg-[#3c302a]'}`}
                      onClick={() => { const result = updateCheckout({ paymentMethod: method.id }); if (!result.ok) toast.error(result.error); }}>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current" aria-hidden="true">{checkout.paymentMethod === method.id && <Check className="h-3 w-3" />}</span>
                      <span className="min-w-0"><span className="block text-sm font-medium">{method.label}</span><span className="mt-1 block text-xs font-normal leading-relaxed opacity-80">{method.description}</span></span>
                    </Button>
                  ))}
                </div>
                {errors.paymentMethod && <p role="alert" className="text-sm text-[#8c3048] dark:text-[#f1afb9]">{errors.paymentMethod}</p>}
                <p id="payment-notice" className="text-xs leading-relaxed opacity-75">Every option is simulated. No card number, security code, UPI ID or bank details are requested.</p>
                <Button type="submit" disabled={busy} className={`${primary} h-14 w-full whitespace-normal px-5`}>
                  {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving demo order…</> : <>Place demo order · {formatPrice(totals.total)} <ArrowRight className="ml-2 h-4 w-4 shrink-0" /></>}
                </Button>
                <p className="text-xs leading-relaxed opacity-70">{DEMO_NOTICE}</p>
              </CardContent>
            </Card>
          </form>
          <aside aria-label="Live order summary" className="min-w-0 lg:sticky lg:top-24 lg:col-span-5">
            <Card className={surface}>
              <CardContent className="space-y-7 p-6 md:p-8">
                <div className="flex w-full items-center justify-between gap-3"><h2 className="font-serif text-2xl">Your selection</h2><Button type="button" variant="link" className="shrink-0 text-inherit underline underline-offset-4" onClick={() => setOverlay('cart', true)}>Edit bag</Button></div>
                <ul className="space-y-6">
                  {cart.map((line) => {
                    const product = products.find((item) => item.id === line.productId);
                    return <li key={line.key} className="flex min-w-0 gap-4">
                      {product && <Link to={ROUTES.product(product.slug)} className="shrink-0"><img src={product.images[0].src} alt={product.images[0].alt} className="h-28 w-20 rounded-sm bg-[#eadfce] object-cover" /></Link>}
                      <div className="min-w-0 flex-1 space-y-2">
                        <h3 className="break-words font-serif text-xl">{product ? <Link to={ROUTES.product(product.slug)} className="underline-offset-4 hover:underline">{product.name}</Link> : 'Unavailable product'}</h3>
                        <p className="text-sm opacity-75">{product?.color} · EU {line.size} · Qty {line.quantity}</p>
                        <p className="text-sm">{product ? formatPrice(product.price * line.quantity) : 'Please remove this item from your bag.'}</p>
                      </div>
                    </li>;
                  })}
                </ul>
                <Separator className="bg-current/15" />
                <TotalsBreakdown totals={totals} />
                <p className="text-xs leading-relaxed opacity-75">Complimentary simulated shipping on orders from {formatPrice(SHIPPING_POLICY.freeAbove)}; otherwise {formatPrice(SHIPPING_POLICY.fee)}. {SHIPPING_POLICY.estimate}</p>
                <div className="flex items-start gap-3 rounded-md bg-[#f1e8dc] p-4 dark:bg-[#3b2f29]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><p className="text-xs leading-relaxed">Browser-only checkout. Your receipt remains available after refreshing, provided site storage is retained.</p></div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;