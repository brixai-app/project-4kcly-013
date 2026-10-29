import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X, ChevronDown, Circle as LogOut } from 'lucide-react';
import { Dialog } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';

type SessionUser = {
  name?: string;
  email?: string;
};

type SessionState = {
  user?: SessionUser | null;
};

const authClient = {
  useSession: () => ({ data: null as SessionState | null, isPending: false }),
  signOut: async () => undefined,
};

const navItems = [
  { label: 'Shop', to: '/shop' },
  { label: 'Artisans', to: '/artisans' },
  { label: 'Stories', to: '/stories' },
  { label: 'Custom', to: '/custom' },
];

export function Header({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart() as { items?: Array<{ quantity?: number }> };
  const session = authClient.useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemCount = useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  const userName = session?.data?.user?.name?.trim() || session?.data?.user?.email?.split('@')?.[0] || 'Guest';

  const handleSignOut = async () => {
    await authClient.signOut();
    setMobileOpen(false);
  };

  return (
    <>
      <header className={cn('sticky top-0 z-40 border-b border-[#C9BFB1] bg-[#F5F1EB]/95 backdrop-blur-sm', className)}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29] transition hover:bg-[#F5F1EB] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            to="/"
            className="min-w-0 shrink-0 font-['Bodoni_Moda'] text-2xl font-light tracking-[0.18em] text-[#302D29] uppercase"
          >
            Jootiya
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex">
            {navItems.map((item) => {
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'text-xs font-semibold uppercase tracking-[0.22em] transition',
                    active ? 'text-[#6B1E1E]' : 'text-[#71695F] hover:text-[#302D29]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="hidden h-10 items-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29] transition hover:bg-[#F5F1EB] sm:inline-flex"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {session?.data?.user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-[140px] truncate text-xs uppercase tracking-[0.18em] text-[#71695F]">
                  Hello, {userName}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-10 items-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29] transition hover:bg-[#F5F1EB]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="hidden h-10 items-center gap-2 border border-[#C9BFB1] bg-[#FFFCF7] px-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29] transition hover:bg-[#F5F1EB] sm:inline-flex"
              >
                <User className="h-4 w-4" />
                Sign In
              </button>
            )}

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center border border-[#C9BFB1] bg-[#FFFCF7] text-[#302D29] transition hover:bg-[#F5F1EB]"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#6B1E1E] bg-[#6B1E1E] px-1 text-[10px] font-semibold leading-none text-white">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-[#C9BFB1] bg-[#FFFCF7] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border border-[#C9BFB1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29]"
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthOpen(true);
                }}
                className="flex items-center justify-between border border-[#C9BFB1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29]"
              >
                <span className="min-w-0 truncate">{session?.data?.user ? 'Account' : 'Sign In'}</span>
                <User className="h-4 w-4" />
              </button>
              {session?.data?.user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-between border border-[#C9BFB1] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#302D29]"
                >
                  <span className="min-w-0 truncate">Sign Out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab="signin" />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}

export default Header;