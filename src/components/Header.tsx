import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/AuthModal";
import { cn } from "@/lib/utils";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [] } = useCart?.() ?? {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState("");
  const session = authClient?.useSession?.() ?? null;
  const user = session?.data?.user ?? null;

  const cartCount = useMemo(
    () => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const submitSearch = (value: string) => {
    const next = value.trim();
    navigate(next ? `/shop?query=${encodeURIComponent(next)}` : "/shop");
    setMobileOpen(false);
  };

  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "Artisans", to: "/#artisans" },
    { label: "Story", to: "/#story" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#8A806F]/30 bg-[#FAF7F0]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#8A806F]/40 text-[#211F1C] transition hover:bg-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl tracking-tight text-[#211F1C] sm:text-3xl">
              Jootiya
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#514B42] sm:inline">
              Jodhpur Mojris
            </span>
          </div>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
          className="hidden flex-1 items-center gap-2 rounded-md border border-[#8A806F]/40 bg-[#FFFDF8] px-3 py-2 lg:flex"
        >
          <Search className="h-4 w-4 shrink-0 text-[#514B42]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mojris, sizes, artisans"
            className="w-full bg-transparent text-sm text-[#211F1C] outline-none placeholder:text-[#514B42]/70"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#6B451D] transition hover:text-[#4E3014]"
          >
            Search <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.22em] transition",
                  active ? "text-[#6B451D]" : "text-[#514B42] hover:text-[#211F1C]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="hidden h-10 items-center gap-2 rounded-md border border-[#8A806F]/40 px-3 text-xs font-semibold uppercase tracking-widest text-[#211F1C] transition hover:bg-white sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            Shop
          </button>

          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#8A806F]/40 px-3 text-xs font-semibold uppercase tracking-widest text-[#211F1C] transition hover:bg-white"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name ?? "Account"}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#8A806F]/40 px-3 text-[#211F1C] transition hover:bg-white"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
            className="relative inline-flex h-10 items-center justify-center rounded-md bg-[#6B451D] px-3 text-white transition hover:bg-[#4E3014]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="ml-2 hidden text-xs font-semibold uppercase tracking-widest sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#211F1C] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-[#8A806F]/30 bg-[#FAF7F0] px-4 py-4 lg:hidden"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className="mb-4 flex items-center gap-2 rounded-md border border-[#8A806F]/40 bg-[#FFFDF8] px-3 py-2"
            >
              <Search className="h-4 w-4 shrink-0 text-[#514B42]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mojris, sizes, artisans"
                className="w-full bg-transparent text-sm text-[#211F1C] outline-none placeholder:text-[#514B42]/70"
              />
            </form>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md border border-[#8A806F]/30 bg-[#FFFDF8] px-4 py-3 text-sm font-medium text-[#211F1C]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-[#6B451D]" />
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAuthOpen(true);
                  setMobileOpen(false);
                }}
                className="flex items-center justify-between rounded-md border border-[#8A806F]/30 bg-[#FFFDF8] px-4 py-3 text-sm font-medium text-[#211F1C]"
              >
                <span>{user?.name ?? "Account"}</span>
                <User className="h-4 w-4 text-[#6B451D]" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

export default Header;