import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Menu } from "lucide-react";

import { Button } from "@/components/ui/shadcn";
import { cn } from "@/lib/utils";
import { useCart } from "@/mock";
import { CartDrawer } from "./CartDrawer";

// NOTE: This header is fully frontend-only and wired to the mocked state
// from src/mock.ts (localStorage-backed). There is NO backend.

const navItems: { label: string; to: string; exact?: boolean }[] = [
  { label: "Home", to: "/", exact: true },
  { label: "Catalog", to: "/catalog" },
];

export const Header: React.FC = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    // Close mobile menu on route change
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full sticky top-0 z-40 border-b border-neutral-200/70 bg-[rgba(248,244,239,0.94)] backdrop-blur-md dark:bg-[rgba(15,23,42,0.92)] dark:border-slate-800">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-4">
        {/* Brand + Primary Nav */}
        <div className="flex items-center gap-8 min-w-0">
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-baseline gap-1"
            >
              <span className="text-2xl md:text-3xl font-semibold tracking-[0.18em] uppercase font-['Playfair_Display'] text-slate-900 dark:text-slate-50">
                Jootiya
              </span>
              <span className="hidden md:inline text-[0.72rem] tracking-[0.28em] uppercase text-amber-800/80 dark:text-amber-200/80">
                Mojris Atelier
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    "relative px-1 py-1 whitespace-nowrap transition-colors",
                    isActive
                      ? "text-slate-900 dark:text-amber-100"
                      : "text-slate-600/90 dark:text-slate-300/90 hover:text-slate-900 dark:hover:text-slate-50",
                  )
                }
              >
                {({ isActive }) => (
                  <span className="inline-flex flex-col items-start">
                    <span>{item.label}</span>
                    <motion.span
                      layoutId="nav-underline"
                      className={cn(
                        "mt-0.5 h-[1px] w-full origin-left bg-amber-700/70 dark:bg-amber-300/80",
                        !isActive && "scale-x-0 opacity-0",
                      )}
                      animate={{
                        scaleX: isActive ? 1 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                    />
                  </span>
                )}
              </NavLink>
            ))}

            {/* Artisans anchor scrolls to #artisans on home */}
            <a
              href="/#artisans"
              className="relative px-1 py-1 whitespace-nowrap text-slate-600/90 dark:text-slate-300/90 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <span className="inline-flex flex-col items-start">
                <span>Artisans</span>
              </span>
            </a>
          </nav>
        </div>

        {/* Actions: Cart + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Cart Drawer trigger */}
          <CartDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <Button
              type="button"
              variant="outline"
              className="relative flex items-center gap-2 rounded-full border-slate-300/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-amber-50/70 hover:border-amber-700/60 dark:bg-slate-900/80 dark:border-slate-700 dark:hover:bg-slate-800/90"
              onClick={() => setDrawerOpen(true)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="inline-flex items-center justify-center rounded-full bg-amber-700 text-amber-50 text-xs min-w-[1.5rem] h-6 px-1">
                {cartCount}
              </span>
            </Button>
          </CartDrawer>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center md:hidden rounded-full border border-slate-300/80 bg-white/80 p-2 text-slate-800 shadow-sm hover:bg-slate-100 hover:border-slate-400/80 dark:bg-slate-900/80 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200/80 bg-[rgba(248,244,239,0.97)] backdrop-blur-md dark:bg-[rgba(15,23,42,0.97)] dark:border-slate-800">
          <div className="w-full px-6 lg:px-12 py-3 flex flex-col gap-2 text-sm text-slate-800 dark:text-slate-100">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between py-2 border-b last:border-b-0 border-slate-200/70 dark:border-slate-700/60",
                    isActive
                      ? "text-slate-900 dark:text-amber-100"
                      : "text-slate-700/90 dark:text-slate-200/90",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-700 dark:bg-amber-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <a
              href="/#artisans"
              className="flex items-center justify-between py-2 border-b border-slate-200/70 last:border-b-0 dark:border-slate-700/60"
            >
              <span>Artisans</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;