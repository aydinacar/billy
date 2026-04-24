import { cn } from '@/lib/utils'
import type { InvoiceStatus } from '@/types/invoice'

const styles: Record<InvoiceStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        styles[status]
      )}
    >
      {status}
    </span>
  )
}
