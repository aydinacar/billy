import type { ReactNode } from 'react'

interface Props {
  label: string
  value: ReactNode
}

export function InfoRow({ label, value }: Props) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}
