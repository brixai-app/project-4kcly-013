import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Input,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/shadcn';
import {
  calculateTotals,
  formatPrice,
  getStock,
  removeFromCart,
  ROUTES,
  setCartQuantity,
  setOverlay,
  SHIPPING_POLICY,
  useMockStore,
} from '@/mock';

export function CartDrawer() {
  const navigate = useNavigate();
  const open = useMockStore((state) => state.overlays.cart);
  const cart = useMockStore((state) => state.cart);
  const products = useMockStore((state) => state.products);
  const storageError = useMockStore((state) => state.storageError);
  const returnFocus = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const totals = calculateTotals(cart, products);
  const unavailable = cart.some((line) =>
    !products.some((product) => product.id === line.productId)
    || line.quantity > getStock(line.productId, line.size, products),
  );
  const close = () => setOverlay('cart', false);
  const outline = 'border-[#cbbbad] bg-transparent text-[#49382e] hover:bg-[#eee5d9] focus-visible:ring-[#702f3c]';

  useEffect(() => {
    if (open && document.activeElement instanceof HTMLElement
      && !contentRef.current?.contains(document.activeElement)) {
      returnFocus.current = document.activeElement;
    }
  }, [open]);

  function changeQuantity(key: string, quantity: number) {
    const previous = cart.find((line) => line.key === key)?.quantity ?? 0;
    if (quantity === previous) return true;
    const result = setCartQuantity(key, quantity);
    if (!result.ok) {
      toast.error(result.error);
      return false;
    }
    toast.success(quantity > previous ? 'Your bag has been updated' : 'Quantity updated', {
      description: `${quantity} ${quantity === 1 ? 'pair' : 'pairs'} in this size.`,
    });
    return true;
  }

  function removeItem(key: string, name: string) {
    const result = removeFromCart(key);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${name} removed from your bag`);
    requestAnimationFrame(() => {
      const target = contentRef.current?.querySelector<HTMLElement>('[data-cart-quantity], [data-cart-empty]');
      target?.focus();
    });
  }

  function checkout() {
    const state = useMockStore.getState();
    if (!state.cart.length) {
      toast.error('Your bag is empty. Choose a pair before checking out.');
      return;
    }
    if (state.cart.some((line) => line.quantity > getStock(line.productId, line.size, state.products))) {
      toast.error('Availability has changed. Please adjust the highlighted items.');
      return;
    }
    close();
    navigate(ROUTES.checkout);
  }

  return (
    <Sheet open={open} onOpenChange={(value) => setOverlay('cart', value)}>
      <SheetContent
        ref={contentRef}
        side="right"
        className="flex h-[100dvh] w-full flex-col gap-0 overflow-hidden border-[#d9cbbd] bg-[#faf6ee] p-0 text-[#352a25] sm:max-w-[560px] [&>button]:right-5 [&>button]:top-6 [&>button]:text-[#49382e]"
        onOpenAutoFocus={() => {
          if (document.activeElement instanceof HTMLElement
            && !contentRef.current?.contains(document.activeElement)) {
            returnFocus.current = document.activeElement;
          }
        }}
        onCloseAutoFocus={(event) => {
          const target = returnFocus.current;
          if (target?.isConnected) {
            event.preventDefault();
            target.focus();
          }
        }}
      >
        <SheetHeader className="shrink-0 border-b border-[#dfd3c5] px-6 py-6 pr-16 text-left sm:px-8 sm:pr-16">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#796354]">A little piece of Jodhpur</p>
          <SheetTitle className="whitespace-normal break-words font-serif text-3xl font-normal text-[#352a25]">
            Your bag <span className="text-xl text-[#796354]">({totals.units})</span>
          </SheetTitle>
          <SheetDescription className="text-sm text-[#796354]">Handcrafted tradition, chosen by you.</SheetDescription>
        </SheetHeader>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Your bag contains {totals.units} {totals.units === 1 ? 'pair' : 'pairs'}. Total {formatPrice(totals.total)}.
          {unavailable ? ' Some items need an availability adjustment.' : ''}
        </p>

        {cart.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-12 text-center">
            <div className="mb-7 flex size-20 shrink-0 items-center justify-center rounded-full bg-[#eee5d9] text-[#702f3c]">
              <ShoppingBag className="size-8" strokeWidth={1.25} aria-hidden="true" />
            </div>
            <h2 className="font-serif text-3xl">A story waiting to begin.</h2>
            <p className="mb-8 mt-4 max-w-xs text-sm leading-7 text-[#796354]">Discover Mojris inspired by Rajasthan, with a little character in every stitch.</p>
            <Button asChild data-cart-empty className="min-h-12 bg-[#702f3c] px-7 text-[#fffaf2] hover:bg-[#55232e]">
              <Link to={ROUTES.catalog} onClick={close}>Explore the collection <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Link>
            </Button>
            <p className="mt-8 text-xs leading-6 text-[#796354]">Browser-only demo. No real payment or shipment.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <div className="px-5 py-2 sm:px-8">
                <Table className="w-full table-fixed">
                  <TableHeader className="sr-only">
                    <TableRow><TableHead>Products, sizes, quantities and prices</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((line) => {
                      const product = products.find((item) => item.id === line.productId);
                      const stock = getStock(line.productId, line.size, products);
                      const invalid = !product || line.quantity > stock;
                      const name = product?.name ?? 'Unavailable Mojri';
                      return (
                        <TableRow key={line.key} className="border-[#dfd3c5] hover:bg-transparent">
                          <TableCell className="whitespace-normal px-0 py-6">
                            <div className="flex min-w-0 items-start gap-4">
                              {product && (
                                <Link to={ROUTES.product(product.slug)} onClick={close} aria-label={`View ${name}`} className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702f3c]">
                                  <img src={product.images[0]?.src} alt={product.images[0]?.alt ?? name} loading="lazy" className="h-28 w-20 rounded-sm bg-[#eae0d2] object-cover sm:h-32 sm:w-24" />
                                </Link>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-1">
                                  <h3 className="min-w-0 whitespace-normal break-words font-serif text-lg leading-snug">
                                    {product ? <Link to={ROUTES.product(product.slug)} onClick={close} className="underline-offset-4 hover:underline">{name}</Link> : name}
                                  </h3>
                                  {product && <span className="text-sm font-medium">{formatPrice(product.price * line.quantity)}</span>}
                                </div>
                                <p className="mt-2 text-xs text-[#796354]">{product?.color ?? 'Unavailable colour'} <span aria-hidden="true">·</span> EU {line.size}</p>
                                {product && <p className="mt-1 text-xs text-[#796354]">{formatPrice(product.price)} / pair</p>}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${name}, EU ${line.size}`}>
                                    <Button type="button" variant="outline" size="icon" className={`size-10 shrink-0 ${outline}`} disabled={line.quantity <= 1} aria-label={`Decrease quantity of ${name}, EU ${line.size}`} onClick={() => changeQuantity(line.key, line.quantity - 1)}><Minus className="size-3.5" aria-hidden="true" /></Button>
                                    <Input
                                      key={`${line.key}:${line.quantity}:${stock}`}
                                      data-cart-quantity
                                      type="text"
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      defaultValue={line.quantity}
                                      aria-label={`Quantity of ${name}, EU ${line.size}`}
                                      aria-invalid={invalid}
                                      aria-describedby={invalid ? `stock-${line.key}` : undefined}
                                      className="h-10 w-12 border-[#cbbbad] bg-transparent px-1 text-center text-sm text-[#352a25] focus-visible:ring-[#702f3c]"
                                      onBlur={(event) => {
                                        const value = event.currentTarget.value.trim();
                                        const quantity = /^\d+$/.test(value) ? Number(value) : NaN;
                                        if (!Number.isSafeInteger(quantity) || quantity < 1) {
                                          toast.error('Enter a whole quantity of at least 1. Use Remove to delete a pair.');
                                          event.currentTarget.value = String(line.quantity);
                                        } else if (!changeQuantity(line.key, quantity)) {
                                          event.currentTarget.value = String(useMockStore.getState().cart.find((item) => item.key === line.key)?.quantity ?? line.quantity);
                                        }
                                      }}
                                      onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } }}
                                    />
                                    <Button type="button" variant="outline" size="icon" className={`size-10 shrink-0 ${outline}`} disabled={line.quantity >= stock} aria-label={`Increase quantity of ${name}, EU ${line.size}`} onClick={() => changeQuantity(line.key, line.quantity + 1)}><Plus className="size-3.5" aria-hidden="true" /></Button>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" className="size-10 shrink-0 text-[#796354] hover:bg-[#eee5d9] hover:text-[#702f3c]" aria-label={`Remove ${name}, EU ${line.size}, from your bag`} onClick={() => removeItem(line.key, name)}><Trash2 className="size-4" aria-hidden="true" /></Button>
                                </div>
                                {invalid && <p id={`stock-${line.key}`} className="mt-3 text-xs leading-5 text-[#702f3c]">{stock > 0 ? `Only ${stock} available in this size. Reduce your quantity to continue.` : 'This size is no longer available. Please remove it to continue.'}</p>}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex items-start gap-3 py-5 text-xs leading-6 text-[#796354]">
                  <Truck className="mt-1 size-4 shrink-0" aria-hidden="true" />
                  <p>Complimentary delivery from {formatPrice(SHIPPING_POLICY.freeAbove)}. {SHIPPING_POLICY.estimate}</p>
                </div>
              </div>
            </ScrollArea>

            <div className="sticky bottom-0 shrink-0 border-t border-[#dfd3c5] bg-[#f5eee4] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-8">
              {storageError && <p role="alert" className="mb-4 break-words text-xs leading-5 text-[#702f3c]">{storageError}</p>}
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-[#796354]">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#796354]">Estimated shipping</dt><dd>{totals.shipping === 0 ? 'Complimentary' : formatPrice(totals.shipping)}</dd></div>
              </dl>
              <Separator className="my-4 bg-[#dfd3c5]" />
              <div className="mb-4 flex items-center justify-between gap-4"><span className="font-serif text-xl">Total</span><span className="text-lg font-medium">{formatPrice(totals.total)}</span></div>
              <Button type="button" onClick={checkout} disabled={unavailable || !!storageError} className="min-h-12 w-full justify-between bg-[#702f3c] px-5 text-[#fffaf2] transition-colors hover:bg-[#55232e] disabled:opacity-50">Continue to demo checkout <ArrowRight className="size-4" aria-hidden="true" /></Button>
              <Button asChild variant="ghost" className="mt-1 min-h-11 w-full text-[#49382e] hover:bg-[#e9dfd2]"><Link to={ROUTES.catalog} onClick={close}>Continue shopping</Link></Button>
              <p className="text-center text-[11px] leading-5 text-[#796354]">Client-side mock checkout. No payment or shipment.</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;