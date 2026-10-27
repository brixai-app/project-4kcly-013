import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Youtube, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Footer({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const links = useMemo(
    () => ({
      care: [
        { label: 'Shipping & Delivery', to: '/shipping' },
        { label: 'Returns & Exchanges', to: '/returns' },
        { label: 'Size Guide', to: '/size-guide' },
      ],
      story: [
        { label: 'Our Atelier', to: '/story' },
        { label: 'Craft Process', to: '/craft' },
        { label: 'Custom Orders', to: '/custom-orders' },
      ],
    }),
    []
  );

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    setEmail('');
    toast.success('You are on the list. Expect first access and atelier notes.');
  };

  return (
    <footer className={cn('border-t border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B]', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <div>
            <p className="font-['Playfair_Display'] text-3xl font-semibold tracking-tight">Jootiya</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#6F655C]">
              Handcrafted Rajasthani mojris from Jodhpur, shaped in warm ivory, leather neutrals, and burnt-sienna accents.
            </p>
          </div>
          <div className="space-y-3 text-sm text-[#6F655C]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E07A5F]" />
              <span className="min-w-0 break-words">Atelier: Jodhpur, Rajasthan</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#E07A5F]" />
              <span className="min-w-0 break-words">+91 98765 43210</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#E07A5F]" />
              <span className="min-w-0 break-words">care@jootiya.in</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Customer Care</h2>
          <nav className="flex flex-col gap-2.5 text-sm">
            {links.care.map((item) => (
              <Link key={item.to} to={item.to} className="min-w-0 truncate text-[#2B2B2B] transition-colors hover:text-[#E07A5F]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Atelier Notes</h2>
          <nav className="flex flex-col gap-2.5 text-sm">
            {links.story.map((item) => (
              <Link key={item.to} to={item.to} className="min-w-0 truncate text-[#2B2B2B] transition-colors hover:text-[#E07A5F]">
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="max-w-xs text-sm leading-6 text-[#6F655C]">
            Complimentary shipping on select orders, careful packaging, and artisan-led custom requests.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F655C]">Newsletter</h2>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="flex items-center gap-2 border border-[#CFC2B2] bg-white px-3 py-2">
              <Mail className="h-4 w-4 shrink-0 text-[#E07A5F]" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6F655C]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-[#E07A5F] bg-[#E07A5F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#C85F45]"
            >
              Join the list
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {subscribed ? (
            <div className="flex items-center gap-2 text-sm text-[#2B2B2B]">
              <CheckCircle2 className="h-4 w-4 text-[#E07A5F]" />
              <span>Subscribed successfully.</span>
            </div>
          ) : null}
          <div className="flex items-center gap-4 pt-2 text-[#6F655C]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#E07A5F]">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#E07A5F]">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="transition-colors hover:text-[#E07A5F]">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;