import React from 'react';
import { useParams } from 'react-router-dom';
import JourneyViews, {
  ArtisanStoriesView,
  CheckoutForm,
  HomeEditorial,
  OrderConfirmationView,
  ProductDetailView,
} from '@/components/JourneyViews';

type PageShellProps = {
  className?: string;
};

export function ProductPage({ className = '' }: PageShellProps) {
  const { slug } = useParams<{ slug?: string }>();
  return <ProductDetailView className={className} />;
}

export function CartPage({ className = '' }: PageShellProps) {
  return <CheckoutForm className={className} />;
}

export function CheckoutPage({ className = '' }: PageShellProps) {
  return <CheckoutForm className={className} />;
}

export function ArtisanPage({ className = '' }: PageShellProps) {
  return <ArtisanStoriesView className={className} />;
}

export function OrderConfirmationPage({ className = '' }: PageShellProps) {
  const { orderId } = useParams<{ orderId?: string }>();
  return <OrderConfirmationView className={className} />;
}

export function JourneyPages({ className = '' }: PageShellProps) {
  return <HomeEditorial className={className} />;
}

export default JourneyPages;