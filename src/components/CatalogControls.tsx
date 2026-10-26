import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, Filter, Search, Sliders, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { filterOptions } from '@/data/mockData';
import type { Filter as FilterType } from '@/types';

type CatalogControlsProps = {
  value?: FilterType;
  onChange?: (next: FilterType) => void;
  className?: string;
};

const defaultFilter: FilterType = {
  query: '',
  categories: [],
  sizes: [],
  priceRange: [0, 10000],
  featuredOnly: false,
};

const pricePresets = [
  { label: 'Under ₹2,500', value: [0, 2500] as [number, number] },
  { label: '₹2,500 - ₹5,000', value: [2500, 5000] as [number, number] },
  { label: '₹5,000 - ₹10,000', value: [5000, 10000] as [number, number] },
];

const sortOptions = ['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export function CatalogControls({ value = defaultFilter, onChange = () => undefined, className = '' }: CatalogControlsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sort, setSort] = useState('Featured');

  const current = useMemo(() => ({ ...defaultFilter, ...value }), [value]);

  const update = (patch: Partial<FilterType>) => onChange({ ...current, ...patch });

  const toggleList = (key: 'categories' | 'sizes', item: string) => {
    const list = current[key] ?? [];
    update({ [key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item] } as Partial<FilterType>);
  };

  const clearAll = () => onChange(defaultFilter);

  const Controls = ({ compact = false }: { compact?: boolean }) => (
    <div className={cn('flex flex-col gap-4', compact ? 'p-0' : 'p-4')}>
      <div className="flex items-center gap-2">
        <Sliders className="h-4 w-4 text-[#6B451D]" />
        <h3 className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.24em] text-[#211F1C]">
          Filters
        </h3>
      </div>

      <label className="flex items-center gap-2 rounded-sm border border-[#8A806F] bg-[#FFFDF8] px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-[#514B42]" />
        <input
          value={current.query ?? ''}
          onChange={(e) => update({ query: e.target.value })}
          placeholder="Search mojris, embroidery, artisan..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[#211F1C] outline-none placeholder:text-[#514B42]/70"
        />
      </label>

      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">Category</p>
        <div className="flex flex-wrap gap-2">
          {(filterOptions?.categories ?? []).map((item) => {
            const active = (current.categories ?? []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleList('categories', item)}
                className={cn(
                  'min-w-0 rounded-sm border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.18em] transition',
                  active
                    ? 'border-[#6B451D] bg-[#6B451D] text-white'
                    : 'border-[#8A806F] bg-[#FFFDF8] text-[#211F1C] hover:border-[#6B451D] hover:text-[#6B451D]'
                )}
              >
                <span className="block min-w-0 truncate">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">Size</p>
        <div className="flex flex-wrap gap-2">
          {(filterOptions?.sizes ?? []).map((item) => {
            const active = (current.sizes ?? []).includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleList('sizes', item)}
                className={cn(
                  'min-w-0 rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
                  active
                    ? 'border-[#6B451D] bg-[#6B451D] text-white'
                    : 'border-[#8A806F] bg-[#FFFDF8] text-[#211F1C] hover:border-[#6B451D] hover:text-[#6B451D]'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">Price</p>
        <div className="flex flex-col gap-2">
          {pricePresets.map((preset) => {
            const active =
              current.priceRange?.[0] === preset.value[0] && current.priceRange?.[1] === preset.value[1];
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => update({ priceRange: preset.value })}
                className={cn(
                  'rounded-sm border px-3 py-2 text-left text-sm transition',
                  active
                    ? 'border-[#6B451D] bg-[#6B451D] text-white'
                    : 'border-[#8A806F] bg-[#FFFDF8] text-[#211F1C] hover:border-[#6B451D]'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-[#211F1C]">
          <input
            type="checkbox"
            checked={current.featuredOnly ?? false}
            onChange={(e) => update({ featuredOnly: e.target.checked })}
            className="h-4 w-4 accent-[#6B451D]"
          />
          Featured only
        </label>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B451D] hover:text-[#4E3014]"
        >
          Clear
        </button>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#514B42]">Sort</p>
        <div className="relative flex-1">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none rounded-sm border border-[#8A806F] bg-[#FFFDF8] px-3 py-2 pr-8 text-sm text-[#211F1C] outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#514B42]" />
        </div>
      </div>
    </div>
  );

  return (
    <section className={cn('w-full', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[#8A806F] pb-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#514B42]">Catalog</p>
          <h2 className="min-w-0 truncate font-serif text-2xl text-[#211F1C]">Refine your search</h2>
        </div>

        <div className="flex items-center gap-2">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-sm border border-[#8A806F] bg-[#FFFDF8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#211F1C] md:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-[#211F1C]/50 backdrop-blur-[2px]" />
              <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-[#8A806F] bg-[#FAF7F0] p-4 shadow-2xl outline-none">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Dialog.Title className="font-serif text-2xl text-[#211F1C]">Filters</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#8A806F] bg-[#FFFDF8] text-[#211F1C]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
                <Controls compact />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <div className="hidden md:block">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-sm border border-[#8A806F] bg-[#FFFDF8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#211F1C]"
            >
              <Sliders className="h-4 w-4" />
              Active
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden md:block">
        <Controls />
      </div>
    </section>
  );
}

CatalogControls.defaultProps = {
  value: defaultFilter,
  onChange: () => undefined,
  className: '',
};

export default CatalogControls;