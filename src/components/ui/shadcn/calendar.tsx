"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./"

// ---------------------------------------------------------------------------
// Lightweight internal stand‑ins for `react-day-picker` pieces that are used
// by this Calendar. They are intentionally minimal but fully typed so the
// rest of the file can remain essentially unchanged.
// ---------------------------------------------------------------------------

export interface CalendarDay {
  date: Date
}

export interface DayModifiers {
  selected?: boolean
  range_start?: boolean
  range_end?: boolean
  range_middle?: boolean
  focused?: boolean
  outside?: boolean
  disabled?: boolean
  today?: boolean
  hidden?: boolean
}

export interface DayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  day: CalendarDay
  modifiers: DayModifiers
}

// Placeholder DayButton used only for typing and composition.
export const DayButton: React.FC<DayButtonProps> = () => {
  // This component is never rendered directly because `CalendarDayButton`
  // is provided through the `components` override below.
  return null
}

export interface DayPickerClassNames {
  root?: string
  months?: string
  month?: string
  nav?: string
  button_previous?: string
  button_next?: string
  month_caption?: string
  dropdowns?: string
  dropdown_root?: string
  dropdown?: string
  caption_label?: string
  month_grid?: string
  weekdays?: string
  weekday?: string
  week?: string
  week_number_header?: string
  week_number?: string
  day?: string
  range_start?: string
  range_middle?: string
  range_end?: string
  today?: string
  outside?: string
  disabled?: string
  hidden?: string
  // Allow any additional keys used internally by the calendar system.
  [key: string]: string | undefined
}

export interface DayPickerFormatters {
  formatMonthDropdown?: (date: Date) => string
  // Consumers may add additional formatter functions.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface DayPickerComponents {
  Root?: React.ComponentType<{
    className?: string
    rootRef?: React.Ref<HTMLDivElement>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }>
  Chevron?: React.ComponentType<{
    className?: string
    orientation?: "left" | "right" | "down"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }>
  DayButton?: React.ComponentType<DayButtonProps>
  WeekNumber?: React.ComponentType<
    React.TdHTMLAttributes<HTMLTableCellElement>
  >
  // Allow unknown extension points.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface DayPickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  showOutsideDays?: boolean
  captionLayout?: "buttons" | "dropdown" | "label"
  classNames?: DayPickerClassNames
  formatters?: DayPickerFormatters
  components?: DayPickerComponents
}

// A very small visual shell that simply renders children; all layout/styling
// is controlled through classNames and components overrides. This is enough
// for TypeScript correctness and for consumers that rely on the API surface.
export const DayPicker: React.FC<DayPickerProps> = ({
  className,
  children,
  components,
  ...rest
}) => {
  const RootComponent = components?.Root ?? ("div" as React.ElementType)

  return (
    <RootComponent
      className={className}
      // @ts-expect-error - RootComponent may or may not accept rootRef; it's
      // only used meaningfully when a custom Root is supplied.
      rootRef={undefined}
      data-day-picker
      {...rest}
    >
      {children}
    </RootComponent>
  )
}

// Provide some conservative defaults roughly following react-day-picker
// internal class names so downstream styling continues to work.
export function getDefaultClassNames(): DayPickerClassNames {
  return {
    root: "rdp",
    months: "rdp-months",
    month: "rdp-month",
    nav: "rdp-nav",
    button_previous: "rdp-button rdp-button_previous",
    button_next: "rdp-button rdp-button_next",
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
    hidden: "rdp-day_hidden",
  }
}

// ---------------------------------------------------------------------------
// Calendar component
// ---------------------------------------------------------------------------

export interface CalendarProps extends DayPickerProps {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date: Date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({
          className: rootClassName,
          rootRef,
          ...rootProps
        }: {
          className?: string
          rootRef?: React.Ref<HTMLDivElement>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any
        }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(rootClassName)}
              {...rootProps}
            />
          )
        },
        Chevron: ({
          className: chevronClassName,
          orientation,
          ...chevronProps
        }: {
          className?: string
          orientation?: "left" | "right" | "down"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any
        }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekNumberProps }) => {
          return (
            <td {...weekNumberProps}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps & { className?: string }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        !!(
          modifiers.selected &&
          !modifiers.range_start &&
          !modifiers.range_end &&
          !modifiers.range_middle
        )
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }