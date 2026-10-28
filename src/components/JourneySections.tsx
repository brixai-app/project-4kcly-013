import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Globe2, Heart, Shield, Sparkles, Star, Truck, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Artisan, CustomOrderRequest, Product } from '@/types';

const assets = [
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
];

const sampleArtisans: Artisan[] = [
  { id: 'a1', name: 'Rafiq Khan', location: 'Jodhpur', specialty: 'Hand-embroidered uppers', story: 'Generations of precision stitching shaped by wedding commissions and heirloom repairs.', portrait: assets[1], yearsActive: 24, signature: ['Aari', 'Zardozi'] },
  { id: 'a2', name: 'Salma Bano', location: 'Bikaner', specialty: 'Mirror and thread work', story: 'Balances delicate ornament with durable construction for everyday luxury.', portrait: assets[2], yearsActive: 18, signature: ['Mirror work', 'Silk thread'] },
];

const sampleProducts: Product[] = [
  { id: 'p1', slug: 'marigold-heritage-mojri', name: 'Marigold Heritage Mojri', category: 'Heritage', gender: 'Unisex', price: 4999, description: 'A ceremonial silhouette with restrained gold detailing.', artisan: 'Rafiq Khan', material: 'Leather, silk thread', color: 'Terracotta', sizes: ['6', '7', '8', '9', '10'], image: assets[0], rating: 4.9, reviewCount: 84, availability: 'in_stock', featured: true, handcrafted: true, stock: 12 },
  { id: 'p2', slug: 'ivory-everyday-jutti', name: 'Ivory Everyday Jutti', category: 'Everyday', gender: 'Women', price: 3299, description: 'Soft-lined and versatile with a polished almond toe.', artisan: 'Salma Bano', material: 'Suede, cotton lining', color: 'Ivory', sizes: ['5', '6', '7', '8'], image: assets[3], rating: 4.7, reviewCount: 51, availability: 'low_stock', newArrival: true, handcrafted: true, stock: 4 },
];

const Section = ({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) => (
  <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">{eyebrow}</p> : null}
        <h2 className="font-['Bodoni_Moda'] text-3xl font-light tracking-tight text-[#2E2B28] sm:text-4xl">{title}</h2>
      </div>
    </div>
    {children}
  </section>
);

export function ProductExperience({ products = sampleProducts }: { products?: Product[] }) {
  const featured = products?.[0] ?? sampleProducts[0];
  return (
    <Section title="Product experience" eyebrow="Curated edit">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9]">
          <img src={featured?.image ?? assets[0]} alt={featured?.name ?? 'Featured product'} crossOrigin="anonymous" className="h-[28rem] w-full object-cover" />
        </motion.div>
        <div className="flex flex-col justify-between gap-4 rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">{featured?.category ?? 'Heritage'}</p>
            <h3 className="mt-2 font-['Bodoni_Moda'] text-3xl font-light text-[#2E2B28]">{featured?.name ?? 'Signature Mojri'}</h3>
            <p className="mt-4 text-sm leading-6 text-[#6E6258]">{featured?.description ?? 'Hand-finished with a refined profile and enduring comfort.'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#2E2B28]">
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-[#C1440E]" />{featured?.rating ?? 4.8}</span>
            <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-[#C1440E]" />{featured?.reviewCount ?? 0} reviews</span>
            <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-[#C1440E]" />Handcrafted</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function CartExperience({ items = [] }: { items?: { name: string; price: number; quantity: number }[] }) {
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  return (
    <Section title="Cart experience" eyebrow="Persistent drawer logic">
      <div className="grid gap-4 rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-6 md:grid-cols-2">
        <div className="space-y-3">
          {items.length ? items.map((item) => <div key={item.name} className="flex items-center justify-between border-b border-[#E7DDCB] pb-3 text-sm"><span className="truncate text-[#2E2B28]">{item.name}</span><span className="text-[#6E6258]">×{item.quantity}</span></div>) : <p className="text-sm text-[#6E6258]">Your selected pieces will appear here and persist in the slide-over drawer.</p>}
        </div>
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-sm"><span className="text-[#6E6258]">Subtotal</span><span className="font-semibold text-[#2E2B28]">₹{subtotal.toLocaleString('en-IN')}</span></div>
          <button type="button" onClick={() => toast.success('Cart drawer ready for checkout')} className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#963308]"><Truck className="h-4 w-4" />Open drawer</button>
        </div>
      </div>
    </Section>
  );
}

export function CheckoutForm({ onSubmit }: { onSubmit?: (payload: CustomOrderRequest) => void }) {
  const [form, setForm] = useState<CustomOrderRequest>({ name: '', phone: '', email: '', occasion: '', size: '', notes: '' });
  const submit = () => {
    if (!form.name || !form.phone || !form.occasion || !form.size) return toast.error('Please complete the required fields');
    onSubmit?.(form);
    toast.success('Checkout request submitted');
  };
  return (
    <Section title="Checkout form" eyebrow="Secure order flow">
      <div className="grid gap-4 rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-6 md:grid-cols-2">
        {['name', 'phone', 'occasion', 'size'].map((key) => <input key={key} value={(form as any)?.[key] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={key} className="min-w-0 rounded-[6px] border border-[#CDBB9B] bg-white px-3 py-3 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]" />)}
        <textarea value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="md:col-span-2 min-h-28 rounded-[6px] border border-[#CDBB9B] bg-white px-3 py-3 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]" />
        <button type="button" onClick={submit} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#963308]"><Check className="h-4 w-4" />Confirm order</button>
      </div>
    </Section>
  );
}

export function ArtisanGallery({ artisans = sampleArtisans }: { artisans?: Artisan[] }) {
  return (
    <Section title="Artisan gallery" eyebrow="Hands behind the craft">
      <div className="grid gap-4 md:grid-cols-2">
        {artisans.map((artisan) => (
          <motion.article key={artisan.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9]">
            <img src={artisan.portrait} alt={artisan.name} crossOrigin="anonymous" className="h-72 w-full object-cover" />
            <div className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">{artisan.location}</p>
              <h3 className="font-['Bodoni_Moda'] text-2xl font-light text-[#2E2B28]">{artisan.name}</h3>
              <p className="text-sm text-[#6E6258]">{artisan.story}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

export function ArtisanProfile({ artisan = sampleArtisans[0] }: { artisan?: Artisan }) {
  return (
    <Section title="Artisan profile" eyebrow="Signature maker">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <img src={artisan?.portrait ?? assets[1]} alt={artisan?.name ?? 'Artisan portrait'} crossOrigin="anonymous" className="h-[30rem] w-full rounded-[6px] object-cover" />
        <div className="rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E6258]">{artisan?.specialty ?? 'Craft specialist'}</p>
          <h3 className="mt-2 font-['Bodoni_Moda'] text-3xl font-light text-[#2E2B28]">{artisan?.name ?? 'Master artisan'}</h3>
          <p className="mt-4 text-sm leading-6 text-[#6E6258]">{artisan?.story ?? 'A story of measured hands, patient finishing, and enduring form.'}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-[#2E2B28]">{(artisan?.signature ?? ['Handmade', 'Heritage']).map((s) => <span key={s} className="rounded-[6px] border border-[#CDBB9B] px-3 py-2">{s}</span>)}</div>
        </div>
      </div>
    </Section>
  );
}

export function CustomOrderForm({ onSubmit }: { onSubmit?: (payload: CustomOrderRequest) => void }) {
  const [form, setForm] = useState<CustomOrderRequest>({ name: '', phone: '', email: '', occasion: '', size: '', colorPreference: '', notes: '' });
  const submit = () => {
    if (!form.name || !form.phone || !form.occasion || !form.size) return toast.error('Please complete the custom order fields');
    onSubmit?.(form);
    toast.success('Custom order request sent');
  };
  return (
    <Section title="Custom order" eyebrow="Made to measure">
      <div className="grid gap-4 rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-6 md:grid-cols-2">
        {['name', 'phone', 'email', 'occasion', 'size', 'colorPreference'].map((key) => <input key={key} value={(form as any)?.[key] ?? ''} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={key} className="min-w-0 rounded-[6px] border border-[#CDBB9B] bg-white px-3 py-3 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]" />)}
        <textarea value={form.notes ?? ''} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" className="md:col-span-2 min-h-28 rounded-[6px] border border-[#CDBB9B] bg-white px-3 py-3 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]" />
        <button type="button" onClick={submit} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#C1440E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#963308]"><Sparkles className="h-4 w-4" />Request quote</button>
      </div>
    </Section>
  );
}

export function EditorialNotFound({ title = 'Page not found', message = 'The requested editorial section could not be located.' }: { title?: string; message?: string }) {
  return (
    <Section title={title} eyebrow="Editorial error">
      <div className="flex flex-col items-start gap-4 rounded-[6px] border border-[#CDBB9B] bg-[#FFFDF9] p-8">
        <p className="max-w-xl text-sm leading-6 text-[#6E6258]">{message}</p>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#C1440E]"><Globe2 className="h-4 w-4" />Return to collection</div>
      </div>
    </Section>
  );
}

export function JourneySections() {
  return (
    <div className="bg-[#F9F5F0]">
      <ProductExperience />
      <ArtisanGallery />
      <CustomOrderForm />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-[#1F1A17] px-4 py-12 text-[#FFFDF9]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-2 sm:px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#CDBB9B]">Craft manifesto</p>
          <h3 className="font-['Bodoni_Moda'] text-3xl font-light">Built for ritual, worn for years.</h3>
          <p className="max-w-2xl text-sm leading-6 text-[#D8CBB8]">A tactile storefront with measured motion, secure checkout, and artisan-led storytelling.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default JourneySections;