import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Expand, MapPin, Scissors, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Separator,
} from '@/components/ui/shadcn';
import {
  ARTISANS,
  ASSETS,
  CRAFT_STEPS,
  DEMO_NOTICE,
  ROUTES,
  setOverlay,
  useMockStore,
} from '@/mock';

export function ArtisanStoryPage() {
  const reducedMotion = useReducedMotion();
  const products = useMockStore((state) => state.products);
  const lightbox = useMockStore((state) => state.overlays.lightbox);
  const galleryIndex = lightbox !== null && lightbox < ARTISANS.length ? lightbox : null;
  const reveal = {
    initial: reducedMotion ? false as const : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reducedMotion ? 0 : 0.5 },
  };
  const buttonStyle = 'rounded-none bg-[#66343c] px-6 text-[#fffaf2] hover:bg-[#49242b] focus-visible:ring-[#66343c] dark:bg-[#e5c8b0] dark:text-[#30221e] dark:hover:bg-[#f4dfcd]';
  const inner = 'mx-auto w-full max-w-[1600px] px-6 lg:px-12';

  return (
    <article className="w-full bg-[#faf6ee] text-[#342822] dark:bg-[#251e1b] dark:text-[#f5eadd]">
      <section aria-labelledby="heritage-title" className="relative grid min-h-[70vh] w-full lg:grid-cols-2">
        <motion.div {...reveal} className="flex min-w-0 flex-col justify-center px-6 py-20 lg:px-12 lg:py-28 xl:px-20">
          <p className="mb-7 flex items-center gap-3 text-xs uppercase tracking-[0.23em] text-[#754c43] dark:text-[#d8b6a2]">
            <span className="h-px w-10 bg-current" aria-hidden="true" /> The Jodhpur journal
          </p>
          <h1 id="heritage-title" className="break-words font-serif text-5xl leading-[1.06] tracking-tight sm:text-6xl xl:text-8xl">
            A city of stories.<br /><span className="italic text-[#713e45] dark:text-[#dfb6b7]">A craft of hands.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#705c50] dark:text-[#d3bfb0]">
            An exploration of the Rajasthani Mojri: its curved silhouette, patient threadwork and the making traditions that inspire Jootiya.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild className={buttonStyle}>
              <a href="#makers">Meet our imagined makers <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" /></a>
            </Button>
            <span className="flex items-center gap-2 text-sm text-[#705c50] dark:text-[#d3bfb0]">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Jodhpur, Rajasthan
            </span>
          </div>
        </motion.div>
        <figure className="flex min-w-0 flex-col bg-[#e7d9c7] dark:bg-[#382b24]">
          <img src={ASSETS.heritage} alt="Jootiya heritage imagery exploring Mojri making and the Jodhpur atelier" className="min-h-[420px] w-full flex-1 object-cover lg:min-h-[650px]" fetchPriority="high" />
          <figcaption className="px-6 py-4 text-xs leading-5 text-[#574338] dark:text-[#ead8c8]">
            The atelier, imagined. Local imagery where supplied; otherwise an original demo illustration. Not a verified workshop portrait.
          </figcaption>
        </figure>
      </section>

      <section aria-label="About this editorial" className="border-y border-[#d9cabb] bg-[#eee5d8] dark:border-[#554237] dark:bg-[#30251f]">
        <div className={`${inner} flex flex-col gap-4 py-7 md:flex-row md:items-start md:gap-12`}>
          <Badge variant="outline" className="w-fit shrink-0 rounded-full border-[#947260] px-3 py-1 text-[#633f35] dark:border-[#b89b85] dark:text-[#ead4c1]">Fictional editorial</Badge>
          <p className="max-w-4xl text-sm leading-7 text-[#675044] dark:text-[#dcc6b4]">
            {DEMO_NOTICE} These imagined biographies celebrate craft without claiming real maker identities, endorsements or verified workshop histories. Experience figures belong to fictional profiles.
          </p>
        </div>
      </section>

      <section id="makers" aria-labelledby="makers-title" className={`${inner} scroll-mt-24 py-20 lg:py-28`}>
        <motion.header {...reveal} className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="mb-4 text-xs uppercase tracking-[0.23em] text-[#805b4b] dark:text-[#cfad96]">The people in our story</p>
            <h2 id="makers-title" className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">Individual hands.<br />Shared traditions.</h2>
          </div>
          <p className="min-w-0 self-end text-base leading-8 text-[#705c50] dark:text-[#d3bfb0] lg:col-span-5">
            A Mojri brings different skills into conversation. These fictional profiles explore cutting, embroidery and finishing through distinct creative perspectives.
          </p>
        </motion.header>
        <div className="space-y-16 lg:space-y-24">
          {ARTISANS.map((artisan, index) => {
            const collectionCount = products.filter((product) => product.artisanId === artisan.id).length;
            return (
              <motion.section key={artisan.id} {...reveal} aria-labelledby={`maker-${artisan.id}`} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16">
                <figure className={`min-w-0 lg:col-span-7 ${index % 2 ? 'lg:order-2' : ''}`}>
                  <Button variant="ghost" onClick={() => setOverlay('lightbox', index)} aria-label={`Enlarge editorial image for ${artisan.name}`} className="group relative block h-auto w-full overflow-hidden rounded-none bg-[#e9dfd0] p-0 hover:bg-[#dfd0bc] focus-visible:ring-[#713e45]">
                    <img src={artisan.image} alt={`Editorial illustration or supplied image accompanying the fictional profile of ${artisan.name}`} loading="lazy" className="aspect-[5/4] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none" />
                    <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#faf6ee] px-3 py-2 text-xs text-[#492c27] shadow-sm"><Expand className="h-4 w-4" aria-hidden="true" /> View image</span>
                  </Button>
                  <figcaption className="mt-3 text-xs leading-6 text-[#786354] dark:text-[#cdb5a2]">{artisan.specialty} — an imagined atelier study, not a verified portrait.</figcaption>
                </figure>
                <div className={`min-w-0 lg:col-span-5 ${index % 2 ? 'lg:order-1' : ''}`}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-serif text-2xl text-[#96745d] dark:text-[#c4a58e]">0{index + 1}</span>
                    <Badge variant="outline" className="rounded-full border-[#cdb8a4] text-[#705447] dark:text-[#dfc5b0]">Fictional maker</Badge>
                  </div>
                  <h3 id={`maker-${artisan.id}`} className="break-words font-serif text-4xl sm:text-5xl">{artisan.name}</h3>
                  <p className="mt-4 text-sm uppercase leading-6 tracking-[0.12em] text-[#793f47] dark:text-[#dfb6b7]">{artisan.specialty}</p>
                  <p className="mt-3 text-sm text-[#705c50] dark:text-[#d3bfb0]">{artisan.location} · {artisan.experience} years in this fictional biography</p>
                  <Separator className="my-6 bg-[#decebc] dark:bg-[#594438]" />
                  <p className="text-base leading-8 text-[#705c50] dark:text-[#d3bfb0]">{artisan.biography}</p>
                  <Button asChild variant="link" className="mt-6 h-auto whitespace-normal p-0 text-left text-[#713e45] underline-offset-8 dark:text-[#e5bdba]">
                    <Link to={`${ROUTES.catalog}?artisan=${encodeURIComponent(artisan.id)}`}>
                      Explore {artisan.name.split(' ')[0]}’s Mojris ({collectionCount}) <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </motion.section>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="process-title" className="w-full bg-[#eee5d8] py-20 dark:bg-[#30251f] lg:py-28">
        <div className={inner}>
          <motion.header {...reveal} className="mb-12">
            <p className="mb-4 text-xs uppercase tracking-[0.23em] text-[#805b4b] dark:text-[#cfad96]">From material to Mojri</p>
            <h2 id="process-title" className="font-serif text-4xl sm:text-5xl lg:text-6xl">Patience, in four movements.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#705c50] dark:text-[#d3bfb0]">An illustrated overview, rather than a claim about a particular workshop. Techniques and materials vary between makers and designs.</p>
          </motion.header>
          <ol className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {CRAFT_STEPS.map((step, index) => (
              <motion.li key={step.title} {...reveal} className="min-w-0">
                <div className="mb-6 flex aspect-[4/3] items-center justify-center border border-[#d7c4ad] bg-[#f8f1e6] dark:border-[#654b3c] dark:bg-[#392c24]">
                  <svg viewBox="0 0 240 170" className="h-40 w-full text-[#855c48] dark:text-[#d6b394]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {index === 0 && <><path d="M58 126 78 45l70-13 38 52-33 53Z" fill="currentColor" fillOpacity=".07" /><path d="m76 117 75-67M91 130l75-67" strokeDasharray="4 5" /><circle cx="64" cy="128" r="11" /><circle cx="82" cy="143" r="11" /></>}
                    {index === 1 && <><circle cx="120" cy="85" r="57" /><circle cx="120" cy="85" r="50" /><path d="M120 117V57m0 26c-39-35-46 16 0 0Zm0 13c40-35 44 15 0 0Zm0-30c-27-23-29-39 0-35 29-4 27 12 0 35Z" /><path d="m157 40 31-17-18 30" /></>}
                    {index === 2 && <><path d="M62 120q-12-48 31-76 47-28 69 11l18 60q-54 32-118 5Z" fill="currentColor" fillOpacity=".07" /><path d="M66 111q57 27 107-3" strokeDasharray="4 5" /><path d="m85 99 6 14m13-10 4 14m15-12 1 14m16-16-2 14m16-19-3 14M173 56l25-28m-12 2 10-1-1 10" /></>}
                    {index === 3 && <><path d="M73 127q-22-37 4-78 23-35 52-14 19 11 29 43l12 39q-44 32-97 10Z" fill="currentColor" fillOpacity=".07" /><path d="M80 111q37-30 75-2M159 35v24m-12-12h24M185 77v16m-8-8h16" /><path d="m99 81 13 12 25-28" /></>}
                  </svg>
                </div>
                <p className="mb-3 text-xs tracking-[0.2em] text-[#805b4b] dark:text-[#cfad96]">0{index + 1}</p>
                <h3 className="font-serif text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#705c50] dark:text-[#d3bfb0]">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className={`${inner} py-20 lg:py-28`}>
        <header className="mb-10 flex w-full flex-wrap items-end justify-between gap-6">
          <div><p className="mb-4 text-xs uppercase tracking-[0.23em] text-[#805b4b] dark:text-[#cfad96]">An atelier notebook</p><h2 id="gallery-title" className="font-serif text-4xl sm:text-5xl">Look a little closer.</h2></div>
          <p className="max-w-sm text-sm leading-7 text-[#705c50] dark:text-[#d3bfb0]">Select an image to enlarge. Use the previous and next controls or arrow keys while the carousel is focused.</p>
        </header>
        <Carousel opts={{ align: 'start', loop: ARTISANS.length > 1 }} aria-label="Fictional artisan editorial gallery" className="w-full">
          <CarouselContent>
            {ARTISANS.map((artisan, index) => (
              <CarouselItem key={artisan.id} className="min-w-0 md:basis-1/2 lg:basis-1/3">
                <figure>
                  <Button variant="ghost" className="block h-auto w-full rounded-none p-0" onClick={() => setOverlay('lightbox', index)} aria-label={`Open ${artisan.specialty} gallery image`}>
                    <img src={artisan.image} alt={`${artisan.specialty}: illustrative imagery for ${artisan.name}'s fictional profile`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                  </Button>
                  <figcaption className="mt-4 text-sm leading-6">{artisan.specialty}<span className="mt-1 block text-xs text-[#786354] dark:text-[#cdb5a2]">Fictional editorial · {artisan.name}</span></figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-7 flex justify-end gap-3"><CarouselPrevious className="static translate-y-0 border-[#bda48e] bg-transparent text-inherit hover:bg-[#eee5d8] dark:hover:bg-[#49362c]" /><CarouselNext className="static translate-y-0 border-[#bda48e] bg-transparent text-inherit hover:bg-[#eee5d8] dark:hover:bg-[#49362c]" /></div>
        </Carousel>
      </section>

      <section aria-labelledby="care-title" className="w-full border-t border-[#decebc] bg-[#f1e9dd] py-20 dark:border-[#594438] dark:bg-[#30251f]">
        <div className={`${inner} grid gap-12 lg:grid-cols-12`}>
          <div className="min-w-0 lg:col-span-5"><p className="mb-4 text-xs uppercase tracking-[0.23em] text-[#805b4b] dark:text-[#cfad96]">Made to be considered</p><h2 id="care-title" className="font-serif text-4xl leading-tight sm:text-5xl">Know the material.<br />Care for the detail.</h2><Button asChild className={`${buttonStyle} mt-8`}><Link to={ROUTES.catalog}>Discover the collection <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
          <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:col-span-7">
            <div><Scissors className="mb-5 h-6 w-6 text-[#805b4b] dark:text-[#cfad96]" aria-hidden="true" /><h3 className="font-serif text-2xl">Material matters</h3><p className="mt-4 text-sm leading-8 text-[#705c50] dark:text-[#d3bfb0]">This demonstration collection describes leather uppers and soles, cotton lining, and cotton or decorative metallic thread. Read each product’s materials and fit notes before choosing; small variations are part of the hand-finished aesthetic.</p></div>
            <div><Sparkles className="mb-5 h-6 w-6 text-[#805b4b] dark:text-[#cfad96]" aria-hidden="true" /><h3 className="font-serif text-2xl">A gentler routine</h3><p className="mt-4 text-sm leading-8 text-[#705c50] dark:text-[#d3bfb0]">Use the care instructions listed on each Mojri’s product page. Leather and embroidery benefit from gentle handling, protection from moisture and breathable storage. Let damp footwear dry naturally, away from direct heat.</p></div>
          </div>
        </div>
      </section>

      <Dialog open={galleryIndex !== null} onOpenChange={(open) => { if (!open) setOverlay('lightbox', null); }}>
        <DialogContent className="max-h-[94dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto border-[#d6c2ae] bg-[#faf6ee] p-5 text-[#342822] dark:border-[#654b3c] dark:bg-[#251e1b] dark:text-[#f5eadd] sm:p-8">
          <DialogHeader className="pr-7 text-left"><DialogTitle className="font-serif text-2xl">The imagined atelier</DialogTitle><DialogDescription className="text-[#705c50] dark:text-[#d3bfb0]">Illustrations or supplied local images accompany fictional biographies. No real artisan endorsement is implied.</DialogDescription></DialogHeader>
          {galleryIndex !== null && (
            <Carousel key={galleryIndex} opts={{ startIndex: galleryIndex, loop: ARTISANS.length > 1 }} aria-label="Enlarged artisan image gallery" className="min-w-0">
              <CarouselContent>
                {ARTISANS.map((artisan) => (
                  <CarouselItem key={artisan.id} className="min-w-0"><figure><img src={artisan.image} alt={`Enlarged editorial imagery for ${artisan.name}, a fictional maker specialising in ${artisan.specialty.toLowerCase()}`} className="h-[52dvh] w-full bg-[#e9dfd0] object-contain" /><figcaption className="mt-4 text-sm leading-6">{artisan.name} · {artisan.specialty}<span className="block text-xs text-[#786354] dark:text-[#cdb5a2]">Fictional editorial image; not a verified workshop portrait.</span></figcaption></figure></CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-5 flex justify-end gap-3"><CarouselPrevious className="static translate-y-0 border-[#bda48e] bg-transparent text-inherit hover:bg-[#eee5d8] dark:hover:bg-[#49362c]" /><CarouselNext className="static translate-y-0 border-[#bda48e] bg-transparent text-inherit hover:bg-[#eee5d8] dark:hover:bg-[#49362c]" /></div>
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}

export default ArtisanStoryPage;