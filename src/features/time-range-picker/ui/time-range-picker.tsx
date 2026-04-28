import { useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/shared/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { cn } from '@/shared/lib/utils'
import { PRESETS, createPresetRange } from '../model/presets'
import type { TimeRange } from '../model/types'

type Props = {
  value: TimeRange
  onChange: (next: TimeRange) => void
  className?: string
}

const itemBase =
  'inline-flex h-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
const itemActive = 'bg-primary text-primary-foreground font-semibold'
const itemIdle = 'text-foreground hover:bg-accent'

export function TimeRangePicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false)
  const isAbsolute = value.preset === undefined

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onChange({ from: range.from, to: range.to })
      setOpen(false)
    }
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-1',
        className,
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-label="Pick date range"
          className={cn(itemBase, 'w-8', isAbsolute ? itemActive : itemIdle)}
        >
          <CalendarIcon className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={isAbsolute ? { from: value.from, to: value.to } : undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div aria-hidden className="mx-1 h-5 w-px bg-border" />

      {PRESETS.map((p) => {
        const active = value.preset === p.key
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(createPresetRange(p.key))}
            className={cn(itemBase, 'px-2.5', active ? itemActive : itemIdle)}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
