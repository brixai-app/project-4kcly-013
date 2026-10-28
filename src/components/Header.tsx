import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X, ChevronDown, Circle as LogOut } from 'lucide-react';
import { Dialog } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import AuthModal from '@/components/AuthModal';
import { authClient, useSession, signOut } from '@/lib/auth-client';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart() as { items?: Array<{ quantity?: number }> };
  const session = useSession?.() ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items],
  );

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Mojri', to: '/shop?category=Mojri' },
    { label: 'Jutti', to: '/shop?category=Jutti' },
    { label: 'Wedding', to: '/shop?category=Wedding' },
    { label: 'Heritage', to: '/shop?category=Heritage' },
  ];

  const handleSearch = () => {
    const trimmed = query.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop');
  };

  const handleAuth = async () => {
    if (session?.user) {
      await signOut?.();
      return;
    }
    setAuthOpen(true);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#CDBB9B] bg-[#F9F5F0]/95 backdrop-blur', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#CDBB9B] bg-[#FFFDF9] text-[#2E2B28] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="font-['Bodoni_Moda'] text-2xl font-semibold tracking-[0.18em] text-[#2E2B28]">
            JOOTIYA
          </div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#6E6258]">
            Jodhpuri Mojris
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2E2B28] transition hover:bg-[#FFFDF9] hover:text-[#C1440E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-[240px] max-w-sm flex-1 items-center gap-2 lg:flex">
          <div className="flex w-full items-center gap-2 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#6E6258]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search styles, artisans, sizes"
              className="w-full bg-transparent text-sm text-[#2E2B28] outline-none placeholder:text-[#6E6258]"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-[#C1440E] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#963308]"
          >
            Search
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="hidden h-10 items-center gap-1 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2E2B28] lg:inline-flex"
          >
            Shop
            <ChevronDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleAuth}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2E2B28] transition hover:text-[#C1440E]"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session?.user ? 'Sign Out' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/shop?cart=open')}
            className="relative inline-flex h-10 items-center justify-center rounded-md border border-[#CDBB9B] bg-[#FFFDF9] px-3 text-[#2E2B28] transition hover:text-[#C1440E]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C1440E] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#CDBB9B] bg-[#FFFDF9] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="min-w-0 rounded-md border border-[#CDBB9B] px-3 py-2 text-sm font-medium text-[#2E2B28]"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-md border border-[#CDBB9B] px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-[#6E6258]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#6E6258]"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-[#C1440E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white"
            >
              Search
            </button>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="hidden border-t border-[#CDBB9B] bg-[#FFFDF9] px-4 py-3 lg:block">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
            {['Everyday', 'Slip-on', 'Men', 'Women', 'Unisex'].map((item) => (
              <Link
                key={item}
                to={`/shop?filter=${encodeURIComponent(item)}`}
                className="rounded-md border border-[#CDBB9B] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#2E2B28] hover:text-[#C1440E]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}

export default Header;