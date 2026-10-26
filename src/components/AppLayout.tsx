import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, X, ChevronDown, ArrowRight, Home, Sparkles, Store, BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart?.() ?? { items: [] as Array<{ quantity?: number }> };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = useMemo(() => items?.reduce((sum, item) => sum + (item?.quantity ?? 0), 0) ?? 0, [items]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/cart') {
      setDrawerOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, navigate]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/shop', label: 'Shop', icon: Store },
    { to: '/stories', label: 'Artisan Stories', icon: BookOpen },
    { to: '/custom-orders', label: 'Custom Orders', icon: Sparkles },
  ];

  const footerLinks = [
    { to: '/shop', label: 'Browse Collection' },
    { to: '/checkout', label: 'Checkout' },
    { to: '/custom-orders', label: 'Bespoke Inquiry' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#2B2B2B]">
      <header className="sticky top-0 z-40 border-b border-[#C9A66B]/60 bg-[#FFF9F0]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#C9A66B] text-[#2B2B2B] transition hover:bg-[#7B2D26] hover:text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="min-w-0 flex-1 lg:flex-none">
            <div className="flex items-baseline gap-2">
              <span className="font-['Playfair_Display'] text-2xl tracking-tight">Jootiya</span>
              <span className="hidden text-[10px] uppercase tracking-[0.35em] text-[#6F655B] sm:inline">Jodhpuri Mojris</span>
            </div>
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
            }}
            className="hidden flex-1 items-center gap-2 lg:flex"
          >
            <div className="flex w-full items-center gap-2 border border-[#C9A66B] bg-white px-3 py-2">
              <Search className="h-4 w-4 text-[#6F655B]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mojris, artisans, occasions"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#6F655B]"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              to="/custom-orders"
              className="hidden border border-[#C9A66B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#2B2B2B] transition hover:bg-[#7B2D26] hover:text-white md:inline-flex"
            >
              Custom Order
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative inline-flex h-10 items-center justify-center border border-[#C9A66B] px-3 text-[#2B2B2B] transition hover:bg-[#7B2D26] hover:text-white"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="ml-2 hidden text-xs font-semibold uppercase tracking-[0.25em] sm:inline">Cart</span>
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border border-[#7B2D26] bg-[#7B2D26] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
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
              className="overflow-hidden border-t border-[#C9A66B]/60 lg:hidden"
            >
              <div className="space-y-4 px-4 py-4 sm:px-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
                  }}
                  className="flex items-center gap-2 border border-[#C9A66B] bg-white px-3 py-2"
                >
                  <Search className="h-4 w-4 text-[#6F655B]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search collection"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#6F655B]"
                  />
                </form>
                <nav className="grid gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center justify-between border border-[#C9A66B] px-4 py-3 text-sm uppercase tracking-[0.2em] transition hover:bg-[#FFF9F0]"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="hidden border-t border-[#C9A66B]/60 lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'text-xs font-semibold uppercase tracking-[0.25em] transition hover:text-[#7B2D26]',
                    location.pathname === link.to && 'text-[#7B2D26]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-[#6F655B]">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Jodhpur, Rajasthan
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Bespoke support
              </span>
            </div>
          </div>
          <div className="border-t border-[#C9A66B]/40 bg-[#FFF9F0]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#6F655B] sm:px-6 lg:px-8">
              <span className="mr-2">Shop by category</span>
              {categories?.slice?.(0, 6)?.map((category: string) => (
                <Link
                  key={category}
                  to={`/shop?category=${encodeURIComponent(category)}`}
                  className="border border-[#C9A66B] px-3 py-1 transition hover:bg-[#7B2D26] hover:text-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-[#C9A66B]/60 bg-[#FFF9F0]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <div className="font-['Playfair_Display'] text-3xl tracking-tight">Jootiya</div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6F655B]">
              Heritage-crafted Jodhpuri Mojris with editorial restraint, bespoke fittings, and a warm luxury finish for modern ceremonial dressing.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between border border-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-[#7B2D26] hover:text-white"
              >
                {link.label}
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
            ))}
            <a
              href="mailto:hello@jootiya.com"
              className="flex items-center justify-between border border-[#C9A66B] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition hover:bg-[#7B2D26] hover:text-white"
            >
              Contact
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      <CartDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}

export default AppLayout;