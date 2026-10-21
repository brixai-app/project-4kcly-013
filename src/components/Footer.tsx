import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Scissors } from 'lucide-react';
import { Separator } from '@/components/ui/shadcn';
import { DEMO_NOTICE, NAV_LINKS } from '@/mock';

export function Footer() {
  const year = new Date().getFullYear();
  const linkClassName =
    'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-[#e5d7c7] underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8c8a6] motion-reduce:transition-none';

  return (
    <footer
      aria-label="Jootiya footer"
      className="w-full border-t border-[#59463f] bg-[#302622] px-6 text-[#f6efe5] lg:px-12"
    >
      <div className="grid w-full grid-cols-1 gap-x-12 gap-y-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-16 lg:py-20">
        <div className="min-w-0 lg:col-span-5">
          <Link
            to="/"
            aria-label="Jootiya home"
            className="inline-block rounded-sm font-['Playfair_Display',Georgia,serif] text-5xl leading-tight tracking-[-0.04em] text-[#f6efe5] transition-colors duration-200 hover:text-[#e8c8a6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8c8a6] motion-reduce:transition-none"
          >
            Jootiya
          </Link>
          <p className="mt-5 max-w-sm font-['Playfair_Display',Georgia,serif] text-2xl leading-relaxed text-[#e5d7c7]">
            Rooted in Rajasthan.
            <br />
            Made to carry a story.
          </p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#cbbbae]">
            A considered celebration of traditional Rajasthani Mojris and the
            handcraft traditions of Jodhpur.
          </p>
          <p className="mt-6 flex items-center gap-2.5 text-xs tracking-wide text-[#e5d7c7]">
            <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
            Jodhpur, Rajasthan, India
          </p>
        </div>

        <nav
          aria-labelledby="footer-explore-heading"
          className="min-w-0 lg:col-span-3"
        >
          <h2
            id="footer-explore-heading"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c8a6]"
          >
            Explore Jootiya
          </h2>
          <ul className="mt-5 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className={linkClassName}>
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
            <li>
              <a href="#footer-mojri-care" className={linkClassName}>
                Caring for your Mojris
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </nav>

        <section
          id="footer-mojri-care"
          aria-labelledby="footer-care-heading"
          className="min-w-0 scroll-mt-24 lg:col-span-4"
        >
          <div className="flex items-center gap-3">
            <Scissors aria-hidden="true" className="h-4 w-4 shrink-0 text-[#e8c8a6]" />
            <h2
              id="footer-care-heading"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c8a6]"
            >
              A little care, a lasting story
            </h2>
          </div>
          <p className="mt-6 text-sm leading-7 text-[#cbbbae]">
            Wipe gently with a soft, dry cloth. Keep your Mojris away from rain
            and direct heat, let them air naturally, and store them in a
            breathable cotton bag between wears.
          </p>
          <p className="mt-4 text-sm leading-7 text-[#cbbbae]">
            Find material-specific care and fit guidance on each product page.
          </p>
        </section>
      </div>

      <Separator className="bg-[#59463f]" />

      <div className="grid min-w-0 gap-5 py-8 lg:grid-cols-12 lg:gap-12">
        <p className="text-xs leading-6 text-[#cbbbae] lg:col-span-5">
          © {year} Jootiya. A browser-only demonstration storefront.
        </p>
        <p className="max-w-3xl text-xs leading-6 text-[#cbbbae] lg:col-span-7">
          <span className="font-semibold text-[#f6efe5]">Demo notice. </span>
          {DEMO_NOTICE}{' '}
          Cart and saved orders stay in your browser. No backend or real payment
          processing is connected.
        </p>
      </div>
    </footer>
  );
}

export default Footer;