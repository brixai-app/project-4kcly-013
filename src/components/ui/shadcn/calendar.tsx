"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayPicker,
  type DayPickerProps as RDPMemberDayPickerProps,
  type ClassNames,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./";

// React-Day-Picker's exported DayPickerProps can be a type alias that
// isn't directly extendable as an interface. We create a concrete
// interface wrapper so CalendarProps can extend it safely.

type BaseDayPickerProps = RDPMemberDayPickerProps;

export interface CalendarProps extends BaseDayPickerProps {
  className?: string;
  classNames?: ClassNames;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  buttonVariant = "ghost",
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-nav_button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-nav_button_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn("w-fit"),
        months: cn("relative flex flex-col gap-4 md:flex-row"),
        month: cn("flex w-full flex-col gap-4"),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1"
        ),
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50"
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]"
        ),
        caption_label: cn("select-none font-medium text-sm"),
        table: cn("w-full border-collapse"),
        head_row: cn("flex"),
        head_cell: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal"
        ),
        row: cn("mt-2 flex w-full"),
        cell: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child>[data-selected]]:rounded-l-md [&:last-child>[data-selected]]:rounded-r-md"
        ),
        day: cn(
          "inline-flex size-[--cell-size] items-center justify-center rounded-md text-sm font-normal leading-none transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "aria-selected:bg-primary aria-selected:text-primary-foreground",
          "disabled:opacity-50 disabled:pointer-events-none"
        ),
        day_today: cn(
          "bg-accent text-accent-foreground rounded-md aria-selected:rounded-none"
        ),
        day_outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground"
        ),
        day_disabled: cn("text-muted-foreground opacity-50"),
        day_hidden: cn("invisible"),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem] flex items-center justify-center w-[--cell-size]"
        ),
        ...classNames,
      }}
      components={{
        IconLeft: (iconProps) => (
          <ChevronLeftIcon className={cn("size-4", iconProps.className)} />
        ),
        IconRight: (iconProps) => (
          <ChevronRightIcon className={cn("size-4", iconProps.className)} />
        ),
        IconDropdown: (iconProps) => (
          <ChevronDownIcon className={cn("size-4", iconProps.className)} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };