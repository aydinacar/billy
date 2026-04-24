import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function DetailCard({ children }: Props) {
  return <dl className="rounded-lg border bg-card p-6 space-y-4">{children}</dl>
}
