import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Instagram, Twitter, Facebook, MapPin, Clock, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { theme, typographyTokens } from '@/data/mockData';

export interface FooterProps {
  showBorderTop?: boolean;
}

interface NewsletterFormState {
  email: string;
}

function validateEmail(value: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length < 5) return false;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(trimmed);
}

export function Footer({ showBorderTop = true }: FooterProps) {
  const [newsletter, setNewsletter] = useState<NewsletterFormState>({ email: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const email = newsletter.email.trim();
    if (!validateEmail(email)) {
      toast.error('Add a valid email so we can reserve your spot.', {
        description: 'Example: name@jootiya.studio',
      });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setNewsletter({ email: '' });
      toast.success('You are on the list.', {
        description: 'Expect a quietly curated dispatch from Jootiya soon.',
      });
    }, 900);
  };

  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'w-full bg-[#F9F6F2] pt-12 md:pt-16 pb-8 md:pb-10 mt-16',
        showBorderTop && 'border-t border-[#D9D1C7]'
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex items-center gap-3">
              <span
                className="px-2.5 py-1 border border-[#D9D1C7] bg-white/70 text-[10px] tracking-[0.25em] uppercase text-[#6F675E]"
                style={{ borderRadius: theme?.radius ?? 16 }}
              >
                Jootiya Studio
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.7rem] leading-tight text-[#2E2B28]"
              style={{ fontFamily: typographyTokens?.displayFamily ?? 'Playfair Display, serif' }}
            >
              Footnotes from a
              <span className="block lg:inline"> quieter wardrobe.</span>
            </h2>
            <p
              className="text-sm sm:text-base text-[#6F675E] max-w-xl"
              style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
            >
              Receive occasional dispatches: new silhouettes, limited drops, and studio stories.
              No noise, just considered footwear.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="footer-email"
                  className="flex items-center gap-2 text-xs tracking-[0.23em] uppercase text-[#6F675E] mb-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Newsletter</span>
                </label>
                <div
                  className="flex items-center gap-2 bg-white border border-[#D9D1C7] px-3 py-2.5 focus-within:border-[#8B0000] transition-colors"
                  style={{ borderRadius: theme?.radius ?? 16 }}
                >
                  <input
                    id="footer-email"
                    type="email"
                    value={newsletter.email}
                    onChange={(e) =>
                      setNewsletter((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="you@jootiya.studio"
                    className="flex-1 bg-transparent outline-none text-sm text-[#2E2B28] placeholder:text-[#B1A79B]"
                    style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase',
                  'bg-[#8B0000] text-white hover:bg-[#6F0000] transition-colors',
                  'border border-[#8B0000]',
                  'disabled:opacity-60 disabled:cursor-not-allowed'
                )}
                style={{ borderRadius: theme?.radius ?? 16 }}
              >
                <span>{submitting ? 'Sending' : 'Join List'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[11px] text-[#9A9186] max-w-md leading-relaxed">
              By joining, you consent to tailored emails from Jootiya. You may unsubscribe at any time.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            <div className="space-y-3">
              <h3
                className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                style={{ fontFamily: typographyTokens?.accentFamily ?? 'Bodoni Moda, serif' }}
              >
                Customer Care
              </h3>
              <div className="h-px bg-[#D9D1C7]/80 w-8" />
              <ul
                className="space-y-2.5 text-sm text-[#2E2B28]"
                style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
              >
                <li>
                  <Link to="/shop" className="hover:text-[#8B0000] transition-colors">
                    Shop all footwear
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#8B0000] transition-colors">
                    Size & fit concierge
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Return policy', {
                        description: 'Complimentary returns within 14 days on unworn pairs.',
                      })
                    }
                    className="hover:text-[#8B0000] transition-colors"
                  >
                    Returns & exchanges
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Care guide', {
                        description: 'Hand-finished leather ages best with gentle, regular care.',
                      })
                    }
                    className="hover:text-[#8B0000] transition-colors"
                  >
                    Care & maintenance
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3
                className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                style={{ fontFamily: typographyTokens?.accentFamily ?? 'Bodoni Moda, serif' }}
              >
                Shipping & Duties
              </h3>
              <div className="h-px bg-[#D9D1C7]/80 w-8" />
              <ul
                className="space-y-2.5 text-sm text-[#2E2B28]"
                style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
              >
                <li className="text-[#6F675E]">
                  Complimentary standard shipping on domestic orders above ₹12,000.
                </li>
                <li className="text-[#6F675E]">
                  Duties are calculated at checkout for international deliveries.
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Dispatch timings', {
                        description: 'Pairs leave our studio within 2 business days.',
                      })
                    }
                    className="hover:text-[#8B0000] transition-colors"
                  >
                    Dispatch windows
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info('Packaging', {
                        description: 'Each pair arrives in a reusable, fabric-lined archival box.',
                      })
                    }
                    className="hover:text-[#8B0000] transition-colors"
                  >
                    Packaging details
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3
                className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                style={{ fontFamily: typographyTokens?.accentFamily ?? 'Bodoni Moda, serif' }}
              >
                Studio
              </h3>
              <div className="h-px bg-[#D9D1C7]/80 w-8" />
              <div
                className="space-y-2.5 text-sm text-[#2E2B28]"
                style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
              >
                <p className="flex items-start gap-2 text-[#6F675E]">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>
                    Jootiya Studio, 3rd Floor
                    <br />
                    Ivory Arcade, Kala Ghoda
                    <br />
                    Mumbai, India
                  </span>
                </p>
                <p className="flex items-start gap-2 text-[#6F675E]">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <span>
                    Monday–Saturday
                    <br />
                    11:00 – 19:00 IST
                  </span>
                </p>
                <p className="flex items-start gap-2 text-[#6F675E]">
                  <Phone className="w-4 h-4 mt-0.5" />
                  <span>Concierge: +91-00000-00000</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3
                className="text-xs tracking-[0.22em] uppercase text-[#6F675E]"
                style={{ fontFamily: typographyTokens?.accentFamily ?? 'Bodoni Moda, serif' }}
              >
                Social
              </h3>
              <div className="h-px bg-[#D9D1C7]/80 w-8" />
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      toast.message('Instagram', {
                        description: '@jootiya.studio — editorial glimpses from the floor.',
                      })
                    }
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#D9D1C7] bg-white hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"
                    style={{ borderRadius: theme?.radius ?? 16 }}
                  >
                    <Instagram className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast.message('Twitter', {
                        description: '@jootiya — notes, sketches, and work-in-progress silhouettes.',
                      })
                    }
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#D9D1C7] bg-white hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"
                    style={{ borderRadius: theme?.radius ?? 16 }}
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast.message('Facebook', {
                        description: 'Follow Jootiya for collection stories and studio events.',
                      })
                    }
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#D9D1C7] bg-white hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"
                    style={{ borderRadius: theme?.radius ?? 16 }}
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-[11px] text-[#9A9186] leading-relaxed max-w-xs"
                  style={{ fontFamily: typographyTokens?.bodyFamily ?? 'Inter, system-ui, sans-serif' }}
                >
                  A slower, more tactile feed. No algorithms chased, only shoes made to be kept.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 border-t border-dashed border-[#D9D1C7] pt-5 md:pt-6 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between text-[11px] text-[#9A9186]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {year} Jootiya Studio.</span>
            <span>Hand-finished in small batches.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() =>
                toast.info('Terms of use', {
                  description: 'Standard terms apply. Reach out to our concierge for clarifications.',
                })
              }
              className="hover:text-[#6F675E] transition-colors"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info('Privacy policy', {
                  description: 'We treat your data with the same care as our materials.',
                })
              }
              className="hover:text-[#6F675E] transition-colors"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() =>
                toast.info('Cookies', {
                  description: 'Minimal, essential cookies to keep your cart intact.',
                })
              }
              className="hover:text-[#6F675E] transition-colors"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;