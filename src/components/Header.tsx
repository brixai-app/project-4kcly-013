import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { navigation } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "@/lib/auth-client";
import AuthModal from "@/components/AuthModal";
import CartDrawer from "@/components/CartDrawer";

export function Header({ className = "" }: { className?: string } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [] } = useCart?.() ?? {};
  const { data: session } = useSession?.() ?? {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = useMemo(
    () => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = navigation?.main ?? [
    { label: "Shop", href: "/shop" },
    { label: "Artisans", href: "/artisans" },
    { label: "About", href: "/about" },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMenuOpen(false);
  };

  const handleAccount = async () => {
    if (session?.user) {
      await signOut?.();
      return;
    }
    setAuthOpen(true);
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b border-[#D8CBBB] bg-[#F9F5F0]/90 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CBBB] bg-[#FFFDFC] text-[#2B2B2B] transition hover:border-[#BFA06E] hover:text-[#000000] lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Bodoni_Moda'] text-2xl font-light tracking-[0.18em] text-[#2B2B2B]">
              JOOTIYA
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6D6259] sm:inline">
              Jodhpur Atelier
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link: any) => {
            const active = location.pathname === link?.href;
            return (
              <Link
                key={link?.href ?? link?.label}
                to={link?.href ?? "/"}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.28em] transition",
                  active ? "text-[#000000]" : "text-[#6D6259] hover:text-[#2B2B2B]"
                )}
              >
                {link?.label ?? ""}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 items-center justify-end lg:flex">
          <div className="flex w-full max-w-sm items-center border border-[#D8CBBB] bg-[#FFFDFC] px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-[#6D6259]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mojris, artisans, collections"
              className="w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6259]"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center border border-[#D8CBBB] bg-[#FFFDFC] text-[#2B2B2B] transition hover:border-[#BFA06E] hover:text-[#000000]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#BFA06E] bg-[#BFA06E] px-1 text-[10px] font-semibold text-[#000000]">
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={handleAccount}
            className="hidden h-10 items-center gap-2 border border-[#D8CBBB] bg-[#FFFDFC] px-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:border-[#BFA06E] hover:text-[#000000] sm:inline-flex"
          >
            <User className="h-4 w-4" />
            {session?.user ? "Account" : "Sign in"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-[#D8CBBB] bg-[#FFFDFC] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="flex items-center border border-[#D8CBBB] bg-[#F9F5F0] px-3 py-2">
              <Search className="mr-2 h-4 w-4 text-[#6D6259]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6259]"
              />
            </form>
            <div className="flex flex-col gap-2.5">
              {links.map((link: any) => (
                <Link
                  key={link?.href ?? link?.label}
                  to={link?.href ?? "/"}
                  className="min-w-0 border border-[#D8CBBB] px-3 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:border-[#BFA06E]"
                >
                  <span className="block truncate">{link?.label ?? ""}</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={handleAccount}
                className="flex items-center justify-between border border-[#D8CBBB] px-3 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]"
              >
                <span>{session?.user ? "Account" : "Sign in"}</span>
                <User className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

export default Header;