import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

type ProductDetailsProps = {
  product?: Product | null;
  className?: string;
};

export function ProductDetails({ product = null, className = '' }: ProductDetailsProps) {
  const { addItem } = useCart();
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    const images = [product?.image, ...(product?.gallery ?? [])].filter(Boolean) as string[];
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'];
  }, [product]);

  const sizes = product?.sizes ?? [];
  const colors = product?.colors ?? [];
  const currentImage = gallery[index % gallery.length] ?? gallery[0];

  const handleAdd = async () => {
    if (!product) return;
    if (sizes.length > 0 && !size) return;
    if (colors.length > 0 && !color) return;
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    addItem(product.id, quantity, size || undefined, color || undefined);
    setLoading(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (!product) {
    return (
      <div className={cn('grid gap-6 lg:grid-cols-[1.1fr_0.9fr]', className)}>
        <div className="aspect-[3/4] bg-[#FFF9F0] border border-[#C9A66B]" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-[#FFF9F0] border border-[#C9A66B]" />
          <div className="h-4 w-full bg-[#FFF9F0] border border-[#C9A66B]" />
          <div className="h-4 w-5/6 bg-[#FFF9F0] border border-[#C9A66B]" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-8 lg:grid-cols-[1.05fr_0.95fr]', className)}>
      <div className="space-y-4">
        <div className="relative overflow-hidden border border-[#C9A66B] bg-[#FFF9F0]">
          <div className="absolute left-4 top-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((v) => (v - 1 + gallery.length) % gallery.length)}
              className="grid h-10 w-10 place-items-center border border-[#C9A66B] bg-[#F5F0E6]/90 text-[#2B2B2B] transition hover:bg-[#FFF9F0]"
              aria-label="Previous image"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((v) => (v + 1) % gallery.length)}
              className="grid h-10 w-10 place-items-center border border-[#C9A66B] bg-[#F5F0E6]/90 text-[#2B2B2B] transition hover:bg-[#FFF9F0]"
              aria-label="Next image"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={product.name}
              crossOrigin="anonymous"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="h-[72vh] w-full object-cover object-center"
            />
          </AnimatePresence>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {gallery.slice(0, 4).map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                'overflow-hidden border transition',
                i === index ? 'border-[#7B2D26]' : 'border-[#C9A66B]'
              )}
            >
              <img src={img} alt={`${product.name} view ${i + 1}`} crossOrigin="anonymous" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 border border-[#C9A66B] bg-[#FFF9F0] p-6 md:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">{product.category}</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-light tracking-tight text-[#2B2B2B] md:text-5xl">{product.name}</h1>
          <div className="flex items-end gap-3">
            <p className="font-['Lora'] text-2xl font-semibold text-[#7B2D26]">₹{product.price.toLocaleString('en-IN')}</p>
            {product.originalPrice ? (
              <p className="pb-1 text-sm text-[#6F655B] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
            ) : null}
          </div>
        </div>

        <p className="max-w-xl text-sm leading-7 text-[#6F655B]">{product.description}</p>

        <div className="grid gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Available sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    'min-w-12 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
                    size === s
                      ? 'border-[#7B2D26] bg-[#7B2D26] text-white'
                      : 'border-[#C9A66B] bg-transparent text-[#2B2B2B] hover:bg-[#F5F0E6]'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {colors.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Color options</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition',
                      color === c
                        ? 'border-[#7B2D26] bg-[#7B2D26] text-white'
                        : 'border-[#C9A66B] bg-transparent text-[#2B2B2B] hover:bg-[#F5F0E6]'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Quantity</p>
            <div className="inline-flex items-center border border-[#C9A66B]">
              <button
                type="button"
                onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                className="grid h-11 w-11 place-items-center text-[#2B2B2B] transition hover:bg-[#F5F0E6]"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <div className="w-12 text-center text-sm font-semibold text-[#2B2B2B]">{quantity}</div>
              <button
                type="button"
                onClick={() => setQuantity((v) => Math.min(5, v + 1))}
                className="grid h-11 w-11 place-items-center text-[#2B2B2B] transition hover:bg-[#F5F0E6]"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-[#C9A66B] pt-5">
          <div className="grid gap-3 text-sm text-[#6F655B]">
            <div className="flex justify-between gap-4">
              <span>Artisan</span>
              <span className="text-[#2B2B2B]">{product.artisanName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Origin</span>
              <span className="text-[#2B2B2B]">{product.origin ?? 'Jodhpur, Rajasthan'}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Material</span>
              <span className="text-[#2B2B2B]">{product.material ?? 'Hand-finished leather'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || added || (sizes.length > 0 && !size) || (colors.length > 0 && !color)}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 border px-5 py-4 text-xs font-semibold uppercase tracking-[0.3em] transition',
              added
                ? 'border-[#7B2D26] bg-[#7B2D26] text-white'
                : 'border-[#7B2D26] bg-[#7B2D26] text-white hover:bg-[#61211C]',
              (loading || added || (sizes.length > 0 && !size) || (colors.length > 0 && !color)) && 'opacity-90'
            )}
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
            {loading ? 'Adding' : added ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <p className="text-xs leading-6 text-[#6F655B]">
            {product.care ?? 'Store in a dry place and wipe gently with a soft cloth after wear.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;