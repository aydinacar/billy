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

async function loadInvoiceByPublicToken(token: string) {
  return db.query.invoicesTable.findFirst({
    where: eq(invoicesTable.publicToken, token),
    with: { client: true, payments: true }
  })
}

export async function getPublicInvoice(token: string) {
  const invoice = await db.query.invoicesTable.findFirst({
    where: eq(invoicesTable.publicToken, token),
    with: {
      client: true,
      items: true,
      payments: true,
      user: true
    }
  })
  return invoice ?? null
}

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

export async function createPublicCheckoutSession(token: string): Promise<string> {
  const invoice = await loadInvoiceByPublicToken(token)
  if (!invoice) throw new Error('Invoice not found')
  if (invoice.status === 'cancelled') throw new Error('This invoice has been cancelled')

  const due = getAmountDue(invoice, invoice.payments)
  if (due <= 0) throw new Error('This invoice is already fully paid')

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
    success_url: `${baseUrl}/pay/${token}?checkout=success`,
    cancel_url: `${baseUrl}/pay/${token}?checkout=cancelled`,
    metadata: {
      invoiceId: invoice.id,
      userId: invoice.userId
    }
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL')
  return session.url
}
