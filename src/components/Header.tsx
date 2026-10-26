import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, User, X, ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { auth as authClient } from '@/lib/auth-client';
import AuthModal from '@/components/AuthModal';

export function Header({ className = '' }: { className?: string } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [], openCart = () => {} } = useCart?.() ?? {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        const result = await authClient?.getSession?.();
        if (active) setSession(result ?? null);
      } catch {
        if (active) setSession(null);
      }
    };
    loadSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const cartCount = useMemo(
    () => items?.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0) ?? 0,
    [items]
  );

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Craft', to: '/shop?collection=atelier' },
    { label: 'Artisans', to: '/shop?category=artisan' },
  ];

  const submitSearch = (value: string) => {
    const query = value.trim();
    if (!query) return;
    navigate(`/shop?query=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#CBBCA7] bg-[#F6F0E5]/95 backdrop-blur-sm', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#CBBCA7] bg-[#FFFDF8] text-[#17130F] transition hover:border-[#A8472A] hover:text-[#A8472A] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl font-medium tracking-tight text-[#17130F] sm:text-3xl">
              Jootiya
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#6F6254] sm:inline">
              Jodhpur Mojris
            </span>
          </div>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(search);
          }}
          className="hidden min-w-0 flex-1 items-center gap-2 lg:flex"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#CBBCA7] bg-[#FFFDF8] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#6F6254]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mojris, collections, artisans"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#17130F] outline-none placeholder:text-[#6F6254]"
            />
          </div>
          <button
            type="submit"
            className="border border-[#A8472A] bg-[#A8472A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#84351F]"
          >
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'inline-flex items-center gap-1 border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#17130F] transition hover:border-[#CBBCA7] hover:bg-[#FFFDF8]',
                location.pathname + location.search === link.to ? 'border-[#CBBCA7] bg-[#FFFDF8]' : ''
              )}
            >
              {link.label}
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 items-center gap-2 border border-[#CBBCA7] bg-[#FFFDF8] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#17130F] transition hover:border-[#A8472A] hover:text-[#A8472A]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.user?.name ?? 'Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => openCart?.()}
            className="relative inline-flex h-10 items-center gap-2 border border-[#CBBCA7] bg-[#FFFDF8] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#17130F] transition hover:border-[#A8472A] hover:text-[#A8472A]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center bg-[#A8472A] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-t border-[#CBBCA7] bg-[#FFFDF8] lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(search);
              }}
              className="flex items-center gap-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#CBBCA7] px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-[#6F6254]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6F6254]"
                />
              </div>
              <button
                type="submit"
                className="border border-[#A8472A] bg-[#A8472A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white"
              >
                Go
              </button>
            </form>

            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex min-w-0 items-center justify-between border border-[#CBBCA7] px-3 py-3 text-sm font-medium text-[#17130F]"
                >
                  <span className="min-w-0 truncate">{link.label}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#6F6254]" />
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex items-center justify-between border border-[#CBBCA7] px-3 py-3 text-sm font-medium text-[#17130F]"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{session?.user?.name ?? 'Account'}</span>
                </span>
                <Heart className="h-4 w-4 text-[#6F6254]" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

export default Header;