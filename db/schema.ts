import { pgTable, uuid, text, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Fatura durumları için Enum
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled'])

// 1. USERS Tablosu (Clerk ile senkronize)
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(), // Clerk'ten gelen 'user_2...' formatındaki ID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 2. CLIENTS Tablosu
export const clientsTable = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => usersTable.clerkId, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  address: text('address'),
  taxNumber: text('tax_number'), // Vergi numarası
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 3. INVOICES Tablosu
export const invoicesTable = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => usersTable.clerkId, { onDelete: 'cascade' })
    .notNull(),
  clientId: uuid('client_id')
    .references(() => clientsTable.id, { onDelete: 'cascade' })
    .notNull(),
  invoiceNumber: text('invoice_number').notNull(), // Örn: INV-2024-001
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  status: invoiceStatusEnum('status').default('draft').notNull(),
  dueDate: timestamp('due_date').notNull(),
  issuedDate: timestamp('issued_date').defaultNow().notNull(),
  notes: text('notes')
})

// 4. PAYMENTS Tablosu
export const paymentsTable = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id')
    .references(() => invoicesTable.id, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  paymentMethod: text('payment_method') // Örn: Bank Transfer, Stripe, Cash
})

// --- İLİŞKİLER (Relations) ---

export const usersRelations = relations(usersTable, ({ many }) => ({
  clients: many(clientsTable),
  invoices: many(invoicesTable)
}))

export const clientsRelations = relations(clientsTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [clientsTable.userId], references: [usersTable.id] }),
  invoices: many(invoicesTable)
}))

export const invoicesRelations = relations(invoicesTable, ({ one, many }) => ({
  client: one(clientsTable, { fields: [invoicesTable.clientId], references: [clientsTable.id] }),
  user: one(usersTable, { fields: [invoicesTable.userId], references: [usersTable.id] }),
  payments: many(paymentsTable)
}))

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  invoice: one(invoicesTable, { fields: [paymentsTable.invoiceId], references: [invoicesTable.id] })
}))
