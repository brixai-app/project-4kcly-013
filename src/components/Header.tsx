import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { authClient, useSession } from '@/lib/auth-client';
import { categories } from '@/data/mockData';
import AuthModal from '@/components/AuthModal';

export function Header({ className = '' }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [] } = useCart?.() ?? {};
  const session = useSession?.() ?? { data: null };
  const user = session?.data?.user ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');

  const itemCount = useMemo(
    () => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: '/shop' },
      { label: 'Checkout', to: '/checkout' },
    ],
    []
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?query=${encodeURIComponent(value)}` : '/shop');
  };

  const handleAccount = async () => {
    if (user) {
      await authClient?.signOut?.();
      return;
    }
    setAuthOpen(true);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#D8CDBE] bg-[#F5F1EB]/95 backdrop-blur-md', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBE] bg-[#FFFCF7] text-[#2B2B2B] transition hover:border-[#C9A66B] hover:text-[#000000] md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 shrink-0">
          <span className="block font-['Playfair_Display'] text-2xl font-semibold tracking-[0.2em] text-[#2B2B2B]">
            JOOTIYA
          </span>
          <span className="block text-[10px] uppercase tracking-[0.35em] text-[#6E665D]">
            Jodhpuri Mojris
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-xs uppercase tracking-[0.28em] transition',
                  active ? 'text-[#000000]' : 'text-[#6E665D] hover:text-[#2B2B2B]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 max-w-sm items-center md:flex">
          <div className="flex w-full items-center gap-2 border border-[#D8CDBE] bg-[#FFFCF7] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#6E665D]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mojris"
              className="min-w-0 w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6E665D]"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleAccount}
            className="inline-flex h-10 items-center gap-2 border border-[#D8CDBE] bg-[#FFFCF7] px-3 text-xs uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:border-[#C9A66B] hover:text-[#000000]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name ?? 'Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="relative inline-flex h-10 items-center justify-center border border-[#D8CDBE] bg-[#FFFCF7] px-3 text-[#2B2B2B] transition hover:border-[#C9A66B] hover:text-[#000000]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 ? (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#C9A66B] bg-[#C9A66B] px-1 text-[10px] font-semibold text-black"
              >
                {itemCount}
              </motion.span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#D8CDBE] bg-[#FFFCF7] md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
              <form onSubmit={handleSearch} className="flex items-center gap-2 border border-[#D8CDBE] bg-[#F5F1EB] px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-[#6E665D]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search mojris"
                  className="min-w-0 w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6E665D]"
                />
              </form>

              <div className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="min-w-0 border border-[#D8CDBE] px-3 py-2 text-xs uppercase tracking-[0.28em] text-[#2B2B2B] transition hover:border-[#C9A66B]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {categories?.slice(0, 6)?.map((category) => (
                  <Link
                    key={category}
                    to={`/shop?category=${encodeURIComponent(category)}`}
                    className="min-w-0 border border-[#D8CDBE] px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[#6E665D] transition hover:border-[#C9A66B] hover:text-[#2B2B2B]"
                  >
                    <span className="block max-w-full truncate">{category}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

export default Header;