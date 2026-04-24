'use server'

import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { invoicesTable } from '@/db/schema'
import {
  invoiceInputSchema,
  invoiceUpdateSchema,
  type InvoiceInput,
  type InvoiceUpdate
} from '@/types/invoice'

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function createInvoice(dto: InvoiceInput) {
  const userId = await requireUserId()
  const data = invoiceInputSchema.parse(dto)
  await db.insert(invoicesTable).values({
    ...data,
    userId,
    issuedDate: new Date(data.issuedDate),
    dueDate: new Date(data.dueDate),
    notes: data.notes || null
  })
  revalidatePath('/invoices')
}

export async function getInvoices() {
  const { userId } = await auth()
  if (!userId) return []
  return db.query.invoicesTable.findMany({
    where: eq(invoicesTable.userId, userId),
    with: { client: true },
    orderBy: [desc(invoicesTable.issuedDate)]
  })
}

export async function getInvoiceById(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  return db.query.invoicesTable.findFirst({
    where: and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)),
    with: { client: true }
  })
}

export async function editInvoice(dto: InvoiceUpdate) {
  const userId = await requireUserId()
  const { id, ...data } = invoiceUpdateSchema.parse(dto)
  await db
    .update(invoicesTable)
    .set({
      ...data,
      issuedDate: new Date(data.issuedDate),
      dueDate: new Date(data.dueDate),
      notes: data.notes || null
    })
    .where(and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)))
  revalidatePath('/invoices')
}

export async function deleteInvoice(id: string) {
  const userId = await requireUserId()
  await db.delete(invoicesTable).where(and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)))
  revalidatePath('/invoices')
}
