import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, ChevronDown } from "lucide-react";
import {
  Button,
  Input,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/shadcn";
import type { UserSession } from "@/mock";

// Props sourced from App.tsx, which in turn talks to the mock.ts state layer.
// This is a 100% frontend-only mock header; auth/cart are client-side only.

export interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  userSession?: UserSession;
  onSignInMock: () => void;
  onSignOut: () => void;
}

const navLinkBaseClasses =
  "relative inline-flex items-center text-sm tracking-wide uppercase transition-colors duration-200 px-1 pb-1 border-b-2 border-transparent";

const activeNavLinkClasses =
  "border-neutral-900 text-neutral-900 dark:text-neutral-100 dark:border-neutral-100";

const inactiveNavLinkClasses =
  "text-neutral-500 hover:text-neutral-900 hover:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:border-neutral-300";

const headerMotionProps = {
  whileHover: { y: -1, opacity: 0.9 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 260, damping: 20 },
};

const iconButtonMotionProps = {
  whileHover: { scale: 1.03, y: -0.5 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 260, damping: 20 },
};

export const Header: React.FC<HeaderProps> = ({
  searchValue,
  onSearchChange,
  cartCount,
  userSession,
  onSignInMock,
  onSignOut,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isOnCatalog = location.pathname.startsWith("/catalog");

  // Debounced search: keep internal input, call parent on a short delay
  const [internalSearch, setInternalSearch] = React.useState(searchValue);

  React.useEffect(() => {
    setInternalSearch(searchValue);
  }, [searchValue]);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      if (internalSearch !== searchValue) {
        onSearchChange(internalSearch);
        if (!isOnCatalog && internalSearch.trim().length > 0) {
          navigate("/catalog");
        }
      }
    }, 260);

    return () => window.clearTimeout(handle);
  }, [internalSearch, searchValue, onSearchChange, isOnCatalog, navigate]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearch(e.target.value);
  };

  const initials = userSession?.name
    ? userSession.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  const displayName = userSession?.name || "Guest";
  const displayEmail = userSession?.email || "Sign in to personalise Jootiya";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-neutral-50/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/70">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand mark */}
        <motion.button
          {...headerMotionProps}
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex flex-col">
            <span className="font-['Playfair_Display'] text-xl tracking-[0.22em] text-neutral-900 dark:text-neutral-50 sm:text-2xl">
              JOOTIYA
            </span>
            <span className="mt-1 h-[1px] w-12 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent group-hover:w-16 group-hover:from-amber-500 group-hover:via-amber-400 transition-[width,background] duration-300 ease-out" />
          </div>
        </motion.button>

        {/* Primary nav */}
        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <HeaderNavLink to="/" label="Home" />
          <HeaderNavLink to="/catalog" label="Catalog" />
          <HeaderNavLink to="/cart" label="Cart" />
        </nav>

        {/* Search + actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* Search */}
          <motion.div
            className="relative hidden max-w-xs flex-1 items-center sm:flex"
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400" />
            <Input
              value={internalSearch}
              onChange={handleSearchInput}
              placeholder="Search silhouettes, brands, stories…"
              className="h-9 border-neutral-200 bg-white/70 pl-9 pr-3 text-xs tracking-wide text-neutral-800 placeholder:text-neutral-400 focus-visible:ring-amber-500/40 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-50"
            />
          </motion.div>

          {/* Compact search icon on mobile */}
          <motion.button
            {...iconButtonMotionProps}
            onClick={() => {
              const term = window.prompt("Search Jootiya", internalSearch) ?? "";
              setInternalSearch(term);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 sm:hidden"
            aria-label="Search Jootiya"
          >
            <Search className="h-4 w-4" />
          </motion.button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                {...iconButtonMotionProps}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-800 shadow-sm hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                aria-label="Account menu"
              >
                <Avatar className="h-6 w-6 border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                  <AvatarImage src={undefined} alt={displayName} />
                  <AvatarFallback className="text-[10px] uppercase text-neutral-700 dark:text-neutral-200">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[6rem] truncate text-[11px] font-medium sm:inline text-left">
                  {displayName}
                </span>
                <Badge
                  variant="outline"
                  className="hidden border-amber-500/40 bg-amber-50/60 px-1.5 py-0 text-[9px] font-medium uppercase tracking-[0.18em] text-amber-700 dark:border-amber-400/50 dark:bg-amber-900/20 dark:text-amber-200 sm:inline-flex"
                >
                  {userSession ? "Profile" : "Guest"}
                </Badge>
                <ChevronDown className="hidden h-3 w-3 text-neutral-400 sm:inline" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-neutral-200 bg-neutral-50/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95"
            >
              <div className="px-3 py-2">
                <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase dark:text-neutral-400">
                  Account
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {displayName}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {displayEmail}
                </p>
              </div>
              <div className="my-1 h-px bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent dark:via-neutral-800/80" />
              {userSession ? (
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="cursor-pointer text-xs text-neutral-800 focus:bg-neutral-200/70 dark:text-neutral-100 dark:focus:bg-neutral-800/70"
                >
                  Sign out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={onSignInMock}
                  className="cursor-pointer text-xs text-neutral-800 focus:bg-neutral-200/70 dark:text-neutral-100 dark:focus:bg-neutral-800/70"
                >
                  Sign in (mock)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <motion.div {...iconButtonMotionProps}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
              onClick={() => navigate("/cart")}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-4 min-w-[1.1rem] justify-center rounded-full border-amber-700/80 bg-amber-500 text-[10px] font-semibold text-neutral-950 shadow-sm dark:border-amber-400 dark:bg-amber-300"
                  variant="outline"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

interface HeaderNavLinkProps {
  to: string;
  label: string;
}

const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          navLinkBaseClasses,
          isActive ? activeNavLinkClasses : inactiveNavLinkClasses,
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <motion.span
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="relative flex items-center gap-1"
        >
          <span>{label}</span>
          <span
            className={`absolute -bottom-[3px] left-0 h-[1px] w-0 bg-neutral-900 transition-[width] duration-300 ease-out dark:bg-neutral-100 ${
              isActive ? "w-full" : "group-hover:w-full"
            }`}
          />
        </motion.span>
      )}
    </NavLink>
  );
};

export default Header;