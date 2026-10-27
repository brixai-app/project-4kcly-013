import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Dialog } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { authClient, useSession } from "@/lib/auth-client";
import { AuthModal } from "@/components/AuthModal";

type NavItem = { label: string; to: string };

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Editorial", to: "/editorial" },
  { label: "Checkout", to: "/checkout" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart() as { items?: { quantity?: number }[] };
  const session = useSession?.() as { data?: { user?: { name?: string | null; email?: string | null } | null } | null } | undefined;

  const cartCount = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const handleSignOut = async () => {
    await authClient?.signOut?.();
  };

  const userLabel = session?.data?.user?.name ?? session?.data?.user?.email ?? "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-[#D8CCB8] bg-[#FAF7F0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B] transition hover:border-[#9A7440] hover:text-[#9A7440] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          to="/"
          className="min-w-0 shrink-0 font-['Playfair_Display'] text-2xl tracking-[0.18em] text-[#2B2B2B]"
        >
          JOOTIYA
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257] transition hover:text-[#9A7440]",
                location.pathname === item.to && "text-[#9A7440]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearchSubmit} className="hidden min-w-0 flex-1 max-w-sm lg:block">
          <label className="flex h-10 items-center gap-2 border border-[#D8CCB8] bg-[#FFFDF8] px-3">
            <Search className="h-4 w-4 shrink-0 text-[#6D6257]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mojris, sizes, artisans"
              className="w-full min-w-0 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6257]"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 items-center gap-2 border border-[#D8CCB8] bg-[#FFFDF8] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#9A7440] hover:text-[#9A7440]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.data?.user ? userLabel : "Sign In"}</span>
            <span className="sm:hidden">Sign In</span>
          </button>

          {session?.data?.user ? (
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="hidden h-10 border border-[#D8CCB8] bg-[#FFFDF8] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#6D6257] transition hover:border-[#9A7440] hover:text-[#9A7440] sm:inline-flex"
            >
              Sign Out
            </button>
          ) : null}

          <Link
            to="/checkout"
            className="relative inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB8] bg-[#FFFDF8] text-[#2B2B2B] transition hover:border-[#9A7440] hover:text-[#9A7440]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center border border-[#9A7440] bg-[#9A7440] px-1 text-[10px] font-semibold leading-none text-black">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#D8CCB8] bg-[#FFFDF8] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <form onSubmit={handleSearchSubmit}>
              <label className="flex h-10 items-center gap-2 border border-[#D8CCB8] bg-[#FAF7F0] px-3">
                <Search className="h-4 w-4 shrink-0 text-[#6D6257]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full min-w-0 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6D6257]"
                />
              </label>
            </form>
            <nav className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "min-w-0 truncate border border-[#D8CCB8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]",
                    location.pathname === item.to && "border-[#9A7440] text-[#9A7440]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab="signin" />
    </header>
  );
}

export default Header;