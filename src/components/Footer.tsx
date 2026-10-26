import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Linkedin, Shield, Truck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryLabels } from '@/data/mockData';

type FooterProps = {
  className?: string;
};

export function Footer({ className = '' }: FooterProps) {
  const [email, setEmail] = useState('');
  const links = useMemo(
    () => [
      { label: 'Shop Mojris', to: '/shop?category=mojri' },
      { label: 'Bridal Edit', to: '/shop?category=bridal' },
      { label: 'Craft Story', to: '/journey/artisan-stories' },
      { label: 'Order Tracking', to: '/journey/order-confirmation' },
    ],
    [],
  );

  const handleSubscribe = () => {
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You are on the Jootiya list.');
    setEmail('');
  };

  return (
    <footer className={cn('border-t border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715]', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <section className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B]">Jootiya</p>
            <h2 className="max-w-sm font-['Playfair_Display'] text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              Heritage mojris, shaped for modern ceremonial dressing.
            </h2>
            <p className="max-w-md text-sm leading-7 text-[#765F55]">
              Crafted in Jodhpur with antique-gold restraint, hand-finished detail, and a quiet editorial sensibility.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-[#765F55]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <span className="min-w-0 break-words">Jodhpur, Rajasthan, India</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <a className="min-w-0 break-words transition-colors hover:text-[#741F2B]" href="tel:+919876543210">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <a className="min-w-0 break-words transition-colors hover:text-[#741F2B]" href="mailto:care@jootiya.com">
                care@jootiya.com
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B]">Customer Care</h3>
          <nav className="flex flex-col gap-2.5 text-sm">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center justify-between gap-3 border-b border-transparent py-1 text-[#2B1715] transition-colors hover:border-[#CDBB9F] hover:text-[#741F2B]"
              >
                <span className="min-w-0 truncate">{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B]">Shipping Notes</h3>
          <div className="flex flex-col gap-3 text-sm text-[#765F55]">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <p className="min-w-0 break-words">Dispatched in refined packaging with tracked delivery across India.</p>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <p className="min-w-0 break-words">Secure checkout, verified order records, and careful post-purchase support.</p>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <p className="min-w-0 break-words">Handmade variations are part of the craft and make each pair distinct.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-[#741F2B]">Newsletter</h3>
          <p className="text-sm leading-7 text-[#765F55]">
            Receive new drops, artisan stories, and occasion edits. No noise, only considered updates.
          </p>
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-[#765F55]" htmlFor="footer-email">
              Email address
            </label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="min-w-0 flex-1 border border-[#CDBB9F] bg-[#FFFDF8] px-3 py-3 text-sm text-[#2B1715] outline-none transition-colors placeholder:text-[#A38E82] focus:border-[#741F2B]"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="inline-flex items-center justify-center gap-2 bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#57151F]"
              >
                Join
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#CDBB9F] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:border-[#741F2B] hover:text-[#741F2B]"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#CDBB9F] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:border-[#741F2B] hover:text-[#741F2B]"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#CDBB9F] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:border-[#741F2B] hover:text-[#741F2B]"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#CDBB9F] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition-colors hover:border-[#741F2B] hover:text-[#741F2B]"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-[#CDBB9F]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs uppercase tracking-[0.22em] text-[#765F55] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Jootiya. All rights reserved.</p>
          <p className="min-w-0 truncate">Categories: {Object.values(categoryLabels).join(' · ')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;