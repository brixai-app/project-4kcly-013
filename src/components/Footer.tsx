import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Linkedin, Youtube, CheckCircle2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Footer({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const links = useMemo(
    () => [
      { label: 'Shop', to: '/shop' },
      { label: 'Artisan Stories', to: '/artisans' },
      { label: 'Custom Requests', to: '/custom' },
      { label: 'Orders', to: '/orders' },
    ],
    []
  );

  const careLinks = useMemo(
    () => [
      { label: 'Shipping & Delivery', to: '/shipping' },
      { label: 'Returns & Exchanges', to: '/returns' },
      { label: 'Care Guide', to: '/care' },
      { label: 'Contact Us', to: '/contact' },
    ],
    []
  );

  const socials = useMemo(
    () => [
      { label: 'Instagram', icon: Instagram, href: 'https://instagram.com', external: true },
      { label: 'Facebook', icon: Facebook, href: 'https://facebook.com', external: true },
      { label: 'Twitter', icon: Twitter, href: 'https://twitter.com', external: true },
      { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', external: true },
      { label: 'YouTube', icon: Youtube, href: 'https://youtube.com', external: true },
    ],
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      toast.success('You are on the list.');
      setEmail('');
      setSubmitting(false);
    }, 700);
  };

  return (
    <footer className={cn('border-t border-[#C9BFB1] bg-[#F5F1EB] text-[#302D29]', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="max-w-xl space-y-4">
              <p className="font-[Bodoni_Moda] text-3xl font-light tracking-tight sm:text-4xl">
                Jootiya
              </p>
              <p className="max-w-lg text-sm leading-6 text-[#71695F]">
                Authentic Jodhpuri mojris shaped by heritage craft, refined materials, and an editorial eye for modern luxury.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71695F]">Explore</p>
                <div className="flex flex-col gap-2.5">
                  {links.map((item) => (
                    <Link key={item.to} to={item.to} className="min-w-0 text-sm text-[#302D29] transition-colors hover:text-[#6B1E1E]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71695F]">Customer Care</p>
                <div className="flex flex-col gap-2.5">
                  {careLinks.map((item) => (
                    <Link key={item.to} to={item.to} className="min-w-0 text-sm text-[#302D29] transition-colors hover:text-[#6B1E1E]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71695F]">Visit</p>
                <div className="space-y-3 text-sm text-[#302D29]">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                    <span className="min-w-0 break-words">Jodhpur Atelier, Rajasthan, India</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                    <span className="min-w-0 break-words">+91 98765 43210</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#6B1E1E]" />
                    <span className="min-w-0 break-words">care@jootiya.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border border-[#C9BFB1] bg-[#FFFCF7] p-6">
              <div className="flex items-start gap-3">
                <ShoppingBag className="mt-1 h-5 w-5 shrink-0 text-[#6B1E1E]" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71695F]">Newsletter</p>
                  <h2 className="mt-2 font-[Bodoni_Moda] text-2xl font-light tracking-tight">
                    Receive the next drop
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full border border-[#C9BFB1] bg-transparent px-4 py-3 text-sm text-[#302D29] outline-none transition-colors placeholder:text-[#71695F]/70 focus:border-[#6B1E1E]"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#6B1E1E] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#501515] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Submitting' : 'Join the list'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-3 flex items-center gap-2 text-xs text-[#71695F]">
                <CheckCircle2 className="h-4 w-4 text-[#6B1E1E]" />
                Curated updates, private previews, and artisan notes.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-2 border border-[#C9BFB1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#302D29] transition-colors hover:border-[#6B1E1E] hover:text-[#6B1E1E]"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#C9BFB1] pt-6 text-xs uppercase tracking-[0.2em] text-[#71695F] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jootiya. Crafted in Jodhpur.</p>
          <p>Authentic mojris, bespoke requests, and heritage-led service.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;