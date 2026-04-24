'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { invoicesTable, invoiceItemsTable } from '@/db/schema'
import {
  invoiceInputSchema,
  invoiceUpdateSchema,
  type InvoiceInput,
  type InvoiceItemInput,
  type InvoiceUpdate
} from '@/types/invoice'

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

function computeAmount(items: InvoiceItemInput[]): string {
  const total = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0)
  return total.toFixed(2)
}

export async function createInvoice(dto: InvoiceInput) {
  const userId = await requireUserId()
  const { items, ...rest } = invoiceInputSchema.parse(dto)
  const amount = computeAmount(items)

  const [created] = await db
    .insert(invoicesTable)
    .values({
      ...rest,
      userId,
      amount,
      issuedDate: new Date(rest.issuedDate),
      dueDate: new Date(rest.dueDate),
      notes: rest.notes || null
    })
    .returning({ id: invoicesTable.id })

  await db.insert(invoiceItemsTable).values(
    items.map((item, position) => ({
      invoiceId: created.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      position
    }))
  )

  revalidatePath('/invoices')
}

export async function getInvoices() {
  const { userId } = await auth()
  if (!userId) return []
  return db.query.invoicesTable.findMany({
    where: eq(invoicesTable.userId, userId),
    with: {
      client: true,
      items: { orderBy: [asc(invoiceItemsTable.position)] }
    },
    orderBy: [desc(invoicesTable.issuedDate)]
  })
}

export async function getInvoiceById(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  return db.query.invoicesTable.findFirst({
    where: and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)),
    with: {
      client: true,
      items: { orderBy: [asc(invoiceItemsTable.position)] },
      payments: true
    }
  })
}

export async function editInvoice(dto: InvoiceUpdate) {
  const userId = await requireUserId()
  const { id, items, ...rest } = invoiceUpdateSchema.parse(dto)
  const amount = computeAmount(items)

  await db
    .update(invoicesTable)
    .set({
      ...rest,
      amount,
      issuedDate: new Date(rest.issuedDate),
      dueDate: new Date(rest.dueDate),
      notes: rest.notes || null
    })
    .where(and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)))

  await db.delete(invoiceItemsTable).where(eq(invoiceItemsTable.invoiceId, id))
  await db.insert(invoiceItemsTable).values(
    items.map((item, position) => ({
      invoiceId: id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      position
    }))
  )

  revalidatePath('/invoices')
}

export async function deleteInvoice(id: string) {
  const userId = await requireUserId()
  await db.delete(invoicesTable).where(and(eq(invoicesTable.id, id), eq(invoicesTable.userId, userId)))
  revalidatePath('/invoices')
}
