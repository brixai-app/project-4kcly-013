import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { FilterState, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductDetailModal from '@/components/ProductDetailModal';

type ProductCardProps = {
  product?: Product | null;
  className?: string;
};

type ProductGridProps = {
  products?: Product[];
  className?: string;
  onQuickAdd?: (product: Product) => void;
};

type FiltersPanelProps = {
  filters?: FilterState;
  onChange?: (next: FilterState) => void;
  categories?: string[];
  className?: string;
};

export function ProductCard({ product = null, className = '' }: ProductCardProps) {
  const { addItem } = useCart?.() ?? { addItem: () => undefined };
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(product?.sizes?.[0] ?? 'UK 7');

  const image = product?.image ?? 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80';
  const priceLabel = useMemo(() => `₹${Number(product?.price ?? 0).toLocaleString('en-IN')}`, [product?.price]);
  const rating = product?.rating ?? 4.8;

  if (!product?.id) return null;

  const handleQuickAdd = () => {
    addItem?.({ productId: product.id, quantity: 1, size, color: product?.colors?.[0] ?? null });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <>
      <motion.article layout className={cn('group overflow-hidden rounded-md border border-[#D8CDBE] bg-[#FFFCF7] shadow-[0_10px_30px_rgba(43,43,43,0.06)]', className)}>
        <button type="button" onClick={() => setOpen(true)} className="block w-full text-left">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1EB]">
            <img src={image} alt={product.name} crossOrigin="anonymous" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute left-3 top-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2B2B2B]">
              <span className="h-px w-8 bg-[#C9A66B]" />
              <span>{product.category}</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div className="min-w-0 rounded-sm bg-[#FFFCF7]/90 px-3 py-2 backdrop-blur-sm">
                <p className="truncate text-sm font-semibold text-[#2B2B2B]">{product.name}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[#6E665D]">{priceLabel}</p>
              </div>
              <div className="flex items-center gap-1 rounded-sm bg-[#FFFCF7]/90 px-2 py-1 text-xs font-semibold text-[#2B2B2B] backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-[#C9A66B] text-[#C9A66B]" />
                <span>{rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button type="button" onClick={handleQuickAdd} className="flex-1 rounded-md bg-[#C9A66B] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-[#B38A4E]">
                  Quick Add
                </button>
                <button type="button" onClick={() => setOpen(true)} className="rounded-md border border-[#D8CDBE] bg-[#FFFCF7] px-3 py-2 text-[#2B2B2B] transition-colors hover:bg-[#F5F1EB]">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </button>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#2B2B2B]">{product.description}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[#6E665D]">{product.inStock ? 'In stock' : 'Sold out'}</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
            Details <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.article>
      <ProductDetailModal product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}

export function ProductGrid({ products = [], className = '', onQuickAdd }: ProductGridProps) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {products?.map((product) => (
        <div key={product.id} className="min-w-0">
          <ProductCard product={product} />
          {onQuickAdd ? (
            <button type="button" onClick={() => onQuickAdd(product)} className="sr-only">
              Add {product.name}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function FiltersPanel({ filters = { query: '', categories: [], priceRange: [0, 0], sortBy: 'featured' }, onChange, categories = [], className = '' }: FiltersPanelProps) {
  const next = (patch: Partial<FilterState>) => onChange?.({ ...filters, ...patch });
  return (
    <aside className={cn('flex flex-col gap-2.5 rounded-md border border-[#D8CDBE] bg-[#FFFCF7] p-4', className)}>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E665D]">Filter</p>
        <h3 className="min-w-0 truncate text-lg font-medium text-[#2B2B2B]">Refine the edit</h3>
      </div>
      <input value={filters.query ?? ''} onChange={(e) => next({ query: e.target.value })} placeholder="Search mojris, juttis..." className="w-full rounded-md border border-[#D8CDBE] bg-white px-3 py-2 text-sm text-[#2B2B2B] outline-none placeholder:text-[#6E665D]" />
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => {
          const active = filters.categories?.includes(category) ?? false;
          return (
            <button key={category} type="button" onClick={() => next({ categories: active ? filters.categories.filter((c) => c !== category) : [...filters.categories, category] })} className={cn('min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors', active ? 'border-[#C9A66B] bg-[#C9A66B] text-black' : 'border-[#D8CDBE] bg-white text-[#2B2B2B]')}>
              <span className="block truncate">{category}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-4 w-4 text-[#6E665D]" />
        <select value={filters.sortBy ?? 'featured'} onChange={(e) => next({ sortBy: e.target.value as FilterState['sortBy'] })} className="w-full rounded-md border border-[#D8CDBE] bg-white px-3 py-2 text-sm text-[#2B2B2B] outline-none">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]">
        Explore all <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </aside>
  );
}

export default ProductCard;