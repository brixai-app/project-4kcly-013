import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { AuthModal } from '@/components/AuthModal';
import authClient from '@/lib/auth-client';

type NavItem = { label: string; to: string };

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Journey', to: '/journey' },
];

export function Header({ className = '' }: { className?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');
  const session = (authClient as { useSession?: () => { data?: { user?: { name?: string; email?: string } } | null } }).useSession?.();
  const user = session?.data?.user ?? null;

  const activePath = useMemo(() => location.pathname ?? '/', [location.pathname]);

  const submitSearch = (value: string) => {
    const next = value.trim();
    if (!next) return;
    navigate(`/shop?query=${encodeURIComponent(next)}`);
    setMobileOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#CDBB9F] bg-[#F7F0E4]/95 backdrop-blur-sm', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715] transition hover:bg-[#741F2B] hover:text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B1715]">
              Jootiya
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-[#765F55] sm:inline">
              Jodhpur Mojris
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'border border-transparent px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition',
                  active ? 'border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715]' : 'text-[#765F55] hover:border-[#CDBB9F] hover:bg-[#FFFDF8] hover:text-[#2B1715]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
          className="hidden min-w-0 flex-1 items-center justify-end md:flex"
        >
          <div className="flex w-full max-w-md items-center border border-[#CDBB9F] bg-[#FFFDF8] px-3">
            <Search className="h-4 w-4 shrink-0 text-[#765F55]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mojris, juttis, artisans"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#2B1715] outline-none placeholder:text-[#765F55]"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 items-center gap-2 border border-[#CDBB9F] bg-[#FFFDF8] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B1715] transition hover:bg-[#741F2B] hover:text-white"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{user?.name ?? 'Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => openCart()}
            className="relative inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9F] bg-[#FFFDF8] text-[#2B1715] transition hover:bg-[#741F2B] hover:text-white"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#741F2B] bg-[#741F2B] px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-[#CDBB9F] bg-[#FFFDF8] lg:hidden', mobileOpen ? 'block' : 'hidden')}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(query);
            }}
            className="flex items-center border border-[#CDBB9F] bg-[#F7F0E4] px-3"
          >
            <Search className="h-4 w-4 shrink-0 text-[#765F55]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#2B1715] outline-none placeholder:text-[#765F55]"
            />
          </form>

          <nav className="flex flex-col gap-2.5">
            {navItems.map((item) => {
              const active = activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'min-w-0 border border-[#CDBB9F] px-3 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition',
                    active ? 'bg-[#741F2B] text-white' : 'bg-[#FFFDF8] text-[#2B1715] hover:bg-[#F7F0E4]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

export default Header;