import { z } from 'zod'
import { usersTable } from '@/db/schema'

export const businessProfileSchema = z.object({
  businessName: z.string().max(100).optional().or(z.literal('')),
  businessEmail: z.email('Invalid email').optional().or(z.literal('')),
  businessPhone: z.string().max(50).optional().or(z.literal('')),
  businessAddress: z.string().max(500).optional().or(z.literal('')),
  businessTaxNumber: z.string().max(50).optional().or(z.literal(''))
})

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>
export type UserRow = typeof usersTable.$inferSelect
