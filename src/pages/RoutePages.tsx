import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { artisans, products } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import {
  CartRoutePanel,
  CheckoutFormSection,
  ConfirmationPanel,
  FilterDrawer,
  ProductGalleryPanel,
  ProductGridSection,
  ArtisanMasonry,
} from "@/components/StoreSections";
import type { Order } from "@/types";

type RoutePagesProps = {
  className?: string;
};

type RouteShellProps = RoutePagesProps & {
  onNavigate?: (path: string) => void;
};

function ProductPage({ className = "", onNavigate }: RouteShellProps) {
  const navigate = useNavigate();
  const params = useParams();
  const slug = params?.slug ?? "";
  const product = products.find((item) => item?.slug === slug) ?? products[0] ?? null;
  const go = onNavigate ?? navigate;

  return (
    <div className={className}>
      <ProductGalleryPanel
        product={product}
        onOpenProduct={(nextSlug) => {
          if (nextSlug) go(`/shop/${nextSlug}`);
        }}
      />
      <ProductGridSection className="mt-10" />
    </div>
  );
}

function CartPage({ className = "", onNavigate }: RouteShellProps) {
  const navigate = useNavigate();
  const go = onNavigate ?? navigate;
  return (
    <div className={className}>
      <CartRoutePanel
        onCheckout={() => {
          go("/checkout");
        }}
      />
    </div>
  );
}

function CheckoutPage({ className = "", onNavigate }: RouteShellProps) {
  const navigate = useNavigate();
  const go = onNavigate ?? navigate;
  return (
    <div className={className}>
      <CheckoutFormSection
        onSubmit={() => {
          go("/confirmation");
        }}
      />
    </div>
  );
}

function ArtisansPage({ className = "" }: RoutePagesProps) {
  return (
    <div className={className}>
      <ArtisanMasonry />
      <div className="mt-10">
        <FilterDrawer open={false} onOpenChange={() => {}} filters={undefined as never} onChange={() => {}} />
      </div>
    </div>
  );
}

function OrderConfirmationPage({ className = "" }: RoutePagesProps) {
  const { order } = useCart() as { order?: Order | null };
  return (
    <div className={className}>
      <ConfirmationPanel order={order ?? null} />
    </div>
  );
}

function RoutePages() {
  return null;
}

export {
  ProductPage,
  CartPage,
  CheckoutPage,
  ArtisansPage,
  OrderConfirmationPage,
  RoutePages,
};
export default RoutePages;