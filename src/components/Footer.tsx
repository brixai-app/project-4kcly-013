import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Footer({ className = '' }: { className?: string } = {}) {
  const [email, setEmail] = useState('');
  const links = useMemo(
    () => ({
      customerCare: [
        { label: 'Contact', to: '/shop' },
        { label: 'Size Guide', to: '/shop' },
        { label: 'Returns', to: '/shop' },
      ],
      shipping: [
        { label: 'Pan-India delivery', to: '/shop' },
        { label: 'Secure packaging', to: '/shop' },
        { label: 'Tracked dispatch', to: '/shop' },
      ],
      social: [
        { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
        { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
        { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
        { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
      ],
    }),
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('You are on the list. Expect first access and atelier notes.');
    setEmail('');
  };

  return (
    <footer className={cn('border-t border-[#D8CCB9] bg-[#F5F1E9] text-[#1A1A1A]', className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:px-8">
        <div className="min-w-0 space-y-4">
          <p className="font-['Playfair_Display'] text-3xl font-light tracking-tight">Jootiya</p>
          <p className="max-w-md text-sm leading-6 text-[#675F56]">
            Authentic Jodhpuri mojris shaped by heritage craft, editorial restraint, and modern luxury commerce.
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#675F56]">
            Crafted in Jodhpur • Delivered across India
          </p>
        </div>

        <div className="min-w-0">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#675F56]">Customer Care</h3>
          <div className="mt-4 flex flex-col gap-2.5">
            {links.customerCare.map((item) => (
              <Link key={item.label} to={item.to} className="text-sm text-[#1A1A1A] transition-colors hover:text-[#A94720]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#675F56]">Shipping</h3>
          <div className="mt-4 flex flex-col gap-2.5">
            {links.shipping.map((item) => (
              <Link key={item.label} to={item.to} className="text-sm text-[#1A1A1A] transition-colors hover:text-[#A94720]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#675F56]">Newsletter</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="block text-sm text-[#675F56]" htmlFor="footer-email">
              Atelier notes, new drops, and private access.
            </label>
            <div className="flex items-stretch gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 border border-[#D8CCB9] bg-[#FAF9F6] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#675F56]/70 focus:border-[#A94720]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-[#A94720] bg-[#A94720] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#843616]"
              >
                Join
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {links.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] text-[#1A1A1A] transition-colors hover:border-[#A94720] hover:text-[#A94720]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default Footer;