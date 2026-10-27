import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { navigationLinks } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { AuthModal } from '@/components/AuthModal';
import { useSession } from '@/lib/auth-client';

export function Header({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items = [] } = useCart?.() ?? {};
  const session = useSession?.() ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [query, setQuery] = useState('');

  const cartCount = useMemo(
    () => items.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const links = navigationLinks ?? [];
  const onSearch = () => {
    const q = query.trim();
    navigate(q ? `/shop?query=${encodeURIComponent(q)}` : '/shop');
    setMobileOpen(false);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#BFA6A0] bg-[#F9F5F0]/95 backdrop-blur', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="min-w-0 flex-1 lg:flex-none">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#2B2B2B]">
              Jootiya
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.35em] text-[#6F625D] sm:inline">
              Jodhpur Mojris
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link?.href ?? link?.label}
              to={link?.href ?? '/'}
              className={cn(
                'text-xs uppercase tracking-[0.28em] text-[#6F625D] transition-colors hover:text-[#D9381E]',
                location.pathname === (link?.href ?? '') && 'text-[#2B2B2B]'
              )}
            >
              {link?.label ?? ''}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-sm border border-[#BFA6A0] bg-[#FFFDFC] px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-[#6F625D]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Search mojris"
              className="w-40 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6F625D]"
            />
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] md:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] transition-colors hover:text-[#D9381E]"
            aria-label={session?.user ? 'Account' : 'Sign in'}
          >
            <User className="h-4 w-4" />
          </button>

          <Dialog open={false} onOpenChange={() => {}}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center border border-[#BFA6A0] bg-[#FFFDFC] text-[#2B2B2B] transition-colors hover:text-[#D9381E]"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-[#D9381E] px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#BFA6A0] bg-[#FFFDFC] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2 rounded-sm border border-[#BFA6A0] px-3 py-2">
              <Search className="h-4 w-4 text-[#6F625D]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                placeholder="Search mojris"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6F625D]"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              {links.map((link) => (
                <Link
                  key={link?.href ?? link?.label}
                  to={link?.href ?? '/'}
                  onClick={() => setMobileOpen(false)}
                  className="min-w-0 border border-[#BFA6A0] px-3 py-2 text-xs uppercase tracking-[0.28em] text-[#2B2B2B]"
                >
                  {link?.label ?? ''}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultMode="signin" />
    </header>
  );
}

export default Header;