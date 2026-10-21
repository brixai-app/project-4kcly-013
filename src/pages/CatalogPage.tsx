import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  Button, Checkbox, Input, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetTrigger, Slider,
} from '@/components/ui/shadcn';
import { ProductCard } from '@/components/ProductCard';
import {
  categories, materials, SIZES, DEFAULT_FILTERS, filterProducts,
  filtersFromSearchParams, filtersToSearchParams, formatCurrency, useStore,
  type CatalogFilters, type CategoryId, type SortOption,
} from '@/mock';

function FilterControls({ filters, onChange, scope }: {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>, replace?: boolean) => void;
  scope: string;
}) {
  const priceCeiling = Math.max(DEFAULT_FILTERS.maxPrice, filters.maxPrice);

  return (
    <div className="space-y-9">
      <div className="space-y-3">
        <label htmlFor={`${scope}-collection`} className="text-sm font-medium">Collection</label>
        <Select value={filters.category} onValueChange={value => onChange({ category: value as CategoryId | 'all' })}>
          <SelectTrigger id={`${scope}-collection`} className="h-12 w-full bg-background">
            <SelectValue placeholder="All collections" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All collections</SelectItem>
            {categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Your size <span className="font-normal text-muted-foreground">/ EU</span></legend>
        <div className="flex flex-wrap gap-2.5">
          {SIZES.map(size => {
            const selected = filters.sizes.includes(size);
            return (
              <Button
                key={size}
                type="button"
                variant={selected ? 'default' : 'outline'}
                aria-pressed={selected}
                aria-label={`EU size ${size}`}
                className="h-10 rounded-full px-4 transition-colors"
                onClick={() => onChange({ sizes: selected ? filters.sizes.filter(value => value !== size) : [...filters.sizes, size] })}
              >
                {size}
              </Button>
            );
          })}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">Shows Mojris with stock in any of your selected sizes.</p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Material</legend>
        {materials.map(material => (
          <div key={material} className="flex min-h-8 items-center gap-3">
            <Checkbox
              id={`${scope}-${material}`}
              checked={filters.materials.includes(material)}
              onCheckedChange={checked => onChange({
                materials: checked === true
                  ? [...filters.materials, material]
                  : filters.materials.filter(value => value !== material),
              })}
            />
            <label htmlFor={`${scope}-${material}`} className="cursor-pointer text-sm">{material}</label>
          </div>
        ))}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-sm font-medium">Price range</legend>
        <div className="flex flex-wrap justify-between gap-2 text-sm tabular-nums text-muted-foreground">
          <span>{formatCurrency(filters.minPrice)}</span>
          <span>{formatCurrency(filters.maxPrice)}</span>
        </div>
        <div className="px-2 py-2">
          <Slider
            aria-label="Price range in Indian rupees"
            min={0}
            max={priceCeiling}
            step={50}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={values => {
              if (values.length === 2) onChange({ minPrice: values[0], maxPrice: values[1] }, true);
            }}
          />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">Use the arrow keys to fine-tune either price handle.</p>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Checkbox
          id={`${scope}-stock`}
          checked={filters.inStockOnly}
          onCheckedChange={checked => onChange({ inStockOnly: checked === true })}
        />
        <label htmlFor={`${scope}-stock`} className="cursor-pointer text-sm">In demo stock only</label>
      </div>
    </div>
  );
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useStore(state => state.products);
  const reviews = useStore(state => state.reviews);
  const reducedMotion = useReducedMotion();
  const filters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams]);
  const results = useMemo(() => filterProducts(products, filters, reviews), [products, filters, reviews]);

  function updateFilters(patch: Partial<CatalogFilters>, replace = false) {
    setSearchParams(previous => filtersToSearchParams({ ...filtersFromSearchParams(previous), ...patch }), { replace });
  }

  function clearAll() {
    setSearchParams(filtersToSearchParams({ ...DEFAULT_FILTERS, sizes: [], materials: [] }));
  }

  const chips = [
    ...(filters.search ? [{ key: 'search', label: `Search: ${filters.search}`, remove: () => updateFilters({ search: '' }) }] : []),
    ...(filters.category !== 'all' ? [{ key: 'category', label: categories.find(category => category.id === filters.category)?.name ?? 'Collection', remove: () => updateFilters({ category: 'all' }) }] : []),
    ...filters.sizes.map(size => ({ key: `size-${size}`, label: `EU ${size}`, remove: () => updateFilters({ sizes: filters.sizes.filter(value => value !== size) }) })),
    ...filters.materials.map(material => ({ key: `material-${material}`, label: material, remove: () => updateFilters({ materials: filters.materials.filter(value => value !== material) }) })),
    ...(filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice
      ? [{ key: 'price', label: `${formatCurrency(filters.minPrice)} – ${formatCurrency(filters.maxPrice)}`, remove: () => updateFilters({ minPrice: DEFAULT_FILTERS.minPrice, maxPrice: DEFAULT_FILTERS.maxPrice }) }]
      : []),
    ...(filters.inStockOnly ? [{ key: 'stock', label: 'In demo stock', remove: () => updateFilters({ inStockOnly: false }) }] : []),
  ];
  const activeCount = chips.length;
  const collection = categories.find(category => category.id === filters.category);

  return (
    <motion.main
      className="w-full bg-background text-foreground"
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="w-full border-b border-border bg-[#eee7dd] dark:bg-[#29241f]" aria-labelledby="catalog-title">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-14 lg:px-12 lg:py-20">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="min-w-0 space-y-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">The Mojri collection / Jodhpur</p>
              <h1 id="catalog-title" className="whitespace-normal break-words font-serif text-5xl leading-[1.1] sm:text-6xl lg:text-7xl">
                {collection ? collection.name : 'Tradition, in every step.'}
              </h1>
            </div>
            <div className="min-w-0 space-y-4 md:max-w-sm">
              <p className="text-sm leading-7 text-muted-foreground">
                {collection ? collection.description : 'Sculpted toes. Patient stitchwork. Explore our imagined edit of Rajasthani Mojris, rooted in the craft of Jodhpur.'}
              </p>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em]">A living craft, thoughtfully reimagined <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-8 lg:px-12 lg:pt-12" aria-label="Shop the collection">
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full min-w-0 sm:max-w-md">
            <label htmlFor="catalog-search" className="sr-only">Search Mojris by name, material, colour or craft</label>
            <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="catalog-search"
              type="search"
              maxLength={160}
              value={filters.search}
              placeholder="Find your Mojri…"
              className="h-12 bg-background pl-11"
              onChange={event => updateFilters({ search: event.target.value }, true)}
            />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 gap-2 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filters{activeCount > 0 ? ` (${activeCount})` : ''}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-serif text-3xl">Find your pair</SheetTitle>
                  <SheetDescription>Filters apply immediately. Close this panel to explore your selection.</SheetDescription>
                </SheetHeader>
                <div className="py-8">
                  <FilterControls filters={filters} onChange={updateFilters} scope="mobile" />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border py-5">
                  <span className="text-sm" role="status">{results.length} {results.length === 1 ? 'design' : 'designs'}</span>
                  <Button variant="ghost" onClick={clearAll} disabled={!activeCount && filters.sort === 'featured'}>Clear all</Button>
                </div>
              </SheetContent>
            </Sheet>
            <label htmlFor="catalog-sort" className="sr-only">Sort products</label>
            <Select value={filters.sort} onValueChange={value => updateFilters({ sort: value as SortOption })}>
              <SelectTrigger id="catalog-sort" className="h-12 w-[190px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Our edit</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? 'design' : 'designs'}{activeCount ? ' in your selection' : ' in the collection'}
          </p>
          {(activeCount > 0 || filters.sort !== 'featured') && <Button variant="ghost" size="sm" onClick={clearAll} className="underline underline-offset-4">Clear all</Button>}
        </div>

        {activeCount > 0 && (
          <div className="mb-8 flex flex-wrap gap-2.5" aria-label="Applied filters">
            {chips.map(chip => (
              <Button key={chip.key} variant="outline" onClick={chip.remove} aria-label={`Remove filter: ${chip.label}`} className="h-auto max-w-full gap-2 rounded-full px-4 py-2 text-left text-xs">
                <span className="min-w-0 whitespace-normal break-words">{chip.label}</span>
                <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-14">
          <aside className="hidden min-w-0 lg:block" aria-label="Filter products">
            <h2 className="mb-7 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Refine the edit</h2>
            <FilterControls filters={filters} onChange={updateFilters} scope="desktop" />
          </aside>

          <div className="min-w-0">
            {results.length > 0 ? (
              <ul className="grid grid-cols-1 items-start gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3" aria-label="Mojri designs">
                {results.map((product, index) => (
                  <li key={product.id} className="min-w-0">
                    <ProductCard
                      product={product}
                      priority={index < 2}
                      imageClassName={index % 3 === 1 ? '!aspect-[4/5] !h-auto' : index % 3 === 2 ? '!aspect-[5/6] !h-auto' : '!aspect-[3/4] !h-auto'}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex min-h-[420px] flex-col items-start justify-center border-y border-border py-16">
                <Search className="mb-6 h-7 w-7 text-muted-foreground" aria-hidden="true" />
                <h2 className="whitespace-normal break-words font-serif text-3xl sm:text-4xl">A different path to your perfect pair.</h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">No Mojris match this selection. Try another material, widen your price range, or start again with the complete collection.</p>
                <Button onClick={clearAll} className="mt-7">Explore all Mojris <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>
              </div>
            )}
            <p className="mt-12 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">An illustrative, browser-only collection. Product listings and reviews are demo content; orders and payments are simulated. Reference photographs may show related traditional footwear; illustrations appear when images are unavailable.</p>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

export default CatalogPage;