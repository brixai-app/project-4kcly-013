import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X, ChevronDown } from 'lucide-react';
import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";
import { AuthModal } from "@/components/AuthModal";
import { CartDrawer } from "@/components/CartDrawer";
import { cn } from "@/lib/utils";

export function Header({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = useSession?.() ?? { data: null };
  const { itemCount } = useCart?.() ?? { itemCount: 0 };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navItems = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "Heritage", to: "/heritage" },
    ],
    []
  );

  const isActive = (to: string) => location.pathname === to;

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b border-[#C9A66B]/60 bg-[#F5F0E6]/95 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center border border-[#C9A66B] bg-[#FFFBF4] text-[#2B2B2B] transition hover:bg-[#f7f0e4] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B2B2B] sm:text-3xl">
              Jootiya
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6D6257] sm:inline">
              Jodhpur Mojris
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition",
                isActive(item.to) ? "text-[#B04E2C]" : "text-[#2B2B2B] hover:text-[#B04E2C]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-4 lg:flex">
          <div className="flex w-full max-w-md items-center border border-[#C9A66B] bg-[#FFFBF4] px-3">
            <Search className="h-4 w-4 shrink-0 text-[#6D6257]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
              placeholder="Search mojris, collections, artisans"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6257]"
            />
            <button
              type="button"
              onClick={submitSearch}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B04E2C] transition hover:text-[#8F3C22]"
            >
              Search
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-11 items-center gap-2 border border-[#C9A66B] bg-[#FFFBF4] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:bg-[#f7f0e4]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.user?.name ?? "Account"}</span>
          </button>

          {session?.user ? (
            <button
              type="button"
              onClick={() => {
                void signOut?.();
              }}
              className="hidden h-11 items-center border border-[#C9A66B] bg-[#FFFBF4] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:bg-[#f7f0e4] sm:inline-flex"
            >
              Sign out
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex h-11 w-11 items-center justify-center border border-[#C9A66B] bg-[#FFFBF4] text-[#2B2B2B] transition hover:bg-[#f7f0e4]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center border border-[#B04E2C] bg-[#B04E2C] px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-[#C9A66B]/50 lg:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center border border-[#C9A66B] bg-[#FFFBF4] px-3">
              <Search className="h-4 w-4 shrink-0 text-[#6D6257]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6257]"
              />
              <button
                type="button"
                onClick={submitSearch}
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B04E2C]"
              >
                Go
              </button>
            </div>

            <nav className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between border border-[#C9A66B] bg-[#FFFBF4] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em]",
                    isActive(item.to) ? "text-[#B04E2C]" : "text-[#2B2B2B]"
                  )}
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  <ChevronDown className="h-4 w-4 rotate-[-90deg] text-[#6D6257]" />
                </Link>
              ))}
            </nav>

            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  void signOut?.();
                  setMobileOpen(false);
                }}
                className="border border-[#C9A66B] bg-[#FFFBF4] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

export default Header;