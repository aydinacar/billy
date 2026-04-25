'use client'

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from './sidebar-context'

export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar()
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hidden md:inline-flex"
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <Icon className="h-5 w-5" />
    </Button>
  )
}
