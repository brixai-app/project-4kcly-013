import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectFieldProps, SelectFieldOption } from '@/types';

export interface InternalOption extends SelectFieldOption {
  index: number;
  isSelected: boolean;
}

export function SelectField({
  label = '',
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  disabled = false,
  error = '',
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fieldId = useId();
  const labelId = label ? `${fieldId}-label` : undefined;
  const listboxId = `${fieldId}-listbox`;
  const errorId = error ? `${fieldId}-error` : undefined;

  const normalizedOptions: InternalOption[] = (options ?? []).map((opt, index) => ({
    ...opt,
    index,
    isSelected: opt.value === value,
  }));

  const selectedOption = normalizedOptions.find(opt => opt.isSelected) ?? null;

  const handleToggle = () => {
    if (disabled) return;
    setOpen(prev => !prev);
    setIsKeyboardNav(false);
  };

  const closeListbox = () => {
    setOpen(false);
    setIsKeyboardNav(false);
  };

  const handleSelect = (option: InternalOption) => {
    if (disabled) return;
    if (option.value !== value) {
      onChange(option.value);
    }
    closeListbox();
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  const activeOrSelectedIndex = (() => {
    if (activeIndex != null && activeIndex >= 0 && activeIndex < normalizedOptions.length) {
      return activeIndex;
    }
    const selectedIdx = normalizedOptions.find(opt => opt.isSelected)?.index;
    if (selectedIdx != null) return selectedIdx;
    if (normalizedOptions.length > 0) return 0;
    return null;
  })();

  const moveActive = (direction: 1 | -1) => {
    if (!normalizedOptions.length) return;
    const current = activeOrSelectedIndex ?? 0;
    let next = current + direction;
    if (next < 0) next = normalizedOptions.length - 1;
    if (next >= normalizedOptions.length) next = 0;
    setActiveIndex(next);
  };

  const ensureActiveVisible = () => {
    if (!listRef.current || activeOrSelectedIndex == null) return;
    const listEl = listRef.current;
    const optionEl = listEl.querySelector<HTMLElement>(
      `[data-index="${activeOrSelectedIndex}"]`
    );
    if (!optionEl) return;
    const { offsetTop, offsetHeight } = optionEl;
    const { scrollTop, clientHeight } = listEl;
    const visibleTop = scrollTop;
    const visibleBottom = scrollTop + clientHeight;
    if (offsetTop < visibleTop) {
      listEl.scrollTop = offsetTop;
    } else if (offsetTop + offsetHeight > visibleBottom) {
      listEl.scrollTop = offsetTop - clientHeight + offsetHeight;
    }
  };

  useEffect(() => {
    if (open) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const listEl = listRef.current;
        if (listEl) {
          const desiredMaxHeight = 280;
          const maxHeight = Math.min(
            desiredMaxHeight,
            spaceBelow > 160 ? spaceBelow - 16 : spaceAbove - 16
          );
          listEl.style.maxHeight = `${Math.max(160, maxHeight)}px`;
        }
      }
      ensureActiveVisible();
    }
  }, [open, activeOrSelectedIndex]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      closeListbox();
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsKeyboardNav(true);
      setOpen(true);
      if (event.key === 'ArrowDown') {
        moveActive(1);
      } else {
        moveActive(-1);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsKeyboardNav(true);
      setOpen(prev => !prev);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsKeyboardNav(true);
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsKeyboardNav(true);
      moveActive(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setIsKeyboardNav(true);
      if (normalizedOptions.length) setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setIsKeyboardNav(true);
      if (normalizedOptions.length) setActiveIndex(normalizedOptions.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsKeyboardNav(true);
      if (activeOrSelectedIndex != null) {
        const opt = normalizedOptions[activeOrSelectedIndex];
        if (opt) handleSelect(opt);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeListbox();
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    } else if (event.key === 'Tab') {
      closeListbox();
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          id={labelId}
          htmlFor={fieldId}
          className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6F675E]"
        >
          {label}
        </label>
        {selectedOption && (
          <span className="text-[11px] font-medium tracking-wide text-[#A0968A]">
            {selectedOption.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      aria-expanded={open}
      aria-haspopup="listbox"
    >
      {renderLabel()}
      <button
        ref={buttonRef}
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={labelId}
        aria-describedby={errorId}
        onClick={handleToggle}
        onKeyDown={handleButtonKeyDown}
        className={cn(
          'group inline-flex w-full items-center justify-between rounded-[16px] border px-4 py-3 text-sm transition-all',
          'bg-[#FFFFFF] border-[#D9D1C7] text-[#2E2B28]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B0000]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F6F2]',
          'data-[open=true]:border-[#8B0000] data-[open=true]:shadow-[0_18px_45px_rgba(15,7,3,0.18)]',
          disabled && 'bg-neutral-100 text-[#A0968A] cursor-not-allowed opacity-70',
          !!error && !disabled && 'border-[#C53030] text-[#2E2B28]'
        )}
        data-open={open ? 'true' : 'false'}
      >
        <span
          className={cn(
            'flex-1 text-left truncate font-medium',
            !selectedOption && 'text-[#A0968A] font-normal'
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="ml-3 flex items-center gap-1 text-[#6F675E]">
          {selectedOption && (
            <span className="hidden text-[10px] uppercase tracking-[0.18em] md:inline-block text-[#A0968A]">
              Refine
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200 ease-out',
              open && 'rotate-180',
              disabled && 'opacity-50'
            )}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 z-30 mt-1 rounded-[18px] border border-[#D9D1C7] bg-[#FFFFFF] shadow-[0_22px_60px_rgba(15,7,3,0.22)]">
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#D9D1C7] to-transparent" />
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            aria-activedescendant={
              activeOrSelectedIndex != null
                ? `${fieldId}-option-${activeOrSelectedIndex}`
                : undefined
            }
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            className="max-h-72 overflow-auto py-2 focus:outline-none scrollbar-thin scrollbar-thumb-[#D9D1C7] scrollbar-track-transparent"
          >
            {normalizedOptions.length === 0 && (
              <li
                className="px-4 py-2 text-sm text-[#A0968A] select-none"
                aria-disabled="true"
              >
                No options available
              </li>
            )}
            {normalizedOptions.map(option => {
              const isActive = activeOrSelectedIndex === option.index;
              const isSelected = option.isSelected;
              return (
                <li
                  key={option.value}
                  id={`${fieldId}-option-${option.index}`}
                  role="option"
                  aria-selected={isSelected}
                  data-index={option.index}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => {
                    if (!isKeyboardNav) setActiveIndex(option.index);
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors',
                    'text-[#2E2B28] hover:bg-[#F9F6F2]',
                    isActive && 'bg-[#F4EDE2]',
                    isSelected && 'font-semibold'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="ml-3 h-4 w-4 text-[#8B0000]" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1 text-xs font-medium text-[#C53030]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectField;