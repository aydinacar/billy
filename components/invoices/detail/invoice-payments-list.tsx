import { formatMoney } from '@/utils/money'
import { formatDate } from '@/utils/date'
import type { Payment } from '@/types/payment'

interface Props {
  payments: Payment[]
  currency: string
}

export function InvoicePaymentsList({ payments, currency }: Props) {
  return (
    <div className="rounded-lg border p-6 space-y-3">
      <h2 className="font-medium">Payments</h2>
      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
      ) : (
        <ul className="divide-y">
          {payments.map(p => (
            <li
              key={p.id}
              className="py-2 flex items-center justify-between gap-4 text-sm"
            >
              <span>{formatDate(p.paymentDate)}</span>
              <span className="text-muted-foreground">{p.paymentMethod || '—'}</span>
              <span className="font-medium">{formatMoney(p.amount, currency)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
