import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";

// NOTE: 100% frontend-only mock implementation. There is **no backend**.
// All data and localStorage persistence are handled in src/mock.ts.
import {
  products,
  type Cart,
  type UserSession,
  getCart,
  getUser,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  computeCartTotals,
  type CartItemVariant,
} from "@/mock";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import { CatalogPage } from "@/pages/CatalogPage";
import CartPage from "@/pages/CartPage";

// ----------------------
// Internal helpers
// ----------------------

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  duration: 0.28,
  ease: [0.22, 0.61, 0.36, 1],
};

// Toast helper options type aligned with sonner/shadcn usage
export type AppToastVariant =
  | "default"
  | "destructive"
  | "success"
  | "info"
  | "error";

export interface AppToastOptions {
  description?: string;
  variant?: AppToastVariant;
}

// Strongly-typed toast passthroughs for child pages
export type ChildToastType = "default" | "success" | "error" | "info";

// A small wrapper so AnimatePresence can access location
const AppRoutes: React.FC<{
  cart: Cart;
  user: UserSession | undefined;
  searchValue: string;
  setSearchValue: (val: string) => void;
  onCartChange: (next: Cart) => void;
  onUserChange: (user: UserSession | undefined) => void;
}> = ({
  cart,
  user,
  searchValue,
  setSearchValue,
  onCartChange,
  onUserChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // ---- Toast helper (shared across pages) ----
  const toastHelper = (message: string, options?: AppToastOptions) => {
    const { description, variant } = options || {};
    const base = {
      description,
      className:
        "bg-neutral-950 text-neutral-50 border border-neutral-800/80 rounded-none font-sans tracking-tight",
      duration: 2600,
    } as const;

    if (variant === "error" || variant === "destructive") {
      toast.error(message, {
        ...base,
        className:
          "bg-neutral-950 text-neutral-50 border border-red-600/70 rounded-none font-sans tracking-tight",
      });
      return;
    }

    if (variant === "success") {
      toast.success(message, {
        ...base,
        className:
          "bg-neutral-950 text-neutral-50 border border-amber-500/70 rounded-none font-sans tracking-tight",
      });
      return;
    }

    toast(message, base);
  };

  // Map child toast types to internal variants
  const mapChildToastVariant = (type?: ChildToastType): AppToastVariant => {
    if (type === "error") return "error";
    if (type === "success") return "success";
    if (type === "info") return "info";
    return "default";
  };

  // ---- Cart operations using mock.ts (pure frontend mocks) ----

  const handleAddToCart = (
    productId: string,
    variant: CartItemVariant,
    qty: number
  ) => {
    const next = addToCart(productId, variant, qty);
    onCartChange(next);
    toastHelper("Added to cart", {
      description: "Your selection is waiting in the Jootiya cart.",
      variant: "success",
    });
  };

  const handleUpdateQty = (lineId: string, qty: number) => {
    const next = updateCartQty(lineId, qty);
    onCartChange(next);
    toastHelper("Quantity updated", { variant: "info" });
  };

  const handleRemoveLine = (lineId: string) => {
    const next = removeFromCart(lineId);
    onCartChange(next);
    toastHelper("Removed from cart", { variant: "info" });
  };

  const handleClearCart = () => {
    const next = clearCart();
    onCartChange(next);
  };

  const handleCheckout = () => {
    // This is a fully mocked client-side checkout – no backend.
    const totals = computeCartTotals(cart);
    if (cart.items.length === 0) {
      toastHelper("Your cart is empty", {
        description: "Add a pair before checking out.",
        variant: "error",
      });
      return;
    }

    // pseudo order no. purely on client (mock)
    const orderNumber = `JY-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // In a real app we'd call checkoutMock here; for this SPA teaser
    // we keep everything mocked on the client and simply clear cart.
    handleClearCart();

    toastHelper("Order confirmed", {
      description: `Your order ${orderNumber} has been beautifully recorded (mock).`,
      variant: "success",
    });

    navigate("/catalog");
  };

  // ---- User session handling (mock sign-in/out) ----

  const handleSignInMock = (name: string, email: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11);

    const avatarPalette = ["#f5f0e6", "#1e1b18", "#b68b2b", "#6b5b4a"];
    const avatarColor = avatarPalette[id.length % avatarPalette.length];

    const session: UserSession = {
      id,
      name: name || "Guest of the House",
      email: email || "guest@jootiya.studio",
      avatarColor,
      defaultCurrency: cart.currency,
      createdAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem("jootiya_user_v1", JSON.stringify(session));
    } catch {
      // fail silently: UX still works for this mock
    }

    onUserChange(session);
    toastHelper("Signed in (mock)", {
      description: `Welcome back, ${session.name}. This is a client-only session.`,
      variant: "success",
    });
  };

  const handleSignOutMock = () => {
    try {
      window.localStorage.removeItem("jootiya_user_v1");
    } catch {
      // ignore
    }
    onUserChange(undefined);
    toastHelper("Signed out", {
      description: "You are now browsing as a guest.",
      variant: "info",
    });
  };

  // Derived featured products for home page
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    []
  );

  return (
    <div className="min-h-screen bg-[#0b0b0a] text-neutral-50 flex flex-col font-sans">
      <Header
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        cartCount={cartCount}
        userSession={user}
        // Header is expected to accept a no-arg callback, so we wrap
        onSignInMock={() => handleSignInMock("", "")}
        onSignOut={handleSignOutMock}
      />

      <main className="flex-1 bg-[radial-gradient(circle_at_top,_#1b1a18,_#050505)]">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="will-change-transform"
            >
              <Routes location={location}>
                <Route
                  path="/"
                  element={<HomePage featuredProducts={featuredProducts} />}
                />
                <Route
                  path="/catalog"
                  element={
                    <CatalogPage
                      products={products}
                      searchValue={searchValue}
                      onAddToCart={handleAddToCart}
                      // CatalogPage expects a shadcn-style toast function
                      onToast={({
                        title,
                        description,
                        variant,
                      }: {
                        title: string;
                        description?: string;
                        variant?: "default" | "destructive" | "success";
                      }) => {
                        const mappedVariant =
                          variant === "destructive" ? "error" : variant;
                        toastHelper(title, {
                          description,
                          variant: mappedVariant as AppToastVariant,
                        });
                      }}
                    />
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <CartPage
                      cart={cart}
                      products={products}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemoveLine}
                      onCheckout={handleCheckout}
                      onToast={({
                        title,
                        description,
                        variant,
                      }: {
                        title: string;
                        description?: string;
                        variant?: "default" | "destructive" | "success";
                      }) => {
                        const mappedVariant =
                          variant === "destructive" ? "error" : variant;
                        toastHelper(title, {
                          description,
                          variant: mappedVariant as AppToastVariant,
                        });
                      }}
                    />
                  }
                />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <Toaster
        richColors
        closeButton
        position="top-center"
        toastOptions={{
          className:
            "border border-neutral-800/80 bg-neutral-950 text-neutral-50 rounded-none shadow-[0_18px_60px_rgba(0,0,0,0.65)]",
        }}
      />
    </div>
  );
};

// ----------------------
// Root App with initialisation from mock.ts
// ----------------------

const App: React.FC = () => {
  const [cart, setCart] = useState<Cart>(() => getCart());
  const [user, setUser] = useState<UserSession | undefined>(() => getUser());
  const [searchValue, setSearchValue] = useState<string>("");

  // Re-sync from mock.ts on first mount in case localStorage changed
  useEffect(() => {
    setCart(getCart());
    setUser(getUser());
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes
        cart={cart}
        user={user}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onCartChange={setCart}
        onUserChange={setUser}
      />
    </BrowserRouter>
  );
};

export default App;