import { cn } from '@/lib/utils'
import { formatMoney } from '@/utils/money'
import { formatDate } from '@/utils/date'
import { daysUntilDue } from '@/utils/invoice-status'
import type { InvoiceDetail, InvoiceStatus } from '@/types/invoice'

interface Props {
  invoice: InvoiceDetail
  amountPaid: number
  amountDue: number
  effectiveStatus: InvoiceStatus
}

export function InvoiceAmountSummary({ invoice, amountPaid, amountDue, effectiveStatus }: Props) {
  const days = daysUntilDue(invoice.dueDate)
  const isOverdue = effectiveStatus === 'overdue'

  return (
    <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Block
        label="Total"
        value={formatMoney(invoice.amount, invoice.currency)}
      />
      <Block
        label="Paid"
        value={formatMoney(amountPaid, invoice.currency)}
        muted
      />
      <Block
        label="Amount due"
        value={formatMoney(amountDue, invoice.currency)}
        emphasis={amountDue > 0}
        helper={
          isOverdue ? (
            <span className="text-destructive">{Math.abs(days)} days overdue</span>
          ) : amountDue > 0 ? (
            <span className="text-muted-foreground">
              {days >= 0 ? `Due in ${days} days` : `Due ${formatDate(invoice.dueDate)}`}
            </span>
          ) : (
            <span className="text-muted-foreground">Settled</span>
          )
        }
      />
    </div>
  )
}

interface BlockProps {
  label: string
  value: string
  muted?: boolean
  emphasis?: boolean
  helper?: React.ReactNode
}

function Block({ label, value, muted, emphasis, helper }: BlockProps) {
  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          'text-xl font-semibold',
          muted && 'text-muted-foreground',
          emphasis && 'text-foreground'
        )}
      >
        {value}
      </div>
      {helper && <div className="text-xs">{helper}</div>}
    </div>
  )
}
