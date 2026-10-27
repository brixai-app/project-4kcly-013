import React, { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import ShopPage from '@/pages/ShopPage';
import SecondaryPages from '@/pages/SecondaryPages';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);
  return null;
}

function AppShell() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = React.useState(false);

  useEffect(() => {
    setCartOpen(location.pathname === '/cart');
  }, [location.pathname]);

  const handleCartOpenChange = (open: boolean) => {
    setCartOpen(open);
    if (!open && location.pathname === '/cart') window.history.replaceState({}, '', '#/');
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#2B2B2B]">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<Navigate to="/" replace />} />
          <Route path="/stories" element={<SecondaryPages />} />
          <Route path="/custom" element={<SecondaryPages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={handleCartOpenChange} />
    </div>
  );
}

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <ScrollToTop />
        <Toaster position="top-right" richColors closeButton />
        <AppShell />
      </CartProvider>
    </HashRouter>
  );
}

export default App;