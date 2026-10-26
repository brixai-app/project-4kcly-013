import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FooterProps = {
  className?: string;
};

export function Footer({ className = '' }: FooterProps = {}) {
  const [email, setEmail] = useState('');
  const year = useMemo(() => new Date().getFullYear(), []);

  const handleSubscribe = () => {
    const value = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You are on the Jootiya list.');
    setEmail('');
  };

  return (
    <footer className={cn('border-t border-[#CBBCA7] bg-[#FFFDF8] text-[#17130F]', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-12 md:px-6 lg:px-8">
        <div className="md:col-span-5">
          <p className="font-serif text-2xl tracking-tight">Jootiya</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#6F6254]">
            Authentic Rajasthani Mojris handcrafted in Jodhpur, shaped by heritage techniques, ivory paper textures, and terracotta leather tones.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-[#6F6254]">
            <span>Jodhpur atelier</span>
            <span>Hand-finished</span>
            <span>Verified craft</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6254]">Customer care</h2>
          <nav className="mt-4 flex flex-col gap-2.5 text-sm">
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/shop">Shop</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/cart">Cart</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/account">Account</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6254]">Shipping</h2>
          <nav className="mt-4 flex flex-col gap-2.5 text-sm">
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/shipping">Delivery</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/returns">Returns</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/care">Care guide</Link>
            <Link className="min-w-0 truncate transition-colors hover:text-[#A8472A]" to="/faq">FAQ</Link>
          </nav>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6254]">Newsletter</h2>
          <p className="mt-4 text-sm leading-7 text-[#6F6254]">
            Receive collection notes, atelier stories, and early access to new drops.
          </p>
          <div className="mt-4 flex gap-2">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] px-3 py-2 text-sm text-[#17130F] outline-none transition focus:border-[#A8472A]"
            />
            <button
              type="button"
              onClick={() => handleSubscribe()}
              className="inline-flex items-center gap-2 rounded-sm bg-[#A8472A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#84351F]"
            >
              Join <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#CBBCA7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#6F6254]">
            © {year} Jootiya. Crafted in Jodhpur.
          </p>
          <div className="flex items-center gap-4">
            <a className="text-[#6F6254] transition-colors hover:text-[#A8472A]" href="mailto:care@jootiya.com" aria-label="Email Jootiya">
              <Mail className="h-4 w-4" />
            </a>
            <a className="text-[#6F6254] transition-colors hover:text-[#A8472A]" href="tel:+911234567890" aria-label="Call Jootiya">
              <Phone className="h-4 w-4" />
            </a>
            <a className="text-[#6F6254] transition-colors hover:text-[#A8472A]" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a className="text-[#6F6254] transition-colors hover:text-[#A8472A]" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a className="text-[#6F6254] transition-colors hover:text-[#A8472A]" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;