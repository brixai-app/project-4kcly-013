import { useMemo, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/shadcn';
import { ProductCard } from '@/components/ProductCard';
import {
  categories,
  editorial,
  artisans,
  DEMO_NOTICE,
  DEFAULT_FILTERS,
  filtersToSearchParams,
  useStore,
  type CategoryId,
  type ProductImage,
} from '@/mock';

function collectionHref(category: CategoryId): string {
  return `/catalog?${filtersToSearchParams({ ...DEFAULT_FILTERS, category }).toString()}`;
}

function EditorialImage({
  image,
  className,
  priority = false,
}: {
  image: ProductImage;
  className: string;
  priority?: boolean;
}) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>): void => {
    const element = event.currentTarget;
    if (element.dataset.fallbackApplied === 'true') return;
    element.dataset.fallbackApplied = 'true';
    element.src = image.fallback;
  };

  return (
    <img
      src={image.src}
      alt={image.alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={handleError}
    />
  );
}

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const products = useStore((state) => state.products);
  const featured = useMemo(
    () => products.filter((product) => product.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder),
    [products],
  );
  const artisan = artisans[0];
  const reveal = {
    initial: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reducedMotion ? 0 : 0.55, ease: 'easeOut' as const },
  };

  return (
    <div className="w-full bg-[#f7f3eb] text-[#29251f] dark:bg-[#201d19] dark:text-[#f7f3eb]">
      <section aria-labelledby="home-title" className="relative w-full min-h-[70vh]">
        <div className="grid min-h-[70vh] grid-cols-1 lg:grid-cols-2">
          <div className="flex min-w-0 items-center px-6 py-16 lg:py-24 lg:pl-12 lg:pr-10 xl:pl-[max(3rem,calc((100vw-1600px)/2+3rem))]">
            <motion.div {...reveal} className="w-full min-w-0">
              <p className="mb-8 text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-[#756552] dark:text-[#c7b7a3]">
                {editorial.eyebrow}
              </p>
              <h1 id="home-title" className="whitespace-pre-line break-words font-['Playfair_Display'] text-[clamp(3rem,5.6vw,6.5rem)] font-normal leading-[1.08] tracking-[-0.045em]">
                {editorial.title}
              </h1>
              <p className="mt-8 max-w-lg text-base leading-8 text-[#6d6155] dark:text-[#d1c3b4]">
                {editorial.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Button asChild className="h-auto min-h-12 rounded-none bg-[#b53e2b] px-7 py-4 text-white shadow-none transition-colors hover:bg-[#943121] focus-visible:ring-[#b53e2b] dark:bg-[#b53e2b] dark:text-white dark:hover:bg-[#943121]">
                  <Link to="/catalog">
                    Explore the collection <ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <a href="#featured-mojris" className="inline-flex min-h-12 items-center gap-2 text-sm underline decoration-[#a99a87] underline-offset-8 transition-colors hover:text-[#b53e2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  Discover the edit <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
          <figure className="relative m-0 min-w-0 bg-[#e7ded1]">
            <EditorialImage image={editorial.heroImage} priority className="h-full min-h-[420px] w-full object-cover lg:absolute lg:inset-0 lg:min-h-0" />
            <figcaption className="relative flex items-center justify-between gap-4 bg-[#e7ded1] px-6 py-4 text-xs leading-relaxed text-[#544638] lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-8">
              <span>Jootiya / The Mojri study</span>
              <span>Illustrative collection</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="featured-mojris" aria-labelledby="featured-title" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-6 py-20 lg:px-12 lg:py-32">
        <motion.div {...reveal} className="mb-12 flex w-full flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div className="min-w-0">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#756552] dark:text-[#c7b7a3]">The considered edit</p>
            <h2 id="featured-title" className="font-['Playfair_Display'] text-4xl leading-tight tracking-tight md:text-6xl">A few lasting impressions.</h2>
          </div>
          <Button asChild variant="link" className="h-auto rounded-none px-0 py-3 text-current underline-offset-8 hover:text-[#b53e2b]">
            <Link to="/catalog">View all Mojris <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" /></Link>
          </Button>
        </motion.div>
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-14 md:grid-cols-2 lg:gap-x-16">
          {featured.map((product, index) => (
            <motion.div key={product.id} {...reveal} className={`min-w-0 ${index % 2 === 1 ? 'md:pt-20' : ''}`}>
              <ProductCard
                product={product}
                className="w-full"
                imageClassName={index % 2 === 0 ? 'aspect-[4/5] w-full object-cover' : 'aspect-[5/6] w-full object-cover'}
              />
            </motion.div>
          ))}
        </div>
        {featured.length === 0 && (
          <p className="py-10 text-base leading-7">The featured edit is being refreshed. <Link to="/catalog" className="underline underline-offset-4">Explore the catalog.</Link></p>
        )}
      </section>

      <section aria-labelledby="artisan-title" className="w-full bg-[#e9e0d3] dark:bg-[#302920]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <figure className="m-0 min-w-0">
            <EditorialImage image={editorial.artisanImage} className="h-full max-h-[850px] min-h-[420px] w-full object-cover" />
          </figure>
          <div className="flex min-w-0 items-center px-6 py-16 lg:px-12 lg:py-24 xl:pr-[max(3rem,calc((100vw-1600px)/2+3rem))]">
            <motion.div {...reveal} className="min-w-0">
              <p className="mb-6 text-xs uppercase tracking-[0.22em] text-[#756552] dark:text-[#c7b7a3]">The hands behind the silhouette</p>
              <h2 id="artisan-title" className="font-['Playfair_Display'] text-4xl leading-[1.15] tracking-tight md:text-5xl xl:text-6xl">{editorial.artisanTitle}</h2>
              <p className="mt-7 text-base leading-8 text-[#65594c] dark:text-[#d1c3b4]">{editorial.artisanDescription}</p>
              {artisan && (
                <div className="mt-8 border-t border-[#b5a48f]/50 pt-6">
                  <p className="text-sm font-medium">{artisan.location}</p>
                  <p className="mt-2 text-sm leading-7 text-[#65594c] dark:text-[#d1c3b4]">{artisan.specialty}</p>
                </div>
              )}
              <Button asChild variant="link" className="mt-7 h-auto rounded-none px-0 py-3 text-current underline underline-offset-8 hover:text-[#b53e2b]">
                <Link to={collectionHref('heritage')}>Explore the heritage collection <ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section aria-labelledby="collections-title" className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-12 lg:py-32">
        <motion.div {...reveal} className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#756552] dark:text-[#c7b7a3]">Find your rhythm</p>
          <h2 id="collections-title" className="font-['Playfair_Display'] text-4xl leading-tight tracking-tight md:text-6xl">For every kind of day.</h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div {...reveal} key={category.id} className={`min-w-0 ${index === 1 ? 'md:pt-16' : ''}`}>
              <Link to={collectionHref(category.id)} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#b53e2b]">
                <div className="overflow-hidden bg-[#e7ded1]">
                  <EditorialImage image={category.image} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none" />
                </div>
                <div className="mt-6 flex items-start justify-between gap-4">
                  <h3 className="min-w-0 font-['Playfair_Display'] text-2xl leading-snug transition-colors group-hover:text-[#b53e2b]">{category.name}</h3>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6d6155] dark:text-[#d1c3b4]">{category.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <aside aria-label="About this demonstration" className="w-full border-t border-[#b5a48f]/30">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-12">
          <p className="text-xs leading-6 text-[#756552] dark:text-[#c7b7a3]">{DEMO_NOTICE}</p>
          <p className="mt-2 text-xs leading-6 text-[#756552] dark:text-[#c7b7a3]">{editorial.photographyNotice}</p>
        </div>
      </aside>
    </div>
  );
}

export default HomePage;