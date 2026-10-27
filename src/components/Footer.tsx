import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { navigationLinks } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function Footer({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();
  const links = useMemo(() => navigationLinks?.slice(0, 4) ?? [], []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You are on the Jootiya list.');
    setEmail('');
  };

  return (
    <footer className={cn('border-t border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B]', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-12 md:px-6 lg:px-8">
        <div className="md:col-span-5">
          <p className="font-['Playfair_Display'] text-3xl font-light tracking-tight">Jootiya</p>
          <p className="mt-4 max-w-md font-['Lora'] text-sm leading-7 text-[#6F625D]">
            Authentic Rajasthani Mojris handcrafted in Jodhpur, shaped by artisan hands, heritage techniques, and a quiet luxury sensibility.
          </p>
          <div className="mt-6 space-y-3 text-sm text-[#6F625D]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9381E]" />
              <span className="min-w-0 break-words">Jodhpur, Rajasthan, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-[#D9381E]" />
              <a className="transition-colors hover:text-[#D9381E]" href="tel:+919876543210">+91 98765 43210</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#D9381E]" />
              <a className="transition-colors hover:text-[#D9381E]" href="mailto:care@jootiya.com">care@jootiya.com</a>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F625D]">Customer Care</h2>
          <nav className="mt-5 flex flex-col gap-2.5 text-sm">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className="min-w-0 truncate transition-colors hover:text-[#D9381E]">
                {link.label}
              </Link>
            ))}
            <a href="#shipping" className="min-w-0 truncate transition-colors hover:text-[#D9381E]">Shipping & Returns</a>
            <a href="#custom-order" className="min-w-0 truncate transition-colors hover:text-[#D9381E]">Custom Orders</a>
            <a href="#care" className="min-w-0 truncate transition-colors hover:text-[#D9381E]">Care Guide</a>
          </nav>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F625D]">Newsletter</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#6F625D]">
            Receive first access to limited drops, artisan stories, and seasonal edits from the Jootiya atelier.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-sm border border-[#BFA6A0] bg-[#FFFDFC] px-4 py-3 text-sm text-[#2B2B2B] outline-none transition focus:border-[#D9381E]"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#D9381E] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#B92B17]">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#6F625D]">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#D9381E]" />Validated signup</span>
            <span>Secure updates only</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#BFA6A0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-[#6F625D] md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {year} Jootiya. Crafted in Jodhpur.</p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D9381E]"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D9381E]"><Facebook className="h-4 w-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D9381E]"><Twitter className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#D9381E]"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;