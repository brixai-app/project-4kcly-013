import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QuantityStepperProps } from '@/types';

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  const clampedValue = Number.isFinite(value) ? Math.min(Math.max(value, min), max) : min;
  const canDecrement = !disabled && clampedValue > min;
  const canIncrement = !disabled && clampedValue < max;

  const handleDecrement = () => {
    if (!canDecrement) return;
    const next = clampedValue - 1;
    onChange(next);
  };

  const handleIncrement = () => {
    if (!canIncrement) return;
    const next = clampedValue + 1;
    onChange(next);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    const nextRaw = event.target.value.replace(/[^\d]/g, '');
    if (nextRaw.length === 0) {
      onChange(min);
      return;
    }
    const parsed = Number.parseInt(nextRaw, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      return;
    }
    const next = Math.min(Math.max(parsed, min), max);
    onChange(next);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    const raw = event.target.value.trim();
    if (raw === '') {
      onChange(min);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      return;
    }
    const next = Math.min(Math.max(parsed, min), max);
    if (next !== clampedValue) {
      onChange(next);
    }
  };

  const ariaLabel = 'Adjust item quantity';

  return (
    <div
      className={cn(
        'inline-flex items-stretch rounded-[16px] border border-[#D9D1C7] bg-white',
        'overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.02)]',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        className={cn(
          'flex h-10 w-9 items-center justify-center',
          'border-r border-[#D9D1C7]/70',
          'transition-colors duration-150',
          canDecrement
            ? 'bg-[#F9F6F2] hover:bg-[#EDE3D8] active:bg-[#E0D2C4] cursor-pointer'
            : 'bg-[#F4EEE6] cursor-not-allowed',
        )}
        aria-label="Decrease quantity"
      >
        <Minus
          className={cn(
            'h-4 w-4',
            canDecrement ? 'text-[#2E2B28]' : 'text-[#B0A79D]',
          )}
        />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={Number.isFinite(clampedValue) ? String(clampedValue) : String(min)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-live="polite"
        aria-disabled={disabled ? 'true' : 'false'}
        className={cn(
          'h-10 w-11 min-w-[2.75rem] px-1.5 text-center',
          'text-sm font-medium text-[#2E2B28]',
          'bg-white focus:outline-none',
          'focus-visible:ring-1 focus-visible:ring-[#8B0000]/60 focus-visible:ring-offset-0',
        )}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        className={cn(
          'flex h-10 w-9 items-center justify-center',
          'border-l border-[#D9D1C7]/70',
          'transition-colors duration-150',
          canIncrement
            ? 'bg-[#F9F6F2] hover:bg-[#EDE3D8] active:bg-[#E0D2C4] cursor-pointer'
            : 'bg-[#F4EEE6] cursor-not-allowed',
        )}
        aria-label="Increase quantity"
      >
        <Plus
          className={cn(
            'h-4 w-4',
            canIncrement ? 'text-[#2E2B28]' : 'text-[#B0A79D]',
          )}
        />
      </button>
    </div>
  );
}

export default QuantityStepper;