'use client'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { SidebarNav } from './SidebarNav'
import { LogoutButton } from './LogoutButton'

interface Props {
  onNavigate?: () => void
  /** Force expanded mode (used inside the mobile sheet). */
  forceExpanded?: boolean
}

export function Sidebar({ onNavigate, forceExpanded }: Props) {
  const { collapsed: collapsedFromContext } = useSidebar()
  const collapsed = !forceExpanded && collapsedFromContext

  return (
    <aside
      className={cn(
        'h-full bg-card border-r flex flex-col transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav
        onNavigate={onNavigate}
        collapsed={collapsed}
      />
      <div className={cn('border-t', collapsed ? 'p-2 flex justify-center' : 'p-3')}>
        <LogoutButton />
      </div>
    </aside>
  )
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        'h-16 flex items-center gap-2 border-b shrink-0',
        collapsed ? 'justify-center px-0' : 'px-6'
      )}
    >
      <Building2 className="h-6 w-6 shrink-0" />
      {!collapsed && <span className="font-semibold">Billy</span>}
    </div>
  )
}
