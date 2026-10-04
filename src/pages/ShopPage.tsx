import type { ReactNode } from "react";
import { CatalogSection } from "@/components/ProductCard";
import {
  ProductDetailSection,
  WishlistSection,
} from "@/components/ProductDetailModal";
import {
  CartSummary,
  CheckoutForm,
  OrderConfirmation,
} from "@/components/CartDrawer";

type PageShellProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
};

function PageShell({
  title = "SOLE ÉLITE",
  eyebrow = "The boutique",
  description = "",
  children = null,
}: PageShellProps = {}) {
  return (
    <main className="min-h-screen bg-[#F5F1EB] font-['Lora',sans-serif] text-[#2B2B2B]">
      <header className="border-b border-[#D8CFC3] px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
        <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#8B0000]">{eyebrow}</p>
        <h1 className="font-['Playfair_Display',sans-serif] text-5xl font-light tracking-tight sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#665E54] sm:text-base">{description}</p>
        )}
      </header>
      <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">{children}</div>
    </main>
  );
}

export function ShopPage() {
  return (
    <PageShell title="The collection" eyebrow="SOLE ÉLITE / Footwear" description="Considered silhouettes. Exceptional materials. Discover your next signature pair.">
      <CatalogSection title="Explore footwear" />
    </PageShell>
  );
}

export function ProductPage() {
  return (
    <main className="min-h-screen bg-[#F5F1EB] font-['Lora',sans-serif] text-[#2B2B2B]">
      <ProductDetailSection showRelated />
    </main>
  );
}

export function CartPage() {
  return (
    <PageShell title="Your selection" eyebrow="SOLE ÉLITE / Shopping bag" description="A simulated checkout. No payment is collected and no real order is placed.">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
        <CartSummary showItems showCheckout={false} />
        <CheckoutForm />
      </div>
    </PageShell>
  );
}

export function ProfilePage() {
  return (
    <PageShell title="Your wishlist" eyebrow="SOLE ÉLITE / Saved pieces" description="A personal edit of the pairs you love, saved on this device. No account required.">
      <WishlistSection />
    </PageShell>
  );
}

export function ConfirmationPage() {
  return (
    <PageShell title="Your order" eyebrow="SOLE ÉLITE / Mock checkout" description="This is a demonstration purchase. No payment has been taken.">
      <OrderConfirmation />
    </PageShell>
  );
}

export default ShopPage;