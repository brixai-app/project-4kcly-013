"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  type DayPickerSingleProps,
  type DayPickerRangeProps,
  type DayPickerMultipleProps,
  type ClassNames,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./";

export type CalendarProps = (
  | DayPickerSingleProps
  | DayPickerRangeProps
  | DayPickerMultipleProps
) & {
  className?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  /**
   * When true, shows days outside the current month.
   */
  showOutsideDays?: boolean;
};

// Local type for react-day-picker v9 components override API
interface CalendarComponents {
  Caption?: React.ComponentType<{
    displayMonth: Date;
    id?: string;
    locale?: string;
  }>;
  IconLeft?: React.ComponentType<{ className?: string }>;
  IconRight?: React.ComponentType<{ className?: string }>;
  IconDropdown?: React.ComponentType<{ className?: string }>;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  buttonVariant = "ghost",
  components,
  ...props
}: CalendarProps & { components?: CalendarComponents }) {
  const mergedClassNames: ClassNames = {
    months: cn("relative flex flex-col gap-4 md:flex-row"),
    month: cn("flex w-full flex-col gap-4"),
    caption: cn("flex h-[--cell-size] items-center justify-center"),
    caption_label: cn("select-none font-medium text-sm"),
    nav: cn(
      "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1"
    ),
    nav_button: cn(
      buttonVariants({ variant: buttonVariant }),
      "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
    ),
    nav_button_previous: cn(
      buttonVariants({ variant: buttonVariant }),
      "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
    ),
    nav_button_next: cn(
      buttonVariants({ variant: buttonVariant }),
      "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
    ),
    table: cn("w-full border-collapse"),
    head_row: cn("flex"),
    head_cell: cn(
      "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal"
    ),
    row: cn("mt-2 flex w-full"),
    weeknumber: cn("w-[--cell-size] select-none text-[0.8rem]"),
    cell: cn("group/day relative aspect-square h-full w-full p-0 text-center"),
    day: cn(
      "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md"
    ),
    day_today: cn(
      "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none"
    ),
    day_outside: cn(
      "text-muted-foreground aria-selected:text-muted-foreground"
    ),
    day_disabled: cn("text-muted-foreground opacity-50"),
    day_hidden: cn("invisible"),
    day_range_start: cn("bg-accent rounded-l-md"),
    day_range_middle: cn("rounded-none"),
    day_range_end: cn("bg-accent rounded-r-md"),
    ...classNames,
  };

  const mergedComponents: CalendarComponents = {
    Caption: ({
      displayMonth,
      id,
      locale,
      ...captionProps
    }: {
      displayMonth: Date;
      id?: string;
      locale?: string;
      [key: string]: unknown;
    }) => {
      const monthLabel = displayMonth.toLocaleString(locale || "default", {
        month: "long",
        year: "numeric",
      });
      return (
        <div className="flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]">
          <div id={id} aria-live="polite" {...captionProps}>
            <span className="select-none font-medium text-sm">{monthLabel}</span>
          </div>
        </div>
      );
    },
    IconLeft: (iconProps: { className?: string }) => (
      <ChevronLeftIcon className={cn("size-4", iconProps.className)} />
    ),
    IconRight: (iconProps: { className?: string }) => (
      <ChevronRightIcon className={cn("size-4", iconProps.className)} />
    ),
    // Fallback chevron used in some layouts
    IconDropdown: (iconProps: { className?: string }) => (
      <ChevronDownIcon className={cn("size-4", iconProps.className)} />
    ),
    ...components,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-nav_button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-nav_button_previous>svg]:rotate-180`,
        className
      )}
      classNames={mergedClassNames}
      components={mergedComponents as any}
      {...props}
    />
  );
}

interface CalendarDayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  day: Date;
  modifiers: Record<string, boolean>;
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: CalendarDayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };