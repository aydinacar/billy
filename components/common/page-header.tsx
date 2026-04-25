import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1 min-w-0 wrap-break-word">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm sm:text-base text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0 max-w-full">{action}</div>}
    </div>
  )
}
