import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, Sparkles, ArrowRight, Search, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { mockData } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';

type SectionProps = { className?: string };

const products = mockData?.products ?? [];
const categories = mockData?.categories ?? [];
const collections = mockData?.collections ?? [];
const editorialSections = mockData?.editorialSections ?? [];

function SectionShell({ children, className = '' }: React.PropsWithChildren<SectionProps>) {
  return <section className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</section>;
}

function HomeExperience({ className = '' }: SectionProps = {}) {
  const featured = products?.filter((p) => p?.featured)?.slice(0, 5) ?? products?.slice(0, 5) ?? [];
  const [activeCollection, setActiveCollection] = useState<string>('All');
  const filtered = useMemo(
    () => (activeCollection === 'All' ? featured : featured.filter((p) => (p?.collection ?? p?.category ?? '') === activeCollection)),
    [activeCollection, featured]
  );

  return (
    <div className={cn('space-y-16 pb-16', className)}>
      <div className="relative overflow-hidden border-b border-[#CBBCA7] bg-[#F6F0E5]">
        <SectionShell className="relative py-8 sm:py-10 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#6F6254]">Jodhpur atelier / authentic mojris</p>
              <h1 className="max-w-3xl font-['Playfair_Display'] text-5xl font-light tracking-tight text-[#17130F] sm:text-6xl lg:text-7xl">
                Handcrafted Mojris, composed like an editorial archive.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6F6254] sm:text-lg">
                Ivory textures, terracotta leather, and deep indigo contrast frame a luxury storefront for the season&apos;s most refined Rajasthani footwear.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm bg-[#A8472A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#84351F]">
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#17130F] transition-colors hover:border-[#A8472A]">
                  Shop Latest Drop
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative overflow-hidden border border-[#CBBCA7] bg-[#FFFDF8]"
            >
              <img
                src={editorialSections?.[0]?.image ?? products?.[0]?.image ?? 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'}
                alt={editorialSections?.[0]?.title ?? 'Editorial lookbook'}
                crossOrigin="anonymous"
                className="h-[34rem] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-[#CBBCA7] bg-[#FFFDF8]/95 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F6254]">Lookbook 01</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#17130F]">
                  A tactile composition of hand-stitched silhouettes, ceremonial finishes, and heirloom craft.
                </p>
              </div>
            </motion.div>
          </div>
        </SectionShell>
      </div>

      <SectionShell>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F6254]">Featured drop</p>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light text-[#17130F] sm:text-4xl">Selected pairs</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#A8472A] sm:inline-flex">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered?.map((product) => <ProductCard key={product?.id ?? product?.slug} product={product} />)}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-[#CBBCA7] bg-[#FFFDF8] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F6254]">Collection index</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['All', ...collections].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveCollection(item)}
                  className={cn(
                    'min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                    activeCollection === item
                      ? 'border-[#A8472A] bg-[#A8472A] text-white'
                      : 'border-[#CBBCA7] bg-transparent text-[#17130F] hover:border-[#A8472A]'
                  )}
                >
                  <span className="block max-w-[12rem] truncate">{item}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              {categories?.slice(0, 4)?.map((category) => (
                <Link key={category} to="/shop" className="flex items-center justify-between border-b border-[#CBBCA7] pb-3 text-sm text-[#17130F]">
                  <span className="min-w-0 truncate">{category}</span>
                  <ChevronRight className="h-4 w-4 text-[#6F6254]" />
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {editorialSections?.slice(1, 3)?.map((section) => (
              <article key={section?.id} className="overflow-hidden border border-[#CBBCA7] bg-[#FFFDF8]">
                <img src={section?.image ?? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'} alt={section?.title ?? 'Craft section'} crossOrigin="anonymous" className="h-72 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F6254]">{section?.eyebrow ?? 'Craft'}</p>
                  <h3 className="mt-2 font-['Playfair_Display'] text-2xl font-light text-[#17130F]">{section?.title ?? 'Atelier notes'}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6F6254]">{section?.body ?? ''}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {products?.slice(0, 4)?.map((product) => (
              <ProductCard key={product?.id ?? product?.slug} product={product} />
            ))}
          </div>
          <div className="border border-[#CBBCA7] bg-[#0a0a0a] p-6 text-[#FFFDF8]">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#CBBCA7]">Manifesto</p>
            <h2 className="mt-4 font-['Playfair_Display'] text-4xl font-light leading-tight">Crafted in Jodhpur, worn everywhere.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#E8DDCF]">
              Each pair is shaped by hand, finished with patience, and designed to move from ceremony to city with quiet confidence.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-[#A8472A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFFDF8]">Heirloom quality, modern rhythm</span>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <div className="border border-[#CBBCA7] bg-[#FFFDF8] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F6254]">Newsletter</p>
              <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-light text-[#17130F]">Receive the next drop.</h2>
            </div>
            <div className="flex w-full max-w-xl items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#CBBCA7] bg-[#F6F0E5] px-4 py-3">
                <Search className="h-4 w-4 text-[#6F6254]" />
                <input className="w-full bg-transparent text-sm text-[#17130F] outline-none placeholder:text-[#6F6254]" placeholder="Email address" />
              </div>
              <button type="button" className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[#A8472A] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white hover:bg-[#84351F]">
                Join <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

function CatalogExperience({ className = '' }: SectionProps = {}) {
  const [sort, setSort] = useState('Featured');
  const [visible, setVisible] = useState(8);
  const [category, setCategory] = useState('All');
  const catalog = useMemo(() => {
    const list = [...products];
    if (category !== 'All') return list.filter((p) => (p?.category ?? '') === category);
    return list;
  }, [category]);

  const sorted = useMemo(() => {
    const list = [...catalog];
    if (sort === 'Price: Low to High') list.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
    if (sort === 'Price: High to Low') list.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
    return list;
  }, [catalog, sort]);

  return (
    <div className={cn('space-y-8 pb-16', className)}>
      <SectionShell className="pt-6">
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-[#CBBCA7] bg-[#FFFDF8] p-5">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#A8472A]" />
              <h2 className="min-w-0 truncate font-['Playfair_Display'] text-2xl font-light text-[#17130F]">Filters</h2>
            </div>
            <div className="mt-5 flex flex-col gap-2.5">
              {['All', ...categories].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    'min-w-0 rounded-sm border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
                    category === item ? 'border-[#A8472A] bg-[#A8472A] text-white' : 'border-[#CBBCA7] text-[#17130F] hover:border-[#A8472A]'
                  )}
                >
                  <span className="block truncate">{item}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-[#CBBCA7] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6F6254]">Catalog</p>
                <h1 className="mt-2 font-['Playfair_Display'] text-4xl font-light text-[#17130F]">Mojri archive</h1>
              </div>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button type="button" className="inline-flex items-center gap-2 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#17130F]">
                    Sort <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="z-50 min-w-52 border border-[#CBBCA7] bg-[#FFFDF8] p-2 shadow-lg">
                    {['Featured', 'Price: Low to High', 'Price: High to Low'].map((item) => (
                      <DropdownMenu.Item key={item} onSelect={() => setSort(item)} className="cursor-pointer rounded-sm px-3 py-2 text-sm text-[#17130F] outline-none hover:bg-[#F6F0E5]">
                        {item}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sorted?.slice(0, visible)?.map((product) => <ProductCard key={product?.id ?? product?.slug} product={product} />)}
            </div>
            {visible < sorted.length && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => setVisible((v) => v + 4)} className="inline-flex items-center gap-2 rounded-sm border border-[#CBBCA7] bg-[#FFFDF8] px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#17130F] hover:border-[#A8472A]">
                  Load more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

export { HomeExperience, CatalogExperience };
export default HomeExperience;