export const paymentMethods = [
  'Bank Transfer',
  'Cash',
  'Credit Card',
  'Stripe',
  'PayPal',
  'Other'
] as const

export type PaymentMethod = (typeof paymentMethods)[number]
