import React, { useCallback, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";

import {
  Button,
  Sheet,
  SheetContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Separator,
} from "@/components/ui/shadcn";

import mockStore, { MockState } from "@/mock";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import DetailPage from "./pages/DetailPage";

// NOTE: This entire app is a 100% frontend-only mock.
// There is NO backend – all state lives in src/mock.ts with localStorage persistence.
// Cart, orders, filters and profile are fully simulated in the browser.

// -----------------------------
// Types that mirror child component props used in this file
// (kept locally so we don't rely on re-exported types from those files)
// -----------------------------

export interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export interface DetailPageProps {
  onOpenCart: () => void;
}

export interface HomePageProps {
  onOpenCart: () => void;
}

// -----------------------------
// Hook to bind React to our mock store
// -----------------------------

const useMockStore = (): MockState => {
  return useSyncExternalStore(mockStore.subscribe, mockStore.getSnapshot);
};

// -----------------------------
// Layout wrapper with animated route transitions
// -----------------------------

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.main
    className="flex-1 w-full"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.32, ease: "easeOut" }}
  >
    {children}
  </motion.main>
);

// -----------------------------
// Cart / Checkout Sheet
// -----------------------------

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const state = useMockStore();
  const detailedCart = mockStore.getCartDetailed();
  const subtotal = mockStore.getCartSubtotal();
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleQuantityChange = useCallback((lineId: string, quantity: number) => {
    mockStore.updateCartQuantity(lineId, quantity);
  }, []);

  const handleRemove = useCallback((lineId: string) => {
    mockStore.removeFromCart(lineId);
  }, []);

  const handleCheckout = useCallback(() => {
    const order = mockStore.checkout();
    if (!order) {
      toast("Your cart is still empty.");
      return;
    }
    toast.success("Order placed from Jodhpur workshop", {
      description: `A mock order of ${order.items.length} line${
        order.items.length > 1 ? "s" : ""
      } has been crafted. This is a frontend-only demo – no real payment processed.`,
    });
    onOpenChange(false);
  }, [onOpenChange]);

  const hasItems = state.cart.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-xl border-l border-neutral-200/70 bg-[#f7f2ec] text-neutral-900 dark:bg-neutral-950 dark:border-neutral-800"
      >
        <div className="flex items-center justify-between pt-4 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-semibold tracking-wide font-serif">
              Jodhpur Cart
            </h2>
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Mock checkout
          </span>
        </div>
        <Separator className="mb-4 bg-neutral-200/80 dark:bg-neutral-800" />

        {!hasItems ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-serif tracking-wide">
              Your mojris are still on the workshop shelf.
            </p>
            <p className="text-xs text-neutral-500">
              Browse the catalog to invite a pair into your story.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-neutral-200/70 dark:border-neutral-800">
                    <TableHead className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-normal">
                      Mojri
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-normal text-center">
                      Size
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-normal text-center">
                      Qty
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-normal text-right">
                      Total
                    </TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedCart.map((line) => (
                    <TableRow
                      key={line.lineId}
                      className="border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors"
                    >
                      <TableCell className="align-top py-3">
                        <div className="flex items-start gap-3">
                          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-neutral-200/80 dark:bg-neutral-800">
                            <img
                              src={line.product.heroImage}
                              alt={line.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs font-medium font-serif tracking-wide text-neutral-900 dark:text-neutral-100">
                              {line.product.name}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              ₹ {line.product.priceINR.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-center text-xs text-neutral-700 dark:text-neutral-300">
                        {line.size}
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(line.lineId, line.quantity - 1)
                            }
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300/80 text-neutral-700 hover:bg-neutral-900 hover:text-neutral-50 hover:border-neutral-900 transition-colors text-[11px]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs px-1 min-w-[1.25rem] text-center">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(line.lineId, line.quantity + 1)
                            }
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-neutral-300/80 text-neutral-700 hover:bg-neutral-900 hover:text-neutral-50 hover:border-neutral-900 transition-colors text-[11px]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle text-right text-xs font-medium text-neutral-900 dark:text-neutral-50">
                        ₹ {line.lineTotalINR.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="align-middle text-right">
                        <button
                          type="button"
                          onClick={() => handleRemove(line.lineId)}
                          className="inline-flex items-center justify-center rounded-full p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4 bg-neutral-200/80 dark:bg-neutral-800" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                <span>Subtotal</span>
                <span className="font-medium">
                  ₹ {subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
                <span>Mock GST (12%)</span>
                <span>₹ {taxes.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-dotted border-neutral-300/70 dark:border-neutral-700 mt-1">
                <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-600">
                  Total
                </span>
                <span className="font-semibold text-base text-neutral-900 dark:text-neutral-50">
                  ₹ {total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                className="w-full h-11 rounded-none bg-neutral-900 hover:bg-neutral-800 text-neutral-50 tracking-[0.16em] text-[11px] font-medium uppercase font-serif"
                onClick={handleCheckout}
              >
                Proceed to mock checkout
              </Button>
              <p className="text-[10px] leading-relaxed text-neutral-500">
                This is a fully mocked, frontend-only experience. Orders are stored
                only in your browser and no payments are processed.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// -----------------------------
// Animated Routes wrapper
// -----------------------------

export interface AnimatedRoutesProps {
  onOpenCart: () => void;
}

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ onOpenCart }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={(
            <PageTransition>
              {/* Cast to satisfy React Router's lack of awareness of our component props */}
              {React.createElement(HomePage as React.ComponentType<HomePageProps>, {
                onOpenCart,
              })}
            </PageTransition>
          )}
        />
        <Route
          path="/catalog"
          element={(
            <PageTransition>
              <CatalogPage />
            </PageTransition>
          )}
        />
        <Route
          path="/product/:id"
          element={(
            <PageTransition>
              {React.createElement(
                DetailPage as React.ComponentType<DetailPageProps>,
                { onOpenCart }
              )}
            </PageTransition>
          )}
        />
      </Routes>
    </AnimatePresence>
  );
};

// -----------------------------
// App Shell
// -----------------------------

const AppShell: React.FC = () => {
  const state = useMockStore();
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = mockStore.getCartCount();

  const handleOpenCart = useCallback(() => {
    setCartOpen(true);
  }, []);

  const handleSearchChange = useCallback<HeaderProps["onSearchChange"]>(
    (value: string) => {
      mockStore.setSearchTerm(value);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ede5] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 font-sans">
      {/* Global font & editorial feel: headings use font-serif (Playfair via Tailwind setup) */}
      {React.createElement(Header as React.ComponentType<HeaderProps>, {
        cartCount,
        onCartClick: handleOpenCart,
        searchValue: state.search.term,
        onSearchChange: handleSearchChange,
      })}

      <AnimatedRoutes onOpenCart={handleOpenCart} />

      <Footer />

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: 0,
            border: "1px solid rgba(15,23,42,0.14)",
            background: "#f7f2ec",
            color: "#1f2933",
          },
        }}
      />
    </div>
  );
};

// -----------------------------
// Root App with Router
// -----------------------------

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;