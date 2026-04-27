import type { LucideIcon } from 'lucide-react'

import { formatMoney } from '@/utils/money'
import type { CurrencyAmount } from '@/actions/dashboard'

interface Props {
  title: string
  icon: LucideIcon
  amounts: CurrencyAmount[]
  emptyLabel?: string
}

export function MetricCard({ title, icon: Icon, amounts, emptyLabel = 'No data' }: Props) {
  return (
    <div className="rounded-lg border bg-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      {amounts.length === 0 ? (
        <p className="text-2xl font-bold text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-1">
          {amounts.map((row) => (
            <p key={row.currency} className="text-2xl font-bold tracking-tight">
              {formatMoney(row.amount, row.currency)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
