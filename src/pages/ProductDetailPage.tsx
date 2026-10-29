import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft, Check, Heart, Minus, Plus, Shield, ShoppingBag, Star, Truck } from 'lucide-react';
import type { Artisan, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { addItem } = useCart?.() ?? {};
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        const json = await res.json();
        const data = (json?.data ?? json) as Product | { product?: Product; artisan?: Artisan } | null;
        const nextProduct = (data as any)?.product ?? (data as Product | null);
        const nextArtisan = (data as any)?.artisan ?? null;
        if (!active) return;
        setProduct(nextProduct ?? null);
        setArtisan(nextArtisan ?? null);
        const firstSize = nextProduct?.sizes?.[0] ?? '';
        setSelectedSize(firstSize);
        setSelectedImage(nextProduct?.images?.[0] ?? nextProduct?.image ?? '');
      } catch {
        if (active) {
          setProduct(null);
          setArtisan(null);
          toast.error('Unable to load product details.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    if (id) load();
    return () => {
      active = false;
    };
  }, [id]);

  const images = useMemo(() => {
    const list = product?.images?.length ? product.images : [product?.image ?? ''];
    return list.filter(Boolean);
  }, [product]);

  const handleAdd = () => {
    if (!product || !addItem) return;
    addItem({
      id: `${product.id}-${selectedSize || 'default'}`,
      productId: product.id,
      product,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: selectedImage || product.image,
      size: selectedSize || undefined,
    });
    toast.success('Added to cart.');
  };

  const price = useMemo(() => {
    const currency = product?.currency ?? '₹';
    return `${currency}${Number(product?.price ?? 0).toLocaleString('en-IN')}`;
  }, [product]);

  return (
    <div className="bg-[#F5F1EB] text-[#302D29]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#71695F] transition hover:text-[#6B1E1E]">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden border border-[#C9BFB1] bg-[#FFFCF7]">
              <div className="aspect-[4/5] w-full bg-[#faf9f6]">
                <img
                  src={selectedImage || product?.image || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'}
                  alt={product?.name ?? 'Product image'}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  className={cn(
                    'h-24 w-20 shrink-0 overflow-hidden border transition',
                    selectedImage === src ? 'border-[#6B1E1E]' : 'border-[#C9BFB1]'
                  )}
                >
                  <img src={src} alt={`${product?.name ?? 'Product'} ${index + 1}`} crossOrigin="anonymous" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="min-w-0 space-y-6">
            <div className="space-y-3 border-b border-[#C9BFB1] pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#71695F]">{product?.category ?? 'Mojri'}</p>
              <h1 className="font-['Bodoni_Moda'] text-4xl font-light tracking-tight sm:text-5xl">{product?.name ?? (loading ? 'Loading...' : 'Product not found')}</h1>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold">{price}</p>
                <div className="flex items-center gap-1 text-sm text-[#71695F]">
                  <Star className="h-4 w-4 fill-current text-[#6B1E1E]" />
                  <span>Hand-finished in Jodhpur</span>
                </div>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-[#71695F]">{product?.description ?? 'An elevated pair crafted with heritage detailing, refined comfort, and a tailored silhouette for ceremonial and everyday wear.'}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#71695F]">Select size</p>
                <button type="button" className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B1E1E]">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product?.sizes?.length ? product.sizes : ['6', '7', '8', '9', '10']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'min-w-0 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                      selectedSize === size ? 'border-[#6B1E1E] bg-[#6B1E1E] text-white' : 'border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29]'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="inline-flex h-11 w-11 items-center justify-center border border-[#C9BFB1] bg-[#FFFCF7]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((v) => v + 1)}
                className="inline-flex h-11 w-11 items-center justify-center border border-[#C9BFB1] bg-[#FFFCF7]"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setFavorite((v) => !v)}
                className={cn('ml-auto inline-flex items-center gap-2 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition', favorite ? 'border-[#6B1E1E] text-[#6B1E1E]' : 'border-[#C9BFB1] text-[#302D29]')}
              >
                <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
                {favorite ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-2 bg-[#6B1E1E] px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#501515]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7] px-5 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#302D29] transition hover:border-[#6B1E1E]"
              >
                Buy now
              </button>
            </div>

            <div className="grid gap-3 border-t border-[#C9BFB1] pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 text-[#6B1E1E]" />
                <div>
                  <p className="text-sm font-semibold">Shipping</p>
                  <p className="text-sm text-[#71695F]">Tracked delivery across India.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-[#6B1E1E]" />
                <div>
                  <p className="text-sm font-semibold">Authentic craft</p>
                  <p className="text-sm text-[#71695F]">Verified artisan provenance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 text-[#6B1E1E]" />
                <div>
                  <p className="text-sm font-semibold">Secure checkout</p>
                  <p className="text-sm text-[#71695F]">Protected payment experience.</p>
                </div>
              </div>
            </div>

            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#71695F]">Artisan provenance</p>
              <div className="mt-3 flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden border border-[#C9BFB1] bg-[#faf9f6]">
                  <img
                    src={artisan?.portrait || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'}
                    alt={artisan?.name ?? 'Artisan portrait'}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{artisan?.name ?? 'Master artisan'}</p>
                  <p className="text-sm text-[#71695F]">{artisan?.title ?? 'Jodhpuri craft atelier'}</p>
                  <p className="mt-2 text-sm leading-6 text-[#71695F]">{artisan?.bio ?? 'Each pair is shaped by hand, balancing ceremonial elegance with enduring comfort and a precise, heritage-led finish.'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;