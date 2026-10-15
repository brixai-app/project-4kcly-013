import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from './ProductDetailModal';

export interface ProductCardProps {
  product?: Product;
  index?: number;
  enableHoverLift?: boolean;
  showCollection?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  index = 0,
  enableHoverLift = true,
  showCollection = true,
  className = '',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();

  const resolvedProduct: Product | null = product ?? null;

  const primaryImage = useMemo(() => {
    if (!resolvedProduct) return null;
    const priorityImage = resolvedProduct.images?.find(img => img?.priority);
    return priorityImage ?? resolvedProduct.images?.[0] ?? null;
  }, [resolvedProduct]);

  const fallbackSlug = useMemo(() => {
    if (resolvedProduct?.slug) return resolvedProduct.slug;
    const safeName = resolvedProduct?.name ?? 'jootiya-footwear';
    return safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }, [resolvedProduct]);

  const displayPrice = useMemo(() => {
    if (!resolvedProduct) return '';
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: resolvedProduct.currency ?? 'INR',
      maximumFractionDigits: 0,
    });
    return formatter.format(resolvedProduct.price ?? 0);
  }, [resolvedProduct]);

  const hasCompareAt = useMemo(() => {
    if (!resolvedProduct) return false;
    return (
      typeof resolvedProduct.compareAtPrice === 'number' &&
      resolvedProduct.compareAtPrice > (resolvedProduct.price ?? 0)
    );
  }, [resolvedProduct]);

  const discountPercent = useMemo(() => {
    if (!resolvedProduct || !hasCompareAt) return null;
    const diff = (resolvedProduct.compareAtPrice ?? 0) - (resolvedProduct.price ?? 0);
    if (diff <= 0) return null;
    const pct = Math.round((diff / (resolvedProduct.compareAtPrice ?? 1)) * 100);
    return pct > 0 ? pct : null;
  }, [resolvedProduct, hasCompareAt]);

  const primaryAvailableSizeId = useMemo(() => {
    if (!resolvedProduct) return null;
    const inStock = resolvedProduct.sizes?.filter(s => (s?.stock ?? 0) > 0) ?? [];
    if (inStock.length === 0) return null;
    const defaultSize = inStock.find(s => s?.isDefault);
    return defaultSize?.id ?? inStock[0]?.id ?? null;
  }, [resolvedProduct]);

  const isSoldOut = useMemo(() => {
    if (!resolvedProduct) return false;
    const totalStock =
      resolvedProduct.sizes?.reduce((acc, s) => acc + (s?.stock ?? 0), 0) ?? 0;
    return totalStock <= 0;
  }, [resolvedProduct]);

  const handleQuickAdd = () => {
    if (!resolvedProduct) {
      toast.error('Unable to add item at the moment.');
      return;
    }
    if (!primaryAvailableSizeId) {
      toast.error('All sizes are currently out of stock.');
      return;
    }
    addItem(resolvedProduct, primaryAvailableSizeId, 1);
    toast.success('Added to cart', {
      description: `${resolvedProduct.name} · Size ${
        resolvedProduct.sizes.find(s => s.id === primaryAvailableSizeId)?.sizeLabel ?? ''
      }`,
    });
  };

  const handleQuickView = () => {
    if (!resolvedProduct) return;
    setQuickViewOpen(true);
  };

  const motionDelay = (index ?? 0) * 0.04;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1], delay: motionDelay }}
        whileHover={enableHoverLift ? { y: -4 } : undefined}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl border border-[#D9D1C7] bg-white/90 shadow-[0_18px_45px_rgba(15,14,11,0.08)] transition-transform duration-500',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden border-b border-[#D9D1C7]/80 bg-[#F9F6F2]">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <Link
              to={`/product/${fallbackSlug}`}
              className="block h-full w-full overflow-hidden"
            >
              <motion.img
                crossOrigin="anonymous"
                src={
                  primaryImage?.url ??
                  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
                }
                alt={primaryImage?.alt ?? resolvedProduct?.name ?? 'Jootiya style'}
                className={cn(
                  'h-full w-full object-cover transition-transform duration-700 ease-out',
                  'group-hover:scale-105'
                )}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-black/30 opacity-75 mix-blend-soft-light" />

          {discountPercent !== null && (
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
              <div className="inline-flex items-center border border-white/40 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <span>{discountPercent}% off</span>
              </div>
              {resolvedProduct?.isLimited && (
                <div className="inline-flex items-center border border-[#8B0000]/60 bg-[#8B0000] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm">
                  Limited run
                </div>
              )}
            </div>
          )}

          {isSoldOut && (
            <div className="pointer-events-none absolute right-4 top-4">
              <span className="inline-flex items-center border border-white/50 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                Sold out
              </span>
            </div>
          )}

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 16 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3"
          >
            <div className="pointer-events-auto flex w-full max-w-xs items-center gap-2 rounded-full bg-white/90 px-2 py-1.5 text-[11px] font-medium tracking-[0.16em] text-[#2E2B28] shadow-lg ring-1 ring-black/5 backdrop-blur">
              <button
                type="button"
                onClick={handleQuickView}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2E2B28] transition-colors hover:bg-[#F9F6F2]"
              >
                <Eye className="h-3 w-3" />
                <span>Quick view</span>
              </button>
              <span className="h-5 w-px bg-[#D9D1C7]" />
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isSoldOut}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
                  isSoldOut
                    ? 'cursor-not-allowed bg-[#E5DED3] text-[#A79D93]'
                    : 'bg-[#8B0000] text-white hover:bg-[#6F0000]'
                )}
              >
                <ShoppingBag className="h-3 w-3" />
                <span>{isSoldOut ? 'Waitlist' : 'Quick add'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col bg-white px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {showCollection && resolvedProduct?.collection && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6F675E]">
                  {resolvedProduct.collection}
                </span>
              )}
              {resolvedProduct?.category && (
                <span className="rounded-sm border border-[#D9D1C7] bg-[#F9F6F2] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#6F675E]">
                  {resolvedProduct.category}
                </span>
              )}
            </div>
          </div>

          <Link to={`/product/${fallbackSlug}`} className="block">
            <h3 className="line-clamp-2 font-[400] text-[15px] tracking-tight text-[#2E2B28]">
              {resolvedProduct?.name ?? 'Untitled silhouette'}
            </h3>
          </Link>

          {resolvedProduct?.subtitle && (
            <p className="mt-1 line-clamp-1 text-xs text-[#6F675E]">
              {resolvedProduct.subtitle}
            </p>
          )}

          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-[15px] text-[#2E2B28]">
                  {displayPrice || '—'}
                </span>
                {hasCompareAt && resolvedProduct?.compareAtPrice && (
                  <span className="text-xs text-[#A79D93] line-through">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: resolvedProduct?.currency ?? 'INR',
                      maximumFractionDigits: 0,
                    }).format(resolvedProduct.compareAtPrice)}
                  </span>
                )}
              </div>
              {discountPercent !== null && (
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#8B0000]">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleQuickView}
              className="inline-flex items-center gap-1 rounded-full border border-transparent bg-transparent px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6F675E] transition-colors hover:border-[#D9D1C7] hover:bg-[#F9F6F2] hover:text-[#2E2B28]"
            >
              <span>Details</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {resolvedProduct?.colors?.length ? (
            <div className="mt-3 flex items-center gap-1.5">
              {resolvedProduct.colors.slice(0, 4).map(colorToken => (
                <span
                  key={colorToken}
                  className={cn(
                    'h-3 w-3 rounded-full border border-black/5',
                    colorToken === 'ivory' && 'bg-[#F4EEE3]',
                    colorToken === 'sand' && 'bg-[#E4D5C2]',
                    colorToken === 'taupe' && 'bg-[#B8A99A]',
                    colorToken === 'charcoal' && 'bg-[#2F2A26]',
                    colorToken === 'black' && 'bg-black',
                    colorToken === 'white' && 'bg-white',
                    colorToken === 'crimson' && 'bg-[#8B0000]',
                    colorToken === 'olive' && 'bg-[#556B2F]',
                    colorToken === 'navy' && 'bg-[#001F3F]',
                    colorToken === 'cognac' && 'bg-[#8B4513]'
                  )}
                />
              ))}
              {resolvedProduct.colors.length > 4 && (
                <span className="text-[10px] text-[#6F675E]">
                  +{resolvedProduct.colors.length - 4}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </motion.article>

      <ProductDetailModal
        productId={resolvedProduct?.id ?? null}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}

export default ProductCard;