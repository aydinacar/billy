import { paymentsTable } from '@/db/schema'

export type Payment = typeof paymentsTable.$inferSelect
