import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  DialogDescription,
  DialogTitle,
  Separator,
  Sheet,
  SheetContent,
} from '@/components/ui/shadcn';
import {
  MAX_CART_QUANTITY,
  calculateTotals,
  formatCurrency,
  getCartLines,
  useStore,
} from '@/mock';

export function CartDrawer() {
  const cartOpen = useStore(state => state.cartOpen);
  const cart = useStore(state => state.cart);
  const products = useStore(state => state.products);
  const storageStatus = useStore(state => state.storageStatus);
  const setCartOpen = useStore(state => state.setCartOpen);
  const closeCart = useStore(state => state.closeCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const beginCheckout = useStore(state => state.beginCheckout);
  const reducedMotion = useReducedMotion();

  const lines = useMemo(() => getCartLines(cart, products), [cart, products]);
  const totals = useMemo(() => calculateTotals(lines), [lines]);
  const hasUnavailableItems = lines.length !== cart.length || lines.some(line =>
    line.quantity < 1 || line.quantity > Math.min(MAX_CART_QUANTITY, line.availableStock),
  );
  const duration = reducedMotion ? 0 : 0.2;

  const changeQuantity = (lineId: string, quantity: number) => {
    const result = updateQuantity(lineId, quantity);
    if (!result.ok) toast.error(result.message);
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex h-[100dvh] w-full flex-col gap-0 overflow-hidden border-l border-border bg-background p-0 text-foreground sm:max-w-[540px]"
      >
        <header className="shrink-0 px-6 pb-6 pt-9 sm:px-8">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Jootiya · Your edit
          </p>
          <DialogTitle className="pr-10 font-serif text-3xl font-normal leading-tight">
            The shopping bag
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Rajasthani silhouettes, selected by you. Review your sizes before simulated checkout.
          </DialogDescription>
          <p className="mt-4 text-xs text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
            {totals.itemCount} {totals.itemCount === 1 ? 'pair' : 'pairs'} in your bag
          </p>
        </header>

        <Separator />

        {cart.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center sm:px-8">
            <ShoppingBag className="mb-6 h-10 w-10 text-muted-foreground" strokeWidth={1} aria-hidden="true" />
            <h2 className="font-serif text-3xl leading-tight">A little room for tradition.</h2>
            <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
              Your bag is empty. Explore our Mojri edit and find a silhouette that feels like you.
            </p>
            <Button asChild className="mt-8 min-h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90">
              <Link to="/catalog" onClick={closeCart}>
                Explore the collection
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
              Browser-only demo. No real products or payments.
            </p>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8">
              <motion.ul layout={!reducedMotion} className="divide-y divide-border" aria-label="Items in your shopping bag">
                <AnimatePresence initial={false}>
                  {lines.map(line => {
                    const limit = Math.min(MAX_CART_QUANTITY, line.availableStock);
                    const unavailable = line.quantity > limit;
                    const image = line.product.images[0];
                    return (
                      <motion.li
                        key={line.id}
                        layout={!reducedMotion}
                        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration }}
                        className="grid min-w-0 grid-cols-[80px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-5"
                      >
                        {image ? (
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="aspect-[3/4] w-full rounded-sm bg-muted object-cover"
                            onError={event => {
                              const target = event.currentTarget;
                              if (target.getAttribute('src') !== image.fallback) {
                                target.src = image.fallback;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex aspect-[3/4] items-center justify-center bg-muted" role="img" aria-label={`${line.product.name} image unavailable`}>
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="whitespace-normal break-words font-serif text-xl leading-tight">
                            {line.product.name}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            EU {line.size} · {line.product.color}
                          </p>
                          <p className="mt-2 text-sm">{formatCurrency(line.unitPrice)} <span className="text-xs text-muted-foreground">/ pair</span></p>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-sm border border-border" role="group" aria-label={`Quantity for ${line.product.name}, EU ${line.size}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none"
                                disabled={line.quantity <= 1}
                                aria-label={`Decrease quantity of ${line.product.name}, EU ${line.size}`}
                                onClick={() => changeQuantity(line.id, line.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                              </Button>
                              <span className="min-w-6 text-center text-sm tabular-nums" aria-live="polite" aria-atomic="true">{line.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-none"
                                disabled={line.quantity >= limit}
                                aria-label={`Increase quantity of ${line.product.name}, EU ${line.size}`}
                                onClick={() => changeQuantity(line.id, line.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-muted-foreground hover:text-foreground"
                              aria-label={`Remove ${line.product.name}, EU ${line.size}, from your bag`}
                              onClick={() => {
                                removeFromCart(line.id);
                                toast.success(`${line.product.name} removed from your bag.`);
                              }}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground">
                              {unavailable ? 'Quantity exceeds demo stock.' : line.quantity >= limit ? 'Size quantity limit reached.' : `${line.availableStock} pairs in demo stock`}
                            </p>
                            <p className="text-sm font-medium tabular-nums">{formatCurrency(line.lineTotal)}</p>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </div>

            <footer className="max-h-[52dvh] shrink-0 overflow-y-auto border-t border-border bg-muted/30 px-6 py-6 sm:px-8">
              {hasUnavailableItems && (
                <p role="alert" className="mb-4 text-sm leading-relaxed text-destructive">
                  Some items are unavailable in the selected quantity. Reduce their quantity or remove them before checkout.
                </p>
              )}
              <div className="mb-5 flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>{totals.freeShippingRemaining > 0
                  ? `Add ${formatCurrency(totals.freeShippingRemaining)} for complimentary demo shipping within India.`
                  : 'Complimentary demo shipping within India.'}</p>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt>Subtotal</dt><dd className="tabular-nums">{formatCurrency(totals.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-muted-foreground">
                  <dt>Estimated shipping</dt><dd className="tabular-nums">{totals.shipping ? formatCurrency(totals.shipping) : 'Complimentary'}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-base font-medium">
                  <dt>Estimated total</dt>
                  <dd aria-live="polite" aria-atomic="true">
                    <motion.span key={totals.total} initial={{ opacity: reducedMotion ? 1 : 0.4 }} animate={{ opacity: 1 }} transition={{ duration }} className="inline-block tabular-nums">
                      {formatCurrency(totals.total)}
                    </motion.span>
                  </dd>
                </div>
              </dl>
              {hasUnavailableItems ? (
                <Button disabled className="mt-6 min-h-12 w-full">Review unavailable items</Button>
              ) : (
                <Button asChild className="mt-6 min-h-12 w-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                  <Link to="/checkout" onClick={() => { beginCheckout(); closeCart(); }}>
                    Continue to demo checkout
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" className="mt-2 min-h-11 w-full">
                <Link to="/catalog" onClick={closeCart}>Continue exploring</Link>
              </Button>
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                Simulated orders only. No backend or real payments.
              </p>
              {storageStatus === 'memory-only' && (
                <p role="status" className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Browser storage is unavailable. Your bag will only be kept while this page remains open.
                </p>
              )}
            </footer>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;