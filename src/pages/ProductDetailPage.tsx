import React, { useCallback, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Ruler, ShoppingBag, Truck, ZoomIn } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Badge, Button, Carousel, CarouselContent, CarouselItem,
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
  Separator, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/shadcn';
import {
  useMockStore, getSelection, setProductSelection, setOverlay, addToCart,
  getArtisan, getRelatedProducts, formatPrice, SIZE_GUIDE, SHIPPING_POLICY, ROUTES,
} from '@/mock';
import { ProductCard } from '@/components/ProductCard';
import { ReviewSection } from '@/components/ReviewSection';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const products = useMockStore((state) => state.products);
  const selections = useMockStore((state) => state.selections);
  const overlays = useMockStore((state) => state.overlays);
  const cart = useMockStore((state) => state.cart);
  const reducedMotion = useReducedMotion();
  const product = products.find((item) => item.slug === slug);
  const productId = product?.id;
  const selection = productId ? selections[productId] ?? getSelection(productId) : null;
  type GalleryApi = Parameters<NonNullable<React.ComponentProps<typeof Carousel>['setApi']>>[0];
  const galleryApi = useRef<GalleryApi>(undefined);
  const removeGalleryListener = useRef<(() => void) | null>(null);

  const connectGallery = useCallback((api: GalleryApi) => {
    removeGalleryListener.current?.();
    galleryApi.current = api;
    if (!api || !productId) return;
    api.scrollTo(getSelection(productId).image, true);
    const onSelect = () => setProductSelection(productId, { image: api.selectedScrollSnap() });
    api.on('select', onSelect);
    removeGalleryListener.current = () => { api.off('select', onSelect); };
  }, [productId]);

  useEffect(() => {
    if (selection) galleryApi.current?.scrollTo(selection.image);
  }, [selection?.image, productId]);

  useEffect(() => {
    setOverlay('lightbox', null);
    setOverlay('sizeGuide', false);
    return () => {
      removeGalleryListener.current?.();
      removeGalleryListener.current = null;
      setOverlay('lightbox', null);
      setOverlay('sizeGuide', false);
    };
  }, [productId]);

  if (!product || !selection) {
    return (
      <section className="w-full bg-[#f7f2e9] px-6 py-28 text-[#382a26] dark:bg-[#241e1c] dark:text-[#f7f2e9] lg:px-12">
        <p className="mb-5 text-xs uppercase tracking-[0.24em]">The Jootiya collection</p>
        <h1 className="font-serif text-4xl md:text-6xl">This pair is unavailable.</h1>
        <p className="my-7 max-w-prose leading-relaxed">The link may have changed, or this design is no longer in our collection. Discover another piece of Jodhpur craftsmanship.</p>
        <Button asChild className="bg-[#632f3b] text-white hover:bg-[#49212b]"><Link to={ROUTES.catalog}><ArrowLeft className="mr-2 h-4 w-4" />Explore the collection</Link></Button>
      </section>
    );
  }

  const artisan = getArtisan(product.artisanId);
  const related = getRelatedProducts(product.id);
  const size = selection.size;
  const available = (variantSize: typeof size) => {
    const stock = product.variants.find((variant) => variant.size === variantSize)?.stock ?? 0;
    const reserved = cart.find((line) => line.productId === product.id && line.size === variantSize)?.quantity ?? 0;
    return Math.max(0, stock - reserved);
  };
  const remaining = size === null ? 0 : available(size);
  const quantity = selection.quantity;
  const soldOut = product.variants.every((variant) => variant.stock === 0);
  const canAdd = size !== null && remaining >= quantity && quantity > 0;
  const currentImage = product.images[selection.image] ?? product.images[0];
  const lightboxIndex = overlays.lightbox === null ? selection.image : Math.min(overlays.lightbox, product.images.length - 1);
  const lightboxImage = product.images[lightboxIndex] ?? currentImage;
  const accent = 'bg-[#632f3b] text-white hover:bg-[#49212b] dark:bg-[#e5c4b0] dark:text-[#301e22] dark:hover:bg-[#f0d8c8]';

  const add = () => {
    if (!canAdd || size === null) return;
    const result = addToCart(product.id, size, quantity);
    if (!result.ok) { toast.error(result.error); return; }
    toast.success(`${product.name} added to your bag`, {
      description: `EU ${size} · ${quantity} ${quantity === 1 ? 'pair' : 'pairs'} · Browser-only demo`,
      action: { label: 'View bag', onClick: () => setOverlay('cart', true) },
    });
  };
  const moveLightbox = (direction: number) => {
    const next = (lightboxIndex + direction + product.images.length) % product.images.length;
    setOverlay('lightbox', next);
    setProductSelection(product.id, { image: next });
  };

  return (
    <div className="w-full bg-[#faf6ef] text-[#382a26] dark:bg-[#241e1c] dark:text-[#f7f2e9]">
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-6 py-6 text-sm lg:px-12">
        <Link to={ROUTES.catalog} className="underline-offset-4 hover:underline">The collection</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
      </nav>
      <section aria-labelledby="product-title" className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-10 px-6 pb-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="min-w-0 lg:col-span-7">
          <Carousel key={product.id} setApi={connectGallery} opts={{ loop: product.images.length > 1 }} aria-label={`${product.name} image gallery`} className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={`${image.src}-${index}`}>
                  <Button variant="ghost" className="group relative block h-auto w-full rounded-none bg-[#e9dfd0] p-0 hover:bg-[#e9dfd0] focus-visible:ring-inset" aria-label={`Enlarge image ${index + 1}: ${image.alt}`} onClick={() => setOverlay('lightbox', index)}>
                    <img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} className="aspect-[4/5] w-full object-cover" />
                    <span className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-[#faf6ef] px-4 py-2 text-xs text-[#382a26] shadow-sm"><ZoomIn className="h-4 w-4" />View detail</span>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-xs leading-relaxed text-[#78685d] dark:text-[#c6b7aa]" aria-live="polite">{selection.image + 1} / {product.images.length} — {currentImage.caption}</p>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="icon" disabled={product.images.length < 2} aria-label="Previous product image" onClick={() => galleryApi.current?.scrollPrev()}><ArrowLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" disabled={product.images.length < 2} aria-label="Next product image" onClick={() => galleryApi.current?.scrollNext()}><ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3" aria-label="Choose a product image">
            {product.images.map((image, index) => (
              <Button key={index} variant="outline" aria-label={`Show image ${index + 1}: ${image.alt}`} aria-pressed={selection.image === index} onClick={() => setProductSelection(product.id, { image: index })} className={`h-auto w-20 overflow-hidden rounded-none p-1 ${selection.image === index ? 'border-[#632f3b] ring-1 ring-[#632f3b] dark:border-[#e5c4b0] dark:ring-[#e5c4b0]' : ''}`}>
                <img src={image.src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </Button>
            ))}
          </div>
        </div>

        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="min-w-0 self-start lg:sticky lg:top-24 lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.22em]">Jodhpur · {product.category}</p>
            {product.badge && <Badge variant="outline" className="border-[#c8b6a3] text-inherit">{product.badge}</Badge>}
          </div>
          <h1 id="product-title" className="mt-6 break-words font-serif text-4xl leading-tight md:text-5xl xl:text-6xl">{product.name}</h1>
          <p className="mt-5 text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-2 text-xs text-[#78685d] dark:text-[#c6b7aa]">INR · Price per pair · Demonstration product</p>
          <p className="my-7 leading-7">{product.description}</p>
          <dl className="space-y-3 text-sm leading-6">
            <div className="flex gap-4"><dt className="w-20 shrink-0 text-[#78685d] dark:text-[#c6b7aa]">Colour</dt><dd>{product.color}</dd></div>
            <div className="flex gap-4"><dt className="w-20 shrink-0 text-[#78685d] dark:text-[#c6b7aa]">Materials</dt><dd>{product.materials.join(', ')}</dd></div>
          </dl>
          <Separator className="my-7 bg-[#ddd0c1] dark:bg-[#54433a]" />
          <div className="mb-4 flex w-full items-center justify-between gap-3">
            <h2 id="size-label" className="text-sm font-medium">Select your size · EU</h2>
            <Button variant="ghost" size="sm" className="text-inherit underline underline-offset-4" onClick={() => setOverlay('sizeGuide', true)}><Ruler className="mr-2 h-4 w-4" />Size guide</Button>
          </div>
          <div role="group" aria-labelledby="size-label" className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => (
              <Button key={variant.size} variant="outline" disabled={available(variant.size) === 0} aria-label={`EU ${variant.size}${available(variant.size) === 0 ? ', unavailable or already in bag' : ''}`} aria-pressed={size === variant.size} onClick={() => setProductSelection(product.id, { size: variant.size, quantity: 1 })} className={`h-11 rounded-full px-4 ${size === variant.size ? accent : 'border-[#c8b6a3] bg-transparent text-inherit hover:bg-[#ede2d4] dark:hover:bg-[#40332c]'}`}>EU {variant.size}</Button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-[#78685d] dark:text-[#c6b7aa]">{product.fit}</p>
          <p className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">{soldOut ? 'This design is currently sold out.' : size === null ? 'Choose a size to see availability.' : remaining === 0 ? 'All available pairs in this size are already in your bag.' : `${remaining} ${remaining === 1 ? 'pair' : 'pairs'} available to add in EU ${size}.`}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div role="group" aria-label="Quantity" className="flex items-center rounded-full border border-[#c8b6a3] p-1">
              <Button variant="ghost" size="icon" className="rounded-full" disabled={quantity <= 1 || size === null} aria-label="Decrease quantity" onClick={() => setProductSelection(product.id, { quantity: quantity - 1 })}><Minus className="h-4 w-4" /></Button>
              <span className="min-w-8 text-center text-sm" aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</span>
              <Button variant="ghost" size="icon" className="rounded-full" disabled={size === null || quantity >= remaining} aria-label="Increase quantity" onClick={() => setProductSelection(product.id, { quantity: quantity + 1 })}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button className={`h-12 min-w-40 flex-1 rounded-none ${accent}`} disabled={!canAdd} onClick={add}><ShoppingBag className="mr-2 h-4 w-4" />{soldOut ? 'Sold out' : size === null ? 'Select a size' : 'Add to bag'}</Button>
          </div>
          <div className="mt-6 space-y-3 text-xs leading-5 text-[#78685d] dark:text-[#c6b7aa]">
            <p className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0" />Free demo shipping above {formatPrice(SHIPPING_POLICY.freeAbove)}; otherwise {formatPrice(SHIPPING_POLICY.fee)}.</p>
            <p className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" />Client-side mock store. No real payment, shipment or fulfilment.</p>
          </div>
        </motion.div>
      </section>

      <section aria-label="Details and craftsmanship" className="w-full border-y border-[#ddd0c1] bg-[#f0e7dc] py-14 dark:border-[#54433a] dark:bg-[#2d2521]">
        <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-12">
          <Tabs value={selection.tab} onValueChange={(tab) => setProductSelection(product.id, { tab })}>
            <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              <TabsTrigger value="details" className="rounded-full px-5 py-3">Construction</TabsTrigger><TabsTrigger value="care" className="rounded-full px-5 py-3">Care</TabsTrigger><TabsTrigger value="delivery" className="rounded-full px-5 py-3">Delivery</TabsTrigger><TabsTrigger value="artisan" className="rounded-full px-5 py-3">The artisan</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="max-w-prose space-y-5 leading-7"><h2 className="font-serif text-3xl">Made slowly. Worn often.</h2><p>{product.story}</p><ul className="list-inside list-disc space-y-2">{product.materials.map((material) => <li key={material}>{material}</li>)}</ul></TabsContent>
            <TabsContent value="care" className="max-w-prose space-y-5 leading-7"><h2 className="font-serif text-3xl">A little care, a lasting companion.</h2><ul className="list-inside list-disc space-y-2">{product.care.map((instruction) => <li key={instruction}>{instruction}</li>)}</ul></TabsContent>
            <TabsContent value="delivery" className="max-w-prose space-y-5 leading-7"><h2 className="font-serif text-3xl">From Jodhpur, in spirit.</h2><p>{SHIPPING_POLICY.estimate}</p><p>Shipping is calculated in your bag. Checkout creates a saved demonstration order only. No payment is charged, no courier is booked, and returns or exchanges are not processed.</p></TabsContent>
            <TabsContent value="artisan" className="max-w-prose space-y-5 leading-7"><h2 className="font-serif text-3xl">{artisan?.name ?? 'The Jodhpur atelier'}</h2>{artisan && <><p>{artisan.specialty} · {artisan.location}</p><p>{artisan.biography}</p></>}<p className="text-sm">Artisan profiles and product stories are fictional demonstration content.</p><Button asChild variant="outline" className="border-[#9c8370] bg-transparent text-inherit"><Link to={ROUTES.artisans}>Discover the making tradition<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></TabsContent>
          </Tabs>
        </div>
      </section>
      <section aria-label="Customer reviews" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12"><ReviewSection productId={product.id} /></section>
      {related.length > 0 && <section aria-labelledby="related-title" className="mx-auto w-full max-w-[1600px] px-6 pb-20 lg:px-12"><div className="mb-9 flex flex-wrap items-center justify-between gap-5"><h2 id="related-title" className="font-serif text-3xl md:text-4xl">A kindred pair.</h2><Link to={ROUTES.catalog} className="text-sm underline underline-offset-4">Explore all Mojris</Link></div><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}

      <Dialog open={overlays.sizeGuide} onOpenChange={(open) => setOverlay('sizeGuide', open)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto bg-[#faf6ef] text-[#382a26] dark:bg-[#2d2521] dark:text-[#f7f2e9]">
          <DialogHeader><DialogTitle className="font-serif text-3xl">Find your fit</DialogTitle><DialogDescription>Measure heel to longest toe while standing. Measure both feet and use the longer measurement. These are illustrative demo measurements.</DialogDescription></DialogHeader>
          <Table><TableHeader><TableRow><TableHead scope="col">EU size</TableHead><TableHead scope="col">Foot length (cm)</TableHead></TableRow></TableHeader><TableBody>{SIZE_GUIDE.map((row) => <TableRow key={row.size}><TableCell>{row.label}</TableCell><TableCell>{row.footLengthCm.toFixed(1)}</TableCell></TableRow>)}</TableBody></Table>
          <p className="text-sm leading-6">{product.fit}</p>
        </DialogContent>
      </Dialog>
      <Dialog open={overlays.lightbox !== null} onOpenChange={(open) => { if (!open) setOverlay('lightbox', null); }}>
        <DialogContent className="max-h-[94dvh] w-[calc(100%-2rem)] max-w-[1100px] overflow-y-auto bg-[#faf6ef] text-[#382a26] dark:bg-[#241e1c] dark:text-[#f7f2e9]" onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); moveLightbox(event.key === 'ArrowLeft' ? -1 : 1); } }}>
          <DialogHeader><DialogTitle className="pr-6 font-serif text-2xl">{product.name} · Image {lightboxIndex + 1}</DialogTitle><DialogDescription>{lightboxImage.caption} Use the arrow keys or buttons to explore.</DialogDescription></DialogHeader>
          <img src={lightboxImage.src} alt={lightboxImage.alt} className="max-h-[65dvh] w-full bg-[#e9dfd0] object-contain" />
          <div className="flex items-center justify-between gap-4"><Button variant="outline" disabled={product.images.length < 2} onClick={() => moveLightbox(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Previous</Button><span className="text-sm" aria-live="polite">{lightboxIndex + 1} / {product.images.length}</span><Button variant="outline" disabled={product.images.length < 2} onClick={() => moveLightbox(1)}>Next<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductDetailPage;