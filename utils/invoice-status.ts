import type { Payment } from '@/types/payment'
import type { InvoiceStatus } from '@/types/invoice'

interface OverdueInput {
  status: InvoiceStatus
  dueDate: Date
}

export function isOverdue(invoice: OverdueInput): boolean {
  if (invoice.status !== 'sent') return false
  return invoice.dueDate.getTime() < Date.now()
}

export function getEffectiveStatus(invoice: OverdueInput): InvoiceStatus {
  return isOverdue(invoice) ? 'overdue' : invoice.status
}

export function getAmountPaid(payments: Pick<Payment, 'amount'>[]): number {
  return payments.reduce((sum, p) => sum + Number(p.amount), 0)
}

export function getAmountDue(invoice: { amount: string }, payments: Pick<Payment, 'amount'>[]): number {
  return Math.max(0, Number(invoice.amount) - getAmountPaid(payments))
}

export function daysUntilDue(dueDate: Date): number {
  const ms = dueDate.getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}
