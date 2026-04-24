import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type Stripe from 'stripe'

import { getStripe } from '@/lib/stripe'
import { recordPaymentAndSettle } from '@/lib/payment-recorder'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const sig = (await headers()).get('stripe-signature')
  if (!sig) return new Response('Missing signature', { status: 400 })

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook not configured', { status: 500 })

  const body = await req.text()
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoiceId

    if (invoiceId && session.payment_status === 'paid' && session.amount_total != null) {
      await recordPaymentAndSettle({
        invoiceId,
        amount: (session.amount_total / 100).toFixed(2),
        paymentMethod: 'Stripe',
        stripeSessionId: session.id
      })
      revalidatePath(`/invoices/${invoiceId}`)
      revalidatePath('/invoices')
    }
  }

  return new Response('OK')
}
