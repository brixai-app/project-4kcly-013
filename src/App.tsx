import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import { AppLayout } from '@/components/AppLayout';
import { Home } from '@/pages/Home';
import { ShopPage } from '@/pages/ShopPage';
import { ProductPage } from '@/pages/ProductPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CustomOrdersPage } from '@/pages/CustomOrdersPage';
import { ArtisanStoriesPage } from '@/pages/ArtisanStoriesPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';

export function App() {
  return (
    <HashRouter>
      <CartProvider>
        <AppLayout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/custom-orders" element={<CustomOrdersPage />} />
          <Route path="/artisans" element={<ArtisanStoriesPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/cart" element={<Navigate to="/shop" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          richColors={false}
          closeButton
          toastOptions={{
            style: {
              background: '#FFF9F0',
              color: '#2B2B2B',
              border: '1px solid #C9A66B',
              borderRadius: '4px',
            },
          }}
        />
      </CartProvider>
    </HashRouter>
  );
}

export default App;