import { z } from 'zod'
import { clientsTable } from '@/db/schema'

export const clientInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(50),
  email: z.email('Invalid email'),
  taxNumber: z.string().max(50).optional(),
  address: z.string().max(200).optional()
})

export const clientUpdateSchema = clientInputSchema.extend({
  id: z.uuid()
})

export type Client = typeof clientsTable.$inferSelect
export type ClientInput = z.infer<typeof clientInputSchema>
export type ClientUpdate = z.infer<typeof clientUpdateSchema>
