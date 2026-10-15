import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, ArrowRight, Truck, Percent, Info } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/mockData';
import type { CartItemResolved, ShippingMethod } from '@/types';
import QuantityStepper from './QuantityStepper';

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FREE_SHIPPING_THRESHOLD = 12000;

const defaultShipping: ShippingMethod = {
  id: 'standard',
  label: 'Standard',
  description: '3–5 business days',
  amount: 0,
  estimatedDaysMin: 3,
  estimatedDaysMax: 5,
};

function resolveCartItems(getResolvedItems: (p: typeof products) => CartItemResolved[]): CartItemResolved[] {
  try {
    return getResolvedItems(products) ?? [];
  } catch {
    return [];
  }
}

function formatCurrency(value: number, currency = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value.toFixed(0)}`;
  }
}

export function CartDrawer({ open = false, onOpenChange }: CartDrawerProps) {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, getResolvedItems, getTotals } = useCart();
  const [internalOpen, setInternalOpen] = React.useState<boolean>(open);

  const isControlled = typeof onOpenChange === 'function';
  const actualOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
    }
  };

  const items = resolveCartItems(getResolvedItems);
  const totals = getTotals(products, defaultShipping);
  const subtotal = totals?.subtotal ?? 0;
  const currency = totals?.currency ?? state?.currency ?? 'INR';
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeProgress =
    FREE_SHIPPING_THRESHOLD === 0 ? 0 : Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  const handleRemove = (id: string) => {
    removeItem(id);
    toast('Removed from cart', {
      description: 'The pair has been released back to the atelier.',
    });
  };

  const handleQuantityChange = (item: CartItemResolved, nextQty: number) => {
    const stock = item?.size?.stock ?? 0;
    const clamped = Math.max(1, Math.min(stock, nextQty));
    if (clamped !== nextQty) {
      toast('Limited stock', {
        description: `Only ${stock} in this size are available.`,
      });
    }
    updateQuantity(item.id, clamped);
  };

  const handleCheckout = () => {
    if (!items.length) {
      toast.error('Your cart is empty', {
        description: 'Curate at least one pair before proceeding to checkout.',
      });
      return;
    }
    handleOpenChange(false);
    navigate('/checkout');
  };

  const handleGoToShop = () => {
    handleOpenChange(false);
    navigate('/shop');
  };

  return (
    <Dialog.Root open={actualOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md border border-[#D9D1C7] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2E2B28] hover:bg-[#F9F6F2] transition-colors"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Cart
          {state?.items?.length ? (
            <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-sm bg-[#8B0000] px-1 text-[0.65rem] font-semibold text-white">
              {state.items.length}
            </span>
          ) : null}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-[#D9D1C7] bg-[#F9F6F2] shadow-2xl focus:outline-none">
          <header className="flex items-center justify-between border-b border-[#D9D1C7] bg-[#F9F6F2]/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#6F675E]">
                Jootiya Cart
              </span>
              <Dialog.Title className="font-['Playfair_Display'] text-xl font-light tracking-tight text-[#2E2B28]">
                Your curation
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D1C7] bg-white text-[#2E2B28] hover:bg-[#F9F6F2] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {!items.length ? (
              <div className="flex h-full flex-col items-start justify-center space-y-6">
                <div>
                  <p className="font-['Playfair_Display'] text-2xl font-light text-[#2E2B28]">
                    The atelier is waiting.
                  </p>
                  <p className="mt-2 text-sm text-[#6F675E]">
                    No pairs have been reserved yet. Discover sculpted silhouettes and archival
                    sneakers in the shop.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoToShop}
                  className="inline-flex items-center justify-center rounded-[16px] border border-[#8B0000] bg-[#8B0000] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#6F0000] transition-colors"
                >
                  Explore collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <ShippingProgressBar
                  subtotal={subtotal}
                  currency={currency}
                  remaining={remainingForFree}
                  progress={freeProgress}
                />

                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="rounded-[16px] border border-[#D9D1C7] bg-white p-3"
                      >
                        <CartLineItem
                          item={item}
                          onQuantityChange={(qty) => handleQuantityChange(item, qty)}
                          onRemove={() => handleRemove(item.id)}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            )}
          </div>

          <footer className="border-t border-[#D9D1C7] bg-[#F9F6F2]/95 px-6 py-4 backdrop-blur">
            <CartSummary
              hasItems={!!items.length}
              totals={totals}
              remainingForFree={remainingForFree}
              currency={currency}
              onCheckout={handleCheckout}
            />
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface CartLineItemProps {
  item: CartItemResolved;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
}

function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const product = item.product;
  const sizeLabel = item.size?.sizeLabel ?? '';
  const stock = item.size?.stock ?? 0;
  const primaryImage = product?.images?.[0];

  const isLowStock = stock > 0 && stock <= 3;

  return (
    <div className="grid grid-cols-[96px,1fr] gap-3">
      <div className="relative overflow-hidden rounded-[14px] border border-[#D9D1C7] bg-[#F9F6F2]">
        {primaryImage?.url ? (
          <img
            crossOrigin="anonymous"
            src={primaryImage.url}
            alt={primaryImage.alt ?? product?.name ?? 'Product image'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.7rem] text-[#6F675E]">
            Jootiya
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 border border-black/5" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-['Playfair_Display'] text-sm font-medium tracking-tight text-[#2E2B28]">
                {product?.name}
              </p>
              {product?.collection ? (
                <p className="mt-0.5 text-[0.7rem] uppercase tracking-[0.2em] text-[#6F675E]">
                  {product.collection}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-[#6F675E]">
                Size {sizeLabel}
                {stock > 0 ? ` • ${stock} in studio` : ' • Made to order'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D1C7] bg-white text-[#6F675E] hover:text-[#2E2B28] hover:bg-[#F9F6F2] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <QuantityStepper
              value={item.quantity}
              min={1}
              max={stock || 99}
              onChange={onQuantityChange}
            />
            <div className="text-right">
              <p className="text-sm font-semibold text-[#2E2B28]">
                {formatCurrency(item.lineTotal, item.currency)}
            </p>
              {isLowStock ? (
                <p className="mt-0.5 text-[0.7rem] text-[#8B0000]">
                  Almost gone in this size
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShippingProgressBarProps {
  subtotal: number;
  currency: string;
  remaining: number;
  progress: number;
}

function ShippingProgressBar({
  subtotal,
  currency,
  remaining,
  progress,
}: ShippingProgressBarProps) {
  const reached = subtotal >= FREE_SHIPPING_THRESHOLD;
  return (
    <div className="rounded-[16px] border border-[#D9D1C7] bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-[#8B0000]" />
        <p className="text-xs text-[#2E2B28]">
          {reached ? (
            <span className="font-medium">Complimentary delivery unlocked.</span>
          ) : (
            <>
              <span className="font-medium">Complimentary delivery at</span>{' '}
              {formatCurrency(FREE_SHIPPING_THRESHOLD, currency)}.
            </>
          )}
        </p>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E8DD]">
        <div
          className={cn(
            'h-full rounded-full bg-[#8B0000] transition-all',
            reached ? 'bg-[#8B0000]' : 'bg-[#8B0000]'
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {!reached ? (
        <p className="mt-1 text-[0.7rem] text-[#6F675E]">
          Add {formatCurrency(remaining, currency)} to enjoy complimentary standard shipping.
        </p>
      ) : null}
    </div>
  );
}

interface CartSummaryProps {
  hasItems: boolean;
  totals: ReturnType<typeof getTotals>;
  remainingForFree: number;
  currency: string;
  onCheckout: () => void;
}

function CartSummary({
  hasItems,
  totals,
  remainingForFree,
  currency,
  onCheckout,
}: CartSummaryProps) {
  const breakdown = [
    { label: 'Subtotal', value: totals?.subtotal ?? 0 },
    { label: 'Shipping', value: totals?.shipping ?? 0 },
    { label: 'Tax', value: totals?.tax ?? 0 },
  ];

  const showSavings = (totals?.discount ?? 0) > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#6F675E]">
        <div className="flex items-center gap-1">
          <Percent className="h-3.5 w-3.5" />
          <span>
            {remainingForFree <= 0
              ? 'You are eligible for atelier-standard complimentary shipping.'
              : 'Tax and duties calculated at checkout.'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[0.7rem]">
          <Info className="h-3.5 w-3.5" />
          <span>Secure checkout</span>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#D9D1C7] bg-white p-3">
        <dl className="space-y-1.5 text-sm text-[#2E2B28]">
          {breakdown.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <dt className="text-xs text-[#6F675E]">{row.label}</dt>
              <dd className="text-xs">{formatCurrency(row.value, currency)}</dd>
            </div>
          ))}
          {showSavings ? (
            <div className="flex items-center justify-between text-xs text-[#8B0000]">
              <dt>Savings</dt>
              <dd>-{formatCurrency(totals?.discount ?? 0, currency)}</dd>
            </div>
          ) : null}
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#D9D1C7] pt-2">
            <dt className="text-[0.8rem] font-semibold text-[#2E2B28]">Total</dt>
            <dd className="font-['Playfair_Display'] text-lg font-medium tracking-tight text-[#2E2B28]">
              {formatCurrency(totals?.grandTotal ?? 0, currency)}
            </dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        disabled={!hasItems}
        onClick={onCheckout}
        className={cn(
          'flex w-full items-center justify-center rounded-[16px] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
          hasItems
            ? 'bg-[#8B0000] text-white hover:bg-[#6F0000]'
            : 'cursor-not-allowed border border-[#D9D1C7] bg-[#F0E8DD] text-[#AFA79D]'
        )}
      >
        Proceed to checkout
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}

export default CartDrawer;