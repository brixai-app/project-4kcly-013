import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Truck, Shield, CreditCard, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts, typographyTokens, theme } from '@/data/mockData';
import type { Product, ProductVariantSize } from '@/types';
import { useCart } from '@/context/CartContext';
import SelectField from '@/components/SelectField';

export interface ProductPageProps {
  className?: string;
}

function useResolvedProduct(slug: string | undefined): Product | null {
  if (!slug) return null;
  const product = getProductBySlug(slug);
  return product ?? null;
}

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

function getDefaultSizeId(sizes: ProductVariantSize[]): string {
  const defaultSize = sizes.find(s => s.isDefault && s.stock > 0);
  if (defaultSize) return defaultSize.id;
  const firstInStock = sizes.find(s => s.stock > 0);
  if (firstInStock) return firstInStock.id;
  return sizes[0]?.id ?? '';
}

export function ProductPage({ className = '' }: ProductPageProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = useResolvedProduct(slug);
  const { addItem } = useCart();

  const [sizeId, setSizeId] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage = useMemo(() => {
    if (!product) return null;
    return product.images.find(img => img.priority) ?? product.images[0] ?? null;
  }, [product]);

  const secondaryImages = useMemo(() => {
    if (!product) return [];
    const [, ...rest] = product.images;
    return rest;
  }, [product]);

  const activeSize = useMemo(
    () => product?.sizes.find(s => s.id === (sizeId || getDefaultSizeId(product.sizes))) ?? null,
    [product, sizeId]
  );

  React.useEffect(() => {
    if (product) {
      setSizeId(getDefaultSizeId(product.sizes));
      setColor(product.primaryColor);
      setQuantity(1);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <div className={cn('min-h-screen bg-[#F9F6F2] text-[#2E2B28]', className)}>
        <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6F675E] hover:text-[#2E2B28]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="mt-16 border border-[#D9D1C7] rounded-2xl bg-white px-8 py-16">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight" style={{ fontFamily: typographyTokens.displayFamily }}>
              Piece not found
            </h1>
            <p className="mt-4 text-[#6F675E]" style={{ fontFamily: typographyTokens.bodyFamily }}>
              The Jootiya piece you are looking for may have stepped off the runway. Discover our latest curation instead.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] text-white text-sm font-semibold tracking-[0.18em] uppercase rounded-md hover:bg-[#6F0000] transition-colors"
              style={{ fontFamily: typographyTokens.bodyFamily }}
            >
              Browse the boutique
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!activeSize || activeSize.stock <= 0) {
      toast.error('Select an available size', {
        description: 'This size is currently out of stock.',
      });
      return;
    }
    if (!color) {
      toast.error('Choose a color story', {
        description: 'Select your preferred finish before adding to cart.',
      });
      return;
    }
    if (quantity < 1) {
      toast.error('Minimum quantity is 1');
      return;
    }
    if (quantity > activeSize.stock) {
      toast.error('Not enough stock', {
        description: `Only ${activeSize.stock} pairs available in this size.`,
      });
      return;
    }

    try {
      setIsAdding(true);
      addItem(product, activeSize.id, quantity);
      toast.success('Added to cart', {
        description: `${product.name} · Size ${activeSize.sizeLabel}`,
      });
    } catch (error) {
      const message = (error as Error)?.message ?? 'Something went wrong while adding to cart.';
      toast.error('Unable to add to cart', { description: message });
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 400);
    }
  };

  const related = getRelatedProducts(product.id).slice(0, 4);
  const inStock = (activeSize?.stock ?? 0) > 0;
  const maxQuantity = Math.min(activeSize?.stock ?? 1, 5);

  return (
    <div className={cn('min-h-screen bg-[#F9F6F2] text-[#2E2B28]', className)}>
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#6F675E] hover:text-[#2E2B28]"
          style={{ fontFamily: typographyTokens.bodyFamily }}
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to edit</span>
        </button>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <motion.div
            className="lg:col-span-7 space-y-4"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#D9D1C7] bg-[#F9F6F2]">
              {primaryImage && (
                <div className="aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.alt}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/20 mix-blend-multiply" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span
                  className="inline-flex px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-white bg-black/40 backdrop-blur-sm border border-white/20 rounded-sm"
                  style={{ fontFamily: typographyTokens.bodyFamily }}
                >
                  Jootiya · {product.collection ?? 'Studio'}
                </span>
                {product.isLimited && (
                  <span
                    className="inline-flex px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-[#F9F6F2] bg-[#8B0000]/80 backdrop-blur-sm border border-white/20 rounded-sm"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Limited run
                  </span>
                )}
              </div>
            </div>

            {secondaryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {secondaryImages.slice(0, 3).map(image => (
                  <motion.button
                    key={image.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-xl border border-[#D9D1C7] bg-white"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex flex-col gap-8"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <header>
              <p
                className="text-xs tracking-[0.3em] uppercase text-[#6F675E] mb-2"
                style={{ fontFamily: typographyTokens.bodyFamily }}
              >
                {product.category} · {product.collection ?? 'Mainline'}
              </p>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#2E2B28]"
                style={{ fontFamily: typographyTokens.displayFamily }}
              >
                {product.name}
              </h1>
              {product.subtitle && (
                <p
                  className="mt-2 text-base text-[#6F675E]"
                  style={{ fontFamily: typographyTokens.accentFamily }}
                >
                  {product.subtitle}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-2xl font-semibold text-[#2E2B28]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span
                      className="text-sm text-[#6F675E] line-through"
                      style={{ fontFamily: typographyTokens.bodyFamily }}
                    >
                      {formatPrice(product.compareAtPrice, product.currency)}
                    </span>
                  )}
                </div>
                {product.tags.includes('new') && (
                  <span
                    className="inline-flex items-center gap-1 px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-[#8B0000] bg-white border border-[#D9D1C7] rounded-sm"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    <Star className="w-3 h-3" />
                    New arrival
                  </span>
                )}
              </div>
            </header>

            <section className="border-y border-[#D9D1C7] py-6 space-y-4">
              <p
                className="text-sm leading-relaxed text-[#3F3A35]"
                style={{ fontFamily: typographyTokens.bodyFamily }}
              >
                {product.description}
              </p>
              {product.metadata?.fitNote && (
                <p
                  className="text-xs text-[#6F675E]"
                  style={{ fontFamily: typographyTokens.bodyFamily }}
                >
                  <span className="font-semibold">Fit note:</span> {product.metadata.fitNote}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs text-[#6F675E]">
                {product.metadata?.upperMaterial && (
                  <div>
                    <p className="font-semibold" style={{ fontFamily: typographyTokens.bodyFamily }}>
                      Upper
                    </p>
                    <p style={{ fontFamily: typographyTokens.bodyFamily }}>{product.metadata.upperMaterial}</p>
                  </div>
                )}
                {product.metadata?.soleMaterial && (
                  <div>
                    <p className="font-semibold" style={{ fontFamily: typographyTokens.bodyFamily }}>
                      Sole
                    </p>
                    <p style={{ fontFamily: typographyTokens.bodyFamily }}>{product.metadata.soleMaterial}</p>
                  </div>
                )}
                {product.metadata?.construction && (
                  <div>
                    <p className="font-semibold" style={{ fontFamily: typographyTokens.bodyFamily }}>
                      Construction
                    </p>
                    <p style={{ fontFamily: typographyTokens.bodyFamily }}>{product.metadata.construction}</p>
                  </div>
                )}
                {product.metadata?.countryOfOrigin && (
                  <div>
                    <p className="font-semibold" style={{ fontFamily: typographyTokens.bodyFamily }}>
                      Crafted in
                    </p>
                    <p style={{ fontFamily: typographyTokens.bodyFamily }}>{product.metadata.countryOfOrigin}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <SelectField
                    label="Size"
                    value={sizeId}
                    onChange={setSizeId}
                    options={product.sizes.map(s => ({
                      label: `${s.sizeLabel} · ${s.scale}`,
                      value: s.id,
                    }))}
                    placeholder="Select size"
                    error={activeSize && activeSize.stock <= 0 ? 'Out of stock' : ''}
                  />
                  {activeSize && (
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        activeSize.stock > 3 ? 'text-[#6F675E]' : activeSize.stock > 0 ? 'text-[#8B0000]' : 'text-[#6F675E]'
                      )}
                      style={{ fontFamily: typographyTokens.bodyFamily }}
                    >
                      {activeSize.stock > 3
                        ? 'In stock · ready to ship'
                        : activeSize.stock > 0
                        ? `Only ${activeSize.stock} pairs left in this size`
                        : 'This size is currently sold out'}
                    </p>
                  )}
                </div>
                <div>
                  <SelectField
                    label="Color story"
                    value={color}
                    onChange={setColor}
                    options={product.colors.map(c => ({
                      label: c.charAt(0).toUpperCase() + c.slice(1),
                      value: c,
                    }))}
                    placeholder="Choose color"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {product.colors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          'h-6 w-6 rounded-full border border-[#D9D1C7] flex items-center justify-center',
                          color === c && 'ring-2 ring-offset-2 ring-[#8B0000] ring-offset-[#F9F6F2]'
                        )}
                        style={{ backgroundColor: c === 'ivory' ? '#F9F6F2' : c === 'sand' ? '#E4D4C8' : c === 'taupe' ? '#B2A39A' : c === 'charcoal' ? '#333333' : c === 'black' ? '#000000' : c === 'white' ? '#FFFFFF' : c === 'crimson' ? '#8B0000' : c === 'olive' ? '#6B7A3F' : c === 'navy' ? '#1D3557' : c === 'cognac' ? '#9F4C2F' : '#D9D1C7' }}
                      >
                        {color === c && <Check className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-[#D9D1C7] rounded-full overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1 || !inStock}
                    className="px-3 py-2 text-sm text-[#2E2B28] disabled:text-[#D9D1C7]"
                  >
                    -
                  </button>
                  <span
                    className="px-4 text-sm min-w-[2.25rem] text-center text-[#2E2B28]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                    disabled={!inStock || quantity >= maxQuantity}
                    className="px-3 py-2 text-sm text-[#2E2B28] disabled:text-[#D9D1C7]"
                  >
                    +
                  </button>
                </div>
                <p
                  className="text-xs text-[#6F675E]"
                  style={{ fontFamily: typographyTokens.bodyFamily }}
                >
                  Max {maxQuantity} per client in this size.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!inStock || isAdding}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold tracking-[0.18em] uppercase transition-colors',
                    inStock
                      ? 'bg-[#8B0000] text-white hover:bg-[#6F0000]'
                      : 'bg-[#D9D1C7] text-[#6F675E] cursor-not-allowed'
                  )}
                  style={{ fontFamily: typographyTokens.bodyFamily }}
                >
                  <span>{inStock ? (isAdding ? 'Adding...' : 'Add to cart') : 'Waitlist size'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-[#D9D1C7] bg-white text-xs font-semibold tracking-[0.22em] uppercase text-[#2E2B28] hover:bg-[#F3EBE0] transition-colors"
                  style={{ fontFamily: typographyTokens.bodyFamily }}
                >
                  <CreditCard className="w-4 h-4" />
                  Express checkout
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#D9D1C7] pt-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Truck className="w-4 h-4 text-[#8B0000]" />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2E2B28]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Express dispatch
                  </p>
                  <p
                    className="mt-1 text-xs text-[#6F675E]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Ships within 24–48 hours from our New Delhi atelier.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Shield className="w-4 h-4 text-[#8B0000]" />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2E2B28]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Complimentary care
                  </p>
                  <p
                    className="mt-1 text-xs text-[#6F675E]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    12-month craftsmanship assurance & dedicated concierge.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CreditCard className="w-4 h-4 text-[#8B0000]" />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2E2B28]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Secure payment
                  </p>
                  <p
                    className="mt-1 text-xs text-[#6F675E]"
                    style={{ fontFamily: typographyTokens.bodyFamily }}
                  >
                    Encrypted checkout with leading global payment partners.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-[#D9D1C7] pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-xl md:text-2xl font-light tracking-tight text-[#2E2B28]"
                style={{ fontFamily: typographyTokens.displayFamily }}
              >
                Styled alongside
              </h2>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-[#6F675E] hover:text-[#2E2B28]"
                style={{ fontFamily: typographyTokens.bodyFamily }}
              >
                View all pieces
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(item => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/product/${item.slug}`)}
                  className="group text-left"
                  whileHover={{ y: -4 }}
                >
                  <div className="overflow-hidden rounded-xl border border-[#D9D1C7] bg-white">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.images[0]?.url ?? primaryImage?.url ?? ''}
                        alt={item.images[0]?.alt ?? item.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p
                      className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                      style={{ fontFamily: typographyTokens.bodyFamily }}
                    >
                      {item.collection ?? 'Studio'}
                    </p>
                    <p
                      className="text-sm text-[#2E2B28]"
                      style={{ fontFamily: typographyTokens.displayFamily }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs text-[#6F675E]"
                      style={{ fontFamily: typographyTokens.bodyFamily }}
                    >
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductPage;