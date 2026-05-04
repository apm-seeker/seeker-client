import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'

export interface MetricCardProps {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  tone?: 'default' | 'destructive'
  className?: string
}

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = 'default',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-lg border border-border/60 bg-card/60 p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        <Icon className="h-5 w-5 opacity-40" aria-hidden />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'text-4xl font-semibold tabular-nums',
            tone === 'destructive' ? 'text-destructive' : 'text-foreground',
          )}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}
