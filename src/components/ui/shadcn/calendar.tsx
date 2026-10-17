"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  type DayPickerProps,
  type CustomComponents,
  type WeekNumberProps,
  type ChevronProps,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./";

// Minimal local class name mapping to keep layout/styling predictable without
// depending on getDefaultClassNames (removed in react-day-picker v9)
const baseClassNames = {
  root: "rdp",
  months: "rdp-months",
  month: "rdp-month",
  nav: "rdp-nav",
  nav_button_previous: "rdp-nav_button rdp-nav_button-previous",
  nav_button_next: "rdp-nav_button rdp-nav_button-next",
  month_caption: "rdp-caption",
  dropdowns: "rdp-dropdowns",
  dropdown_root: "rdp-dropdown_root",
  dropdown: "rdp-dropdown",
  caption_label: "rdp-caption_label",
  month_grid: "rdp-month_grid",
  weekdays: "rdp-weekdays",
  weekday: "rdp-weekday",
  week: "rdp-week",
  week_number_header: "rdp-week_number_header",
  week_number: "rdp-week_number",
  day: "rdp-day",
  range_start: "rdp-range_start",
  range_middle: "rdp-range_middle",
  range_end: "rdp-range_end",
  today: "rdp-day_today",
  outside: "rdp-day_outside",
  disabled: "rdp-day_disabled",
  hidden: "rdp-hidden",
} as const;

type CalendarProps = DayPickerProps & {
  className?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  buttonVariant = "ghost",
  components,
  formatters,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-nav_button-next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-nav_button-previous>svg]:rotate-180`,
        className,
      )}
      formatters={formatters}
      classNames={{
        root: cn("w-fit", baseClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          baseClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", baseClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          baseClassNames.nav,
        ),
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          baseClassNames.nav_button_previous,
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          baseClassNames.nav_button_next,
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          baseClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          baseClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          baseClassNames.dropdown_root,
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          baseClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium text-sm",
          baseClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", baseClassNames.month_grid),
        weekdays: cn("flex", baseClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          baseClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", baseClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          baseClassNames.week_number_header,
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          baseClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          baseClassNames.day,
        ),
        range_start: cn("bg-accent rounded-l-md", baseClassNames.range_start),
        range_middle: cn(
          "rounded-none",
          baseClassNames.range_middle,
        ),
        range_end: cn("bg-accent rounded-r-md", baseClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          baseClassNames.today,
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          baseClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          baseClassNames.disabled,
        ),
        hidden: cn("invisible", baseClassNames.hidden),
        ...classNames,
      }}
      components={{
        Caption: (captionProps) => {
          const { DisplayCaption } = captionProps.components;
          const { displayMonth } = captionProps;
          return (
            <div className="flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]">
              <button
                className="flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
                type="button"
              >
                <DisplayCaption displayMonth={displayMonth} />
                <ChevronDownIcon className="size-3.5" />
              </button>
            </div>
          );
        },
        Chevron: ({ className, orientation, ...chevronProps }: ChevronProps) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", className)}
                {...chevronProps}
              />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...chevronProps}
              />
            );
          }

          return (
            <ChevronDownIcon
              className={cn("size-4", className)}
              {...chevronProps}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekProps }: WeekNumberProps) => {
          return (
            <td {...weekProps}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...(components as CustomComponents | undefined),
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const ref = React.useRef<HTMLButtonElement | null>(null);

  return (
    <Button
      {...props}
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        baseClassNames.day,
        className,
      )}
    />
  );
}

export { Calendar, CalendarDayButton };