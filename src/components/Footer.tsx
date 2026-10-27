import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !value.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    toast.success("Subscribed to Jootiya journal.");
    setEmail("");
  };

  return (
    <footer className="border-t border-[#D8CCB8] bg-[#FAF7F0] text-[#2B2B2B]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div>
            <p className="font-['Playfair_Display'] text-2xl tracking-tight">Jootiya</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#6D6257]">
              Authentic Jodhpuri Mojris shaped by heritage craft, quiet luxury, and enduring comfort.
            </p>
          </div>
          <div className="space-y-2 text-sm text-[#6D6257]">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7440]" />Jodhpur, Rajasthan, India</p>
            <p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7440]" />+91 98765 43210</p>
            <p className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#9A7440]" />care@jootiya.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Customer Care</h3>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link className="w-fit transition-colors hover:text-[#9A7440]" to="/shop">Shop Collection</Link>
            <Link className="w-fit transition-colors hover:text-[#9A7440]" to="/checkout">Shipping & Returns</Link>
            <Link className="w-fit transition-colors hover:text-[#9A7440]" to="/checkout">Size Guidance</Link>
            <Link className="w-fit transition-colors hover:text-[#9A7440]" to="/shop">Craft & Materials</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Shipping</h3>
          <div className="space-y-3 text-sm leading-6 text-[#6D6257]">
            <p>Pan-India delivery with careful packaging and tracked dispatch.</p>
            <p>Orders are prepared within 24–48 hours, subject to artisan availability.</p>
            <p>For custom sizing, please allow additional tailoring time.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Newsletter</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 border border-[#D8CCB8] bg-[#FFFDF8] px-3 py-2">
              <Mail className="h-4 w-4 shrink-0 text-[#9A7440]" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6D6257]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 border border-[#9A7440] bg-[#9A7440] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#76562E]"
            >
              Join the journal <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center gap-3 pt-2 text-[#6D6257]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#9A7440]"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#9A7440]"><Facebook className="h-4 w-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#9A7440]"><Twitter className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#9A7440]"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#D8CCB8] px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs uppercase tracking-[0.22em] text-[#6D6257] md:flex-row md:items-center md:justify-between">
          <p>© {year} Jootiya. All rights reserved.</p>
          <p>Handcrafted in India with heritage-first design.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;