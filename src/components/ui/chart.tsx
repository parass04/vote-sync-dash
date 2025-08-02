import * as React from "react"
import { cn } from "@/lib/utils"

// Simple chart context for basic functionality
const ChartContext = React.createContext<{
  config?: Record<string, any>
}>({})

export const useChart = () => {
  const context = React.useContext(ChartContext)
  return context
}

// Simple Chart component wrapper
export const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, any>
  }
>(({ className, config = {}, children, ...props }, ref) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn("chart-container", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
Chart.displayName = "Chart"

// Re-export recharts components for direct use
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
}

// Simple tooltip content component
export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean
    payload?: any[]
    label?: string
    labelFormatter?: (value: any, payload?: any[]) => React.ReactNode
    formatter?: (value: any, name: string, props: any) => [React.ReactNode, string]
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }
>(({ className, active, payload, label, hideLabel, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
      {...props}
    >
      {!hideLabel && label && (
        <div className="font-medium">{label}</div>
      )}
      <div className="grid gap-2">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

// Simple legend component
export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    payload?: any[]
    verticalAlign?: "top" | "bottom"
    hideIcon?: boolean
    nameKey?: string
  }
>(({ className, payload, verticalAlign = "bottom", hideIcon, nameKey, ...props }, ref) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
      {...props}
    >
      {payload.map((item, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          {!hideIcon && (
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
})
ChartLegend.displayName = "ChartLegend"

// Export the main components
export const ChartContainer = Chart
export const ChartTooltip = ({ content, ...props }: any) => (
  <Tooltip content={content} {...props} />
)