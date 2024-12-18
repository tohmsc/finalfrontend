"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

interface ExpandableContextType {
  isExpanded: boolean
  toggleExpand: () => void
  expandDirection: "vertical" | "horizontal" | "both"
  expandBehavior: "replace" | "push"
  transitionDuration: number
  easeType: string
  initialDelay: number
  onExpandEnd?: () => void
  onCollapseEnd?: () => void
}

const ExpandableContext = React.createContext<ExpandableContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  expandDirection: "vertical",
  expandBehavior: "replace",
  transitionDuration: 0.3,
  easeType: "easeInOut",
  initialDelay: 0,
})

const useExpandable = () => React.useContext(ExpandableContext)

interface ExpandableProps extends Omit<React.ComponentProps<typeof motion.div>, "children"> {
  children: React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactNode)
  expanded?: boolean
  onToggle?: () => void
  transitionDuration?: number
  easeType?: string
  expandDirection?: "vertical" | "horizontal" | "both"
  expandBehavior?: "replace" | "push"
  initialDelay?: number
  onExpandStart?: () => void
  onExpandEnd?: () => void
  onCollapseStart?: () => void
  onCollapseEnd?: () => void
}

const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      children,
      expanded,
      onToggle,
      transitionDuration = 0.3,
      easeType = "easeInOut",
      expandDirection = "vertical",
      expandBehavior = "replace",
      initialDelay = 0,
      onExpandStart,
      onExpandEnd,
      onCollapseStart,
      onCollapseEnd,
      ...props
    },
    ref
  ) => {
    const [isExpandedInternal, setIsExpandedInternal] = React.useState(false)
    const isExpanded = expanded !== undefined ? expanded : isExpandedInternal
    const toggleExpand = onToggle || (() => setIsExpandedInternal((prev) => !prev))

    React.useEffect(() => {
      if (isExpanded) {
        onExpandStart?.()
      } else {
        onCollapseStart?.()
      }
    }, [isExpanded, onExpandStart, onCollapseStart])

    const contextValue: ExpandableContextType = {
      isExpanded,
      toggleExpand,
      expandDirection,
      expandBehavior,
      transitionDuration,
      easeType,
      initialDelay,
      onExpandEnd,
      onCollapseEnd,
    }

    return (
      <ExpandableContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          initial={false}
          animate={{
            transition: {
              duration: transitionDuration,
              ease: easeType,
              delay: initialDelay,
            },
          }}
          {...props}
        >
          {typeof children === "function" ? children({ isExpanded }) : children}
        </motion.div>
      </ExpandableContext.Provider>
    )
  }
)
Expandable.displayName = "Expandable"

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverToExpand?: boolean
  expandDelay?: number
  collapseDelay?: number
}

const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  ({ className, children, ...props }, ref) => {
    const { isExpanded } = useExpandable()
    const [measureRef] = useMeasure()

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        animate={{
          height: isExpanded ? "auto" : "52px",
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut"
        }}
        {...(props as HTMLMotionProps<"div">)}
      >
        <div ref={measureRef}>{children}</div>
      </motion.div>
    )
  }
)
ExpandableCard.displayName = "ExpandableCard"

const ExpandableCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
ExpandableCardHeader.displayName = "ExpandableCardHeader"

const ExpandableCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
ExpandableCardContent.displayName = "ExpandableCardContent"

const ExpandableCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
ExpandableCardFooter.displayName = "ExpandableCardFooter"

interface ExpandableContentProps extends HTMLMotionProps<"div"> {
  preset?: "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right"
  keepMounted?: boolean
  animateIn?: {
    initial?: { [key: string]: number | string }
    animate?: { [key: string]: number | string }
    exit?: { [key: string]: number | string }
    transition?: { duration?: number; ease?: string }
  }
}

const ExpandableContent = React.forwardRef<HTMLDivElement, ExpandableContentProps>(
  ({ preset, keepMounted = true, animateIn, children, ...props }, ref) => {
    const { isExpanded } = useExpandable()

    const presets: Record<string, {
      initial: { [key: string]: number }
      animate: { [key: string]: number }
      exit: { [key: string]: number }
      transition?: { duration?: number; ease?: string }
    }> = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      "slide-up": {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      },
      "slide-down": {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      },
      "slide-left": {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
      },
      "slide-right": {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
      },
    }

    const animation = preset ? presets[preset] : animateIn

    if (!keepMounted && !isExpanded) {
      return null
    }

    return (
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            ref={ref}
            initial={animation?.initial}
            animate={animation?.animate}
            exit={animation?.exit}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              ...(animation?.transition || {}),
            }}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
ExpandableContent.displayName = "ExpandableContent"

const ExpandableTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { toggleExpand } = useExpandable()

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn("cursor-pointer", className)}
      onClick={toggleExpand}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          toggleExpand()
        }
      }}
      {...props}
    />
  )
})
ExpandableTrigger.displayName = "ExpandableTrigger"

const GridAnimation = () => {
  return (
    <div className="absolute bottom-0 w-full h-24 grid grid-cols-8 gap-0.5">
      {Array.from({ length: 32 }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-neutral-900"
          initial={{ opacity: 0.1 }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

export {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
  GridAnimation,
} 