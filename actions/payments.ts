'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { invoicesTable, paymentsTable } from '@/db/schema'
import { paymentInputSchema, type PaymentInput } from '@/types/payment'
import { recordPaymentAndSettle, syncInvoiceStatus } from '@/lib/payment-recorder'
import { getAmountDue } from '@/utils/invoice-status'
import { getAppUrl, getStripe } from '@/lib/stripe'

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

async function loadOwnedInvoice(invoiceId: string, userId: string) {
  return db.query.invoicesTable.findFirst({
    where: and(eq(invoicesTable.id, invoiceId), eq(invoicesTable.userId, userId)),
    with: { client: true, payments: true }
  })
}

export async function recordPayment(dto: PaymentInput) {
  const userId = await requireUserId()
  const data = paymentInputSchema.parse(dto)
  const invoice = await loadOwnedInvoice(data.invoiceId, userId)
  if (!invoice) throw new Error('Invoice not found')

  await recordPaymentAndSettle({
    invoiceId: data.invoiceId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentDate: new Date(data.paymentDate)
  })

  revalidatePath(`/invoices/${data.invoiceId}`)
  revalidatePath('/invoices')
}

export async function deletePayment(paymentId: string) {
  const userId = await requireUserId()
  const payment = await db.query.paymentsTable.findFirst({
    where: eq(paymentsTable.id, paymentId),
    with: { invoice: true }
  })
  if (!payment || payment.invoice.userId !== userId) throw new Error('Payment not found')

  await db.delete(paymentsTable).where(eq(paymentsTable.id, paymentId))
  await syncInvoiceStatus(payment.invoiceId)

  revalidatePath(`/invoices/${payment.invoiceId}`)
  revalidatePath('/invoices')
}

export async function createCheckoutSession(invoiceId: string): Promise<string> {
  const userId = await requireUserId()
  const invoice = await loadOwnedInvoice(invoiceId, userId)
  if (!invoice) throw new Error('Invoice not found')

  const due = getAmountDue(invoice, invoice.payments)
  if (due <= 0) throw new Error('Invoice is already fully paid')

  const stripe = getStripe()
  const baseUrl = getAppUrl()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: invoice.client.email,
    line_items: [
      {
        price_data: {
          currency: invoice.currency.toLowerCase(),
          product_data: {
            name: `Invoice ${invoice.invoiceNumber}`,
            description: `Payment for invoice ${invoice.invoiceNumber}`
          },
          unit_amount: Math.round(due * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${baseUrl}/invoices/${invoice.id}?checkout=success`,
    cancel_url: `${baseUrl}/invoices/${invoice.id}?checkout=cancelled`,
    metadata: {
      invoiceId: invoice.id,
      userId
    }
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}
