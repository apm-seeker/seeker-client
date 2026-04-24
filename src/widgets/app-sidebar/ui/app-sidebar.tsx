import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib'
import { primaryNavItems, secondaryNavItems, type NavItem } from '../model/nav-items'

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
          'text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-sidebar-active-foreground',
          isActive && 'bg-sidebar-active text-sidebar-active-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden
            className={cn(
              'absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r bg-primary opacity-0 transition-opacity',
              isActive && 'opacity-100',
            )}
          />
          <Icon className="h-[18px] w-[18px] shrink-0" />
          <span className="hidden md:inline">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export function AppSidebar() {
  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
        'w-16 md:w-56 lg:w-60',
      )}
    >
      <nav className="flex flex-1 flex-col gap-1 p-2 pt-4 md:p-3 md:pt-4">
        {primaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
      <nav className="flex flex-col gap-1 border-t border-sidebar-border p-2 md:p-3">
        {secondaryNavItems.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>
    </aside>
  )
}
