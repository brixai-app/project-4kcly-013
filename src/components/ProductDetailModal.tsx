import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { getProductById, products } from '@/data/mockData';
import {
  Product,
  ProductDetailModalProps,
  ProductVariantSize,
} from '@/types';
import QuantityStepper from '@/components/QuantityStepper';
import SelectField from '@/components/SelectField';

export interface ProductDetailState {
  sizeId: string;
  color: string;
  quantity: number;
  error?: string;
}

function getDefaultSizeId(product: Product | null): string {
  if (!product?.sizes?.length) return '';
  const defaultSize = product.sizes.find(s => s.isDefault && s.stock > 0);
  if (defaultSize) return defaultSize.id;
  const firstInStock = product.sizes.find(s => s.stock > 0);
  return firstInStock?.id ?? product.sizes[0]?.id ?? '';
}

function getSizeById(product: Product | null, sizeId: string): ProductVariantSize | null {
  if (!product) return null;
  return product.sizes.find(s => s.id === sizeId) ?? null;
}

function getStockForSize(product: Product | null, sizeId: string): number {
  const size = getSizeById(product, sizeId);
  return size?.stock ?? 0;
}

export function ProductDetailModal({
  productId,
  open,
  onOpenChange,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [state, setState] = useState<ProductDetailState>({
    sizeId: '',
    color: '',
    quantity: 1,
    error: undefined,
  });

  const { addItem } = useCart();

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    const resolved = getProductById?.(productId) ?? products.find(p => p.id === productId) ?? null;
    setProduct(resolved ?? null);
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    setState(prev => ({
      ...prev,
      sizeId: getDefaultSizeId(product),
      color: product.primaryColor ?? product.colors?.[0] ?? '',
      quantity: 1,
      error: undefined,
    }));
  }, [product]);

  const activeImage = useMemo(() => {
    if (!product?.images?.length) return null;
    const prioritized = product.images.find(img => img.priority);
    return prioritized ?? product.images[0];
  }, [product]);

  const activeStock = useMemo(() => getStockForSize(product, state.sizeId), [product, state.sizeId]);

  const handleSizeChange = (value: string) => {
    setState(prev => ({
      ...prev,
      sizeId: value,
      quantity: 1,
      error: undefined,
    }));
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    const max = activeStock || 1;
    const clamped = Math.min(value, max);
    setState(prev => ({
      ...prev,
      quantity: clamped,
      error: undefined,
    }));
  };

  const handleColorSelect = (color: string) => {
    setState(prev => ({
      ...prev,
      color,
      error: undefined,
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!state.sizeId) {
      setState(prev => ({ ...prev, error: 'Please select a size to continue.' }));
      toast.error('Select a size', {
        description: 'Choose your preferred size before adding to cart.',
      });
      return;
    }
    if (!state.color) {
      setState(prev => ({ ...prev, error: 'Please select a color to continue.' }));
      toast.error('Select a color', {
        description: 'Choose your preferred color before adding to cart.',
      });
      return;
    }
    if (activeStock <= 0) {
      setState(prev => ({ ...prev, error: 'Selected size is currently out of stock.' }));
      toast.error('Out of stock', {
        description: 'This size is not available. Try a different size.',
      });
      return;
    }
    const qty = Math.min(state.quantity || 1, activeStock);
    addItem(product, state.sizeId, qty);
    toast.success('Added to cart', {
      description: `${product.name} · Qty ${qty}`,
      icon: <Check className="w-4 h-4 text-[#8B0000]" />,
    });
    onOpenChange(false);
  };

  const isAddDisabled = !product || !state.sizeId || !state.color || activeStock <= 0;

  const sizeOptions =
    product?.sizes?.map(s => ({
      label: `${s.sizeLabel}${s.stock <= 0 ? ' · Waitlist' : ''}`,
      value: s.id,
    })) ?? [];

  const priceDisplay = useMemo(() => {
    if (!product) return null;
    const localePrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: product.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(product.price);
    const compare =
      product.compareAtPrice && product.compareAtPrice > product.price
        ? new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: product.currency || 'INR',
            maximumFractionDigits: 0,
          }).format(product.compareAtPrice)
        : null;
    return { localePrice, compare };
  }, [product]);

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setState(prev => ({
        ...prev,
        error: undefined,
      }));
    }
    onOpenChange(value);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-y-4 right-4 left-4 lg:left-auto lg:w-[960px] z-50 rounded-2xl overflow-hidden shadow-2xl bg-[#F9F6F2]/95 border border-[#D9D1C7]"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  <div className="relative bg-[#111111]">
                    {activeImage ? (
                      <div className="h-full w-full overflow-hidden">
                        <img
                          src={activeImage.url}
                          alt={activeImage.alt}
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover aspect-[3/4]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-black/40 mix-blend-multiply" />
                      </div>
                    ) : (
                      <div className="h-full w-full bg-[#111111] flex items-center justify-center text-[#F9F6F2] text-sm tracking-[0.2em] uppercase">
                        Visual Coming Soon
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#F9F6F2]/80">
                      <span className="h-px w-6 bg-[#F9F6F2]/60" />
                      <span>Jootiya Atelier · Detail View</span>
                    </div>
                  </div>
                  <div className="relative flex flex-col bg-[#F9F6F2]/90">
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D1C7]/80 bg-[#F9F6F2]/80 text-[#2E2B28]/80 hover:bg-white hover:text-[#2E2B28] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </Dialog.Close>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 lg:px-8 lg:pt-8 lg:pb-6 space-y-6">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Dialog.Title className="font-['Playfair_Display'] text-2xl lg:text-3xl tracking-tight text-[#2E2B28]">
                            {product?.name ?? 'Selected piece'}
                          </Dialog.Title>
                          {product?.subtitle && (
                            <Dialog.Description className="text-xs tracking-[0.22em] uppercase text-[#6F675E]">
                              {product.subtitle}
                            </Dialog.Description>
                          )}
                        </div>
                        {priceDisplay && (
                          <div className="flex items-baseline gap-3">
                            <span className="text-lg font-semibold text-[#2E2B28]">
                              {priceDisplay.localePrice}
                            </span>
                            {priceDisplay.compare && (
                              <span className="text-xs text-[#6F675E] line-through">
                                {priceDisplay.compare}
                              </span>
                            )}
                            {product?.isLimited && (
                              <span className="ml-auto inline-flex items-center rounded-full border border-[#D9D1C7]/80 px-3 py-1 text-[10px] tracking-[0.18em] uppercase text-[#2E2B28] bg-white/70">
                                Limited Run
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 text-xs text-[#6F675E] leading-relaxed">
                        <p className="line-clamp-3">
                          {product?.description ??
                            'A Jootiya silhouette crafted in Italian-inspired proportions with a quiet luxury profile and soft yet assertive lines.'}
                        </p>
                        {product?.metadata?.fitNote && (
                          <p className="text-[11px] tracking-[0.16em] uppercase">
                            Fit: <span className="text-[#2E2B28]">{product.metadata.fitNote}</span>
                          </p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E2B28]">
                                Size
                              </span>
                              <span className="text-[11px] text-[#6F675E]">
                                {activeStock > 0
                                  ? `${activeStock} pair${activeStock > 1 ? 's' : ''} left`
                                  : 'Waitlist'}
                              </span>
                            </div>
                            <SelectField
                              label=""
                              value={state.sizeId}
                              options={sizeOptions}
                              placeholder="Select EU size"
                              onChange={handleSizeChange}
                              disabled={!product?.sizes?.length}
                              error=""
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E2B28]">
                                Color
                              </span>
                              <span className="text-[11px] text-[#6F675E]">
                                {state.color || product?.primaryColor || 'Select'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(product?.colors ?? []).map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => handleColorSelect(color)}
                                  className={cn(
                                    'relative h-8 rounded-full border px-3 text-[11px] tracking-[0.18em] uppercase transition-all',
                                    state.color === color
                                      ? 'border-[#8B0000] bg-[#8B0000] text-white shadow-sm'
                                      : 'border-[#D9D1C7] bg-white/80 text-[#2E2B28] hover:border-[#8B0000]/70 hover:text-[#8B0000]',
                                  )}
                                >
                                  <span>{color}</span>
                                  {state.color === color && (
                                    <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-white text-[#8B0000]">
                                      <Check className="w-2 h-2" />
                                    </span>
                                  )}
                                </button>
                              ))}
                              {(!product?.colors || product.colors.length === 0) && (
                                <span className="text-[11px] text-[#6F675E] italic">
                                  Single palette finish
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-6">
                            <div className="space-y-1">
                              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E2B28]">
                                Quantity
                              </span>
                              <QuantityStepper
                                value={state.quantity}
                                min={1}
                                max={activeStock || 1}
                                onChange={handleQuantityChange}
                                disabled={activeStock <= 0}
                              />
                            </div>
                            <div className="flex-1 space-y-1 text-right">
                              <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E2B28]">
                                Status
                              </span>
                              <div className="text-[11px]">
                                {activeStock > 3 && (
                                  <span className="text-[#2E2B28]">In stock · Ready to ship</span>
                                )}
                                {activeStock > 0 && activeStock <= 3 && (
                                  <span className="text-[#8B0000]">
                                    Only {activeStock} left · Almost gone
                                  </span>
                                )}
                                {activeStock <= 0 && (
                                  <span className="text-[#6F675E]">Waitlist only</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {state.error && (
                          <div className="flex items-start gap-2 rounded-xl border border-[#D9D1C7] bg-white/80 px-3 py-2.5 text-xs text-[#8B0000]">
                            <AlertCircle className="w-4 h-4 mt-0.5" />
                            <p>{state.error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-[#D9D1C7]/80 bg-white/90 px-6 py-4 lg:px-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-[#6F675E]">
                        <span className="h-6 w-6 rounded-full border border-[#D9D1C7] flex items-center justify-center text-[10px] tracking-[0.16em] uppercase">
                          EU
                        </span>
                        <span>Complimentary shipping across India on this silhouette.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAddDisabled}
                        className={cn(
                          'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                          isAddDisabled
                            ? 'bg-[#D9D1C7] text-white cursor-not-allowed'
                            : 'bg-[#8B0000] text-white hover:bg-[#6F0000]',
                        )}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export default ProductDetailModal;