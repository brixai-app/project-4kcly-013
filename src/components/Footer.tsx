import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone, Instagram, Facebook, Youtube, Shield, Truck, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Footer({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const year = useMemo(() => new Date().getFullYear(), []);
  const links = [
    { label: "Shop Mojris", to: "/shop" },
    { label: "Heritage Stories", to: "/heritage" },
    { label: "Cart", to: "/shop#cart" },
  ];
  const care = ["Hand-finished in Jodhpur", "Free size guidance", "Secure local checkout"];
  const socials = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to Jootiya updates.");
    setEmail("");
  };

  return (
    <footer className={cn("border-t border-[#C9A66B] bg-[#F5F0E6] text-[#2B2B2B]", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr] lg:px-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#B04E2C]" />
            <span className="font-serif text-2xl tracking-tight">Jootiya</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6D6257]">
            Handcrafted Rajasthani Mojris from Jodhpur, shaped with patient stitching, warm parchment tones, and a modern editorial eye.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-[#6D6257]">
            {care.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckDot />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Explore</h2>
          <nav className="flex flex-col gap-2.5">
            {links.map((link) => (
              <Link key={link.label} to={link.to} className="group inline-flex items-center justify-between gap-3 text-sm font-medium text-[#2B2B2B] transition-colors hover:text-[#B04E2C]">
                <span className="min-w-0 truncate">{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Customer Care</h2>
          <div className="flex flex-col gap-2.5 text-sm text-[#2B2B2B]">
            <a href="tel:+919999999999" className="inline-flex items-center gap-2 hover:text-[#B04E2C]">
              <Phone className="h-4 w-4 shrink-0" /> +91 99999 99999
            </a>
            <a href="mailto:care@jootiya.com" className="inline-flex items-center gap-2 hover:text-[#B04E2C]">
              <Mail className="h-4 w-4 shrink-0" /> care@jootiya.com
            </a>
            <span className="inline-flex items-start gap-2 text-[#6D6257]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              Jodhpur, Rajasthan, India
            </span>
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#6D6257]">
            <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-[#B04E2C]" /> Pan-India shipping</span>
            <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 shrink-0 text-[#B04E2C]" /> Secure order handling</span>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6257]">Newsletter</h2>
          <p className="text-sm leading-6 text-[#6D6257]">Receive new drops, artisan notes, and size guidance in a restrained monthly letter.</p>
          <form onSubmit={submit} className="space-y-3">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <div className="flex items-center gap-2 border border-[#C9A66B] bg-[#FFFBF4] px-3 py-2">
              <Mail className="h-4 w-4 shrink-0 text-[#6D6257]" />
              <input id="footer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full bg-transparent text-sm outline-none placeholder:text-[#6D6257]" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 bg-[#B04E2C] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#8F3C22]">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center gap-3 pt-2">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="inline-flex h-10 w-10 items-center justify-center border border-[#C9A66B] text-[#2B2B2B] transition-colors hover:bg-[#B04E2C] hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
      <div className="border-t border-[#C9A66B] px-4 py-4 text-center text-xs uppercase tracking-[0.22em] text-[#6D6257] sm:px-6 lg:px-8">
        © {year} Jootiya. Crafted in Jodhpur.
      </div>
    </footer>
  );
}

function CheckDot() {
  return <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#B04E2C]" />;
}

export default Footer;