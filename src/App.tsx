import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ShopPage from './pages/ShopPage';
import SecondaryPages, {
  ProductPage,
  CartPage,
  CheckoutPage,
  ArtisansPage,
  ArtisanPage,
  CustomOrderPage,
  LoginPage,
  NotFoundPage,
} from './pages/SecondaryPages';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="min-h-[calc(100vh-0px)]"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/artisans/:id" element={<ArtisanPage />} />
          <Route path="/custom-order" element={<CustomOrderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <HashRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#F9F5F0] text-[#2E2B28] antialiased">
          <ScrollToTop />
          <Header />
          <main className="relative">
            <AppRoutes />
          </main>
          <Footer />
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
          <Toaster
            position="top-right"
            richColors={false}
            closeButton
            toastOptions={{
              style: {
                background: '#FFFDF9',
                color: '#2E2B28',
                border: '1px solid #CDBB9B',
                borderRadius: '6px',
              },
            }}
          />
        </div>
      </CartProvider>
    </HashRouter>
  );
}

export default App;
// [auto-removed: duplicate export of App]
// export { App };