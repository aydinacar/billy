import { ThemeToggle } from '../theme-toggle'
import { MobileMenu } from './MobileMenu'
import { UserButton } from '@clerk/nextjs'

export function Topbar() {
  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <MobileMenu />
      </div>
      <UserButton />
    </header>
  )
}
