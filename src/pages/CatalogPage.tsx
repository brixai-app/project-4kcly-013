import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Grid2X2, List, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, Input, Pagination, PaginationContent, PaginationItem,
  PaginationLink, Sheet, SheetContent, SheetDescription, SheetHeader,
  SheetTitle, SheetTrigger, Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/shadcn';
import { ProductCard } from '@/components/ProductCard';
import {
  COLORS, SIZES, DEFAULT_CATALOG, ROUTES, catalogFromSearch,
  catalogToSearch, restoreCatalog, setCatalog, queryCatalog,
  formatPrice, getArtisan, useMockStore,
  type CatalogState,
} from '@/mock';

export function CatalogPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const products = useMockStore((state) => state.products);
  const filters = useMemo(() => catalogFromSearch(location.search), [location.search]);
  const result = useMemo(() => queryCatalog(filters, products), [filters, products]);

  // The URL owns navigation history; the central module validates, clamps and mirrors it.
  // Avoid a second store-to-URL effect, which could overwrite Back/Forward navigation.
  useEffect(() => {
    const restored = restoreCatalog(location.search);
    const canonical = catalogToSearch(restored);
    if (canonical !== location.search.replace(/^\?/, '')) {
      navigate({ pathname: location.pathname, search: canonical ? `?${canonical}` : '' }, { replace: true, preventScrollReset: true });
    }
  }, [location.search, location.pathname, products, navigate]);

  function update(patch: Partial<CatalogState>, replace = false) {
    restoreCatalog(location.search);
    const next = setCatalog(patch);
    const search = catalogToSearch(next);
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace, preventScrollReset: true });
  }

  function clearAll() {
    update({ ...DEFAULT_CATALOG, view: filters.view, sort: filters.sort, pageSize: filters.pageSize });
  }

  const activeCount = filters.colors.length + filters.sizes.length + filters.categories.length + Number(Boolean(filters.artisanId));
  const hasFilters = activeCount > 0 || Boolean(filters.query);
  const sortLabel = filters.sort === 'price-asc' ? 'Price: low to high' : filters.sort === 'price-desc' ? 'Price: high to low' : 'Most loved';
  const firstResult = result.total ? (result.page - 1) * filters.pageSize + 1 : 0;
  const lastResult = Math.min(result.page * filters.pageSize, result.total);
  const controlClass = 'min-h-11 rounded-full border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#713c46] focus-visible:ring-offset-2';
  const selectedClass = 'border-[#713c46] bg-[#713c46] text-white hover:bg-[#582c35]';
  const idleClass = 'border-[#d9cec1] bg-transparent text-[#51443b] hover:border-[#713c46] hover:bg-[#eee4d8] dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800';

  const filterControls = (
    <div className="space-y-9">
      <fieldset className="min-w-0">
        <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em]">Colour palette</legend>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((color) => (
            <Button key={color} variant="outline" aria-pressed={filters.colors.includes(color)}
              className={`${controlClass} ${filters.colors.includes(color) ? selectedClass : idleClass}`}
              onClick={() => update({ colors: filters.colors.includes(color) ? filters.colors.filter((value) => value !== color) : [...filters.colors, color] })}>
              {filters.colors.includes(color) && <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />}{color}
            </Button>
          ))}
        </div>
      </fieldset>
      <fieldset className="min-w-0">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]">Your size · EU</legend>
        <p className="mb-4 text-sm leading-relaxed text-[#75665a] dark:text-stone-400">Find pairs available in any of your selected sizes.</p>
        <div className="flex flex-wrap gap-2.5">
          {SIZES.map((size) => (
            <Button key={size} variant="outline" aria-label={`EU size ${size}`} aria-pressed={filters.sizes.includes(size)}
              className={`${controlClass} ${filters.sizes.includes(size) ? selectedClass : idleClass}`}
              onClick={() => update({ sizes: filters.sizes.includes(size) ? filters.sizes.filter((value) => value !== size) : [...filters.sizes, size] })}>
              {size}
            </Button>
          ))}
        </div>
      </fieldset>
      {hasFilters && <Button variant="ghost" onClick={clearAll} className="text-[#713c46] underline underline-offset-4 dark:text-rose-200">Clear all filters</Button>}
    </div>
  );

  return (
    <div className="w-full bg-[#faf7f1] text-[#352b25] dark:bg-stone-950 dark:text-stone-100">
      <section className="w-full border-b border-[#e1d7cb] bg-[#efe6da] dark:border-stone-800 dark:bg-stone-900" aria-labelledby="collection-title">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-14 sm:py-20 lg:px-12">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.26em] text-[#713c46] dark:text-rose-200">Jodhpur, Rajasthan · The collection</p>
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <h1 id="collection-title" className="min-w-0 font-serif text-5xl leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">Made slowly.<br />Worn for a lifetime.</h1>
            <div className="min-w-0 lg:w-[340px]">
              <p className="text-base leading-7 text-[#6b5a4d] dark:text-stone-300">Traditional Rajasthani Mojris. Thoughtful threadwork, supple leather, and the enduring spirit of Jodhpur.</p>
              <Link to={ROUTES.artisans} className="mt-5 inline-flex items-center gap-3 py-2 text-sm font-medium text-[#713c46] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-rose-200">Discover the craft <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 py-10 lg:px-12 lg:py-14" aria-label="Shop the collection">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1d7cb] pb-6 dark:border-stone-800">
          <div className="relative w-full min-w-0 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-[#75665a]" aria-hidden="true" />
            <label htmlFor="collection-search" className="sr-only">Search the collection</label>
            <Input id="collection-search" type="search" value={filters.query} maxLength={200}
              onChange={(event) => update({ query: event.target.value }, true)} placeholder="Search name, colour, material…"
              className="h-11 border-[#d9cec1] bg-transparent pl-11 text-base dark:border-stone-600" />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 border-[#d9cec1] bg-transparent lg:hidden"><SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />Filters{activeCount > 0 && <Badge className="ml-2 bg-[#713c46] text-white">{activeCount}</Badge>}</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(90vw,420px)] overflow-y-auto bg-[#faf7f1] p-6 text-[#352b25] dark:bg-stone-950 dark:text-stone-100">
                <SheetHeader className="mb-8 text-left"><SheetTitle className="font-serif text-3xl">Find your pair</SheetTitle><SheetDescription>Refine by colour and available EU size. Results update immediately.</SheetDescription></SheetHeader>
                {filterControls}
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" className="h-11 border-[#d9cec1] bg-transparent" aria-label={`Sort collection: ${sortLabel}`}>{sortLabel}<ChevronDown className="ml-3 h-4 w-4" aria-hidden="true" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-52">
                <DropdownMenuItem onSelect={() => update({ sort: 'popular' })}><Check className={`mr-2 h-4 w-4 ${filters.sort === 'popular' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />Most loved</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => update({ sort: 'price-asc' })}><Check className={`mr-2 h-4 w-4 ${filters.sort === 'price-asc' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />Price: low to high</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => update({ sort: 'price-desc' })}><Check className={`mr-2 h-4 w-4 ${filters.sort === 'price-desc' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />Price: high to low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div role="group" aria-label="Collection view" className="flex gap-1 rounded-md border border-[#d9cec1] p-1 dark:border-stone-600">
              <Button variant="ghost" size="icon" aria-label="Product grid" aria-pressed={filters.view === 'grid'} onClick={() => update({ view: 'grid', page: result.page })} className={`h-9 w-9 ${filters.view === 'grid' ? 'bg-[#713c46] text-white hover:bg-[#582c35] hover:text-white' : ''}`}><Grid2X2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" aria-label="Comparison table" aria-pressed={filters.view === 'table'} onClick={() => update({ view: 'table', page: result.page })} className={`h-9 w-9 ${filters.view === 'table' ? 'bg-[#713c46] text-white hover:bg-[#582c35] hover:text-white' : ''}`}><List className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-10 pt-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden min-w-0 lg:block" aria-label="Collection filters">
            <div className="mb-8 flex w-full items-center justify-between gap-2"><h2 className="font-serif text-2xl">Refine your edit</h2><SlidersHorizontal className="h-4 w-4" aria-hidden="true" /></div>
            {filterControls}
          </aside>
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-[#75665a] dark:text-stone-400">{result.total === 0 ? 'No pairs found' : `${firstResult}–${lastResult} of ${result.total} handcrafted pairs`}</p>
              {hasFilters && <Button variant="ghost" size="sm" onClick={clearAll} className="text-[#713c46] dark:text-rose-200">Clear all<X className="ml-2 h-3.5 w-3.5" aria-hidden="true" /></Button>}
            </div>
            {hasFilters && (
              <div className="mb-8 flex flex-wrap gap-2" aria-label="Active filters">
                {filters.query && <Badge variant="outline" className="max-w-full gap-2 rounded-full px-3 py-2"><span className="min-w-0 break-words">Search: {filters.query}</span><Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Remove search filter" onClick={() => update({ query: '' })}><X className="h-3.5 w-3.5" /></Button></Badge>}
                {filters.colors.map((color) => <Badge key={color} variant="outline" className="gap-2 rounded-full px-3 py-2">{color}<Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`Remove ${color} filter`} onClick={() => update({ colors: filters.colors.filter((value) => value !== color) })}><X className="h-3.5 w-3.5" /></Button></Badge>)}
                {filters.sizes.map((size) => <Badge key={size} variant="outline" className="gap-2 rounded-full px-3 py-2">EU {size}<Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`Remove EU ${size} filter`} onClick={() => update({ sizes: filters.sizes.filter((value) => value !== size) })}><X className="h-3.5 w-3.5" /></Button></Badge>)}
                {filters.categories.map((category) => <Badge key={category} variant="outline" className="gap-2 rounded-full px-3 py-2">{category}<Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`Remove ${category} filter`} onClick={() => update({ categories: filters.categories.filter((value) => value !== category) })}><X className="h-3.5 w-3.5" /></Button></Badge>)}
                {filters.artisanId && <Badge variant="outline" className="gap-2 rounded-full px-3 py-2">{getArtisan(filters.artisanId)?.name}<Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Remove artisan filter" onClick={() => update({ artisanId: '' })}><X className="h-3.5 w-3.5" /></Button></Badge>}
              </div>
            )}

            {result.total === 0 ? (
              <div className="rounded-sm border border-[#e1d7cb] px-6 py-20 text-center dark:border-stone-800">
                <Search className="mx-auto mb-6 h-8 w-8 text-[#927b68]" aria-hidden="true" />
                <h2 className="font-serif text-3xl sm:text-4xl">A different path to your perfect pair.</h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#75665a] dark:text-stone-400">Try a broader search, another colour, or fewer sizes. There is more of Jodhpur to discover.</p>
                <Button onClick={clearAll} className="mt-8 min-h-11 bg-[#713c46] px-6 text-white hover:bg-[#582c35]">Explore all Mojris<ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" /></Button>
              </div>
            ) : filters.view === 'grid' ? (
              <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div role="region" aria-label="Mojri comparison table; scroll horizontally for more columns" tabIndex={0} className="min-w-0 overflow-x-auto rounded-sm border border-[#e1d7cb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:border-stone-800">
                <Table className="min-w-[680px]">
                  <TableCaption className="px-4 pb-5 text-left">Prices in INR. Available sizes reflect current demo stock; choose a size on the product page.</TableCaption>
                  <TableHeader><TableRow><TableHead scope="col">Mojri</TableHead><TableHead scope="col">Colour</TableHead><TableHead scope="col">Available EU sizes</TableHead><TableHead scope="col" className="text-right">Price</TableHead><TableHead scope="col"><span className="sr-only">Product details</span></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {result.items.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="py-5"><Link to={ROUTES.product(product.slug)} className="flex items-center gap-4 underline-offset-4 hover:underline"><img src={product.images[0].src} alt="" loading="lazy" width={56} height={72} className="h-[72px] w-14 shrink-0 rounded-sm bg-[#efe6da] object-cover" /><span className="whitespace-normal font-serif text-lg">{product.name}</span></Link></TableCell>
                        <TableCell>{product.color}</TableCell>
                        <TableCell><div className="flex max-w-64 flex-wrap gap-1.5">{product.variants.map((variant) => variant.stock > 0 ? <Badge key={variant.size} variant="outline" className="font-normal">{variant.size}</Badge> : null)}{product.variants.every((variant) => variant.stock === 0) && <span className="text-sm text-[#75665a] dark:text-stone-400">Currently unavailable</span>}</div></TableCell>
                        <TableCell className="whitespace-nowrap text-right">{formatPrice(product.price)}</TableCell>
                        <TableCell><Button asChild variant="ghost" size="icon"><Link to={ROUTES.product(product.slug)} aria-label={`View ${product.name}`}><ArrowRight className="h-4 w-4" /></Link></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {result.pages > 1 && (
              <Pagination className="mt-14" aria-label="Collection pages">
                <PaginationContent className="flex-wrap gap-3">
                  <PaginationItem><Button variant="outline" disabled={result.page === 1} onClick={() => update({ page: result.page - 1 })} aria-label="Previous collection page"><ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />Previous</Button></PaginationItem>
                  <PaginationItem><PaginationLink href={`${ROUTES.catalog}?${catalogToSearch({ ...filters, page: result.page })}`} isActive aria-label={`Page ${result.page} of ${result.pages}`} className="w-auto px-4" onClick={(event) => event.preventDefault()}>{result.page} / {result.pages}</PaginationLink></PaginationItem>
                  <PaginationItem><Button variant="outline" disabled={result.page === result.pages} onClick={() => update({ page: result.page + 1 })} aria-label="Next collection page">Next<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Button></PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            <p className="mt-12 border-t border-[#e1d7cb] pt-6 text-xs leading-6 text-[#75665a] dark:border-stone-800 dark:text-stone-400">A browser-only demonstration collection with fictional products and artisans. No real payments or fulfilment.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CatalogPage;