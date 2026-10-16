"use client"

import * as React from "react"

// A minimal, fully typed stand‑in for `@radix-ui/react-aspect-ratio`.
// It preserves the same basic public API (Root component with `ratio` prop)
// so other code can continue to use <AspectRatio> identically.

export interface AspectRatioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The desired aspect ratio (width / height).
   * Defaults to 16 / 9 to roughly match Radix's example.
   */
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, style, children, ...props }, ref) => {
    const paddingTop = `${100 / ratio}%`

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            width: "100%",
            paddingTop,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }