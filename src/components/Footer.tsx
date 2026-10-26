import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);
  const links = [
    { label: "Customer Care", to: "/shop" },
    { label: "Shipping & Returns", to: "/shop" },
    { label: "Authenticity", to: "/shop" },
    { label: "Privacy", to: "/shop" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to Jootiya updates.");
    setEmail("");
  };

  return (
    <footer className="border-t border-[#8A806F]/30 bg-[#FFFDF8] text-[#211F1C]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <section className="space-y-4">
          <p className="font-serif text-3xl tracking-tight">Jootiya</p>
          <p className="max-w-md text-sm leading-6 text-[#514B42]">
            Authentic Rajasthani Mojris handcrafted in Jodhpur, shaped by artisan skill, heritage materials, and a quiet luxury finish.
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#514B42]">
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#6B451D]" href="mailto:care@jootiya.com">
              <Mail className="h-4 w-4" />
              care@jootiya.com
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#6B451D]" href="tel:+919876543210">
              <Phone className="h-4 w-4" />
              +91 98765 43210
            </a>
          </div>
        </section>

        <nav className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Explore</p>
          <div className="flex flex-col gap-2.5">
            {links.map((link) => (
              <Link key={link.label} to={link.to} className="group inline-flex items-center justify-between gap-3 text-sm text-[#211F1C] transition-colors hover:text-[#6B451D]">
                <span className="min-w-0 truncate">{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </nav>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Newsletter</p>
          <p className="max-w-sm text-sm leading-6 text-[#514B42]">
            Receive new drop previews, artisan stories, and early access to limited pairs.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-11 w-full rounded-sm border border-[#8A806F]/40 bg-[#FAF7F0] px-4 text-sm text-[#211F1C] outline-none transition focus:border-[#6B451D]"
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#6B451D] px-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#4E3014]">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center gap-3 pt-2 text-[#514B42]">
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#6B451D]">
              <Instagram className="h-5 w-5" />
            </a>
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#6B451D]">
              <Facebook className="h-5 w-5" />
            </a>
            <a aria-label="Twitter" href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#6B451D]">
              <Twitter className="h-5 w-5" />
            </a>
            <a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#6B451D]">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </section>
      </div>

      <div className="border-t border-[#8A806F]/20 px-4 py-4 text-center text-xs uppercase tracking-[0.22em] text-[#514B42] sm:px-6 lg:px-8">
        © {year} Jootiya. Crafted in Jodhpur.
      </div>
    </footer>
  );
}

export default Footer;