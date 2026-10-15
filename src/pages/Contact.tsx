import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { masonryConfig } from '@/data/mockData';

export interface ContactProps {
  className?: string;
}

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  preferredTime: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
  reason?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 'appointments',
    question: 'Do I need an appointment to visit the Jootiya studio?',
    answer:
      'Walk-ins are welcome during studio hours, but we recommend booking a private fitting if you are exploring multiple pairs or custom work. Private sessions guarantee a dedicated stylist and fitting lounge slot.',
  },
  {
    id: 'custom',
    question: 'Do you offer custom or made-to-measure footwear?',
    answer:
      'Yes. Our atelier offers made-to-order colorways, exotic leathers on select lasts, and full bespoke builds for select silhouettes. Share your brief via the concierge form and we will follow up with timelines and pricing.',
  },
  {
    id: 'international',
    question: 'Do you ship internationally?',
    answer:
      'We currently ship to most major destinations in North America, Europe, and the Middle East. Duties and taxes are calculated at checkout where available; otherwise, local import fees may apply upon delivery.',
  },
  {
    id: 'sizing',
    question: 'How does Jootiya sizing run?',
    answer:
      'Most of our sneakers run true to size. For loafers, oxfords, and heels, we include specific fit notes on each product page. If you are between sizes or have a high arch, we recommend reaching out with your measurements.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'Unworn, undamaged pairs in original packaging can be returned or exchanged within 14 days of delivery. Limited-run and monogrammed pieces are final sale. Our concierge team can guide you through the process.',
  },
];

export function Contact({ className = '' }: ContactProps) {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
    preferredTime: '',
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(faqItems[0]?.id ?? null);

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: ContactFormErrors = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.reason.trim()) next.reason = 'Please select a reason.';
    if (!form.message.trim() || form.message.trim().length < 16) {
      next.message = 'Share a bit more detail (at least 16 characters).';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error('A few details need your attention.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Your message has been received. Our concierge will respond shortly.');
      setForm({
        name: '',
        email: '',
        phone: '',
        reason: '',
        message: '',
        preferredTime: '',
      });
    }, 900);
  };

  const toggleFaq = (id: string) => {
    setActiveFaq(prev => (prev === id ? null : id));
  };

  const masonryHint = masonryConfig?.length ?? 0;

  return (
    <div className={cn('min-h-screen bg-[#F9F6F2] text-[#2E2B28]', className)}>
      <main className="w-full pt-24 pb-20">
        <section className="w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="lg:col-span-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#6F675E] mb-4">
                    Studio Concierge
                  </p>
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-5"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    A direct line to the Jootiya fitting room.
                  </h1>
                  <p className="text-sm sm:text-base text-[#6F675E] max-w-xl leading-relaxed mb-8">
                    Whether you are curating a daily rotation or commissioning a custom pair, our
                    stylists respond to every note personally. Share your brief and we will align
                    sizing, availability, and timing before you ever step into the studio.
                  </p>
                </div>
                <div className="hidden lg:block relative mt-6">
                  <div className="border border-[#D9D1C7] rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm">
                    <div className="grid grid-cols-3 divide-x divide-[#D9D1C7]/70">
                      <div className="p-5">
                        <p className="text-[11px] tracking-[0.18em] uppercase text-[#6F675E] mb-2">
                          Response window
                        </p>
                        <p className="text-sm font-medium">Within 24 hours</p>
                        <p className="text-xs text-[#6F675E] mt-1">
                          Concierge replies for all new enquiries.
                        </p>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] tracking-[0.18em] uppercase text-[#6F675E] mb-2">
                          Private fittings
                        </p>
                        <p className="text-sm font-medium">Wed – Sun</p>
                        <p className="text-xs text-[#6F675E] mt-1">
                          Early evenings & late weekends by request.
                        </p>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] tracking-[0.18em] uppercase text-[#6F675E] mb-2">
                          Curation rhythm
                        </p>
                        <p className="text-sm font-medium">
                          {masonryHint > 0 ? `${masonryHint} masonry patterns` : 'Seasonal drops'}
                        </p>
                        <p className="text-xs text-[#6F675E] mt-1">
                          A rotating salon of capsules and limited runs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                className="lg:col-span-6"
              >
                <div className="relative h-full">
                  <div className="absolute inset-3 rounded-3xl border border-[#D9D1C7]/80" />
                  <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-[#D9D1C7]/70">
                    <div className="grid grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-3 p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <span
                              className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                              style={{ fontFamily: 'Bodoni Moda, serif' }}
                            >
                              Write to the studio
                            </span>
                            <span className="text-[11px] text-[#6F675E]">
                              All fields marked * are required
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium tracking-wide text-[#2E2B28]">
                                Full name *
                              </label>
                              <input
                                type="text"
                                value={form.name}
                                onChange={e => handleChange('name', e.target.value)}
                                className={cn(
                                  'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none transition',
                                  'border-[#D9D1C7] focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]',
                                  errors.name && 'border-[#8B0000]'
                                )}
                                placeholder="How should we address you?"
                              />
                              {errors.name && (
                                <p className="text-[11px] text-[#8B0000]">{errors.name}</p>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium tracking-wide text-[#2E2B28]">
                                Email *
                              </label>
                              <input
                                type="email"
                                value={form.email}
                                onChange={e => handleChange('email', e.target.value)}
                                className={cn(
                                  'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none transition',
                                  'border-[#D9D1C7] focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]',
                                  errors.email && 'border-[#8B0000]'
                                )}
                                placeholder="studio@yourdomain.com"
                              />
                              {errors.email && (
                                <p className="text-[11px] text-[#8B0000]">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium tracking-wide text-[#2E2B28]">
                                WhatsApp / phone
                              </label>
                              <input
                                type="tel"
                                value={form.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                                className="w-full rounded-xl border border-[#D9D1C7] px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition"
                                placeholder="+91 00000 00000"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium tracking-wide text-[#2E2B28]">
                                Reason *
                              </label>
                              <select
                                value={form.reason}
                                onChange={e => handleChange('reason', e.target.value)}
                                className={cn(
                                  'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none transition',
                                  'border-[#D9D1C7] focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]',
                                  errors.reason && 'border-[#8B0000]'
                                )}
                              >
                                <option value="">Select one</option>
                                <option value="private-fitting">Private fitting appointment</option>
                                <option value="custom-order">Custom / made-to-order brief</option>
                                <option value="sizing-guidance">Sizing and fit guidance</option>
                                <option value="order-support">Existing order support</option>
                                <option value="press-styling">Press / styling pull</option>
                                <option value="other">Something else</option>
                              </select>
                              {errors.reason && (
                                <p className="text-[11px] text-[#8B0000]">{errors.reason}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="flex items-center justify-between text-xs font-medium tracking-wide text-[#2E2B28]">
                              <span>Tell us about your brief *</span>
                              <span className="text-[11px] text-[#6F675E]">
                                {Math.max(form.message.trim().length, 0)} characters
                              </span>
                            </label>
                            <textarea
                              value={form.message}
                              onChange={e => handleChange('message', e.target.value)}
                              rows={4}
                              className={cn(
                                'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none resize-none transition',
                                'border-[#D9D1C7] focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]',
                                errors.message && 'border-[#8B0000]'
                              )}
                              placeholder="Pairs you are considering, typical sizes in other brands, timelines, or any references you love."
                            />
                            {errors.message && (
                              <p className="text-[11px] text-[#8B0000]">{errors.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium tracking-wide text-[#2E2B28]">
                                Preferred contact window
                              </label>
                              <input
                                type="text"
                                value={form.preferredTime}
                                onChange={e => handleChange('preferredTime', e.target.value)}
                                className="w-full rounded-xl border border-[#D9D1C7] px-3.5 py-2.5 text-sm bg-[#FDFBF8] outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] transition"
                                placeholder="e.g., Weekday evenings, 5–7 PM IST"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                            <button
                              type="submit"
                              disabled={submitting}
                              className={cn(
                                'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase',
                                'rounded-xl bg-[#8B0000] text-white hover:bg-[#6F0000] transition-colors',
                                'disabled:opacity-60 disabled:cursor-not-allowed'
                              )}
                            >
                              <span>{submitting ? 'Sending' : 'Submit enquiry'}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="text-[11px] text-[#6F675E] leading-relaxed">
                              By submitting, you agree to be contacted by our team via email or
                              phone regarding this enquiry.
                            </p>
                          </div>
                        </form>
                      </div>

                      <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-[#D9D1C7]/80 bg-[#F9F6F2]">
                        <div className="h-full flex flex-col">
                          <div className="relative aspect-[3/4] w-full overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1630905119003-329447458f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDY2MTIyfDB8MXxzZWFyY2h8Mnx8YXJjaGl0ZWN0dXJhbCUyMGJvdXRpcXVlJTIwaW50ZXJpb3IlMjBuZXV0cmFsJTIwcGFsZXR0ZXxlbnwwfDB8fHwxNzkyMDc3NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&q=80&w=1200&auto=format&fit=crop"
                              alt="Jootiya studio lounge with sneakers displayed on warm taupe shelving"
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F2] via-transparent to-transparent opacity-80" />
                          </div>
                          <div className="p-4 sm:p-5 space-y-3">
                            <div>
                              <p className="text-[11px] tracking-[0.22em] uppercase text-[#6F675E] mb-1">
                                Studio hotline
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-[#6F675E]" />
                                <span>+91 98765 43210</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-[11px] tracking-[0.22em] uppercase text-[#6F675E] mb-1">
                                Concierge email
                              </p>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-[#6F675E]" />
                                <span>concierge@jootiya.studio</span>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-dashed border-[#D9D1C7]/80 mt-1">
                              <p className="text-[11px] tracking-[0.22em] uppercase text-[#6F675E] mb-1">
                                Preferred for quick sizing help
                              </p>
                              <p className="text-xs text-[#6F675E]">
                                Drop us a note with your usual sizes and brands you wear daily. We
                                will recommend the ideal last and size before you commit.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full mt-16">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="lg:col-span-5"
              >
                <div className="border border-[#D9D1C7] rounded-3xl overflow-hidden bg-white">
                  <div className="relative h-52 sm:h-64 w-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
                      alt="Jootiya flagship studio exterior in a neutral architectural setting"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f130d]/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-[11px] tracking-[0.24em] uppercase text-white/80 mb-1">
                          Flagship studio
                        </p>
                        <p
                          className="text-lg sm:text-xl text-white"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          Jootiya, Kala Ghoda
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/30 px-3 py-1 text-[11px] text-white backdrop-blur">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Mumbai</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7 space-y-5">
                    <div className="space-y-1">
                      <p className="text-xs tracking-[0.22em] uppercase text-[#6F675E]">
                        Location
                      </p>
                      <p className="text-sm font-medium">
                        3rd Floor, Ivory House,
                        <br />
                        Ropewalk Lane, Kala Ghoda,
                        <br />
                        Mumbai 400001, India
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-xs tracking-[0.22em] uppercase text-[#6F675E] mb-1.5">
                          Studio hours
                        </p>
                        <div className="flex items-start gap-2 text-xs text-[#2E2B28]">
                          <Clock className="w-4 h-4 mt-0.5 text-[#6F675E]" />
                          <div>
                            <p>Wednesday – Sunday</p>
                            <p className="text-[#6F675E]">12:00 PM – 8:30 PM IST</p>
                            <p className="mt-2">Private appointments</p>
                            <p className="text-[#6F675E]">10:30 AM – 12:00 PM IST</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.22em] uppercase text-[#6F675E] mb-1.5">
                          Access
                        </p>
                        <p className="text-xs text-[#2E2B28]">
                          Valet parking available after 4 PM.
                          <br />
                          Elevator access to all floors.
                          <br />
                          Quiet fitting lounge on request.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-dashed border-[#D9D1C7]/80 pt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          toast.info('Map opening is simulated in this preview.');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#2E2B28] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-[#2E2B28] hover:text-white transition-colors"
                      >
                        <span>Open in maps</span>
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                      <p className="text-[11px] text-[#6F675E]">
                        Share your arrival time and we will reserve a fitting suite.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
                className="lg:col-span-7"
              >
                <div className="border border-[#D9D1C7] rounded-3xl bg-white px-4 sm:px-6 py-6 sm:py-7">
                  <div className="flex items-baseline justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[11px] tracking-[0.24em] uppercase text-[#6F675E] mb-2">
                        Studio FAQ
                      </p>
                      <h2
                        className="text-xl sm:text-2xl font-light tracking-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        The questions we hear in the fitting room, answered in advance.
                      </h2>
                    </div>
                  </div>
                  <div className="divide-y divide-[#D9D1C7]/80">
                    {faqItems.map(item => {
                      const isOpen = activeFaq === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleFaq(item.id)}
                          className="w-full text-left py-4 sm:py-5 focus:outline-none group"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm sm:text-base font-medium text-[#2E2B28]">
                              {item.question}
                            </p>
                            <div
                              className={cn(
                                'flex items-center justify-center rounded-full border border-[#D9D1C7] w-7 h-7 shrink-0 transition-colors',
                                isOpen && 'bg-[#2E2B28] border-[#2E2B28]'
                              )}
                            >
                              <ChevronDown
                                className={cn(
                                  'w-4 h-4 text-[#2E2B28] transition-transform',
                                  isOpen && 'rotate-180 text-white'
                                )}
                              />
                            </div>
                          </div>
                          <motion.div
                            initial={false}
                            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs sm:text-sm text-[#6F675E] mt-3 leading-relaxed max-w-2xl">
                              {item.answer}
                            </p>
                          </motion.div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-4 border-t border-dashed border-[#D9D1C7]/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#2E2B28]">
                      <span className="inline-flex w-2 h-2 rounded-sm bg-[#8B0000]" />
                      <span>
                        Still wondering about something specific? Mention it in your concierge note
                        and we will tailor our reply.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contact;