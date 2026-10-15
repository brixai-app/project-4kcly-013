import React from "react";
import { ShoppingBag, Filter, Shoe, Palette } from "lucide-react";
import { ROUTES } from "../mock";

interface HeaderProps {
  cartCount: number;
  currentRoute: string;
  onNavigate: (path: string) => void;
  onOpenCart: () => void;
  onOpenFilters: () => void;
  onCategoryFilter: (category: string | null) => void;
}

const navItems = [
  { label: "Home", path: ROUTES.HOME, category: null },
  { label: "Sneakers", path: ROUTES.HOME, category: "Sneakers" },
  { label: "Formal", path: ROUTES.HOME, category: "Formal" },
  { label: "Casual", path: ROUTES.HOME, category: "Casual" },
];

const Header: React.FC<HeaderProps> = ({
  cartCount,
  currentRoute,
  onNavigate,
  onOpenCart,
  onOpenFilters,
  onCategoryFilter,
}) => {
  const handleNavClick = (item: (typeof navItems)[number]) => {
    onNavigate(item.path);
    onCategoryFilter(item.category);
  };

  return (
    <header className="border-b border-[rgba(43,43,43,0.12)] bg-[#F5F1EB]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate(ROUTES.HOME)}
          className="group flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
        >
          <span className="font-['Playfair_Display'] text-2xl tracking-[0.12em] text-[#2B2B2B] uppercase">
            Jootiya
          </span>
          <span className="font-['Bodoni_Moda'] text-xs tracking-[0.2em] text-[#7E6B5A] uppercase hidden sm:inline">
            Atelier Footwear
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => {
            const active =
              item.category && currentRoute === ROUTES.HOME
                ? true
                : item.path === currentRoute && !item.category;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`relative pb-1 font-['Inter'] tracking-[0.16em] uppercase text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F] ${
                  active ? "text-[#2B2B2B]" : "text-[#7E6B5A] hover:text-[#2B2B2B]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-0 bottom-0 h-[2px] w-6 bg-[#BFA06F]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFilters}
            className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[rgba(126,107,90,0.4)] bg-white/80 px-3 py-1 text-xs font-['Inter'] uppercase tracking-[0.16em] text-[#7E6B5A] shadow-sm hover:bg-[#F5F1EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFA06F]"
          >
            <Filter className="h-3 w-3" />
            Filters
          </button>

          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center justify-center rounded-full bg-[#BFA06F] px-3 py-2 text-[#F5F1EB] shadow-md hover:bg-[#a58a5c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#BFA06F] focus-visible:ring-offset-[#F5F1EB]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-[#2B2B2B] px-1 text-[10px] font-semibold text-[#F5F1EB] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[rgba(43,43,43,0.08)] bg-[#F5F1EB] mt-16">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E6B5A] font-['Inter'] tracking-[0.12em] uppercase">
        <div className="flex items-center gap-2">
          <Shoe className="h-4 w-4" />
          <span>Jootiya Studio — Crafted for the city in motion.</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Palette className="h-3 w-3" />
            <span>Warm Ivory / Charcoal / Taupe / Gold</span>
          </div>
          <span className="hidden sm:inline">© {new Date().getFullYear()} Jootiya (Mock)</span>
        </div>
      </div>
    </footer>
  );
};

export default Header;