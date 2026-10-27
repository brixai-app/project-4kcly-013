import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Footer({ className = "" }: { className?: string } = {}) {
  const [email, setEmail] = useState("");
  const links = useMemo(
    () => ({
      care: [
        { label: "Shipping & Delivery", to: "/secondary/shipping" },
        { label: "Returns & Exchanges", to: "/secondary/returns" },
        { label: "Size Guide", to: "/secondary/size-guide" },
      ],
      social: [
        { label: "Instagram", href: "https://instagram.com", icon: Instagram },
        { label: "Facebook", href: "https://facebook.com", icon: Facebook },
        { label: "Twitter", href: "https://twitter.com", icon: Twitter },
        { label: "YouTube", href: "https://youtube.com", icon: Youtube },
      ],
    }),
    []
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You’re on the list. Expect atelier notes soon.");
    setEmail("");
  };

  return (
    <footer className={cn("border-t border-[#D8CBBB] bg-[#FFFDFC] text-[#2B2B2B]", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6 lg:px-8">
        <section className="space-y-4">
          <p className="font-['Bodoni_Moda'] text-3xl leading-none tracking-tight">Jootiya</p>
          <p className="max-w-md text-sm leading-6 text-[#6D6259]">
            Authentic Jodhpuri mojris shaped by craft, patience, and a quiet editorial sensibility.
            Warm ivory canvases, muted gold detailing, and tactile heritage define every release.
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#6D6259]">
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#BFA06E]" href="mailto:care@jootiya.com">
              <Mail className="h-4 w-4" /> care@jootiya.com
            </a>
            <a className="inline-flex items-center gap-2 transition-colors hover:text-[#BFA06E]" href="tel:+911234567890">
              <Phone className="h-4 w-4" /> +91 12345 67890
            </a>
          </div>
        </section>

        <nav className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6259]">Customer Care</h2>
          <div className="flex flex-col gap-2.5">
            {links.care.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group inline-flex min-w-0 items-center justify-between gap-3 border-b border-transparent py-1 text-sm text-[#2B2B2B] transition-colors hover:border-[#D8CBBB] hover:text-[#BFA06E]"
              >
                <span className="min-w-0 truncate">{item.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </nav>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6D6259]">Newsletter</h2>
          <p className="text-sm leading-6 text-[#6D6259]">
            Receive collection previews, artisan stories, and private access to new drops.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-11 w-full border border-[#D8CBBB] bg-[#FFFDFC] px-4 text-sm text-[#2B2B2B] outline-none transition-colors placeholder:text-[#6D6259] focus:border-[#BFA06E]"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 bg-[#BFA06E] px-4 text-xs font-semibold uppercase tracking-[0.24em] text-black transition-colors hover:bg-[#A88650]"
            >
              Join the list
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
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
                  className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CBBB] text-[#2B2B2B] transition-colors hover:border-[#BFA06E] hover:text-[#BFA06E]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
      <div className="border-t border-[#D8CBBB] px-4 py-4 text-center text-xs uppercase tracking-[0.22em] text-[#6D6259] md:px-6 lg:px-8">
        © {new Date().getFullYear()} Jootiya. Crafted in Jodhpur.
      </div>
    </footer>
  );
}

export default Footer;