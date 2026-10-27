import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
// [auto-quarantined uninstalled package "better-auth/react"] import { useSession } from 'better-auth/react';
const useSession: any = typeof Proxy !== 'undefined' ? new Proxy((() => null) as any, { get: () => useSession, apply: () => null }) : (() => null);
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { navigation } from '@/data/mockData';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';

export function Header({ className = '' }: { className?: string } = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { session } = useSession();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = useMemo(() => items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0, [items]);

  const links = navigation?.main ?? [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Artisans', href: '/artisans' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#D8CCB9] bg-[#FAF9F6]/95 backdrop-blur-sm', className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] bg-white text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720] lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="min-w-0">
            <div className="truncate font-['Playfair_Display'] text-2xl font-semibold tracking-tight text-[#1A1A1A]">
              Jootiya
            </div>
            <div className="truncate text-[10px] uppercase tracking-[0.32em] text-[#675F56]">
              Jodhpur Mojris
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'min-w-0 border border-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#675F56] transition hover:border-[#D8CCB9] hover:text-[#1A1A1A]',
                isActive(link.href) && 'border-[#D8CCB9] text-[#1A1A1A]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="hidden h-10 items-center gap-2 border border-[#D8CCB9] bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720] sm:inline-flex"
            aria-label="Search collection"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] bg-white text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720]"
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#A94720] bg-[#A94720] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center border border-[#D8CCB9] bg-white text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720]"
                aria-label="Account menu"
              >
                <User className="h-5 w-5" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-50 min-w-48 border border-[#D8CCB9] bg-[#FAF9F6] p-2 shadow-[0_18px_40px_rgba(26,26,26,0.08)]"
              >
                <div className="px-2 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[#675F56]">
                  {session?.user?.name ?? 'Guest'}
                </div>
                <DropdownMenu.Item asChild>
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="flex w-full items-center justify-between px-2 py-2 text-left text-sm text-[#1A1A1A] outline-none transition hover:bg-white"
                  >
                    <span>{session?.user ? 'Account' : 'Sign in'}</span>
                    <User className="h-4 w-4 text-[#675F56]" />
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link
                    to="/shop"
                    className="flex items-center justify-between px-2 py-2 text-sm text-[#1A1A1A] outline-none transition hover:bg-white"
                  >
                    <span>Shop latest</span>
                    <Search className="h-4 w-4 text-[#675F56]" />
                  </Link>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#D8CCB9] bg-[#FAF9F6] px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2.5">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'min-w-0 border border-[#D8CCB9] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720]',
                  isActive(link.href) && 'border-[#A94720] text-[#A94720]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setAuthOpen(true);
              }}
              className="border border-[#D8CCB9] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1A1A1A] transition hover:border-[#A94720] hover:text-[#A94720]"
            >
              {session?.user ? 'Account' : 'Sign in'}
            </button>
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

export default Header;