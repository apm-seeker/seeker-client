import { Bell, Box, CircleHelp } from 'lucide-react'
import { cn } from '@/shared/lib'

type AppTopbarProps = {
  hasUnreadAlerts?: boolean
}

export function AppTopbar({ hasUnreadAlerts = false }: AppTopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Box className="h-[18px] w-[18px]" />
        </div>
        <span className="text-base font-semibold tracking-tight text-foreground">Seeker</span>
      </div>
      <div className="flex items-center gap-1">
        <IconButton aria-label="Help">
          <CircleHelp className="h-[18px] w-[18px]" />
        </IconButton>
        <IconButton aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          <span
            aria-hidden
            className={cn(
              'absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card',
              !hasUnreadAlerts && 'hidden',
            )}
          />
        </IconButton>
      </div>
    </header>
  )
}

function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
