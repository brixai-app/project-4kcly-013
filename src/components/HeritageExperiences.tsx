import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Sparkles, Circle as Icon } from 'lucide-react';
import { toast } from 'sonner';
import { editorialStories } from '@/data/mockData';
import type { CustomOrderRequest } from '@/types';
import { cn } from '@/lib/utils';

type Story = {
  title: string;
  location: string;
  copy: string;
  image: string;
  accent: string;
};

const stories: Story[] = editorialStories?.length
  ? editorialStories.map((story: any, index: number) => ({
      title: story?.title ?? `Heritage Story ${index + 1}`,
      location: story?.location ?? 'Jodhpur',
      copy: story?.copy ?? story?.story ?? 'A quiet study in hand-finished leather, heritage silhouettes, and ceremonial detail.',
      image: story?.image ?? 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      accent: story?.accent ?? 'maroon',
    }))
  : [
      {
        title: 'The Lasting Curve',
        location: 'Jodhpur',
        copy: 'Hand-cut uppers, patient stitching, and a softened toe line shaped for long ceremonial evenings.',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
        accent: 'maroon',
      },
      {
        title: 'Workshop Light',
        location: 'Old City',
        copy: 'A measured palette of ivory, tan, and deep brown keeps the craft visible and the silhouette refined.',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        accent: 'gold',
      },
    ];

const initialForm: CustomOrderRequest = {
  fullName: '',
  email: '',
  phone: '',
  occasion: '',
  size: '',
  colorPreference: '',
  budget: '',
  timeline: '',
  notes: '',
};

const requiredFields: (keyof CustomOrderRequest)[] = ['fullName', 'email', 'phone', 'occasion', 'size', 'budget', 'timeline'];

export function ArtisanStoryList({ className = '' }: { className?: string } = {}) {
  return (
    <section className={cn('space-y-0', className)}>
      {stories.map((story, index) => (
        <motion.article
          key={`${story.title}-${index}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'grid min-h-[72vh] overflow-hidden border border-[#C9A66B] bg-[#FFF9F0]',
            index % 2 === 0 ? 'lg:grid-cols-[1.15fr_0.85fr]' : 'lg:grid-cols-[0.85fr_1.15fr]'
          )}
        >
          <div className={cn('relative flex items-end p-6 sm:p-10 lg:p-14', index % 2 === 0 ? 'order-1' : 'order-2')}>
            <img
              src={story.image}
              alt={story.title}
              crossOrigin="anonymous"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/20 to-transparent" />
            <div className="relative max-w-xl text-white">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#F5F0E6]/90">{story.location}</p>
              <h3 className="font-['Playfair_Display'] text-4xl font-light tracking-tight sm:text-5xl">{story.title}</h3>
              <div className="mt-6 h-px w-24 bg-[#C9A66B]" />
            </div>
          </div>
          <div className={cn('flex flex-col justify-between gap-8 p-6 sm:p-10 lg:p-14', index % 2 === 0 ? 'order-2' : 'order-1')}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7B2D26]">Maker narrative</p>
              <p className="mt-5 max-w-2xl font-['Lora'] text-base leading-8 text-[#2B2B2B] sm:text-lg">{story.copy}</p>
            </div>
            <div className="grid gap-4 border-t border-[#C9A66B]/60 pt-6 sm:grid-cols-2">
              {[
                ['Hand-finished', 'Every pair is shaped and polished by hand.'],
                ['Heritage fit', 'Balanced for ceremonial wear and long comfort.'],
              ].map(([label, text]) => (
                <div key={label} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7B2D26]">{label}</p>
                  <p className="text-sm leading-7 text-[#6F655B]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

export function CustomOrderForm({ className = '' }: { className?: string } = {}) {
  const [form, setForm] = useState<CustomOrderRequest>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const missing = useMemo(
    () => requiredFields.filter((field) => !(form?.[field]?.trim?.() ?? '')),
    [form]
  );

  const update = (field: keyof CustomOrderRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (missing.length > 0) {
      toast.error('Please complete the required bespoke request fields.');
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSubmitting(false);
    toast.success('Your bespoke request has been received. We will respond shortly.');
    setForm(initialForm);
  };

  const inputClass =
    'w-full border border-[#C9A66B] bg-[#FFF9F0] px-4 py-3 text-sm text-[#2B2B2B] outline-none transition placeholder:text-[#6F655B]/70 focus:border-[#7B2D26]';

  return (
    <section className={cn('border border-[#C9A66B] bg-[#F5F0E6] p-6 sm:p-8 lg:p-10', className)}>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7B2D26]">Bespoke order</p>
          <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-light tracking-tight text-[#2B2B2B] sm:text-4xl">
            Commission a pair made for the occasion
          </h2>
        </div>
        <Sparkles className="hidden h-6 w-6 text-[#C9A66B] sm:block" />
      </div>

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {[
          ['fullName', 'Full name'],
          ['email', 'Email address'],
          ['phone', 'Phone number'],
          ['occasion', 'Occasion'],
          ['size', 'Size'],
          ['colorPreference', 'Color preference'],
          ['budget', 'Budget'],
          ['timeline', 'Timeline'],
        ].map(([field, label]) => (
          <label key={field} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">{label}</span>
            <input
              value={form?.[field as keyof CustomOrderRequest] ?? ''}
              onChange={(e) => update(field as keyof CustomOrderRequest, e.target.value)}
              className={inputClass}
              placeholder={label}
              type={field === 'email' ? 'email' : 'text'}
            />
          </label>
        ))}
        <label className="md:col-span-2 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            className={cn(inputClass, 'min-h-32 resize-y')}
            placeholder="Share embroidery references, fit concerns, or delivery notes."
          />
        </label>

        <div className="md:col-span-2 flex flex-col gap-4 border-t border-[#C9A66B]/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-[#6F655B]">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#7B2D26]" />Validated request</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-[#7B2D26]" />Response within 24 hours</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#61211C] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting' : 'Send request'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4 border-t border-[#C9A66B]/60 pt-6 sm:grid-cols-3">
        {[
          [MapPin, 'Jodhpur atelier', 'Crafted in the old city with heritage methods.'],
          [Phone, 'Direct consultation', 'Speak with our team for sizing and timeline guidance.'],
          [Mail, 'Concierge follow-up', 'We confirm details before production begins.'],
        ].map(([Icon, title, text]) => (
          <div key={title as string} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-[#7B2D26]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2B2B2B]">{title as string}</p>
            </div>
            <p className="text-sm leading-7 text-[#6F655B]">{text as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArtisanStoryList;