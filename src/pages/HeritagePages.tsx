import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { ArtisanList, ArtisanStoryDrawer, CartView, ProductDetailView } from "@/components/StorefrontSections";
import { artisanStories, products } from "@/data/mockData";
import type { ArtisanStory, Product } from "@/types";

type PageShellProps = {
  className?: string;
};

function resolveProduct(slug?: string): Product | null {
  return products?.find((product) => product?.slug === slug) ?? products?.[0] ?? null;
}

function resolveStory(id?: string): ArtisanStory | null {
  return artisanStories?.find((story) => story?.id === id) ?? artisanStories?.[0] ?? null;
}

export function ProductPage({ className = "" }: PageShellProps) {
  const params = useParams();
  const product = resolveProduct(params?.slug);
  return (
    <main className={className}>
      <ProductDetailView product={product ?? undefined} />
    </main>
  );
}

export function CartPage({ className = "" }: PageShellProps) {
  return (
    <main className={className}>
      <CartView />
    </main>
  );
}

export function ArtisanStoriesPage({ className = "" }: PageShellProps) {
  const location = useLocation();
  const params = useParams();
  const story = resolveStory(params?.storyId ?? location?.state?.storyId);
  return (
    <main className={className}>
      <ArtisanList />
      <ArtisanStoryDrawer open={Boolean(story)} story={story ?? undefined} />
    </main>
  );
}

export default ProductPage;