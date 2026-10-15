import React from "react";
import { Toaster } from "sonner";
import Header, { Footer } from "./components/Header";
import MainFeature from "./components/MainFeature";
import {
  FilterDrawer,
  CartDrawer,
  CheckoutForm,
  OrderConfirmation,
} from "./components/SecondaryFeature";
import {
  ROUTES,
  parseRoute,
  loadCartFromStorage,
  saveCartToStorage,
  loadLastOrder,
} from "./mock";
import type { CartItem } from "./components/SecondaryFeature";
import type { CartItemInput } from "./components/MainFeature";

// NOTE: Cart + orders are fully mocked on client via localStorage.

const App: React.FC = () => {
  const [route, setRoute] = React.useState(() =>
    parseRoute(window.location.pathname)
  );
  const [cart, setCart] = React.useState<CartItem[]>(() => loadCartFromStorage());
  const [filters, setFilters] = React.useState<{
    category: string | null;
    size: number | null;
    color: string | null;
  }>({ category: null, size: null, color: null });
  const [cartOpen, setCartOpen] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [lastOrder, setLastOrder] = React.useState<any | null>(() =>
    loadLastOrder()
  );

  React.useEffect(() => {
    const onPop = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  React.useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const navigate = (path: string) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
  };

  const addToCart = (input: CartItemInput) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === input.productId &&
          i.size === input.size &&
          i.color === input.color
      );
      if (idx === -1) {
        return [...prev, { ...input }];
      }
      const existing = prev[idx];
      const mergedQty = Math.min(5, existing.quantity + input.quantity);
      const next = [...prev];
      next[idx] = { ...existing, quantity: mergedQty };
      return next;
    });
  };

  const updateQuantity = (item: CartItem, qty: number) => {
    setCart((prev) =>
      prev.map((line) =>
        line.productId === item.productId &&
        line.size === item.size &&
        line.color === item.color
          ? { ...line, quantity: qty }
          : line
      )
    );
  };

  const removeItem = (item: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (line) =>
          !(
            line.productId === item.productId &&
            line.size === item.size &&
            line.color === item.color
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  const handleOrderCreated = () => {
    const order = loadLastOrder();
    setLastOrder(order);
    navigate(ROUTES.CONFIRMATION);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#2B2B2B]">
      <Toaster richColors position="top-center" duration={3000} />
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        currentRoute={window.location.pathname}
        onNavigate={navigate}
        onOpenCart={() => setCartOpen(true)}
        onOpenFilters={() => setFilterOpen(true)}
        onCategoryFilter={(category) => setFilters((f) => ({ ...f, category }))}
      />

      {route.name === "checkout" ? (
        <CheckoutForm
          cart={cart}
          onClearCart={clearCart}
          onOrderCreated={handleOrderCreated}
        />
      ) : route.name === "confirmation" ? (
        <OrderConfirmation lastOrder={lastOrder} />
      ) : (
        <MainFeature
          route={route}
          onNavigate={navigate}
          onAddToCart={addToCart}
          filters={filters}
        />
      )}

      <Footer />

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApply={(next) => setFilters(next)}
      />
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onProceedToCheckout={() => {
          setCartOpen(false);
          navigate(ROUTES.CHECKOUT);
        }}
      />
    </div>
  );
};

export default App;