import { useState } from 'react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/currency'

export interface RevenueChartPoint {
  label: string
  value: number
}

export interface RevenueChartProps {
  points: RevenueChartPoint[]
}

const CHART_HEIGHT = 160 // px
const TOOLTIP_CLEARANCE = 32 // px reserved above the tallest bar for the hover tooltip
const BAR_MAX_HEIGHT = CHART_HEIGHT - TOOLTIP_CLEARANCE

export function RevenueChart({ points }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const max = Math.max(1, ...points.map((point) => point.value))
  const hasRevenue = points.some((point) => point.value > 0)

  return (
    <div>
      <div
        className="flex items-end gap-2"
        style={{ height: CHART_HEIGHT }}
        role="img"
        aria-label={`Faturamento por período: ${points.map((p) => `${p.label} ${formatCurrency(p.value)}`).join(', ')}`}
      >
        {points.map((point, index) => {
          const barHeight = Math.max(2, (point.value / max) * BAR_MAX_HEIGHT)
          const isHovered = hoveredIndex === index

          return (
            <div
              key={`${point.label}-${index}`}
              className="relative flex h-full flex-1 flex-col items-center justify-end"
            >
              {isHovered && (
                <div
                  role="tooltip"
                  className="shadow-elevated absolute z-10 rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white dark:bg-neutral-100 dark:text-neutral-900"
                  style={{ bottom: barHeight + 8 }}
                >
                  {formatCurrency(point.value)}
                </div>
              )}
              <button
                type="button"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                aria-label={`${point.label}: ${formatCurrency(point.value)}`}
                className={cn(
                  'bg-brand-500 hover:bg-brand-600 focus-visible:ring-brand-400 w-full max-w-6 rounded-t-md transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  isHovered && 'bg-brand-600',
                )}
                style={{ height: barHeight }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {points.map((point, index) => (
          <span
            key={`${point.label}-${index}`}
            className="flex-1 text-center text-xs text-neutral-500 dark:text-neutral-400"
          >
            {point.label}
          </span>
        ))}
      </div>
      {!hasRevenue && (
        <p className="mt-3 text-center text-sm text-neutral-400 dark:text-neutral-500">
          Nenhum faturamento neste período.
        </p>
      )}
    </div>
  )
}
