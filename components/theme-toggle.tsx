'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true)
    }, 0)

    return () => clearTimeout(timeout)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-md border border-transparent opacity-0">
        <div className="h-5 w-5" />
      </button>
    )
  }
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md transition-colors hover:bg-accent border border-transparent"
      aria-label="Change theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-foreground" />}
    </button>
  )
}
