import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, MapPin, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Button, Tabs, TabsList, TabsTrigger, TabsContent,
} from '@/components/ui/shadcn';
import { ProductCard } from '@/components/ProductCard';
import { ReviewSection } from '@/components/ReviewSection';
import {
  DEMO_NOTICE, MAX_CART_QUANTITY, FREE_SHIPPING_THRESHOLD,
  formatCurrency, getProductById, getArtisan, getRelatedProducts,
  getReviewSummary, getStock, useStore,
  type Product, type ShoeSize,
} from '@/mock';

function ProductDetailContent({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion();
  const products = useStore(state => state.products);
  const reviews = useStore(state => state.reviews);
  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const openCart = useStore(state => state.openCart);
  const storageStatus = useStore(state => state.storageStatus);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ShoeSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [supportTab, setSupportTab] = useState('details');
  const [added, setAdded] = useState(false);

  const image = product.images[imageIndex] ?? product.images[0];
  const artisan = getArtisan(product.artisanId);
  const related = getRelatedProducts(product, products);
  const summary = getReviewSummary(product.id, reviews);
  const inStock = product.variants.some(variant => variant.stock > 0);
  const stock = selectedSize === null ? 0 : getStock(product, selectedSize);
  const alreadyInBag = cart.find(line => line.productId === product.id && line.size === selectedSize)?.quantity ?? 0;
  const remaining = Math.max(0, Math.min(MAX_CART_QUANTITY, stock) - alreadyInBag);
  const canAdd = selectedSize !== null && quantity > 0 && quantity <= remaining;

  const moveImage = (direction: number) => {
    if (product.images.length) {
      setImageIndex(index => (index + direction + product.images.length) % product.images.length);
    }
  };

  const handleAdd = () => {
    if (selectedSize === null) {
      toast.error('Choose an available EU size before adding to your bag.');
      return;
    }
    const result = addToCart(product.id, selectedSize, quantity);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setAdded(true);
    toast.success(result.message, {
      action: { label: 'View bag', onClick: openCart },
    });
  };

  return (
    <motion.div
      className="w-full bg-background text-foreground"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <nav aria-label="Breadcrumb" className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-2 px-6 py-5 text-sm text-muted-foreground lg:px-12">
        <Link to="/catalog" className="underline-offset-4 hover:text-foreground hover:underline">The collection</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-foreground">{product.name}</span>
      </nav>

      <section aria-label={`${product.name} image gallery`} className="w-full">
        <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#e9e1d6] dark:bg-[#29251f]">
          {image ? (
            <motion.img
              key={image.id}
              src={image.src}
              alt={image.alt}
              onError={event => {
                const element = event.currentTarget;
                if (element.getAttribute('src') !== image.fallback) element.src = image.fallback;
              }}
              initial={reduceMotion ? false : { opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="h-[70vh] min-h-[420px] w-full object-contain"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <p className="px-6 py-24 text-center text-foreground">Photography is unavailable for this Mojri.</p>
          )}
        </div>
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-5 border-b border-border px-6 py-5 lg:px-12">
          <div className="flex flex-wrap gap-2.5" aria-label="Choose a product image">
            {product.images.map((entry, index) => (
              <Button
                key={entry.id}
                type="button"
                variant={imageIndex === index ? 'default' : 'outline'}
                className="rounded-full px-4"
                aria-label={`Show ${product.name} image ${index + 1}`}
                aria-pressed={imageIndex === index}
                onClick={() => setImageIndex(index)}
              >
                {index === 0 ? 'The silhouette' : `Craft study ${index + 1}`}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
              {product.images.length ? imageIndex + 1 : 0} / {product.images.length}
            </span>
            <Button type="button" variant="outline" size="icon" aria-label="Previous product image" disabled={product.images.length < 2} onClick={() => moveImage(-1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Next product image" disabled={product.images.length < 2} onClick={() => moveImage(1)}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="w-full text-xs leading-relaxed text-muted-foreground">Illustrative demo listing. Reference photography may show related traditional footwear; illustrated Mojri studies appear when photography cannot load.</p>
        </div>
      </section>

      <section aria-labelledby="product-title" className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-20">
        <div className="min-w-0 lg:col-span-7">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{product.origin} · {product.material}</p>
          <h1 id="product-title" className="whitespace-normal break-words font-serif text-5xl leading-tight md:text-7xl">{product.name}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{product.subtitle}</p>
          <p className="mt-7 leading-8">{product.description}</p>
          <p className="mt-5 text-sm text-muted-foreground">{product.craft}</p>
          <a href="#product-reviews" className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-muted-foreground">
            {summary.count ? `${summary.average.toFixed(1)} / 5 · ${summary.count} demo reviews` : 'Read or write a demo review'}
          </a>

          <Tabs value={supportTab} onValueChange={setSupportTab} className="mt-10">
            <TabsList aria-label="Product information" className="h-auto w-full flex-wrap justify-start gap-2 bg-muted p-2">
              <TabsTrigger value="details" className="whitespace-normal">Materials</TabsTrigger>
              <TabsTrigger value="care" className="whitespace-normal">Care ritual</TabsTrigger>
              <TabsTrigger value="fit" className="whitespace-normal">Size & fit</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-5 leading-7">
              <h2 className="mb-4 font-serif text-2xl">Considered, inside and out.</h2>
              <ul className="list-disc space-y-2 pl-5">
                {product.materials.map(material => <li key={material}>{material}</li>)}
              </ul>
              <p className="mt-5 text-sm text-muted-foreground">Colour: {product.color}. Materials describe the fictional demo design.</p>
            </TabsContent>
            <TabsContent value="care" className="pt-5 leading-7">
              <h2 className="mb-4 font-serif text-2xl">A little care, a lasting ritual.</h2>
              <ul className="list-disc space-y-2 pl-5">
                {product.care.map(instruction => <li key={instruction}>{instruction}</li>)}
              </ul>
            </TabsContent>
            <TabsContent value="fit" id="product-fit-guide" className="pt-5 leading-7">
              <h2 className="mb-4 font-serif text-2xl">Finding your fit.</h2>
              <p>{product.fit}</p>
              <p className="mt-4 text-sm text-muted-foreground">Sizes shown are EU sizes. Unavailable sizes cannot be selected. This fictional collection has no verified foot-length measurement chart.</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="border-y border-border py-8">
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="font-serif text-3xl">{formatCurrency(product.price)}</p>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{inStock ? 'Demo collection' : 'Out of demo stock'}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Per pair · simulated purchase only. Free demo shipping from {formatCurrency(FREE_SHIPPING_THRESHOLD)}.</p>
            <fieldset className="mt-8">
              <legend className="text-sm font-medium">Choose your EU size</legend>
              <Button type="button" variant="link" className="mb-3 mt-1 h-auto px-0 text-foreground underline underline-offset-4" onClick={() => {
                setSupportTab('fit');
                window.requestAnimationFrame(() => document.getElementById('product-fit-guide')?.focus());
              }}>Read the size guide</Button>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map(variant => (
                  <Button
                    key={variant.size}
                    type="button"
                    variant={selectedSize === variant.size ? 'default' : 'outline'}
                    className="h-auto min-h-11 rounded-full px-4 py-2"
                    disabled={variant.stock <= 0}
                    aria-pressed={selectedSize === variant.size}
                    aria-label={`EU ${variant.size}${variant.stock <= 0 ? ', unavailable' : ''}`}
                    onClick={() => { setSelectedSize(variant.size); setQuantity(1); setAdded(false); }}
                  >EU {variant.size}{variant.stock <= 0 ? ' · sold out' : ''}</Button>
                ))}
              </div>
            </fieldset>
            <p id="stock-information" className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">
              {selectedSize === null ? 'Select a size to see availability.' : remaining === 0 ? 'No more pairs of this size can be added to your bag.' : `${remaining} more ${remaining === 1 ? 'pair' : 'pairs'} available for your bag${alreadyInBag ? ` · ${alreadyInBag} already added` : ''}.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <span id="quantity-label" className="text-sm font-medium">Quantity</span>
              <div className="flex items-center gap-4" role="group" aria-labelledby="quantity-label">
                <Button type="button" variant="outline" size="icon" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => { setQuantity(value => value - 1); setAdded(false); }}><Minus className="h-4 w-4" aria-hidden="true" /></Button>
                <output className="min-w-6 text-center tabular-nums" aria-live="polite" aria-label="Selected quantity">{quantity}</output>
                <Button type="button" variant="outline" size="icon" aria-label="Increase quantity" disabled={selectedSize === null || quantity >= remaining} onClick={() => { setQuantity(value => value + 1); setAdded(false); }}><Plus className="h-4 w-4" aria-hidden="true" /></Button>
              </div>
            </div>
            <motion.div className="mt-7" whileTap={reduceMotion || !canAdd ? undefined : { scale: 0.985 }}>
              <Button type="button" className="h-auto min-h-14 w-full gap-3 whitespace-normal bg-[#a43e2b] px-6 py-4 text-white hover:bg-[#843020] dark:bg-[#bc513a] dark:text-white dark:hover:bg-[#a43e2b]" disabled={!canAdd} aria-describedby="stock-information" onClick={handleAdd}>
                {added ? <Check className="h-5 w-5 shrink-0" aria-hidden="true" /> : <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden="true" />}
                {added ? 'Add another to your bag' : 'Add to bag'} · {formatCurrency(product.price * quantity)}
              </Button>
            </motion.div>
            {added && <Button type="button" variant="outline" className="mt-3 min-h-11 w-full" onClick={openCart}>View your bag</Button>}
            <p className="mt-5 text-xs leading-6 text-muted-foreground">{DEMO_NOTICE}</p>
            {storageStatus === 'memory-only' && <p role="status" className="mt-3 text-sm text-muted-foreground">Browser storage is unavailable. Your demo bag will only be retained while this page remains open.</p>}
          </div>
        </div>
      </section>

      {artisan && (
        <section aria-labelledby="artisan-title" className="w-full bg-muted/60">
          <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-12 lg:px-12 lg:py-20">
            <div className="min-w-0 lg:col-span-5">
              <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />{artisan.location}</p>
              <h2 id="artisan-title" className="font-serif text-4xl leading-tight">Behind the stitch.</h2>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <h3 className="font-serif text-2xl">{artisan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{artisan.specialty} · fictional artisan portrait</p>
              <p className="mt-6 leading-8">{artisan.story}</p>
            </div>
          </div>
        </section>
      )}

      <div id="product-reviews" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-6 py-16 lg:px-12 lg:py-20">
        <ReviewSection productId={product.id} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mx-auto w-full max-w-[1600px] border-t border-border px-6 py-16 lg:px-12 lg:py-20">
          <div className="mb-10 flex w-full flex-wrap items-center justify-between gap-5">
            <h2 id="related-title" className="font-serif text-4xl">The story continues.</h2>
            <Button asChild variant="outline"><Link to="/catalog">Explore the collection <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
          </div>
          <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry, index) => <ProductCard key={entry.id} product={entry} imageClassName={index === 1 ? 'aspect-[3/4]' : 'aspect-[4/5]'} />)}
          </div>
        </section>
      )}
    </motion.div>
  );
}

export function ProductDetailPage() {
  const { id, slug, productId } = useParams<{ id: string; slug: string; productId: string }>();
  const products = useStore(state => state.products);
  const product = getProductById(id ?? slug ?? productId ?? '', products);

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-[1600px] flex-col items-start justify-center gap-6 px-6 py-20 lg:px-12" aria-labelledby="product-not-found">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">A different path through Jodhpur</p>
        <h1 id="product-not-found" className="font-serif text-4xl leading-tight md:text-6xl">This Mojri could not be found.</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">The link may be incomplete. Discover the rest of our illustrative craft collection instead.</p>
        <Button asChild><Link to="/catalog"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to the collection</Link></Button>
      </section>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}

export default ProductDetailPage;