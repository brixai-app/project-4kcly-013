import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, User, X, ChevronDown, Home, Store, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "@/lib/auth-client";
import { AuthModal } from "@/components/AuthModal";

type HeaderProps = { className?: string };

export function Header({ className = "" }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], setCartOpen } = useCart() as any;
  const { session } = useSession() as any;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const count = useMemo(() => items?.reduce((sum: number, item: any) => sum + (item?.quantity ?? 0), 0) ?? 0, [items]);

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Catalog", to: "/catalog", icon: Store },
    { label: "Artisans", to: "/artisans", icon: Search },
  ];

  const handleCart = () => setCartOpen?.(true);
  const handleAuth = () => setAuthOpen(true);
  const handleSignOut = async () => {
    await signOut?.();
    setAuthOpen(false);
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b border-[#CDBB9D] bg-[#F7F0E3]/95 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center border border-[#CDBB9D] bg-[#FFFDFC] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="group flex min-w-0 items-baseline gap-2">
            <span className="font-['Bodoni_Moda'] text-2xl font-light tracking-[0.18em] text-[#211A17] uppercase">Jootiya</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-[#6F6258] sm:inline">Mojris</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition",
                  active
                    ? "border-[#741F2B] bg-[#741F2B] text-white"
                    : "border-transparent text-[#211A17] hover:border-[#CDBB9D] hover:bg-[#FFFDFC]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className="hidden items-center gap-2 border border-[#CDBB9D] bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white sm:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Catalog</span>
          </button>

          {session?.id ? (
            <button
              type="button"
              onClick={handleAuth}
              className="inline-flex items-center gap-2 border border-[#CDBB9D] bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{session?.name ?? "Account"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAuth}
              className="inline-flex items-center gap-2 border border-[#CDBB9D] bg-[#FFFDFC] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#211A17] transition hover:bg-[#741F2B] hover:text-white"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCart}
            className="relative inline-flex h-10 items-center justify-center border border-[#CDBB9D] bg-[#FFFDFC] px-3 text-[#211A17] transition hover:bg-[#741F2B] hover:text-white"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center border border-[#741F2B] bg-[#741F2B] px-1 text-[10px] font-semibold leading-none text-white">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#CDBB9D] bg-[#FFFDFC] md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 border border-[#CDBB9D] px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#211A17]"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleAuth}
                className="flex items-center gap-3 border border-[#CDBB9D] px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#211A17]"
              >
                <User className="h-4 w-4" />
                <span>{session?.id ? "Account" : "Sign In"}</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultTab={session?.id ? "signin" : "signin"} />
    </header>
  );
}

export default Header;