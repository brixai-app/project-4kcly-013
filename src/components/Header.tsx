import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Dialog } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { authClient, useSession } from "@/lib/auth-client";
import { AuthModal } from "@/components/AuthModal";

export type HeaderProps = { className?: string };
export function Header({ className = "" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], openCart = () => {} } = useCart?.() ?? {};
  const { data: session } = useSession?.() ?? { data: null };
  const cartCount = useMemo(() => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0), [items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") ?? "");
  }, [location.search]);

  const submitSearch = (value: string) => {
    const next = value.trim();
    const params = new URLSearchParams(location.search);
    if (next) params.set("q", next);
    else params.delete("q");
    navigate({ pathname: "/shop", search: params.toString() ? `?${params.toString()}` : "" });
    setMobileOpen(false);
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={cn(
        "text-xs uppercase tracking-[0.24em] transition-colors hover:text-[#8B0000]",
        location.pathname === to ? "text-[#8B0000]" : "text-[#2E2E2E]"
      )}
      onClick={() => setMobileOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[#CFC1AD] bg-[#F5F1E9]/95 backdrop-blur",
        scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.04)]" : "",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-[#CFC1AD] bg-[#FFFCF6] text-[#2E2E2E] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 md:flex-none">
          <div className="font-['Playfair_Display'] text-2xl font-semibold tracking-[0.18em] text-[#2E2E2E]">
            JOOTIYA
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{navLink("/", "Home")}{navLink("/shop", "Catalog")}</nav>

        <form
          className="hidden flex-1 items-center justify-center md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
        >
          <div className="flex w-full max-w-md items-center gap-2 border border-[#CFC1AD] bg-[#FFFCF6] px-3 py-2">
            <Search className="h-4 w-4 text-[#6F675D]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mojris, sizes, artisans"
              className="w-full bg-transparent text-sm text-[#2E2E2E] outline-none placeholder:text-[#6F675D]"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 border border-[#CFC1AD] bg-[#FFFCF6] px-3 text-xs uppercase tracking-[0.24em] text-[#2E2E2E] transition-colors hover:border-[#8B0000] hover:text-[#8B0000]"
            onClick={() => setAuthOpen(true)}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.user?.name ?? "Account"}</span>
          </button>
          <button
            type="button"
            className="relative inline-flex h-10 items-center gap-2 border border-[#8B0000] bg-[#8B0000] px-3 text-xs uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#650000]"
            onClick={() => openCart?.()}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center border border-white/30 px-1 text-[10px] leading-5">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#CFC1AD] bg-[#FFFCF6] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <form
              className="flex items-center gap-2 border border-[#CFC1AD] px-3 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
            >
              <Search className="h-4 w-4 text-[#6F675D]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
            <div className="flex flex-col gap-2.5">{navLink("/", "Home")}{navLink("/shop", "Catalog")}</div>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-left text-xs uppercase tracking-[0.24em] text-[#2E2E2E]"
              onClick={() => {
                setMobileOpen(false);
                setAuthOpen(true);
              }}
            >
              <User className="h-4 w-4" />
              Account
            </button>
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" redirectTo={location.pathname} />
    </header>
  );
}
export default Header;