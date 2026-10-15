import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';

export interface HeaderProps {
  transparentOnTop?: boolean;
}

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function useQueryParam(key: string): [string, (value: string, options?: { replace?: boolean }) => void] {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get(key) ?? '';
    setValue(current);
  }, [location.search, key]);

  const update = (next: string, options?: { replace?: boolean }) => {
    const params = new URLSearchParams(location.search);
    if (next.trim()) {
      params.set(key, next);
    } else {
      params.delete(key);
    }
    const search = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : '',
      },
      { replace: options?.replace ?? false }
    );
  };

  return [value, update];
}

export function Header({ transparentOnTop = false }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const [searchValue, setSearchValue] = useQueryParam('q');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = state.items?.reduce((acc, item) => acc + (item?.quantity ?? 0), 0) ?? 0;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setIsScrolled(y > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) {
      navigate('/shop');
      return;
    }
    if (location.pathname !== '/shop') {
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    } else {
      setSearchValue(trimmed, { replace: true });
    }
  };

  const isHeroTransparent = transparentOnTop && !isScrolled && location.pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          'backdrop-blur-md',
          isHeroTransparent
            ? 'bg-transparent text-[#F9F6F2]'
            : 'bg-[#F9F6F2]/95 border-b border-[#D9D1C7] text-[#2E2B28]'
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div
                className={cn(
                  'h-9 w-9 rounded-full border flex items-center justify-center',
                  isHeroTransparent ? 'border-[#F9F6F2]/40' : 'border-[#D9D1C7]',
                  'bg-white/5'
                )}
              >
                <span className="text-xs tracking-[0.25em] uppercase font-semibold">
                  J
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={cn(
                    'text-lg sm:text-xl tracking-[0.3em] uppercase',
                    'font-semibold',
                    'font-[Playfair_Display]'
                  )}
                >
                  Jootiya
                </span>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs tracking-[0.28em] uppercase',
                    isHeroTransparent ? 'text-[#F9F6F2]/70' : 'text-[#6F675E]'
                  )}
                >
                  Footwear Studio
                </span>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'text-xs tracking-[0.25em] uppercase transition-colors',
                      'border-b border-transparent pb-0.5',
                      isActive
                        ? isHeroTransparent
                          ? 'text-[#F9F6F2] border-[#F9F6F2]'
                          : 'text-[#2E2B28] border-[#2E2B28]'
                        : isHeroTransparent
                        ? 'text-[#F9F6F2]/70 hover:text-[#F9F6F2]'
                        : 'text-[#6F675E] hover:text-[#2E2B28]'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-1 justify-end">
              <form
                onSubmit={handleSearchSubmit}
                className={cn(
                  'relative flex-1 max-w-xs lg:max-w-sm',
                  'group'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5',
                    'bg-white/80 backdrop-blur-md',
                    'transition-colors',
                    isHeroTransparent
                      ? 'border-white/30 focus-within:border-white/70'
                      : 'border-[#D9D1C7] focus-within:border-[#8B0000]'
                  )}
                >
                  <Search
                    className={cn(
                      'w-4 h-4 flex-none',
                      isHeroTransparent ? 'text-[#F9F6F2]/80' : 'text-[#6F675E]'
                    )}
                  />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search sneakers, boots, loafers..."
                    className={cn(
                      'w-full bg-transparent border-none outline-none text-xs',
                      'placeholder:text-[11px]',
                      isHeroTransparent
                        ? 'text-[#F9F6F2] placeholder:text-[#F9F6F2]/60'
                        : 'text-[#2E2B28] placeholder:text-[#6F675E]'
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      'text-[10px] tracking-[0.2em] uppercase font-semibold',
                      'px-2 py-0.5 rounded-full border transition-colors',
                      isHeroTransparent
                        ? 'border-[#F9F6F2]/50 text-[#F9F6F2]/80 hover:bg-[#F9F6F2] hover:text-[#2E2B28]'
                        : 'border-[#D9D1C7] text-[#6F675E] hover:bg-[#2E2B28] hover:text-[#F9F6F2]'
                    )}
                  >
                    Find
                  </button>
                </div>
              </form>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={cn(
                  'relative flex items-center justify-center rounded-full border',
                  'h-10 w-10 transition-colors',
                  isHeroTransparent
                    ? 'border-[#F9F6F2]/60 hover:bg-[#F9F6F2] hover:text-[#2E2B28]'
                    : 'border-[#D9D1C7] hover:bg-[#2E2B28] hover:text-[#F9F6F2]'
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1 min-w-[18px] h-[18px]',
                      'rounded-full bg-[#8B0000] text-[10px] text-white',
                      'flex items-center justify-center px-1'
                    )}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex md:hidden items-center gap-3">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className={cn(
                  'relative flex items-center justify-center rounded-full border',
                  'h-9 w-9 transition-colors',
                  isHeroTransparent
                    ? 'border-[#F9F6F2]/60 hover:bg-[#F9F6F2] hover:text-[#2E2B28]'
                    : 'border-[#D9D1C7] hover:bg-[#2E2B28] hover:text-[#F9F6F2]'
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1 min-w-[16px] h-[16px]',
                      'rounded-full bg-[#8B0000] text-[9px] text-white',
                      'flex items-center justify-center px-1'
                    )}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className={cn(
                  'flex items-center justify-center rounded-full border',
                  'h-9 w-9 transition-colors',
                  isHeroTransparent
                    ? 'border-[#F9F6F2]/60 hover:bg-[#F9F6F2] hover:text-[#2E2B28]'
                    : 'border-[#D9D1C7] hover:bg-[#2E2B28] hover:text-[#F9F6F2]'
                )}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
              mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="pb-4 border-t border-[#D9D1C7]/70 pt-3 space-y-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5',
                    'bg-white/80 backdrop-blur-md border-[#D9D1C7]',
                    'transition-colors focus-within:border-[#8B0000]'
                  )}
                >
                  <Search className="w-4 h-4 text-[#6F675E]" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search collection..."
                    className={cn(
                      'w-full bg-transparent border-none outline-none text-xs',
                      'placeholder:text-[11px] text-[#2E2B28] placeholder:text-[#6F675E]'
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      'text-[10px] tracking-[0.2em] uppercase font-semibold',
                      'px-2 py-0.5 rounded-full border transition-colors',
                      'border-[#D9D1C7] text-[#6F675E] hover:bg-[#2E2B28] hover:text-[#F9F6F2]'
                    )}
                  >
                    Go
                  </button>
                </div>
              </form>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between px-1 py-2',
                        'text-xs tracking-[0.24em] uppercase',
                        'border-b border-[#D9D1C7]/60',
                        isActive ? 'text-[#2E2B28] font-semibold' : 'text-[#6F675E]'
                      )
                    }
                  >
                    <span>{item.label}</span>
                    <span className="h-px w-10 bg-[#D9D1C7]" />
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <div className="h-16 md:h-20" />
    </>
  );
}

export default Header;