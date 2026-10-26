import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '@/data/mockData';
import ProductDetails from '@/components/ProductDetails';
import { ProductGrid } from '@/components/StorefrontSections';

export function ProductPage() {
  const { id } = useParams<{ id?: string }>();
  const product = products?.find((item) => item.id === id) ?? null;
  const relatedProducts = products?.filter((item) => item.id !== id && item.category === product?.category).slice(0, 4) ?? [];

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F5F0E6] px-4 py-20 text-[#2B2B2B]">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 border border-[#C9A66B] bg-[#FFF9F0] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Product not found</p>
          <h1 className="font-['Playfair_Display'] text-4xl font-light tracking-tight md:text-6xl">The selected mojri is unavailable.</h1>
          <p className="max-w-2xl font-['Lora'] text-base leading-7 text-[#6F655B]">
            The piece may have been removed from the collection or the route is incorrect. Return to the curated catalog to continue exploring Jootiya&apos;s heritage edit.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center border border-[#7B2D26] bg-[#7B2D26] px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#61211C]"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F5F0E6] text-[#2B2B2B]">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6F655B]">
          <Link to="/" className="transition-colors hover:text-[#7B2D26]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:text-[#7B2D26]">Shop</Link>
          <span>/</span>
          <span className="truncate text-[#2B2B2B]">{product.name}</span>
        </div>
        <ProductDetails product={product} />
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#C9A66B] bg-[#FFF9F0]">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F655B]">Related pieces</p>
                <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light tracking-tight md:text-4xl">Continue the collection</h2>
              </div>
              <Link
                to="/shop"
                className="hidden border border-[#C9A66B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#2B2B2B] transition-colors hover:border-[#7B2D26] hover:text-[#7B2D26] md:inline-flex"
              >
                View all
              </Link>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductPage;