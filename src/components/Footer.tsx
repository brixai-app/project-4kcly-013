import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/shadcn';
import {
  categories,
  DEMO_NOTICE,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  SIZES,
  formatCurrency,
} from '@/mock';

function FooterGuide({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto min-h-11 justify-start whitespace-normal rounded-sm px-0 py-2 text-left text-sm font-normal text-stone-300 underline-offset-4 transition-colors hover:bg-transparent hover:text-white hover:underline focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto border-stone-300 bg-[#f8f4ed] text-stone-900 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 sm:max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="pr-6 font-serif text-3xl font-normal leading-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-3 text-sm leading-7 text-stone-700 dark:text-stone-300">
          {children}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="min-h-11 bg-stone-900 text-stone-50 transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-300">
              Understood
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-800 bg-stone-950 px-6 text-stone-100 lg:px-12">
      <div className="grid w-full grid-cols-1 gap-x-12 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="min-w-0 sm:col-span-2 lg:col-span-6">
          <Link
            to="/"
            aria-label="Jootiya home"
            className="inline-block rounded-sm font-serif text-5xl tracking-tight text-stone-100 transition-colors hover:text-[#dfad8d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-stone-300 sm:text-6xl"
          >
            Jootiya<span className="text-[#dfad8d]">.</span>
          </Link>
          <p className="mt-6 max-w-lg whitespace-normal font-serif text-2xl leading-relaxed text-stone-200 sm:text-3xl">
            The soul of Rajasthan.<br />
            A story in every stitch.
          </p>
          <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400">
            An editorial tribute to the Rajasthani Mojri and Jodhpur’s
            enduring language of hand-cut leather, sculpted toes and patient
            threadwork.
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs tracking-wide text-stone-300">
            <MapPin className="h-4 w-4 shrink-0 text-[#dfad8d]" aria-hidden="true" />
            Inspired by Jodhpur, Rajasthan, India
          </p>
        </div>

        <nav aria-label="Footer collections" className="min-w-0 lg:col-span-3">
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[#dfad8d]">
            The collections
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                asChild
                variant="ghost"
                className="h-auto min-h-11 justify-start whitespace-normal rounded-sm px-0 py-2 text-sm font-normal text-stone-300 transition-colors hover:bg-transparent hover:text-white focus-visible:ring-stone-300"
              >
                <Link to="/catalog" className="gap-2">
                  Explore all Mojris
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </Button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto min-h-11 justify-start whitespace-normal rounded-sm px-0 py-2 text-left text-sm font-normal text-stone-300 underline-offset-4 transition-colors hover:bg-transparent hover:text-white hover:underline focus-visible:ring-stone-300"
                >
                  <Link to={`/catalog?category=${encodeURIComponent(category.id)}`}>
                    {category.name}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-guidance" className="min-w-0 lg:col-span-3">
          <h2 id="footer-guidance" className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-[#dfad8d]">
            A little guidance
          </h2>
          <div className="flex flex-col items-start gap-1">
            <FooterGuide
              label="Shipping information"
              title="From the imagined atelier"
              description="Shipping information for this browser-only demonstration. No physical orders are dispatched."
            >
              <p>
                The checkout supports Indian addresses only. Demo shipping is{' '}
                {formatCurrency(SHIPPING_FEE)} for a non-empty bag below{' '}
                {formatCurrency(FREE_SHIPPING_THRESHOLD)}; bags at or above that
                subtotal receive free simulated shipping.
              </p>
              <p>
                Your bag and checkout show the same calculated shipping total.
                No courier is booked, tracking number issued or delivery date
                promised. Entered contact and address details are not saved to
                persistent order history.
              </p>
            </FooterGuide>

            <FooterGuide
              label="Size & fit guidance"
              title="Find your comfortable fit"
              description="General guidance, not a measured size chart for a physical product."
            >
              <p>
                This collection uses EU sizes {SIZES[0]}–{SIZES[SIZES.length - 1]}.
                Choose your usual closed-shoe size; if you are between sizes,
                choose the larger size. Each product page shows its fit notes
                and available demo inventory.
              </p>
              <p>
                For real footwear, measure both feet while standing and use the
                longer measurement against the maker’s own chart. A Mojri should
                feel secure without pinching the toes. We do not provide invented
                centimetre conversions or guarantee a physical fit.
              </p>
            </FooterGuide>

            <FooterGuide
              label="Caring for your Mojris"
              title="A little care, a longer story"
              description="Gentle, general care advice for traditional leather and embroidered footwear."
            >
              <p>
                Keep Mojris dry and away from prolonged direct sunlight. After
                wearing, let them air naturally before storing them in a
                breathable cotton bag.
              </p>
              <p>
                Remove surface dust gently with a soft, dry cloth. Avoid soaking,
                machine washing, harsh cleaners and direct heat. Treat delicate
                threadwork lightly; do not scrub embellished uppers.
              </p>
              <p>
                Always follow the material-specific care notes on the product
                page. For an actual handmade pair, ask its maker before applying
                leather treatments to silk, velvet or embroidered areas.
              </p>
            </FooterGuide>

            <FooterGuide
              label="Returns & exchanges"
              title="A note on returns"
              description="There are no real purchases, payments, shipments or refunds in this demo."
            >
              <p>
                Before placing a simulated order, you can change sizes by
                removing a bag item and adding your preferred available size.
                Quantity changes and removals are available directly in your bag.
              </p>
              <p>
                Placing a demo order records a fictional order in this browser
                and updates demo stock. It does not charge you or establish a
                real returns policy. Post-order returns, exchanges and refunds
                are not processed in this prototype.
              </p>
            </FooterGuide>
          </div>
        </section>
      </div>

      <div className="flex w-full flex-col gap-6 border-t border-stone-800 py-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <p className="min-w-0 text-xs leading-6 text-stone-400 lg:max-w-3xl">
          <span className="font-medium text-stone-200">An illustrative storefront. </span>
          {DEMO_NOTICE}
        </p>
        <p className="shrink-0 text-xs leading-6 tracking-wide text-stone-400">
          © {new Date().getFullYear()} Jootiya · Craft, considered.
        </p>
      </div>
    </footer>
  );
}

export default Footer;