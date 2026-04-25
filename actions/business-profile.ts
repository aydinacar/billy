'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { usersTable } from '@/db/schema'
import { businessProfileSchema, type BusinessProfileInput, type UserRow } from '@/types/business-profile'

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function getBusinessProfile(): Promise<UserRow | null> {
  const { userId } = await auth()
  if (!userId) return null
  const row = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, userId)
  })
  return row ?? null
}

export async function updateBusinessProfile(dto: BusinessProfileInput) {
  const userId = await requireUserId()
  const data = businessProfileSchema.parse(dto)

  await db
    .update(usersTable)
    .set({
      businessName: data.businessName || null,
      businessEmail: data.businessEmail || null,
      businessPhone: data.businessPhone || null,
      businessAddress: data.businessAddress || null,
      businessTaxNumber: data.businessTaxNumber || null
    })
    .where(eq(usersTable.clerkId, userId))

  revalidatePath('/settings')
}
