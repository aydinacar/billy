'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface SidebarContextValue {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({
  defaultCollapsed,
  children
}: {
  defaultCollapsed: boolean
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const toggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      document.cookie = `sidebar-collapsed=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
      return next
    })
  }, [])

  return <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
