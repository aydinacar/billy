import { z } from 'zod'
import { invoicesTable } from '@/db/schema'
import type { Client } from './client'

export const invoiceStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const
export type InvoiceStatus = (typeof invoiceStatuses)[number]

export const invoiceInputSchema = z.object({
  clientId: z.uuid('Select a client'),
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  status: z.enum(invoiceStatuses),
  issuedDate: z.string().min(1, 'Select an issue date'),
  dueDate: z.string().min(1, 'Select a due date'),
  notes: z.string().max(500).optional()
})

export const invoiceUpdateSchema = invoiceInputSchema.extend({
  id: z.uuid()
})

export type Invoice = typeof invoicesTable.$inferSelect
export type InvoiceInput = z.infer<typeof invoiceInputSchema>
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>
export type InvoiceWithClient = Invoice & { client: Client }
