import { z } from 'zod'

import { invoicesTable, invoiceItemsTable } from '@/db/schema'
import { currencyCodes, invoiceStatuses } from '@/constants/invoice'
import type { Client } from './client'
import type { Payment } from './payment'

export type InvoiceStatus = (typeof invoiceStatuses)[number]
export type Currency = (typeof currencyCodes)[number]

const decimalString = (message: string) => z.string().regex(/^\d+(\.\d{1,2})?$/, message)

export const invoiceItemInputSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200),
  quantity: decimalString('Enter a valid quantity'),
  unitPrice: decimalString('Enter a valid price')
})

export const invoiceInputSchema = z.object({
  clientId: z.uuid('Select a client'),
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50),
  currency: z.enum(currencyCodes),
  status: z.enum(invoiceStatuses),
  issuedDate: z.string().min(1, 'Select an issue date'),
  dueDate: z.string().min(1, 'Select a due date'),
  notes: z.string().max(500).optional(),
  items: z.array(invoiceItemInputSchema).min(1, 'Add at least one line item')
})

export const invoiceUpdateSchema = invoiceInputSchema.extend({
  id: z.uuid()
})

export type Invoice = typeof invoicesTable.$inferSelect
export type InvoiceItem = typeof invoiceItemsTable.$inferSelect
export type InvoiceInput = z.infer<typeof invoiceInputSchema>
export type InvoiceItemInput = z.infer<typeof invoiceItemInputSchema>
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>
export type InvoiceWithClient = Invoice & { client: Client; items: InvoiceItem[] }
export type InvoiceDetail = InvoiceWithClient & { payments: Payment[] }
