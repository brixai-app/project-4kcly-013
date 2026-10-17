import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import mockStore from "@/mock";

// NOTE: This header works entirely against the frontend-only mock store in src/mock.ts.
// There is NO backend – search and cart counts are derived from local in-memory + localStorage state.

interface HeaderProps {
  onCartOpen?: () => void;
}

const navLinkBaseClasses =
  "relative inline-flex items-center text-sm tracking-[0.18em] uppercase transition-colors duration-200";

const activeAccentClasses =
  "text-amber-900 dark:text-amber-300";

const inactiveMutedClasses =
  "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white";

const underlineMotion = {
  rest: { width: 0, opacity: 0 },
  hover: { width: "100%", opacity: 1 },
};

export const Header: React.FC<HeaderProps> = ({ onCartOpen }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = React.useState(() =>
    mockStore.getSearch().term ?? "",
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  // Sync local search input with global search state when store changes
  React.useEffect(() => {
    const unsubscribe = mockStore.subscribe((state) => {
      if (state.search.term !== searchTerm) {
        setSearchTerm(state.search.term);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartCount = React.useSyncExternalStore(
    mockStore.subscribe,
    () => mockStore.getCartCount(),
    () => mockStore.getCartCount(),
  );

  const profile = React.useSyncExternalStore(
    mockStore.subscribe,
    () => mockStore.getProfile(),
    () => mockStore.getProfile(),
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    mockStore.setSearchTerm(value);
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Catalog", to: "/catalog" },
  ];

  return (
    <header className="w-full border-b border-stone-200/70 bg-[#f5f1ea]/80 backdrop-blur-md dark:bg-stone-900/80 dark:border-stone-800 z-30 sticky top-0">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link
              to="/"
              className="group flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f1ea] dark:focus-visible:ring-offset-stone-900 rounded-sm"
            >
              <div className="flex flex-col leading-none">
                <span className="text-2xl lg:text-[1.9rem] font-semibold tracking-[0.22em] font-serif uppercase text-stone-900 dark:text-stone-50">
                  Jootiya
                </span>
                <span className="mt-0.5 text-[0.62rem] tracking-[0.32em] uppercase text-stone-500 dark:text-stone-400">
                  Jodhpur Mojri Editorial
                </span>
              </div>
              <span className="h-9 w-[1px] bg-gradient-to-b from-amber-700/70 via-stone-400/40 to-transparent dark:from-amber-400/80 dark:via-stone-500/60 ml-2" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const active = isActivePath(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        navLinkBaseClasses,
                        (isActive || active) ? activeAccentClasses : inactiveMutedClasses,
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <motion.span
                        initial="rest"
                        whileHover="hover"
                        animate={isActive || active ? "hover" : "rest"}
                        className="flex flex-col items-start"
                      >
                        <span>{item.label}</span>
                        <motion.span
                          variants={underlineMotion}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className="mt-1 h-[1px] bg-amber-800/80 dark:bg-amber-300"
                        />
                      </motion.span>
                    )}
                  </NavLink>
                );
              })}

              {/* Artisan Stories anchor - in-page section on home */}
              <a
                href="/#artisan-stories"
                className={[
                  navLinkBaseClasses,
                  location.pathname === "/" ? inactiveMutedClasses : inactiveMutedClasses,
                ].join(" ")}
              >
                <motion.span
                  initial="rest"
                  whileHover="hover"
                  className="flex flex-col items-start"
                >
                  <span>Artisan Stories</span>
                  <motion.span
                    variants={underlineMotion}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="mt-1 h-[1px] bg-amber-800/80 dark:bg-amber-300"
                  />
                </motion.span>
              </a>
            </nav>
          </div>

          {/* Search + actions */}
          <div className="flex items-center gap-3 lg:gap-4 flex-1 justify-end">
            {/* Search input - desktop */}
            <div className="hidden md:flex flex-1 max-w-md items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search mojris or artisans"
                  className="w-full pl-9 pr-3 h-9 rounded-full border-stone-300/70 bg-white/70 text-sm placeholder:text-stone-400 focus-visible:ring-amber-800/60 focus-visible:border-amber-800/70 dark:bg-stone-900/70 dark:border-stone-700 dark:placeholder:text-stone-500"
                />
              </div>
            </div>

            {/* Cart */}
            <Tooltip delayDuration={150}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open cart"
                  className="relative rounded-full border border-stone-300/70 bg-white/70 hover:bg-amber-900 hover:text-amber-50 hover:border-amber-900/80 transition-colors duration-200 dark:bg-stone-900/80 dark:border-stone-700 dark:hover:bg-amber-400 dark:hover:text-stone-950"
                  onClick={onCartOpen}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[1.3rem] h-[1.3rem] rounded-full bg-amber-900 text-[0.65rem] font-medium text-amber-50 flex items-center justify-center shadow-sm dark:bg-amber-300 dark:text-stone-900"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="text-xs tracking-wide">
                Cart
              </TooltipContent>
            </Tooltip>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full px-2 pr-3 border border-stone-300/70 bg-white/70 hover:bg-stone-900 hover:text-amber-50 hover:border-stone-900/80 transition-colors duration-200 dark:bg-stone-900/80 dark:border-stone-700 dark:hover:bg-stone-800"
                >
                  <Avatar className="h-7 w-7 border border-stone-200/70 dark:border-stone-700">
                    <AvatarImage src={""} alt={profile.name} />
                    <AvatarFallback className="bg-amber-900 text-amber-50 text-xs font-medium tracking-[0.18em] uppercase">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-stone-700 dark:text-stone-200 tracking-[0.18em] uppercase">
                    {profile.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[220px] border-stone-200 bg-[#faf6ef]/95 backdrop-blur-md dark:bg-stone-900/95 dark:border-stone-700"
              >
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[0.65rem] font-medium tracking-[0.24em] uppercase text-stone-500 dark:text-stone-400">
                    Guest Profile
                  </p>
                  <p className="mt-1 text-xs text-stone-800 dark:text-stone-100">
                    {profile.city}, {profile.country}
                  </p>
                </div>
                <DropdownMenuItem className="text-xs tracking-[0.18em] uppercase text-stone-700 dark:text-stone-100">
                  <User className="mr-2 h-3.5 w-3.5" />
                  View profile (mock)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs tracking-[0.18em] uppercase text-stone-700 dark:text-stone-100">
                  Orders (mock)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    mockStore.reset();
                  }}
                  className="text-xs tracking-[0.18em] uppercase text-stone-700 dark:text-stone-100"
                >
                  Reset demo state
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile: compact search icon */}
            <div className="flex md:hidden items-center gap-2">
              <div className="relative w-32">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-8 pr-2 h-8 rounded-full border-stone-300/70 bg-white/70 text-[0.75rem] placeholder:text-stone-400 focus-visible:ring-amber-800/60 focus-visible:border-amber-800/70 dark:bg-stone-900/70 dark:border-stone-700 dark:placeholder:text-stone-500"
                />
              </div>

              {/* Mobile menu */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full border border-stone-300/70 bg-white/70 hover:bg-stone-900 hover:text-amber-50 hover:border-stone-900/80 transition-colors duration-200 dark:bg-stone-900/80 dark:border-stone-700 dark:hover:bg-stone-800"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileNavOpen}
                onClick={() => setIsMobileNavOpen((v) => !v)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile nav panel */}
        {isMobileNavOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden pb-4 border-t border-stone-200/80 dark:border-stone-800"
          >
            <ul className="pt-3 flex flex-col gap-1 text-xs tracking-[0.18em] uppercase text-stone-700 dark:text-stone-200">
              {navItems.map((item) => {
                const active = isActivePath(item.to);
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-2 ${
                          isActive || active
                            ? "text-amber-900 dark:text-amber-300"
                            : "text-stone-700 dark:text-stone-200"
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <span className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-stone-300/80 via-transparent to-transparent dark:from-stone-700" />
                    </NavLink>
                  </li>
                );
              })}
              <li>
                <a
                  href="/#artisan-stories"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center justify-between py-2"
                >
                  <span>Artisan Stories</span>
                  <span className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-stone-300/80 via-transparent to-transparent dark:from-stone-700" />
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;