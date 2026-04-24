'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { clientsTable } from '@/db/schema'
import { clientInputSchema, clientUpdateSchema, type ClientInput, type ClientUpdate } from '@/types/client'

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function createClient(dto: ClientInput) {
  const userId = await requireUserId()
  const data = clientInputSchema.parse(dto)
  await db.insert(clientsTable).values({ ...data, userId })
  revalidatePath('/clients')
}

export async function getClients() {
  const { userId } = await auth()
  if (!userId) return []
  return db.query.clientsTable.findMany({
    where: eq(clientsTable.userId, userId)
  })
}

export async function getClientById(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  return db.query.clientsTable.findFirst({
    where: and(eq(clientsTable.id, id), eq(clientsTable.userId, userId))
  })
}

export async function editClient(dto: ClientUpdate) {
  const userId = await requireUserId()
  const { id, ...data } = clientUpdateSchema.parse(dto)
  await db
    .update(clientsTable)
    .set(data)
    .where(and(eq(clientsTable.id, id), eq(clientsTable.userId, userId)))
  revalidatePath('/clients')
}

export async function deleteClient(id: string) {
  const userId = await requireUserId()
  await db.delete(clientsTable).where(and(eq(clientsTable.id, id), eq(clientsTable.userId, userId)))
  revalidatePath('/clients')
}
