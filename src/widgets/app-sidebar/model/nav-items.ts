import {
  AlertCircle,
  BarChart3,
  Bell,
  BrainCircuit,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const primaryNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/traces', label: 'Traces', icon: BarChart3 },
  { to: '/errors', label: 'Errors', icon: AlertCircle },
  { to: '/reports', label: 'Reports', icon: BrainCircuit },
  { to: '/alerts', label: 'Alerts', icon: Bell },
]

export const secondaryNavItems: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings },
]
