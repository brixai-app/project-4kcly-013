import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/shadcn";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

// Utility to join Tailwind classes
function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { label: "Home", to: "/" },
  { label: "Catalog", to: "/catalog" },
];

/**
 * Luxury editorial top navigation for Jootiya.
 * - Uses Playfair Display for the brand wordmark via Tailwind font utilities.
 * - Sticky, high-contrast header with subtle shadow.
 * - Responsive mobile navigation with disclosure panel.
 * - Cart button exposes cart count via props and triggers parent drawer.
 *
 * NOTE: Cart data and all stateful mocks are managed centrally in src/mock.ts
 * and wired in App.tsx. This component is purely presentational + UI state.
 */
export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    // Close mobile nav when route changes
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(0,0,0,0.06)] bg-[#F5F1EB]/90 backdrop-blur-md dark:border-[rgba(255,255,255,0.08)] dark:bg-[#111111]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Brand + Desktop Nav */}
        <div className="flex flex-1 items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-[#F5F1EB] dark:focus-visible:ring-offset-[#111111]"
            aria-label="Jootiya home"
          >
            <span className="text-xl tracking-[0.2em] text-[#2B2B2B] dark:text-[#F5F1EB] font-semibold font-['Playfair_Display'] uppercase">
              Jootiya
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    "text-sm tracking-[0.18em] uppercase transition-colors duration-200 font-medium",
                    "text-[#5A5145] hover:text-[#2B2B2B] dark:text-[#D1C7B8] dark:hover:text-[#F5F1EB]",
                    isActive && "text-[#2B2B2B] dark:text-[#F5F1EB]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Cart + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart button */}
          <Button
            type="button"
            variant="ghost"
            onClick={onCartClick}
            className="relative flex items-center gap-2 rounded-full border border-transparent bg-[#2B2B2B] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F5F1EB] shadow-sm transition-colors duration-200 hover:bg-[#3A3A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1EB] dark:bg-[#F5F1EB] dark:text-[#111111] dark:hover:bg-[#E4DBCE] dark:focus-visible:ring-offset-[#111111]"
            aria-label={cartCount > 0 ? `Open cart with ${cartCount} items` : "Open cart"}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#BFA06F] px-1 text-[10px] font-semibold leading-none text-[#2B2B2B] shadow-md">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] bg-white/70 p-1.5 text-[#2B2B2B] shadow-sm transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1EB] dark:border-[rgba(255,255,255,0.14)] dark:bg-[#181818]/80 dark:text-[#F5F1EB] dark:hover:bg-[#222222] dark:focus-visible:ring-offset-[#111111] md:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      <div
        id="mobile-nav"
        className={classNames(
          "border-t border-[rgba(0,0,0,0.06)] bg-[#F5F1EB]/95 backdrop-blur-sm transition-[max-height,opacity] duration-200 ease-out overflow-hidden md:hidden dark:border-[rgba(255,255,255,0.08)] dark:bg-[#111111]/95",
          mobileOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col space-y-1 px-4 py-3 sm:px-6 lg:px-8" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                classNames(
                  "flex items-center justify-between border-b border-transparent py-2 text-sm font-medium uppercase tracking-[0.18em] transition-colors duration-200",
                  "text-[#5A5145] hover:text-[#2B2B2B] dark:text-[#D1C7B8] dark:hover:text-[#F5F1EB]",
                  isActive && "border-b-[#BFA06F] text-[#2B2B2B] dark:text-[#F5F1EB]"
                )
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;