import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';

export interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const handleNewsletterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email')?.toString().trim() ?? '';
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    form.reset();
    toast.success('You are on the Jootiya list.');
  };

  return (
    <footer className={`border-t border-[#CDBB9B] bg-[#FFFDF9] text-[#2E2B28] ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <p className="font-['Bodoni_Moda'] text-3xl leading-none tracking-tight">Jootiya</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#6E6258]">
            Authentic Jodhpuri Mojris shaped by hand, heritage, and a quiet luxury palette of ivory, terracotta, and gold.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6258]">
            <span>Crafted in Rajasthan</span>
            <span>•</span>
            <span>Verified Materials</span>
            <span>•</span>
            <span>Direct Artisan Sourcing</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6258]">Customer Care</h2>
          <nav className="mt-4 flex flex-col gap-2.5 text-sm">
            <Link className="min-w-0 truncate transition-colors hover:text-[#C1440E]" to="/shop">
              Shop
            </Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#C1440E]" to="/secondary">
              Shipping & Returns
            </Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#C1440E]" to="/secondary">
              Size Guide
            </Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#C1440E]" to="/secondary">
              Contact
            </Link>
          </nav>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6258]">Follow</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" /> Twitter
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube className="h-4 w-4" /> YouTube
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6E6258]">Newsletter</h2>
          <p className="mt-4 text-sm leading-6 text-[#6E6258]">
            Receive early access to new drops, artisan stories, and private restocks.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 py-2 text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258] focus:border-[#C1440E]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-[#C1440E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#963308]"
            >
              Join <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-5 flex flex-col gap-2 text-sm text-[#6E6258]">
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="mailto:care@jootiya.com">
              <Mail className="h-4 w-4" /> care@jootiya.com
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#C1440E]" href="tel:+911234567890">
              <Phone className="h-4 w-4" /> +91 12345 67890
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;