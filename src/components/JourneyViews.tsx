import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, MapPin, Shield, Sparkles, Truck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { artisanById, featuredProducts, heroSlides, products, styleMetadata, verifiedImageUrls } from '@/data/mockData';
import type { Artisan, Order, Product } from '@/types';

type SectionProps = { className?: string };
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const img = (src?: string) => src ?? verifiedImageUrls?.[0] ?? '';
const firstProduct = (list: Product[] = products) => list?.[0] ?? null;

export function HomeEditorial({ className = '' }: SectionProps) {
  const slide = heroSlides?.[0] ?? {};
  return (
    <section className={cn('bg-[#F7F0E4] text-[#2B1715]', className)}>
      <div className="mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#765F55]">
            <span className="h-px w-10 bg-[#CDBB9F]" />
            <span>{styleMetadata?.heritage ?? 'Jodhpur Heritage'}</span>
          </div>
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#741F2B]">{slide?.eyebrow ?? 'Authentic Mojris'}</p>
            <h1 className="font-serif text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
              {slide?.title ?? 'Hand-finished mojris for ceremonial and everyday elegance.'}
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#765F55]">{slide?.description ?? 'A refined edit of Jodhpuri craftsmanship, shaped in ivory, maroon, and antique gold.'}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#57151F]">
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link to="/journey" className="inline-flex items-center gap-2 border border-[#CDBB9F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#2B1715] transition-colors hover:bg-white">
                Craft Journey
              </Link>
            </div>
          </div>
          <div className="grid gap-3 border-t border-[#CDBB9F] pt-5 sm:grid-cols-3">
            {['Verified leather', 'Artisan lineage', 'Secure checkout'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#765F55]">
                <CheckCircle2 size={16} className="text-[#741F2B]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[60vh] overflow-hidden">
          <img src={img(slide?.image)} alt={slide?.title ?? 'Jootiya editorial hero'} crossOrigin="anonymous" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B1715]/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
            <div className="max-w-md border border-white/30 bg-[#FFFDF8]/90 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#741F2B]">{styleMetadata?.craft ?? 'Craft lineage'}</p>
              <p className="mt-2 text-sm leading-7 text-[#2B1715]">{slide?.caption ?? 'A quiet, ceremonial silhouette with hand-stitched precision and a softened profile.'}</p>
            </div>
            <div className="border border-[#CDBB9F] bg-[#FFFDF8]/95 p-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#765F55]">Current chapter</p>
              <p className="mt-2 font-serif text-2xl">{slide?.chapter ?? '01'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDetailView({ className = '' }: SectionProps) {
  const product = firstProduct() ?? undefined;
  const { addItem } = useCart();
  const navigate = useNavigate();
  const artisan = product?.artisanId ? artisanById?.[product.artisanId] : undefined;
  const gallery = product?.gallery?.length ? product.gallery : [product?.image ?? verifiedImageUrls?.[1] ?? ''];
  return (
    <section className={cn('bg-[#FFFDF8] px-5 py-10 text-[#2B1715] sm:px-8 lg:px-10', className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.slice(0, 2).map((src, index) => (
              <img key={`${src}-${index}`} src={img(src)} alt={product?.name ?? 'Product image'} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
            ))}
          </div>
          <img src={img(gallery?.[2] ?? product?.image)} alt={product?.name ?? 'Product detail'} crossOrigin="anonymous" className="aspect-[16/10] w-full object-cover" />
        </div>
        <div className="flex flex-col justify-between gap-8 border border-[#CDBB9F] bg-[#F7F0E4] p-6">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#741F2B]">{product?.category ?? 'Mojri'}</p>
            <h2 className="font-serif text-4xl font-light tracking-tight">{product?.name ?? 'Signature Mojri'}</h2>
            <p className="text-lg font-semibold text-[#741F2B]">{money(product?.price ?? 0)}</p>
            <p className="max-w-xl leading-8 text-[#765F55]">{product?.description ?? 'Hand-finished leather, balanced comfort, and a ceremonial profile designed for long wear.'}</p>
            <div className="grid gap-3 text-sm text-[#765F55]">
              <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#741F2B]" /> {product?.craftsmanship ?? 'Hand-embroidered by master artisans'}</div>
              <div className="flex items-center gap-2"><Shield size={16} className="text-[#741F2B]" /> {product?.material ?? 'Premium leather and textile lining'}</div>
              <div className="flex items-center gap-2"><MapPin size={16} className="text-[#741F2B]" /> {artisan?.location ?? 'Jodhpur, Rajasthan'}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { if (product) { addItem({ product, quantity: 1 }); toast.success('Added to cart'); } }} className="bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#57151F]">
              Add to Cart
            </button>
            <button type="button" onClick={() => navigate('/checkout')} className="border border-[#CDBB9F] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#2B1715] hover:bg-white">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CheckoutForm({ className = '' }: SectionProps) {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const shippingFee = subtotal > 0 ? 250 : 0;
  const total = subtotal + shippingFee;
  const submit = () => {
    if (!items?.length) return toast.error('Your cart is empty');
    toast.success('Order placed successfully');
    clearCart();
    navigate('/confirmation');
  };
  return (
    <section className={cn('bg-[#F7F0E4] px-5 py-10 text-[#2B1715] sm:px-8 lg:px-10', className)}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form className="space-y-4 border border-[#CDBB9F] bg-[#FFFDF8] p-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <h2 className="font-serif text-3xl font-light">Checkout</h2>
          {['Full name', 'Email', 'Phone', 'Address line 1', 'City', 'State', 'Postal code'].map((label) => (
            <input key={label} required placeholder={label} className="w-full border border-[#CDBB9F] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#765F55]" />
          ))}
          <button type="submit" className="w-full bg-[#741F2B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-[#57151F]">
            Place Order
          </button>
        </form>
        <aside className="space-y-4 border border-[#CDBB9F] bg-[#FFFDF8] p-6">
          <h3 className="font-serif text-2xl font-light">Order summary</h3>
          <div className="space-y-3">
            {items?.map((item) => (
              <div key={`${item.productId}-${item.size ?? ''}-${item.color ?? ''}`} className="flex items-center justify-between gap-4 border-b border-[#CDBB9F] pb-3 text-sm">
                <span className="min-w-0 truncate">{item.product?.name ?? 'Item'}</span>
                <span className="shrink-0 text-[#741F2B]">{money((item.product?.price ?? 0) * (item.quantity ?? 1))}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-[#765F55]">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{money(shippingFee)}</span></div>
            <div className="flex justify-between border-t border-[#CDBB9F] pt-2 text-base font-semibold text-[#2B1715]"><span>Total</span><span>{money(total)}</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function ArtisanStoriesView({ className = '' }: SectionProps) {
  const artisans = Object.values(artisanById ?? {}) as Artisan[];
  return (
    <section className={cn('bg-[#FFFDF8] px-5 py-10 text-[#2B1715] sm:px-8 lg:px-10', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#741F2B]">Artisan stories</p>
            <h2 className="mt-2 font-serif text-4xl font-light">The hands behind the pair</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm text-[#765F55] md:flex"><Users size={16} /> Living lineage</div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {artisans.slice(0, 3).map((artisan, index) => (
            <article key={artisan.id} className="overflow-hidden border border-[#CDBB9F] bg-[#F7F0E4]">
              <img src={img(verifiedImageUrls?.[index + 2])} alt={artisan.name} crossOrigin="anonymous" className="aspect-[4/5] w-full object-cover" />
              <div className="space-y-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#741F2B]">{artisan.location}</p>
                <h3 className="font-serif text-2xl font-light">{artisan.name}</h3>
                <p className="text-sm text-[#765F55]">{artisan.lineage}</p>
                <p className="text-sm leading-7 text-[#765F55]">{artisan.specialty}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OrderConfirmationView({ className = '' }: SectionProps) {
  const order: Order | null = null;
  return (
    <section className={cn('bg-[#F7F0E4] px-5 py-10 text-[#2B1715] sm:px-8 lg:px-10', className)}>
      <div className="mx-auto max-w-4xl border border-[#CDBB9F] bg-[#FFFDF8] p-6 text-center">
        <CheckCircle2 className="mx-auto text-[#741F2B]" size={40} />
        <h2 className="mt-4 font-serif text-4xl font-light">Order confirmed</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-8 text-[#765F55]">Your order has been received and is being prepared with artisan care.</p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
          <div className="border border-[#CDBB9F] p-4"><p className="text-xs uppercase tracking-[0.35em] text-[#765F55]">Status</p><p className="mt-2 font-semibold">{order?.status ?? 'confirmed'}</p></div>
          <div className="border border-[#CDBB9F] p-4"><p className="text-xs uppercase tracking-[0.35em] text-[#765F55]">ETA</p><p className="mt-2 font-semibold flex items-center gap-2"><Clock size={16} /> 3-5 days</p></div>
          <div className="border border-[#CDBB9F] p-4"><p className="text-xs uppercase tracking-[0.35em] text-[#765F55]">Tracking</p><p className="mt-2 font-semibold">Shared by email</p></div>
        </div>
      </div>
    </section>
  );
}

const JourneyViews = {
  HomeEditorial,
  ProductDetailView,
  CheckoutForm,
  ArtisanStoriesView,
  OrderConfirmationView,
};

export default JourneyViews;
export { JourneyViews };
