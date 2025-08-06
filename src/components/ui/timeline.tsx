
import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      >
        {children}
      </ol>
    )
  }
)
Timeline.displayName = "Timeline"


const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("relative flex flex-col p-2", className)}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"


const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-0 left-[23px] top-6 w-px bg-border",
      "first:top-3 last:h-3",
      className
    )}
    {...props}
  />
))
TimelineConnector.displayName = "TimelineConnector"


const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4", className)}
    {...props}
  />
))
TimelineHeader.displayName = "TimelineHeader"


const TimelineIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-primary z-10",
      className
    )}
    {...props}
  />
))
TimelineIcon.displayName = "TimelineIcon"


const TimelineTime = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "hidden w-20 text-right text-sm text-muted-foreground md:block",
      className
    )}
    {...props}
  />
))
TimelineTime.displayName = "TimelineTime"


const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold", className)}
    {...props}
  />
))
TimelineTitle.displayName = "TimelineTitle"


const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col rounded-md border bg-card/60 p-3 ml-11 mt-2",
      className
    )}
    {...props}
  />
))
TimelineContent.displayName = "TimelineContent"

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTime,
  TimelineTitle,
  TimelineContent
}
