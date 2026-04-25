'use client'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  permission?: string
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings }
]

interface Props {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: Props) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map(item => (
        <SidebarNavItem
          key={item.to}
          item={item}
          onClick={onNavigate}
        />
      ))}
    </nav>
  )
}

interface NavItemProps {
  item: NavItem
  onClick?: () => void
}

function SidebarNavItem({ item }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.to
  const Icon = item.icon

  return (
    <Link
      href={item.to}
      className={cn(
        'transition-colors hover:text-primary flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        isActive ? 'bg-accent text-accent-foreground font-bold' : 'text-muted-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}
