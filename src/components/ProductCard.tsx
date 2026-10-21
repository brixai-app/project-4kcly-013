import React, { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn';
import {
  MAX_CART_QUANTITY,
  formatCurrency,
  isValidSize,
  useStore,
  type Product,
  type ShoeSize,
} from '@/mock';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  className,
  imageClassName,
  priority = false,
}: ProductCardProps) {
  const reducedMotion = useReducedMotion();
  const fieldId = useId();
  const [size, setSize] = useState<ShoeSize | undefined>();
  const [imageStage, setImageStage] = useState<0 | 1 | 2>(0);
  const [addCount, setAddCount] = useState(0);
  const [added, setAdded] = useState(false);

  // Atomic selectors keep snapshots stable while reflecting checkout inventory changes.
  const liveProduct = useStore(state =>
    state.products.find(item => item.id === product.id),
  );
  const addToCart = useStore(state => state.addToCart);
  const openCart = useStore(state => state.openCart);
  const quantityInBag = useStore(state =>
    state.cart.find(line => line.productId === product.id && line.size === size)
      ?.quantity ?? 0,
  );
  const item = liveProduct ?? product;
  const image = item.images[0];
  const detailPath = `/product/${encodeURIComponent(item.slug)}`;
  const inStock = item.variants.some(variant => variant.stock > 0);
  const selectedVariant = item.variants.find(variant => variant.size === size);
  const remaining = Math.max(
    0,
    Math.min(MAX_CART_QUANTITY, selectedVariant?.stock ?? 0) - quantityInBag,
  );
  const canAdd = Boolean(liveProduct && size !== undefined && remaining > 0);
  const imageSource = imageStage === 0 ? image?.src : image?.fallback;
  const stockMessage = !inStock
    ? 'Currently out of demo stock'
    : size === undefined
      ? 'Available in selected EU sizes'
      : !selectedVariant || selectedVariant.stock === 0
        ? 'This size is out of demo stock'
        : remaining === 0
          ? 'Bag limit reached for this size'
          : `${remaining} ${remaining === 1 ? 'pair' : 'pairs'} available to add in EU ${size}`;

  useEffect(() => {
    setSize(undefined);
    setAdded(false);
    setAddCount(0);
  }, [product.id]);

  useEffect(() => {
    setImageStage(0);
  }, [product.id, image?.src, image?.fallback]);

  function selectSize(value: string) {
    const parsed = Number(value);
    if (!isValidSize(parsed)) return;
    setSize(parsed);
    setAdded(false);
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (size === undefined) {
      toast.error('Choose an available EU size first.');
      return;
    }

    const result = addToCart(item.id, size, 1);
    if (!result.ok) {
      setAdded(false);
      toast.error(result.message);
      return;
    }

    setAdded(true);
    setAddCount(count => count + 1);
    const memoryOnly = useStore.getState().storageStatus === 'memory-only';
    toast.success(result.message, {
      description: memoryOnly
        ? 'Browser storage is unavailable. Your demo bag lasts for this open page only.'
        : 'Saved in this browser. No real purchase or payment.',
      action: { label: 'View bag', onClick: () => openCart() },
    });
  }

  return (
    <motion.article
      className={cn('group w-full min-w-0 text-foreground', className)}
      initial={false}
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      aria-labelledby={`${fieldId}-title`}
    >
      <Link
        to={detailPath}
        className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
        aria-label={`Discover ${item.name}`}
      >
        <div
          className={cn(
            'relative aspect-[4/5] w-full overflow-hidden bg-[#eee7dd] dark:bg-[#302a25]',
            imageClassName,
          )}
        >
          {image && imageStage < 2 && imageSource ? (
            <motion.img
              key={`${item.id}-${imageStage}-${imageSource}`}
              src={imageSource}
              alt={imageStage === 1 ? `Illustrated Mojri study for ${item.name}; not a product photograph` : image.alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-cover"
              whileHover={reducedMotion ? undefined : { scale: 1.035 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onError={() => setImageStage(stage => stage === 0 ? 1 : 2)}
            />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 p-8 text-center text-[#665748] dark:text-[#d8cbbb]">
              <ShoppingBag className="h-9 w-9" strokeWidth={1} aria-hidden="true" />
              <span className="font-serif text-2xl">{item.name}</span>
              <span className="text-xs tracking-wide">Mojri imagery unavailable</span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-4 pb-3 pt-5 sm:pt-6">
        <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Jodhpur · {item.material}</span>
          <span>{!inStock ? 'Sold out' : item.isNew ? 'New study' : 'Mojri collection'}</span>
        </div>

        <div className="flex min-w-0 items-start justify-between gap-4">
          <h3 id={`${fieldId}-title`} className="min-w-0 whitespace-normal break-words font-serif text-2xl leading-tight sm:text-3xl">
            <Link
              to={detailPath}
              className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.name}
            </Link>
          </h3>
          <span className="shrink-0 pt-1 text-sm font-medium tabular-nums">
            {formatCurrency(item.price)}
          </span>
        </div>

        <div className="space-y-2">
          <p className="whitespace-normal break-words text-sm leading-relaxed text-muted-foreground">
            {item.subtitle}
          </p>
          <p className="whitespace-normal break-words text-xs leading-relaxed text-muted-foreground">
            {item.craft}
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-2.5">
          <label htmlFor={`${fieldId}-size`} className="block text-xs font-medium">
            Choose EU size <span className="text-muted-foreground">(required)</span>
          </label>
          <div className="flex min-w-0 flex-wrap gap-2.5">
            <div className="min-w-0 flex-[1_1_115px]">
              <Select
                name={`${item.id}-size`}
                value={size === undefined ? '' : String(size)}
                onValueChange={selectSize}
                disabled={!inStock || !liveProduct}
                required
              >
                <SelectTrigger
                  id={`${fieldId}-size`}
                  className="h-11 w-full rounded-none border-border bg-background"
                  aria-describedby={`${fieldId}-stock`}
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {item.variants.map(variant => (
                    <SelectItem
                      key={variant.size}
                      value={String(variant.size)}
                      disabled={variant.stock <= 0}
                    >
                      EU {variant.size}{variant.stock <= 0 ? ' — unavailable' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={!canAdd}
              className="h-11 min-w-0 flex-[1_1_145px] gap-2 rounded-none bg-[#a83e2d] px-4 text-white transition-colors hover:bg-[#873023] disabled:opacity-50 dark:bg-[#b34b38] dark:text-white dark:hover:bg-[#963c2d]"
              aria-label={`Add ${item.name}${size === undefined ? '' : ` in EU ${size}`} to your demo bag`}
            >
              <motion.span
                key={addCount}
                className="inline-flex shrink-0"
                initial={false}
                animate={reducedMotion || addCount === 0 ? { scale: 1 } : { scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              </motion.span>
              <span>{added ? 'Add another pair' : 'Add to bag'}</span>
            </Button>
          </div>
          <p id={`${fieldId}-stock`} role="status" className="text-xs leading-relaxed text-muted-foreground">
            {stockMessage}
          </p>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">Demo listing · simulated shopping</span>
          <Button asChild variant="link" className="h-auto gap-1.5 rounded-sm p-0 text-xs text-foreground underline-offset-4">
            <Link to={detailPath} aria-label={`Explore the story of ${item.name}`}>
              Explore the craft <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;