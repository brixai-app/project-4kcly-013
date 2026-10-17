import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";

import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/shadcn";

// NOTE: This app is 100% frontend-only; all data, cart, and user state are mocked in src/mock.ts
// with localStorage persistence via safeStorage-style helpers.
import {
  getCart,
  getUser,
  getSearchSuggestions,
  computeCartTotals,
  subscribe,
  type Product,
  type Artisan,
} from "@/mock";

interface SuggestionItem {
  type: "product" | "artisan";
  item: Product | Artisan;
}

const burgundy = "#5b1f29"; // deep accent used in inline styles when needed

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState<number>(() => {
    const totals = computeCartTotals(getCart());
    return totals.itemCount;
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const user = useMemo(() => getUser(), []);

  // Subscribe to cart changes from the mocked state layer
  useEffect(() => {
    const listener = () => {
      const totals = computeCartTotals(getCart());
      setCartCount(totals.itemCount);
    };

    subscribe(listener);
    return () => {
      // clean up subscription
      // in this mock implementation we simply no-op by removing the listener if supported
      try {
        // lazy import to avoid circular dependency concerns; unsubscribe is exported from mock
        const { unsubscribe } = require("@/mock") as typeof import("@/mock");
        if (typeof unsubscribe === "function") {
          unsubscribe(listener);
        }
      } catch {
        // ignore in non-browser/test environments
      }
    };
  }, []);

  const suggestions: SuggestionItem[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const result = getSearchSuggestions(searchQuery.trim());
    const items: SuggestionItem[] = [];
    result.products.forEach((p: Product) => items.push({ type: "product", item: p }));
    result.artisans.forEach((a: Artisan) => items.push({ type: "artisan", item: a }));
    return items.slice(0, 8);
  }, [searchQuery]);

  const handleNavigateSuggestion = (suggestion: SuggestionItem) => {
    if (suggestion.type === "product") {
      navigate(`/product/${(suggestion.item as Product).id}`);
    } else {
      // For artisans, route to home with hash for stories section
      if (location.pathname === "/") {
        const element = document.getElementById("artisan-stories");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate("/#artisan-stories");
      }
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleSearchKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setFocusedIndex((prev) => {
        const next = prev + 1;
        return next >= suggestions.length ? 0 : next;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setFocusedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? suggestions.length - 1 : next;
      });
    } else if (event.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        event.preventDefault();
        handleNavigateSuggestion(suggestions[focusedIndex]);
      } else if (suggestions.length === 1) {
        event.preventDefault();
        handleNavigateSuggestion(suggestions[0]);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full border-b border-neutral-200/70 bg-neutral-50/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="w-full px-6 lg:px-12 py-4 flex items-center gap-6">
        {/* Brand */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          onClick={() => navigate("/")}
          className="flex items-baseline gap-2 focus-visible:outline-none"
        >
          <span
            className="text-2xl md:text-3xl tracking-[0.22em] uppercase font-serif text-neutral-900 dark:text-neutral-50 select-none"
            style={{ letterSpacing: "0.24em" }}
          >
            Jootiya
          </span>
          <span className="hidden md:inline text-xs tracking-[0.28em] uppercase text-neutral-500 dark:text-neutral-400">
            Jodhpur Mojris
          </span>
        </motion.button>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm flex-1">
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`relative pb-1 transition-colors duration-150 ease-out text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50 ${
              isActivePath("/") && "text-neutral-900 dark:text-neutral-50"
            }`}
          >
            <span className="uppercase tracking-[0.18em]">Home</span>
            {isActivePath("/") && (
              <span
                className="absolute left-0 -bottom-0.5 h-[2px] w-5 rounded-full"
                style={{ backgroundColor: burgundy }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/catalog")}
            className={`relative pb-1 transition-colors duration-150 ease-out text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50 ${
              isActivePath("/catalog") && "text-neutral-900 dark:text-neutral-50"
            }`}
          >
            <span className="uppercase tracking-[0.18em]">Catalog</span>
            {isActivePath("/catalog") && (
              <span
                className="absolute left-0 -bottom-0.5 h-[2px] w-7 rounded-full"
                style={{ backgroundColor: burgundy }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              if (location.pathname === "/") {
                const element = document.getElementById("artisan-stories");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              } else {
                navigate("/#artisan-stories");
              }
            }}
            className="relative pb-1 transition-colors duration-150 ease-out text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            <span className="uppercase tracking-[0.18em]">Artisan Stories</span>
          </button>
        </nav>

        {/* Search */}
        <div className="flex-1 flex items-center justify-end">
          <DropdownMenu open={isOpen && suggestions.length > 0} onOpenChange={setIsOpen}>
            <div className="relative w-full max-w-md">
              <DropdownMenuTrigger asChild>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
                  <Input
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-neutral-100/90 border-neutral-200 text-sm placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:border-neutral-400 dark:bg-neutral-900/80 dark:border-neutral-700 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-500"
                    placeholder="Search Mojris or artisans"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(true);
                      setFocusedIndex(-1);
                    }}
                    onFocus={() => {
                      if (suggestions.length) setIsOpen(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="mt-1 w-full max-w-md rounded-2xl border border-neutral-200/80 bg-neutral-50/95 backdrop-blur-sm shadow-lg dark:border-neutral-800 dark:bg-neutral-900/95"
              >
                {suggestions.map((suggestion, index) => {
                  const isProduct = suggestion.type === "product";
                  const active = index === focusedIndex;
                  const base = suggestion.item as Product & Artisan;

                  return (
                    <DropdownMenuItem
                      key={`${suggestion.type}-${base.id}-${index}`}
                      className={`flex flex-col items-start gap-0.5 py-2.5 px-3.5 cursor-pointer rounded-xl transition-colors duration-150 ${
                        active
                          ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
                          : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                      }`}
                      onClick={() => handleNavigateSuggestion(suggestion)}
                      onMouseEnter={() => setFocusedIndex(index)}
                    >
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-sm font-medium tracking-wide">
                          {isProduct
                            ? (suggestion.item as Product).name
                            : (suggestion.item as Artisan).name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase tracking-[0.16em] border-0 px-2 py-0.5 rounded-full ${
                            isProduct
                              ? "bg-amber-100/70 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100"
                              : "bg-rose-100/70 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100"
                          }`}
                        >
                          {isProduct ? "Mojri" : "Artisan"}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {isProduct
                          ? (suggestion.item as Product).craftTechnique
                          : (suggestion.item as Artisan).atelierName}
                      </p>
                    </DropdownMenuItem>
                  );
                })}

                {!suggestions.length && searchQuery.trim().length > 1 && (
                  <div className="px-3.5 py-3 text-xs text-neutral-500 dark:text-neutral-400">
                    No Mojris or artisans found for “{searchQuery.trim()}”.
                  </div>
                )}
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </div>

        {/* Actions: Cart + User */}
        <div className="flex items-center gap-3 md:gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                onClick={() => navigate("/checkout")}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-sm transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge
                    className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.4rem] rounded-full border-none bg-[#7c2a32] px-1 text-[10px] font-medium text-amber-50 shadow-md"
                  >
                    {cartCount}
                  </Badge>
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="text-xs tracking-wide uppercase">
              View cart & checkout
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Avatar className="h-9 w-9 border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <AvatarImage src={user?.avatarUrl ?? ""} alt={user?.name ?? "Guest"} />
                  <AvatarFallback className="text-[10px] font-semibold tracking-wide bg-neutral-200/80 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-50">
                    {user?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || "RJ"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent className="flex flex-col gap-0.5 text-xs max-w-xs">
              <span className="font-medium tracking-wide text-neutral-900 dark:text-neutral-50">
                {user?.name || "Guest of Jodhpur"}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                Profile is fully mocked & stored only in your browser.
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Header;