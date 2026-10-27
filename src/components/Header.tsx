import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { categories } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useSession } from '@/lib/auth-client';
import AuthModal from '@/components/AuthModal';

export function Header({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [] } = useCart?.() ?? { items: [] };
  const { data: session } = useSession?.() ?? { data: null };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');

  const bagCount = useMemo(
    () => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const navItems = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: '/shop' },
      ...(categories ?? []).slice(0, 4).map((category: string) => ({
        label: category,
        to: `/shop?category=${encodeURIComponent(category)}`,
      })),
    ],
    []
  );

  const handleSearch = () => {
    const trimmed = query.trim();
    navigate(trimmed ? `/shop?query=${encodeURIComponent(trimmed)}` : '/shop');
    setMobileOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#D8CDBB] bg-[#FAF9F6]/95 backdrop-blur-sm', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CDBB] bg-white text-[#2B2B2B] transition hover:border-[#9A7135] hover:text-[#9A7135] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl tracking-tight text-[#2B2B2B]">Jootiya</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9A7135] sm:inline">
              Jodhpuri Mojris
            </span>
          </div>
        </Link>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="hidden min-w-0 flex-1 items-center gap-2 lg:flex"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#D8CDBB] bg-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#6E665C]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mojris, artisans, collections"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6E665C]/70"
            />
          </div>
          <button
            type="submit"
            className="border border-[#9A7135] bg-[#9A7135] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#765326]"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 items-center gap-2 border border-[#D8CDBB] bg-white px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#9A7135] hover:text-[#9A7135]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.user?.name ?? 'Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="relative inline-flex h-10 items-center gap-2 border border-[#D8CDBB] bg-white px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B] transition hover:border-[#9A7135] hover:text-[#9A7135]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {bagCount > 0 ? (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center border border-[#9A7135] bg-[#9A7135] px-1.5 text-[10px] font-semibold leading-5 text-black">
                {bagCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-[#D8CDBB] lg:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6E665C] sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'whitespace-nowrap transition hover:text-[#9A7135]',
                location.pathname === item.to.split('?')[0] ? 'text-[#2B2B2B]' : ''
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#D8CDBB] bg-[#FAF9F6] lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="flex items-center gap-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#D8CDBB] bg-white px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-[#6E665C]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6E665C]/70"
                  />
                </div>
                <button
                  type="submit"
                  className="border border-[#9A7135] bg-[#9A7135] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black"
                >
                  Go
                </button>
              </form>

              <div className="flex flex-col gap-2.5">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="min-w-0 border border-[#D8CDBB] bg-white px-3 py-3 text-sm font-medium text-[#2B2B2B] transition hover:border-[#9A7135] hover:text-[#9A7135]"
                  >
                    <span className="block truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
    </header>
  );
}

export default Header;