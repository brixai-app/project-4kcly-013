import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Sliders, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ProductCategory,
  ProductColorToken,
  ProductFilterState,
  ProductTag,
} from '@/types';
import {
  categories as categoryOptions,
  availableColors,
  availableTags,
} from '@/data/mockData';

export interface FilterDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: ProductFilterState;
  onChange?: (value: ProductFilterState) => void;
}

type SectionKey = 'categories' | 'colors' | 'tags' | 'price' | 'flags';

const DEFAULT_FILTER_STATE: ProductFilterState = {
  query: '',
  categories: [],
  tags: [],
  colors: [],
  priceMin: undefined,
  priceMax: undefined,
  onlyInStock: false,
  onlyFeatured: false,
};

function parseNumberParam(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  if (Number.isNaN(n)) return undefined;
  return n;
}

function useURLFilterState(): [ProductFilterState, (value: ProductFilterState) => void] {
  const location = useLocation();
  const navigate = useNavigate();

  const state = useMemo<ProductFilterState>(() => {
    const params = new URLSearchParams(location.search);
    const categoriesParam = params.get('categories');
    const tagsParam = params.get('tags');
    const colorsParam = params.get('colors');
    const query = params.get('q') ?? '';
    const onlyInStock = params.get('inStock') === '1';
    const onlyFeatured = params.get('featured') === '1';
    const priceMin = parseNumberParam(params.get('priceMin'));
    const priceMax = parseNumberParam(params.get('priceMax'));

    const categories = (categoriesParam ?? '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean) as ProductCategory[];

    const tags = (tagsParam ?? '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean) as ProductTag[];

    const colors = (colorsParam ?? '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean) as ProductColorToken[];

    return {
      query,
      categories,
      tags,
      colors,
      priceMin,
      priceMax,
      onlyInStock,
      onlyFeatured,
    };
  }, [location.search]);

  const setState = (value: ProductFilterState) => {
    const params = new URLSearchParams(location.search);
    if (value.query) params.set('q', value.query);
    else params.delete('q');

    if (value.categories.length > 0) params.set('categories', value.categories.join(','));
    else params.delete('categories');

    if (value.tags.length > 0) params.set('tags', value.tags.join(','));
    else params.delete('tags');

    if (value.colors.length > 0) params.set('colors', value.colors.join(','));
    else params.delete('colors');

    if (typeof value.priceMin === 'number') params.set('priceMin', String(value.priceMin));
    else params.delete('priceMin');

    if (typeof value.priceMax === 'number') params.set('priceMax', String(value.priceMax));
    else params.delete('priceMax');

    if (value.onlyInStock) params.set('inStock', '1');
    else params.delete('inStock');

    if (value.onlyFeatured) params.set('featured', '1');
    else params.delete('featured');

    navigate({ search: params.toString() }, { replace: true });
  };

  return [state, setState];
}

export function FilterDrawer({
  open = false,
  onOpenChange,
  value,
  onChange,
}: FilterDrawerProps) {
  const [urlState, setUrlState] = useURLFilterState();
  const controlled = typeof value !== 'undefined' && typeof onChange === 'function';
  const [internalState, setInternalState] = useState<ProductFilterState>(urlState);
  const [accordion, setAccordion] = useState<Record<SectionKey, boolean>>({
    categories: true,
    colors: true,
    tags: false,
    price: true,
    flags: true,
  });

  useEffect(() => {
    if (!controlled) {
      setInternalState(urlState);
    }
  }, [urlState, controlled]);

  const currentState = controlled ? value ?? DEFAULT_FILTER_STATE : internalState;

  const appliedCount = useMemo(() => {
    const s = currentState ?? DEFAULT_FILTER_STATE;
    let count = 0;
    if (s.categories.length > 0) count += 1;
    if (s.tags.length > 0) count += 1;
    if (s.colors.length > 0) count += 1;
    if (typeof s.priceMin === 'number' || typeof s.priceMax === 'number') count += 1;
    if (s.onlyInStock) count += 1;
    if (s.onlyFeatured) count += 1;
    return count;
  }, [currentState]);

  const isDirty = appliedCount > 0;

  const setState = (next: ProductFilterState) => {
    if (controlled) {
      onChange?.(next);
    } else {
      setInternalState(next);
    }
  };

  const handleToggleArray = <K extends 'categories' | 'colors' | 'tags'>(
    key: K,
    token: ProductCategory | ProductColorToken | ProductTag,
  ) => {
    const s = currentState ?? DEFAULT_FILTER_STATE;
    const arr = [...(s[key] as string[])];
    const idx = arr.indexOf(token);
    if (idx === -1) arr.push(token);
    else arr.splice(idx, 1);
    setState({ ...s, [key]: arr });
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', raw: string) => {
    const s = currentState ?? DEFAULT_FILTER_STATE;
    const trimmed = raw.trim();
    if (!trimmed) {
      const next: ProductFilterState = { ...s, [field]: undefined };
      setState(next);
      return;
    }
    const n = Number(trimmed.replace(/[^\d.]/g, ''));
    if (Number.isNaN(n)) return;
    const next: ProductFilterState = { ...s, [field]: n };
    setState(next);
  };

  const handleFlagToggle = (key: 'onlyInStock' | 'onlyFeatured') => {
    const s = currentState ?? DEFAULT_FILTER_STATE;
    const next: ProductFilterState = { ...s, [key]: !s[key] };
    setState(next);
  };

  const handleApply = () => {
    const s = currentState ?? DEFAULT_FILTER_STATE;
    if (!controlled) {
      setUrlState(s);
    }
    if (onOpenChange) onOpenChange(false);
  };

  const handleReset = () => {
    if (controlled) {
      onChange?.(DEFAULT_FILTER_STATE);
    } else {
      setInternalState(DEFAULT_FILTER_STATE);
      setUrlState(DEFAULT_FILTER_STATE);
    }
  };

  const toggleAccordion = (key: SectionKey) => {
    setAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSectionHeader = (label: string, key: SectionKey) => {
    const openSection = accordion[key];
    return (
      <button
        type="button"
        onClick={() => toggleAccordion(key)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6F675E]">
          {label}
        </span>
        {openSection ? (
          <ChevronUp className="h-4 w-4 text-[#6F675E]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#6F675E]" />
        )}
      </button>
    );
  };

  const s = currentState ?? DEFAULT_FILTER_STATE;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-2 rounded-md border border-[#D9D1C7] bg-[#F9F6F2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2E2B28] transition-colors hover:bg-white',
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {appliedCount > 0 && (
            <span className="ml-1 rounded-sm bg-[#8B0000] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {appliedCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut" />
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#D9D1C7] bg-[#F9F6F2]/95 shadow-2xl backdrop-blur-xl',
            'data-[state=open]:animate-slideInRight data-[state=closed]:animate-slideOutRight',
          )}
        >
          <div className="flex items-center justify-between border-b border-[#D9D1C7] px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D1C7] bg-white">
                <Sliders className="h-3.5 w-3.5 text-[#2E2B28]" />
              </span>
              <div className="flex flex-col">
                <Dialog.Title className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2E2B28]">
                  Refine Selection
                </Dialog.Title>
                <Dialog.Description className="text-xs text-[#6F675E]">
                  Tailor Jootiya to your stride.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D9D1C7] bg-white text-[#2E2B28] transition-colors hover:bg-[#2E2B28] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-3 border-b border-[#D9D1C7]/60 pb-4">
              {renderSectionHeader('Category', 'categories')}
              {accordion.categories && (
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions?.map(cat => {
                    const id = cat?.id as ProductCategory | undefined;
                    if (!id) return null;
                    const isActive = s.categories.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleToggleArray('categories', id)}
                        className={cn(
                          'flex items-center justify-between rounded-md border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em]',
                          isActive
                            ? 'border-[#8B0000] bg-[#8B0000] text-white'
                            : 'border-[#D9D1C7] bg-white text-[#2E2B28] hover:border-[#8B0000]',
                        )}
                      >
                        <span>{cat.label ?? id}</span>
                        {isActive && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 border-b border-[#D9D1C7]/60 pb-4">
              {renderSectionHeader('Color Palette', 'colors')}
              {accordion.colors && (
                <div className="flex flex-wrap gap-2">
                  {availableColors?.map(color => {
                    const token = color?.id as ProductColorToken | undefined;
                    if (!token) return null;
                    const isActive = s.colors.includes(token);
                    const swatchColor =
                      (color.swatchHex as string | undefined) ??
                      '#D9D1C7';
                    return (
                      <button
                        key={token}
                        type="button"
                        onClick={() => handleToggleArray('colors', token)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]',
                          isActive
                            ? 'border-[#8B0000] bg-[#8B0000] text-white'
                            : 'border-[#D9D1C7] bg-white text-[#2E2B28]',
                        )}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/5"
                          style={{ backgroundColor: swatchColor }}
                        />
                        <span>{color.label ?? token}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 border-b border-[#D9D1C7]/60 pb-4">
              {renderSectionHeader('Mood Tagging', 'tags')}
              {accordion.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {availableTags?.map(tag => {
                    const id = tag?.id as ProductTag | undefined;
                    if (!id) return null;
                    const isActive = s.tags.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleToggleArray('tags', id)}
                        className={cn(
                          'rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em]',
                          isActive
                            ? 'border-[#8B0000] bg-[#8B0000] text-white'
                            : 'border-[#D9D1C7] bg-white text-[#6F675E] hover:border-[#8B0000]',
                        )}
                      >
                        {tag.label ?? id}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3 border-b border-[#D9D1C7]/60 pb-4">
              {renderSectionHeader('Price Band', 'price')}
              {accordion.price && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6F675E]">
                      Min
                    </span>
                    <div className="flex items-center rounded-md border border-[#D9D1C7] bg-white px-2.5 py-1.5">
                      <span className="text-xs text-[#6F675E]">₹</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={typeof s.priceMin === 'number' ? s.priceMin : ''}
                        onChange={e => handlePriceChange('priceMin', e.target.value)}
                        className="ml-1 w-full border-none bg-transparent text-xs text-[#2E2B28] outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6F675E]">
                      Max
                    </span>
                    <div className="flex items-center rounded-md border border-[#D9D1C7] bg-white px-2.5 py-1.5">
                      <span className="text-xs text-[#6F675E]">₹</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={typeof s.priceMax === 'number' ? s.priceMax : ''}
                        onChange={e => handlePriceChange('priceMax', e.target.value)}
                        className="ml-1 w-full border-none bg-transparent text-xs text-[#2E2B28] outline-none"
                        placeholder="Any"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {renderSectionHeader('Availability', 'flags')}
              {accordion.flags && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleFlagToggle('onlyInStock')}
                    className={cn(
                      'flex items-center justify-between rounded-md border px-3 py-2.5 text-xs',
                      s.onlyInStock
                        ? 'border-[#8B0000] bg-[#8B0000] text-white'
                        : 'border-[#D9D1C7] bg-white text-[#2E2B28]',
                    )}
                  >
                    <span className="font-medium uppercase tracking-[0.2em]">
                      Only In Stock
                    </span>
                    {s.onlyInStock && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFlagToggle('onlyFeatured')}
                    className={cn(
                      'flex items-center justify-between rounded-md border px-3 py-2.5 text-xs',
                      s.onlyFeatured
                        ? 'border-[#8B0000] bg-[#8B0000] text-white'
                        : 'border-[#D9D1C7] bg-white text-[#2E2B28]',
                    )}
                  >
                    <span className="font-medium uppercase tracking-[0.2em]">
                      Editorial Picks Only
                    </span>
                    {s.onlyFeatured && <Check className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#D9D1C7] bg-[#F9F6F2]/95 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                className={cn(
                  'inline-flex flex-1 items-center justify-center rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                  isDirty
                    ? 'border-[#D9D1C7] bg-white text-[#2E2B28] hover:border-[#8B0000]'
                    : 'cursor-not-allowed border-[#D9D1C7] bg-white text-[#C0B8AE]',
                )}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex flex-[1.4] items-center justify-center rounded-md bg-[#8B0000] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#6F0000]"
              >
                Apply Filters
              </button>
            </div>
            <p className="mt-2 text-[11px] text-[#6F675E]">
              Filters stay in sync with your URL, so you can share this exact edit.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FilterDrawer;