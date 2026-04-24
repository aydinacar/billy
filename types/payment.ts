import { z } from 'zod'

import { paymentsTable } from '@/db/schema'

const decimalString = (message: string) => z.string().regex(/^\d+(\.\d{1,2})?$/, message)

export const paymentInputSchema = z.object({
  invoiceId: z.uuid(),
  amount: decimalString('Enter a valid amount'),
  paymentDate: z.string().min(1, 'Select a payment date'),
  paymentMethod: z.string().max(50).optional()
})

export type Payment = typeof paymentsTable.$inferSelect
export type PaymentInput = z.infer<typeof paymentInputSchema>
