import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export interface HeaderProps {
  className?: string;
  onOpenCart?: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ className = '', onOpenCart = () => {}, onSearch = () => {} }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const { items } = useCart() as { items?: Array<{ quantity?: number }> };
  const location = useLocation();
  const navigate = useNavigate();

  const itemCount = React.useMemo(
    () => (items ?? []).reduce((sum, item) => sum + (item?.quantity ?? 0), 0),
    [items]
  );

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/story', label: 'Story' },
    { to: '/custom', label: 'Custom' },
  ];

  const submitSearch = (value: string) => {
    const next = value.trim();
    onSearch(next);
    if (next) navigate(`/shop?search=${encodeURIComponent(next)}`);
  };

  return (
    <header className={cn('sticky top-0 z-50 border-b border-[#CFC2B2] bg-[#F5F1EB]/95 backdrop-blur-md', className)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="min-w-0 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="font-['Playfair_Display'] text-2xl tracking-tight text-[#2B2B2B]">Jootiya</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6F655C] sm:inline">
              Jodhpur Atelier
            </span>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-xs font-semibold uppercase tracking-[0.22em] text-[#6F655C] transition-colors hover:text-[#2B2B2B]',
                  isActive && 'text-[#2B2B2B]'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form
          className="hidden min-w-[220px] max-w-[320px] flex-1 md:block"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch(query);
          }}
        >
          <div className="flex items-center gap-2 border border-[#CFC2B2] bg-[#FFFDF7] px-3 py-2">
            <Search className="h-4 w-4 text-[#6F655C]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mojris"
              className="w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6F655C]"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => submitSearch(query)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] transition-colors hover:border-[#E07A5F] hover:text-[#E07A5F] md:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onOpenCart()}
            className="relative inline-flex h-10 w-10 items-center justify-center border border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] transition-colors hover:border-[#E07A5F] hover:text-[#E07A5F]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center border border-[#CFC2B2] bg-[#E07A5F] px-1 text-[10px] font-semibold text-black">
                {itemCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#CFC2B2] bg-[#FFFDF7] text-[#2B2B2B] transition-colors hover:border-[#E07A5F] hover:text-[#E07A5F] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="border-t border-[#CFC2B2] bg-[#FFFDF7] md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'min-w-0 border border-[#CFC2B2] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6F655C] transition-colors hover:border-[#E07A5F] hover:text-[#2B2B2B]',
                      isActive && 'border-[#E07A5F] text-[#2B2B2B]'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className="flex items-center gap-2 border border-[#CFC2B2] bg-[#F5F1EB] px-3 py-2"
            >
              <Search className="h-4 w-4 text-[#6F655C]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mojris"
                className="w-full bg-transparent text-sm text-[#2B2B2B] outline-none placeholder:text-[#6F655C]"
              />
            </form>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

export default Header;