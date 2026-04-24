'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FormDialog } from '@/components/common/form-dialog'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { InvoicePaymentForm } from './invoice-payment-form'
import { deletePayment } from '@/actions/payments'
import { formatMoney } from '@/utils/money'
import { formatDate } from '@/utils/date'
import type { Payment } from '@/types/payment'

interface Props {
  invoiceId: string
  payments: Payment[]
  currency: string
  amountDue: number
}

export function InvoicePaymentsList({ invoiceId, payments, currency, amountDue }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Payment | null>(null)
  const [isDeleting, startDelete] = useTransition()

  function handleSuccess() {
    setOpen(false)
    router.refresh()
  }

  function handleDelete() {
    if (!pendingDelete) return
    const target = pendingDelete
    startDelete(async () => {
      try {
        await deletePayment(target.id)
        setPendingDelete(null)
        router.refresh()
      } catch (error) {
        console.error('Error deleting payment:', error)
        toast.error('Failed to delete payment')
      }
    })
  }

  return (
    <div className="rounded-lg border p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Payments</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={amountDue <= 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Record payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
      ) : (
        <ul className="divide-y">
          {payments.map(p => (
            <li
              key={p.id}
              className="py-2 flex items-center justify-between gap-4 text-sm"
            >
              <span className="w-32 shrink-0">{formatDate(p.paymentDate)}</span>
              <span className="flex-1 text-muted-foreground">{p.paymentMethod || '—'}</span>
              <span className="font-medium">{formatMoney(p.amount, currency)}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPendingDelete(p)}
                aria-label="Delete payment"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Record payment"
        description="Manually log a payment received outside Stripe."
      >
        <InvoicePaymentForm
          invoiceId={invoiceId}
          amountDue={amountDue}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={next => {
          if (!next) setPendingDelete(null)
        }}
        title="Delete payment?"
        description="This will remove the payment record. The invoice status may change."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
