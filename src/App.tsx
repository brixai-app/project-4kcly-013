import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Home } from "@/pages/Home";
import { ShopPage } from "@/pages/ShopPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";

export function App() {
  const [cartOpen, setCartOpen] = React.useState(false);

  return (
    <CartProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#F5F1E9] text-[#2E2E2E]">
          <Header className="sticky top-0 z-40" />
          <main className="min-h-[calc(100vh-8rem)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
          <Toaster position="top-right" richColors closeButton />
        </div>
      </HashRouter>
    </CartProvider>
  );
}

export default App;