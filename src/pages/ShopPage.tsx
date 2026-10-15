import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, Sliders, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Product,
  ProductCategory,
  ProductColorToken,
  ProductFilterState,
  ProductSortOption,
  ProductTag,
  ActiveSortState,
} from '@/types';
import {
  products,
  availableColors,
  availableTags,
  categories,
  sortOptions,
} from '@/data/mockData';
import AppLayout from '@/components/AppLayout';
import ProductGridMasonry from '@/components/ProductGridMasonry';
import FilterDrawer from '@/components/FilterDrawer';
import SelectField from '@/components/SelectField';

export interface ShopPageProps {
  className?: string;
}

const defaultFilterState: ProductFilterState = {
  query: '',
  categories: [],
  tags: [],
  colors: [],
  priceMin: undefined,
  priceMax: undefined,
  onlyInStock: false,
  onlyFeatured: false,
};

const defaultSortState: ActiveSortState = {
  optionId: 'featured',
  field: 'featured',
  direction: 'desc',
};

function parseNumberParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function getInitialStateFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const query = params.get('q') ?? '';
  const categoryParam = params.get('categories') ?? '';
  const tagParam = params.get('tags') ?? '';
  const colorParam = params.get('colors') ?? '';
  const onlyInStock = params.get('inStock') === '1';
  const onlyFeatured = params.get('featured') === '1';
  const priceMin = parseNumberParam(params.get('min'));
  const priceMax = parseNumberParam(params.get('max'));
  const sortId = (params.get('sort') as ActiveSortState['optionId']) ?? 'featured';

  const categoriesVal = categoryParam
    .split(',')
    .map(v => v.trim())
    .filter(Boolean) as ProductCategory[];

  const tagsVal = tagParam
    .split(',')
    .map(v => v.trim())
    .filter(Boolean) as ProductTag[];

  const colorsVal = colorParam
    .split(',')
    .map(v => v.trim())
    .filter(Boolean) as ProductColorToken[];

  const sortOption = sortOptions.find(o => o.id === sortId) ?? sortOptions[0];

  const filterState: ProductFilterState = {
    query,
    categories: categoriesVal,
    tags: tagsVal,
    colors: colorsVal,
    priceMin,
    priceMax,
    onlyInStock,
    onlyFeatured,
  };

  const sortState: ActiveSortState = {
    optionId: sortOption.id,
    field: sortOption.field,
    direction: sortOption.direction,
  };

  return { filterState, sortState };
}

function buildSearchFromState(filter: ProductFilterState, sort: ActiveSortState) {
  const params = new URLSearchParams();
  if (filter.query) params.set('q', filter.query);
  if (filter.categories.length) params.set('categories', filter.categories.join(','));
  if (filter.tags.length) params.set('tags', filter.tags.join(','));
  if (filter.colors.length) params.set('colors', filter.colors.join(','));
  if (typeof filter.priceMin === 'number') params.set('min', String(filter.priceMin));
  if (typeof filter.priceMax === 'number') params.set('max', String(filter.priceMax));
  if (filter.onlyInStock) params.set('inStock', '1');
  if (filter.onlyFeatured) params.set('featured', '1');
  if (sort.optionId !== 'featured') params.set('sort', sort.optionId);
  const s = params.toString();
  return s ? `?${s}` : '';
}

function applyFilters(list: Product[], filter: ProductFilterState): Product[] {
  return list.filter(product => {
    if (filter.query) {
      const q = filter.query.toLowerCase();
      const haystack = `${product.name} ${product.subtitle ?? ''} ${product.description} ${product.collection ?? ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filter.categories.length && !filter.categories.includes(product.category)) {
      return false;
    }
    if (filter.tags.length && !product.tags.some(tag => filter.tags.includes(tag))) {
      return false;
    }
    if (filter.colors.length && !product.colors.some(c => filter.colors.includes(c))) {
      return false;
    }
    if (typeof filter.priceMin === 'number' && product.price < filter.priceMin) {
      return false;
    }
    if (typeof filter.priceMax === 'number' && product.price > filter.priceMax) {
      return false;
    }
    if (filter.onlyFeatured && !product.isFeatured) {
      return false;
    }
    if (filter.onlyInStock) {
      const hasStock = product.sizes.some(s => (s.stock ?? 0) > 0);
      if (!hasStock) return false;
    }
    return true;
  });
}

function applySort(list: Product[], sort: ActiveSortState): Product[] {
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort.field) {
      case 'price':
        return sort.direction === 'asc' ? a.price - b.price : b.price - a.price;
      case 'name': {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        if (an === bn) return 0;
        const cmp = an < bn ? -1 : 1;
        return sort.direction === 'asc' ? cmp : -cmp;
      }
      case 'createdAt': {
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return sort.direction === 'asc' ? ad - bd : bd - ad;
      }
      case 'popularity': {
        const ap = a.popularityScore ?? 0;
        const bp = b.popularityScore ?? 0;
        return sort.direction === 'asc' ? ap - bp : bp - ap;
      }
      case 'featured':
      default: {
        const af = a.isFeatured ? 1 : 0;
        const bf = b.isFeatured ? 1 : 0;
        if (af !== bf) return bf - af;
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return bd - ad;
      }
    }
  });
  return sorted;
}

export function ShopPage({ className = '' }: ShopPageProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const initial = useMemo(
    () => getInitialStateFromSearch(location.search),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filterState, setFilterState] = useState<ProductFilterState>(
    initial.filterState ?? defaultFilterState
  );
  const [sortState, setSortState] = useState<ActiveSortState>(
    initial.sortState ?? defaultSortState
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isHydratedFromUrl, setIsHydratedFromUrl] = useState(false);

  useEffect(() => {
    if (isHydratedFromUrl) return;
    const parsed = getInitialStateFromSearch(location.search);
    setFilterState(parsed.filterState);
    setSortState(parsed.sortState);
    setIsHydratedFromUrl(true);
  }, [location.search, isHydratedFromUrl]);

  useEffect(() => {
    if (!isHydratedFromUrl) return;
    const search = buildSearchFromState(filterState, sortState);
    const next = `${location.pathname}${search}`;
    if (next !== `${location.pathname}${location.search}`) {
      navigate(next, { replace: true });
    }
  }, [filterState, sortState, isHydratedFromUrl, location.pathname, location.search, navigate]);

  const filteredProducts = useMemo(() => {
    const filtered = applyFilters(products, filterState);
    return applySort(filtered, sortState);
  }, [filterState, sortState]);

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; type: 'query' | 'category' | 'tag' | 'color' | 'price' | 'flag' }[] =
      [];
    if (filterState.query) {
      chips.push({ id: 'query', label: `Search: “${filterState.query}”`, type: 'query' });
    }
    filterState.categories.forEach(cat => {
      const meta = categories.find(c => c.id === cat);
      chips.push({
        id: `cat-${cat}`,
        label: meta?.label ?? cat,
        type: 'category',
      });
    });
    filterState.tags.forEach(tag => {
      const meta = availableTags.find(t => t.id === tag);
      chips.push({
        id: `tag-${tag}`,
        label: meta?.label ?? tag,
        type: 'tag',
      });
    });
    filterState.colors.forEach(color => {
      const meta = availableColors.find(c => c.id === color);
      chips.push({
        id: `color-${color}`,
        label: meta?.label ?? color,
        type: 'color',
      });
    });
    if (typeof filterState.priceMin === 'number' || typeof filterState.priceMax === 'number') {
      const parts: string[] = [];
      if (typeof filterState.priceMin === 'number') parts.push(`₹${filterState.priceMin}`);
      if (typeof filterState.priceMax === 'number') parts.push(`₹${filterState.priceMax}`);
      chips.push({
        id: 'price',
        label: `Price: ${parts.join('–')}`,
        type: 'price',
      });
    }
    if (filterState.onlyInStock) {
      chips.push({ id: 'in-stock', label: 'In stock only', type: 'flag' });
    }
    if (filterState.onlyFeatured) {
      chips.push({ id: 'featured', label: 'Featured edit', type: 'flag' });
    }
    return chips;
  }, [filterState]);

  const currentSortOption: ProductSortOption =
    sortOptions.find(o => o.id === sortState.optionId) ?? sortOptions[0];

  const handleSortChange = (value: string) => {
    const opt = sortOptions.find(o => o.id === value) ?? sortOptions[0];
    setSortState({
      optionId: opt.id,
      field: opt.field,
      direction: opt.direction,
    });
  };

  const handleFilterDrawerChange = (value: ProductFilterState) => {
    setFilterState(value);
  };

  const handleChipRemove = (chipId: string) => {
    if (chipId === 'query') {
      setFilterState(prev => ({ ...prev, query: '' }));
      return;
    }
    if (chipId === 'price') {
      setFilterState(prev => ({ ...prev, priceMin: undefined, priceMax: undefined }));
      return;
    }
    if (chipId === 'in-stock') {
      setFilterState(prev => ({ ...prev, onlyInStock: false }));
      return;
    }
    if (chipId === 'featured') {
      setFilterState(prev => ({ ...prev, onlyFeatured: false }));
      return;
    }
    if (chipId.startsWith('cat-')) {
      const slug = chipId.replace('cat-', '') as ProductCategory;
      setFilterState(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== slug),
      }));
      return;
    }
    if (chipId.startsWith('tag-')) {
      const slug = chipId.replace('tag-', '') as ProductTag;
      setFilterState(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== slug),
      }));
      return;
    }
    if (chipId.startsWith('color-')) {
      const slug = chipId.replace('color-', '') as ProductColorToken;
      setFilterState(prev => ({
        ...prev,
        colors: prev.colors.filter(c => c !== slug),
      }));
    }
  };

  const handleClearAll = () => {
    setFilterState(defaultFilterState);
  };

  const handleInlineQueryChange = (value: string) => {
    setFilterState(prev => ({ ...prev, query: value }));
  };

  return (
    <AppLayout>
      <main
        className={cn(
          'min-h-screen bg-[#F9F6F2] text-[#2E2B28] pt-24 pb-20',
          className
        )}
      >
        <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-12 md:col-span-7 space-y-4">
              <p className="text-xs tracking-[0.35em] uppercase text-[#6F675E]">
                JOOTIYA EDIT
              </p>
              <h1 className="font-[Playfair Display] text-4xl sm:text-5xl lg:text-6xl tracking-tight">
                The Boutique Catalogue
              </h1>
              <p className="text-sm sm:text-base text-[#6F675E] max-w-xl">
                An evolving curation of sneakers, loafers, boots, and evening heels.
                Filter by mood, material, or silhouette to find your exact stride.
              </p>
              <div className="hidden md:flex items-center gap-3 text-xs text-[#6F675E]">
                <span className="h-px w-10 bg-[#D9D1C7]" />
                <span>{filteredProducts.length} pieces refined</span>
                <span className="text-[#C0B6AA]">/</span>
                <span>{products.length} total in boutique</span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6F675E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={filterState.query}
                    onChange={e => handleInlineQueryChange(e.target.value)}
                    placeholder="Search by style, occasion, or collection"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#D9D1C7] bg-[#FBF8F4] rounded-xl outline-none focus:border-[#8B0000] placeholder:text-[#B0A79D]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-[#D9D1C7] bg-white rounded-xl text-xs font-medium tracking-[0.16em] uppercase"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#6F675E] md:hidden">
                  <span>{filteredProducts.length} refined</span>
                  <span className="text-[#C0B6AA]">/</span>
                  <span>{products.length} total</span>
                </div>
                <div className="ml-auto w-40">
                  <SelectField
                    label=""
                    value={currentSortOption.id}
                    options={sortOptions.map(o => ({
                      label: o.label,
                      value: o.id,
                    }))}
                    placeholder="Sort by"
                    onChange={handleSortChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-y border-[#D9D1C7] py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6F675E]">
                <Sliders className="w-3.5 h-3.5" />
                <span className="uppercase tracking-[0.2em]">
                  Active refinement
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={!activeChips.length}
                className={cn(
                  'inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase',
                  activeChips.length
                    ? 'text-[#8B0000] hover:text-[#6F0000]'
                    : 'text-[#C0B6AA] cursor-default'
                )}
              >
                <span>Reset</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeChips.length === 0 ? (
                <span className="text-xs text-[#B0A79D]">
                  No filters selected. Start with silhouettes, leather tones, or occasion.
                </span>
              ) : (
                activeChips.map(chip => (
                  <motion.button
                    key={chip.id}
                    type="button"
                    onClick={() => handleChipRemove(chip.id)}
                    layout
                    whileHover={{ y: -1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D9D1C7] bg-white text-xs text-[#2E2B28]"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3 h-3 text-[#6F675E]" />
                  </motion.button>
                ))
              )}
            </div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <aside className="hidden lg:block lg:col-span-3 pt-2">
              <div className="sticky top-28 space-y-6">
                <div className="space-y-2">
                  <p className="text-[11px] tracking-[0.22em] uppercase text-[#6F675E]">
                    Curate
                  </p>
                  <p className="text-xs text-[#6F675E]">
                    Use the drawer or chips above to sculpt your ideal line-up. Jootiya
                    remembers your selections per session.
                  </p>
                </div>
                <div className="space-y-4 text-xs text-[#6F675E]">
                  <div>
                    <p className="font-medium text-[#2E2B28] mb-1">Suggested filters</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['sneakers', 'loafers', 'heels', 'boots'].map(cat => {
                        const isActive = filterState.categories.includes(
                          cat as ProductCategory
                        );
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() =>
                              setFilterState(prev => ({
                                ...prev,
                                categories: isActive
                                  ? prev.categories.filter(c => c !== cat)
                                  : [...prev.categories, cat as ProductCategory],
                              }))
                            }
                            className={cn(
                              'px-2.5 py-1 rounded-full border text-[11px]',
                              isActive
                                ? 'border-[#8B0000] bg-[#8B0000] text-white'
                                : 'border-[#D9D1C7] bg-white text-[#2E2B28]'
                            )}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#2E2B28] mb-1">Mood tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {availableTags.slice(0, 6).map(tag => {
                        const isActive = filterState.tags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() =>
                              setFilterState(prev => ({
                                ...prev,
                                tags: isActive
                                  ? prev.tags.filter(t => t !== tag.id)
                                  : [...prev.tags, tag.id],
                              }))
                            }
                            className={cn(
                              'px-2.5 py-1 rounded-full border text-[11px]',
                              isActive
                                ? 'border-[#8B0000] bg-[#8B0000] text-white'
                                : 'border-[#D9D1C7] bg-white text-[#2E2B28]'
                            )}
                          >
                            {tag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#D9D1C7] pt-4 text-xs text-[#6F675E] space-y-2">
                  <p className="font-medium text-[#2E2B28]">Sort logic</p>
                  <p>
                    “{currentSortOption.label}” prioritises pieces by{' '}
                    {currentSortOption.field === 'price'
                      ? 'price'
                      : currentSortOption.field === 'createdAt'
                      ? 'arrival date'
                      : currentSortOption.field === 'name'
                      ? 'alphabetical order'
                      : 'editorial relevance'}
                    .
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <ProductGridMasonry
                products={filteredProducts}
                isLoading={!isHydratedFromUrl}
                emptyLabel="Nothing matches this exact curation. Loosen one or two filters and try again."
                className=""
                accentFirstRow
              />
            </div>
          </section>
        </section>

        <FilterDrawer
          open={isFilterDrawerOpen}
          onOpenChange={setIsFilterDrawerOpen}
          value={filterState}
          onChange={handleFilterDrawerChange}
        />
      </main>
    </AppLayout>
  );
}

export default ShopPage;