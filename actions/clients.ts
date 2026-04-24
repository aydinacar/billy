'use server'

import { db } from '@/db'
import { ClientDto, CreateClientDto, UpdateClientDto } from '@/types/client'
import { clientsTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
export async function createClient(dto: CreateClientDto) {
  const { userId } = await auth()
  await db
    .insert(clientsTable)
    .values({
      ...dto,
      userId: userId!
    })
    .returning()
  revalidatePath('/clients')
}

export async function getClients() {
  const { userId } = await auth()
  if (!userId) return []
  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.userId, userId)
  })
  return clients
}

export async function getClientById(id: string) {
  const { userId } = await auth()
  if (!userId) return null
  const client = await db.query.clientsTable.findFirst({
    where: and(eq(clientsTable.id, id), eq(clientsTable.userId, userId))
  })
  return client
}

export async function editClient(dto: UpdateClientDto) {
  const { userId } = await auth()
  await db
    .update(clientsTable)
    .set(dto)
    .where(and(eq(clientsTable.id, dto.id), eq(clientsTable.userId, userId!)))
    .returning()
  revalidatePath('/clients')
}

export async function deleteClient(id: string) {
  const { userId } = await auth()
  await db.delete(clientsTable).where(and(eq(clientsTable.id, id), eq(clientsTable.userId, userId!)))
  revalidatePath('/clients')
}
