'use client'
import { Building2 } from 'lucide-react'
import { SidebarNav } from './SidebarNav'
import { LogoutButton } from './LogoutButton'

interface Props {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: Props) {
  return (
    <aside className="h-full md:w-64 bg-card border-r flex flex-col">
      <SidebarBrand />
      <SidebarNav onNavigate={onNavigate} />
      <div className="p-3 border-t">
        <LogoutButton />
      </div>
    </aside>
  )
}

function SidebarBrand() {
  return (
    <div className="h-16 flex items-center gap-2 px-6 border-b shrink-0">
      <Building2 className="h-6 w-6" />
      <span className="font-semibold">Billy</span>
    </div>
  )
}
