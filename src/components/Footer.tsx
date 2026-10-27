import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Youtube, Linkedin, Globe2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Footer({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const links = useMemo(
    () => ({
      care: [
        { label: 'Shipping & Delivery', to: '/journey/shipping' },
        { label: 'Returns & Exchanges', to: '/journey/returns' },
        { label: 'Size Guide', to: '/journey/size-guide' },
        { label: 'Contact Support', to: '/journey/contact' },
      ],
      story: [
        { label: 'Our Jodhpur Story', to: '/journey/story' },
        { label: 'Craftsmanship', to: '/journey/craft' },
        { label: 'Artisan Profiles', to: '/journey/artisans' },
        { label: 'Journal', to: '/journey/journal' },
      ],
      social: [
        { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
        { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
        { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
        { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
      ],
    }),
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You are on the list. Expect the next atelier note soon.');
    setEmail('');
  };

  return (
    <footer className={cn('border-t border-[#D8CDBB] bg-[#FAF9F6] text-[#2B2B2B]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr]">
          <section className="min-w-0">
            <p className="font-[Playfair_Display] text-3xl font-medium tracking-tight">Jootiya</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#6E665C]">
              A warm-ivory editorial storefront for authentic Jodhpuri mojris, shaped by heritage craft, fine gold rules, and a quiet luxury sensibility rooted in Rajasthan.
            </p>
            <div className="mt-6 flex items-start gap-3 text-sm text-[#6E665C]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7135]" />
              <span className="min-w-0 break-words">Jodhpur, Rajasthan, India</span>
            </div>
            <div className="mt-3 flex items-start gap-3 text-sm text-[#6E665C]">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7135]" />
              <a className="min-w-0 break-words transition-colors hover:text-[#9A7135]" href="tel:+919999999999">
                +91 99999 99999
              </a>
            </div>
            <div className="mt-3 flex items-start gap-3 text-sm text-[#6E665C]">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7135]" />
              <a className="min-w-0 break-words transition-colors hover:text-[#9A7135]" href="mailto:care@jootiya.com">
                care@jootiya.com
              </a>
            </div>
          </section>

          <nav aria-label="Customer care" className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Customer Care</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {links.care.map((item) => (
                <li key={item.label}>
                  <Link className="group inline-flex items-center gap-2 text-sm text-[#2B2B2B] transition-colors hover:text-[#9A7135]" to={item.to}>
                    <span className="min-w-0 truncate">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Brand story" className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Brand Story</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {links.story.map((item) => (
                <li key={item.label}>
                  <Link className="group inline-flex items-center gap-2 text-sm text-[#2B2B2B] transition-colors hover:text-[#9A7135]" to={item.to}>
                    <span className="min-w-0 truncate">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665C]">Newsletter</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#6E665C]">
              Receive atelier notes, new drop previews, and care guidance for your pair.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12 w-full border border-[#D8CDBB] bg-white px-4 text-sm text-[#2B2B2B] outline-none transition-colors placeholder:text-[#6E665C]/70 focus:border-[#9A7135]"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#9A7135] px-5 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#765326]"
              >
                Join the list
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              {links.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBB] bg-white text-[#2B2B2B] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 border border-[#D8CDBB] bg-white px-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#2B2B2B] transition-colors hover:border-[#9A7135] hover:text-[#9A7135]"
              >
                <Globe2 className="h-4 w-4" />
                Visit Jodhpur
              </a>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#D8CDBB] pt-6 text-xs uppercase tracking-[0.24em] text-[#6E665C] sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Jootiya. All rights reserved.</p>
          <p>Authentic craft, refined presentation, and careful service.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;