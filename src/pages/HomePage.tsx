import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, MapPin, Scissors, Sparkles } from 'lucide-react';
import { Badge, Button, Separator } from '@/components/ui/shadcn';
import { ProductCard } from '@/components/ProductCard';
import {
  ARTISANS,
  ASSETS,
  CRAFT_STEPS,
  DEMO_NOTICE,
  ROUTES,
  catalogToSearch,
  useMockStore,
} from '@/mock';

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const products = useMockStore((state) => state.products);
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const artisan = ARTISANS[0];
  const careProduct = featured[0] ?? products[0];
  const reveal = {
    initial: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reducedMotion ? 0 : 0.55 },
  };
  const collectionLink = (category: 'Everyday' | 'Celebration' | 'Signature') =>
    `${ROUTES.catalog}?${catalogToSearch({ categories: [category] })}`;

  return (
    <div className="w-full bg-[#faf7f1] text-[#342b26] dark:bg-[#211c19] dark:text-[#f4eade]">
      <section aria-labelledby="home-heading" className="relative w-full overflow-hidden bg-[#eee5d8] dark:bg-[#302720]">
        <div className="grid min-h-[76vh] w-full grid-cols-1 lg:grid-cols-2">
          <motion.div {...reveal} className="flex min-w-0 flex-col justify-center px-6 py-16 sm:px-10 lg:py-24 lg:pl-12 lg:pr-10 xl:pl-[max(3rem,calc((100vw-1600px)/2+3rem))]">
            <p className="mb-7 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] sm:text-xs">
              <span aria-hidden="true" className="h-px w-9 bg-current opacity-50" />
              Rajasthan, at your feet
            </p>
            <h1 id="home-heading" className="whitespace-normal break-words font-serif text-[clamp(3.4rem,6.4vw,7.5rem)] font-normal leading-[1.05] tracking-[-0.055em]">
              Rooted in craft.<br />
              <span className="italic text-[#743942] dark:text-[#e5b7b1]">Made for you.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-8 text-[#695b50] dark:text-[#d2c2b2]">
              Discover the art of the Rajasthani Mojri. Traditional silhouettes, intricate threadwork, and the enduring spirit of Jodhpur.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild className="h-auto min-h-12 rounded-none bg-[#743942] px-7 py-4 text-sm text-white shadow-none transition-colors hover:bg-[#572a32] focus-visible:ring-[#743942] dark:bg-[#e5b7b1] dark:text-[#30201f] dark:hover:bg-[#f0ccc7]">
                <Link to={ROUTES.catalog}>Shop Mojris <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" className="h-auto min-h-12 rounded-none px-3 py-4 text-sm text-[#49382d] underline decoration-[#ad9582] underline-offset-8 hover:bg-[#dfd1c0] dark:text-[#f4eade] dark:hover:bg-[#43362c]">
                <Link to={ROUTES.artisans}>Meet the artisans</Link>
              </Button>
            </div>
            <p className="mt-12 flex items-center gap-2 text-xs tracking-wide text-[#756454] dark:text-[#cbb8a3]">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              Inspired by Jodhpur. Dedicated to tradition.
            </p>
          </motion.div>
          <figure className="relative min-h-[440px] min-w-0 sm:min-h-[560px] lg:min-h-[76vh]">
            <img src={ASSETS.hero} alt="Editorial presentation of a traditional Rajasthani Mojri and its intricate detailing" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
            <figcaption className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 bg-[#faf7f1]/95 px-5 py-4 text-[#49382d] backdrop-blur-sm sm:bottom-8 sm:left-8 sm:right-8">
              <span className="text-[10px] uppercase tracking-[0.2em]">The Jodhpur edit</span>
              <Link to={collectionLink('Signature')} className="inline-flex min-h-8 items-center gap-3 text-xs underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#743942]">
                Explore signature pairs <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="w-full border-y border-[#d8cbbc] bg-[#f5efe5] dark:border-[#504236] dark:bg-[#2b231e]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-5 text-[10px] font-medium uppercase tracking-[0.19em] sm:text-xs lg:px-12">
          <span className="flex items-center gap-2.5"><Scissors aria-hidden="true" className="h-4 w-4" /> Traditional handwork</span>
          <span>Only Mojris. Always Rajasthan.</span>
          <a href="#the-edit" className="inline-flex min-h-8 items-center gap-3 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#743942]">Discover the collection <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" /></a>
        </div>
      </div>

      <section id="the-edit" aria-labelledby="edit-heading" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-6 py-20 lg:px-12 lg:py-28">
        <motion.div {...reveal} className="mb-12 flex w-full flex-wrap items-end justify-between gap-7">
          <div className="min-w-0">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#806958] dark:text-[#c9b29c]">Considered pairs. Lasting impressions.</p>
            <h2 id="edit-heading" className="font-serif text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl">The curated edit</h2>
          </div>
          <Button asChild variant="ghost" className="rounded-none px-0 text-[#743942] underline underline-offset-8 hover:bg-transparent hover:text-[#49232a] dark:text-[#e5b7b1] dark:hover:text-white">
            <Link to={ROUTES.catalog}>View all Mojris <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" /></Link>
          </Button>
        </motion.div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
            {featured.map((product, index) => (
              <motion.div key={product.id} {...reveal} className={`min-w-0 ${index === 0 || index === 3 ? 'lg:col-span-7' : 'lg:col-span-5'} ${index === 1 ? 'lg:pt-24' : ''} ${index === 3 ? 'lg:pt-16' : ''}`}>
                <ProductCard product={product} imageClassName={index === 0 || index === 3 ? 'aspect-[6/5] object-cover' : 'aspect-[4/5] object-cover'} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="border-y border-[#d8cbbc] py-10 text-[#756454] dark:text-[#d2c2b2]">Our next edit is taking shape. Explore the collection to see available pairs.</p>
        )}
        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-[#d8cbbc] pt-7 dark:border-[#504236]">
          <span className="mr-2 text-xs text-[#756454] dark:text-[#d2c2b2]">Find your shade</span>
          <Button asChild variant="outline" className="h-auto rounded-full border-[#cbb9a6] bg-transparent px-5 py-2.5 text-[#49382d] hover:bg-[#eee5d8] dark:border-[#78614e] dark:text-[#f4eade] dark:hover:bg-[#43362c]">
            <Link to={`${ROUTES.catalog}?${catalogToSearch({ colors: ['Sand'] })}`}>Earthy sand</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto rounded-full border-[#cbb9a6] bg-transparent px-5 py-2.5 text-[#743942] hover:bg-[#eee5d8] dark:border-[#78614e] dark:text-[#e5b7b1] dark:hover:bg-[#43362c]">
            <Link to={`${ROUTES.catalog}?${catalogToSearch({ colors: ['Burgundy'] })}`}>Deep burgundy</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto rounded-full border-[#cbb9a6] bg-transparent px-5 py-2.5 text-[#49382d] hover:bg-[#eee5d8] dark:border-[#78614e] dark:text-[#f4eade] dark:hover:bg-[#43362c]">
            <Link to={`${ROUTES.catalog}?${catalogToSearch({ colors: ['Ivory'] })}`}>Quiet ivory</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="heritage-heading" className="w-full bg-[#743942] text-[#fff8ed]">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-28">
          <motion.div {...reveal} className="min-w-0 lg:col-span-5">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#ebc9c1]">A slower kind of beautiful</p>
            <h2 id="heritage-heading" className="font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">Not simply made.<br /><span className="italic">Made with meaning.</span></h2>
            <p className="mt-7 max-w-lg text-sm leading-8 text-[#f0dcd4]">A Mojri carries a language of its own: the sweep of a curved toe, the rhythm of a stitch, the quiet intricacy of thread. Our collection celebrates the making traditions of Rajasthan, one thoughtful detail at a time.</p>
            <Button asChild variant="ghost" className="mt-6 h-auto rounded-none px-0 py-3 text-[#fff8ed] underline underline-offset-8 hover:bg-transparent hover:text-[#ebc9c1]">
              <Link to={ROUTES.artisans}>Explore the story <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" /></Link>
            </Button>
          </motion.div>
          <div className="grid min-w-0 grid-cols-1 gap-x-9 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:pt-2">
            {CRAFT_STEPS.map((step, index) => (
              <motion.div key={step.title} {...reveal} className="min-w-0 border-t border-[#ae777b] pt-5">
                <span className="text-xs tracking-widest text-[#ebc9c1]">0{index + 1}</span>
                <h3 className="mt-4 font-serif text-3xl font-normal">{step.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#f0dcd4]">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="artisan-heading" className="w-full bg-[#eee5d8] dark:bg-[#302720]">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
          <figure className="relative min-h-[420px] min-w-0 sm:min-h-[560px]">
            <img src={ASSETS.heritage} alt="Atelier-inspired editorial celebrating the handwork behind Jodhpur Mojris" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <figcaption className="absolute bottom-6 left-6 right-6 w-fit bg-[#faf7f1]/95 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#49382d] backdrop-blur-sm">Jodhpur · Rajasthan · India</figcaption>
          </figure>
          <motion.div {...reveal} className="flex min-w-0 flex-col justify-center px-6 py-16 sm:px-10 lg:px-12 lg:py-24 xl:pr-[max(3rem,calc((100vw-1600px)/2+3rem))]">
            <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-[#806958] dark:text-[#c9b29c]">Behind every pair, a pair of hands</p>
            <h2 id="artisan-heading" className="font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl lg:text-6xl">The soul of<br /><span className="italic">the Blue City.</span></h2>
            <p className="mt-7 max-w-lg text-sm leading-8 text-[#695b50] dark:text-[#d2c2b2]">Beyond Jodhpur’s blue walls lies a rich tradition of leatherwork and embroidery. Discover the skills, patience, and collaborative spirit that give the Rajasthani Mojri its distinctive character.</p>
            {artisan && (
              <div className="mt-7 max-w-lg border-t border-[#cbb9a6] pt-6 dark:border-[#78614e]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-serif text-2xl">{artisan.name}</p>
                  <Badge variant="outline" className="rounded-none border-[#b49b86] font-normal text-[#695b50] dark:border-[#9e8068] dark:text-[#d2c2b2]">Fictional artisan portrait</Badge>
                </div>
                <p className="mt-2 text-xs leading-6 text-[#756454] dark:text-[#c9b29c]">{artisan.specialty} · {artisan.location}</p>
              </div>
            )}
            <Button asChild className="mt-8 h-auto min-h-12 w-fit rounded-none bg-[#743942] px-6 py-4 text-white shadow-none hover:bg-[#572a32] dark:bg-[#e5b7b1] dark:text-[#30201f] dark:hover:bg-[#f0ccc7]">
              <Link to={ROUTES.artisans}>Meet the artisans <ArrowRight aria-hidden="true" className="ml-4 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="care-heading" className="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-12 lg:py-24">
        <motion.div {...reveal} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <Sparkles aria-hidden="true" className="mb-5 h-5 w-5 text-[#743942] dark:text-[#e5b7b1]" />
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#806958] dark:text-[#c9b29c]">Wear thoughtfully. Keep beautifully.</p>
            <h2 id="care-heading" className="font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">A little care.<br />A longer story.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#695b50] dark:text-[#d2c2b2]">Natural materials deserve a gentle touch. Explore material details, fit guidance, and care notes on every product page.</p>
          </div>
          <div className="min-w-0 self-center lg:col-span-7">
            {careProduct?.care.slice(0, 3).map((instruction, index) => (
              <div key={instruction} className="flex items-start gap-5 border-t border-[#d8cbbc] py-5 dark:border-[#504236]">
                <span className="pt-1 text-xs tracking-widest text-[#806958] dark:text-[#c9b29c]">0{index + 1}</span>
                <p className="text-sm leading-7">{instruction}</p>
              </div>
            ))}
            <Button asChild variant="ghost" className="mt-3 h-auto rounded-none px-0 py-3 text-[#743942] underline underline-offset-8 hover:bg-transparent hover:text-[#49232a] dark:text-[#e5b7b1] dark:hover:text-white">
              <Link to={collectionLink('Everyday')}>Find your everyday pair <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
        <Separator className="my-10 bg-[#d8cbbc] dark:bg-[#504236]" />
        <p className="max-w-3xl text-xs leading-6 text-[#756454] dark:text-[#c9b29c]">{DEMO_NOTICE} This storefront uses client-side mock data and browser storage only; there is no backend or real payment processing.</p>
      </section>
    </div>
  );
}

export default HomePage;