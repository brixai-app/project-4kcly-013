import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Footprints, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/shadcn';
import {
  addToCart,
  formatPrice,
  ROUTES,
  setProductSelection,
  useMockStore,
  type Product,
} from '@/mock';

/** Browser-only demo purchases are handled and persisted exclusively by @/mock. */
export function ProductCard({
  product,
  className = '',
  imageClassName = '',
  aspect = 'portrait',
  priority = false,
}: {
  product: Product;
  className?: string;
  imageClassName?: string;
  aspect?: 'portrait' | 'square' | 'landscape' | 'tall';
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const reducedMotion = useReducedMotion();
  const headingId = useId();
  const guidanceId = useId();
  const currentProduct = useMockStore((state) =>
    state.products.find((item) => item.id === product.id),
  );
  const cart = useMockStore((state) => state.cart);
  const selectedSize = useMockStore(
    (state) => state.selections[product.id]?.size ?? null,
  );
  const item = currentProduct ?? product;
  const image = item.images[0];
  const productPath = ROUTES.product(item.slug);
  const remaining = (size: Product['variants'][number]['size']) => {
    if (!currentProduct) return 0;
    const stock = currentProduct.variants.find((variant) => variant.size === size)?.stock ?? 0;
    const reserved = cart.find(
      (line) => line.productId === item.id && line.size === size,
    )?.quantity ?? 0;
    return Math.max(0, stock - reserved);
  };
  const soldOut = !currentProduct || !item.variants.some((variant) => variant.stock > 0);
  const bagLimitReached = !soldOut && !item.variants.some((variant) => remaining(variant.size) > 0);
  const canAdd = selectedSize !== null && remaining(selectedSize) > 0;
  const aspectClass = aspect === 'square'
    ? 'aspect-square'
    : aspect === 'landscape'
      ? 'aspect-[4/3]'
      : aspect === 'tall'
        ? 'aspect-[3/5]'
        : 'aspect-[4/5]';

  function handleAdd() {
    if (adding) return;
    if (selectedSize === null) {
      toast.error('Choose your EU size before adding this pair.');
      return;
    }
    if (!canAdd) {
      toast.error('This size is no longer available. Please choose another.');
      return;
    }
    setAdding(true);
    try {
      const result = addToCart(item.id, selectedSize, 1);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(`${item.name} added to your bag`, {
        description: `EU ${selectedSize} · ${item.color} · ${formatPrice(item.price)}. Demo purchase only.`,
      });
    } catch {
      toast.error('Your pair could not be saved. Please try again.');
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card
      className={`group min-w-0 rounded-none border-0 bg-transparent text-[#342820] shadow-none dark:text-[#f5eadc] ${className}`}
    >
      <Link
        to={productPath}
        aria-label={`Discover ${item.name}, ${formatPrice(item.price)}`}
        className={`relative block overflow-hidden bg-[#e9dfd0] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#712f40] dark:bg-[#352e29] ${aspectClass} ${imageClassName}`}
      >
        {image ? (
          <motion.img
            src={image.src}
            alt={image.alt || `${item.name}, ${item.color} handcrafted Rajasthani Mojris`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={1400}
            height={1600}
            sizes="(min-width: 1536px) 35vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
            whileHover={reducedMotion ? undefined : { scale: 1.035 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ) : (
          <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 px-6 text-[#685749] dark:text-[#dfcbb6]">
            <Footprints size={36} strokeWidth={1} aria-hidden="true" />
            <span className="text-sm">Product photograph unavailable</span>
          </div>
        )}
      </Link>

      <CardContent className="space-y-4 px-0 pb-2 pt-5">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#756253] dark:text-[#c8b39f]">
            {item.color} · Jodhpur
          </span>
          <Badge
            variant="outline"
            className="max-w-full whitespace-normal rounded-full border-[#d5c5b5] px-3 py-1 text-[10px] font-normal tracking-wide text-[#674e3d] dark:border-[#655246] dark:text-[#e0c7ae]"
          >
            {item.badge || 'Handcrafted'}
          </Badge>
        </div>

        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <h3 className="whitespace-normal break-words font-serif text-xl leading-snug lg:text-2xl">
              <Link
                to={productPath}
                className="rounded-sm underline-offset-4 transition-colors hover:text-[#712f40] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#712f40] dark:hover:text-[#e4b3bd]"
              >
                {item.name}
              </Link>
            </h3>
            <p className="text-sm tabular-nums text-[#685749] dark:text-[#d5c2b0]">
              {formatPrice(item.price)}
            </p>
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider delayDuration={250}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex shrink-0">
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={soldOut || bagLimitReached}
                        aria-label={soldOut ? `${item.name} is sold out` : bagLimitReached ? `Available ${item.name} pairs are already in your bag` : `Choose a size for ${item.name}`}
                        className="h-11 w-11 rounded-full border-[#cbb9a7] bg-[#faf6ee] text-[#712f40] transition-colors hover:border-[#712f40] hover:bg-[#712f40] hover:text-white disabled:opacity-50 dark:border-[#806b59] dark:bg-[#352b25] dark:text-[#f1d6cc] dark:hover:bg-[#eedbca] dark:hover:text-[#492b2b]"
                      >
                        <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
                      </Button>
                    </PopoverTrigger>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {soldOut ? 'Currently sold out' : bagLimitReached ? 'All available pairs are in your bag' : 'Select your size · quick add'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <PopoverContent
              align="end"
              sideOffset={10}
              collisionPadding={16}
              aria-labelledby={headingId}
              aria-describedby={guidanceId}
              className="w-80 max-w-[calc(100vw-2rem)] space-y-4 border-[#dacbbb] bg-[#fcf8f1] p-5 text-[#342820] shadow-xl dark:border-[#655246] dark:bg-[#29221e] dark:text-[#f5eadc]"
            >
              <div className="space-y-1">
                <h4 id={headingId} className="break-words font-serif text-xl">Choose your size</h4>
                <p id={guidanceId} className="text-xs leading-relaxed text-[#756253] dark:text-[#c8b39f]">
                  European sizing. One pair will be added. Unavailable sizes cannot be selected.
                </p>
              </div>
              <div role="group" aria-label={`Available EU sizes for ${item.name}`} className="flex flex-wrap gap-2">
                {item.variants.map((variant) => {
                  const available = remaining(variant.size);
                  const selected = selectedSize === variant.size;
                  return (
                    <Button
                      key={variant.size}
                      type="button"
                      variant="outline"
                      aria-pressed={selected}
                      aria-label={`EU ${variant.size}${available === 0 ? ', unavailable' : ''}`}
                      disabled={available === 0 || adding}
                      onClick={() => setProductSelection(item.id, { size: variant.size, quantity: 1 })}
                      className={`h-10 gap-1.5 rounded-full border px-3.5 text-xs transition-colors disabled:opacity-40 disabled:line-through ${selected ? 'border-[#712f40] bg-[#712f40] text-white hover:bg-[#592333] hover:text-white dark:border-[#e4b3bd]' : 'border-[#cbb9a7] bg-transparent text-inherit hover:bg-[#e9dfd0] dark:border-[#806b59] dark:hover:bg-[#46372d]'}`}
                    >
                      {selected && <Check size={12} aria-hidden="true" />}
                      EU {variant.size}
                    </Button>
                  );
                })}
              </div>
              <p aria-live="polite" className="min-h-4 text-xs text-[#756253] dark:text-[#c8b39f]">
                {selectedSize === null ? 'Select a size to continue.' : canAdd ? `EU ${selectedSize} selected · ready to add` : 'This size is unavailable or already fully reserved in your bag.'}
              </p>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!canAdd || adding}
                className="min-h-11 w-full gap-2 rounded-none bg-[#712f40] text-white transition-colors hover:bg-[#552231] disabled:opacity-50 dark:bg-[#e7c5ba] dark:text-[#35201e] dark:hover:bg-[#f3dacf]"
              >
                <ShoppingBag size={16} aria-hidden="true" />
                {adding ? 'Saving to bag…' : 'Add to bag'}
              </Button>
              <p className="text-[11px] leading-relaxed text-[#756253] dark:text-[#c8b39f]">Demo store · saved in this browser only.</p>
            </PopoverContent>
          </Popover>
        </div>
        {(soldOut || bagLimitReached) && (
          <p className="text-xs text-[#756253] dark:text-[#c8b39f]">
            {soldOut ? 'Currently sold out' : 'Available pairs are already in your bag'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductCard;