import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Shield, Truck, Instagram, Facebook, Twitter, Youtube, Circle as Icon } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className = "" }: FooterProps) {
  const [email, setEmail] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);

  const submitNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!valid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to Jootiya updates.");
    setEmail("");
  };

  const linkClass = "text-sm text-[#6F675D] transition-colors hover:text-[#8B0000]";
  const headingClass = "font-serif text-sm uppercase tracking-[0.22em] text-[#2E2E2E]";

  return (
    <footer className={cn("border-t border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E]", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <p className="font-serif text-3xl tracking-tight">Jootiya</p>
            <p className="max-w-md text-sm leading-7 text-[#6F675D]">
              Authentic Jodhpuri Mojris shaped by artisan hands, heritage materials, and a refined editorial lens.
            </p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-[#6F675D]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" />
              <span className="min-w-0 break-words">Jodhpur, Rajasthan, India</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" />
              <a className={linkClass} href="tel:+919876543210">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" />
              <a className={linkClass} href="mailto:care@jootiya.com">
                care@jootiya.com
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
          <div className="min-w-0">
            <h3 className={headingClass}>Customer Care</h3>
            <ul className="mt-4 space-y-3">
              <li><Link className={linkClass} to="/shop">Shop Collection</Link></li>
              <li><Link className={linkClass} to="/#artisan-story">Artisan Story</Link></li>
              <li><Link className={linkClass} to="/#shipping">Shipping & Returns</Link></li>
              <li><Link className={linkClass} to="/#size-guide">Size Guide</Link></li>
            </ul>
          </div>
          <div className="min-w-0">
            <h3 className={headingClass}>Shipping</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6F675D]">
              <li className="flex items-start gap-3"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" /><span className="min-w-0 break-words">Pan-India delivery with careful packaging.</span></li>
              <li className="flex items-start gap-3"><Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" /><span className="min-w-0 break-words">Secure checkout and order tracking.</span></li>
              <li className="flex items-start gap-3"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#8B0000]" /><span className="min-w-0 break-words">Dispatch timelines shared after confirmation.</span></li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className={headingClass}>Newsletter</h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#6F675D]">
            Receive new drops, restocks, and atelier notes in a restrained monthly letter.
          </p>
          <form onSubmit={submitNewsletter} className="mt-5 space-y-3">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="min-w-0 flex-1 border border-[#CFC1AD] bg-[#FFFCF6] px-3 py-3 text-sm text-[#2E2E2E] outline-none transition focus:border-[#8B0000]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center border border-[#8B0000] bg-[#8B0000] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#650000]"
              >
                Join
              </button>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
              { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
              { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
              { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-[#CFC1AD] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E2E2E] transition hover:border-[#8B0000] hover:text-[#8B0000]"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#CFC1AD]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs uppercase tracking-[0.18em] text-[#6F675D] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Jootiya. All rights reserved.</p>
          <p>Handcrafted in Rajasthan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;