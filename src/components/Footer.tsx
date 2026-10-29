import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { toast } from "sonner";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
  const [email, setEmail] = useState("");

  const year = useMemo(() => new Date().getFullYear(), []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You’re on the list. Expect atelier notes and new arrivals.");
    setEmail("");
  };

  return (
    <footer className={`border-t border-[#CDBB9D] bg-[#F7F0E3] text-[#211A17] ${className}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:px-8">
        <section className="space-y-4">
          <div className="space-y-2">
            <p className="font-['Bodoni_Moda'] text-3xl leading-none tracking-tight">Jootiya</p>
            <p className="max-w-sm text-sm leading-6 text-[#6F6258]">
              Authentic Jodhpuri mojris shaped by atelier craft, provenance-led storytelling, and a collector’s eye for detail.
            </p>
          </div>
          <p className="max-w-sm text-xs uppercase tracking-[0.24em] text-[#6F6258]">
            Hand-finished in Rajasthan · Curated for modern ceremonial dressing
          </p>
        </section>

        <nav aria-label="Customer care" className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Customer Care</h2>
          <div className="flex flex-col gap-2.5 text-sm">
            <Link className="w-fit transition-colors hover:text-[#741F2B]" to="/catalog">
              Shop Collection
            </Link>
            <Link className="w-fit transition-colors hover:text-[#741F2B]" to="/artisans">
              Artisan Stories
            </Link>
            <Link className="w-fit transition-colors hover:text-[#741F2B]" to="/checkout">
              Checkout
            </Link>
          </div>
        </nav>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Shipping</h2>
          <div className="space-y-3 text-sm text-[#6F6258]">
            <p>Pan-India delivery with careful packaging and tracked dispatch.</p>
            <p>For sizing guidance, our team can help with fit, finish, and occasion styling.</p>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <span className="min-w-0 break-words">Jodhpur, Rajasthan, India</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <span className="min-w-0 break-words">+91 98765 43210</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#741F2B]" />
              <span className="min-w-0 break-words">care@jootiya.com</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6F6258]">Newsletter</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm text-[#6F6258]" htmlFor="footer-email">
              Atelier notes, new drops, and care guidance.
            </label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-sm border border-[#CDBB9D] bg-[#FFFDFC] px-3 py-3 text-sm text-[#211A17] outline-none transition focus:border-[#741F2B]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-sm bg-[#741F2B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#561620]"
              >
                Join
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
          <div className="flex items-center gap-3 pt-2 text-[#6F6258]">
            <a className="transition-colors hover:text-[#741F2B]" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a className="transition-colors hover:text-[#741F2B]" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a className="transition-colors hover:text-[#741F2B]" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a className="transition-colors hover:text-[#741F2B]" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-[#CDBB9D]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs uppercase tracking-[0.22em] text-[#6F6258] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Jootiya. All rights reserved.</p>
          <p>Provenance-led craftsmanship from Rajasthan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;