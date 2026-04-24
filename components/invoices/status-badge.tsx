import { cn } from '@/lib/utils'
import { invoiceStatusStyles } from '@/constants/invoice'
import type { InvoiceStatus } from '@/types/invoice'

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        invoiceStatusStyles[status]
      )}
    >
      {status}
    </span>
  )
}
