import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { invoicesTable, paymentsTable } from '@/db/schema'

interface RecordParams {
  invoiceId: string
  amount: string
  paymentMethod?: string | null
  paymentDate?: Date
  stripeSessionId?: string
}

interface RecordResult {
  skipped: boolean
  paymentId?: string
}

/**
 * Insert a payment row, then mark the parent invoice as `paid` if the
 * sum of payments now covers the invoice total. Idempotent on stripeSessionId.
 */
export async function recordPaymentAndSettle(params: RecordParams): Promise<RecordResult> {
  if (params.stripeSessionId) {
    const existing = await db.query.paymentsTable.findFirst({
      where: eq(paymentsTable.stripeSessionId, params.stripeSessionId)
    })
    if (existing) return { skipped: true, paymentId: existing.id }
  }

  const [inserted] = await db
    .insert(paymentsTable)
    .values({
      invoiceId: params.invoiceId,
      amount: params.amount,
      paymentMethod: params.paymentMethod ?? null,
      paymentDate: params.paymentDate ?? new Date(),
      stripeSessionId: params.stripeSessionId ?? null
    })
    .returning({ id: paymentsTable.id })

  await syncInvoiceStatus(params.invoiceId)

  return { skipped: false, paymentId: inserted.id }
}

/**
 * If the invoice is now fully paid (sum of payments ≥ amount), set status to 'paid'.
 * If it was 'paid' but is no longer fully covered (e.g. a payment was deleted),
 * fall back to 'sent'.
 */
export async function syncInvoiceStatus(invoiceId: string) {
  const invoice = await db.query.invoicesTable.findFirst({
    where: eq(invoicesTable.id, invoiceId)
  })
  if (!invoice) return

  const payments = await db.query.paymentsTable.findMany({
    where: eq(paymentsTable.invoiceId, invoiceId)
  })
  const paid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const fullyPaid = paid >= Number(invoice.amount)

  if (fullyPaid && invoice.status !== 'paid') {
    await db.update(invoicesTable).set({ status: 'paid' }).where(eq(invoicesTable.id, invoiceId))
  } else if (!fullyPaid && invoice.status === 'paid') {
    await db.update(invoicesTable).set({ status: 'sent' }).where(eq(invoicesTable.id, invoiceId))
  }
}
