import { pgTable, uuid, text, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Fatura durumları için Enum
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled'])

// 1. USERS Tablosu (Clerk ile senkronize)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(), // Clerk'ten gelen 'user_2...' formatındaki ID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 2. CLIENTS Tablosu
export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  address: text('address'),
  taxNumber: text('tax_number'), // Vergi numarası
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 3. INVOICES Tablosu
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  clientId: uuid('client_id')
    .references(() => clients.id, { onDelete: 'cascade' })
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
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id')
    .references(() => invoices.id, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  paymentMethod: text('payment_method') // Örn: Bank Transfer, Stripe, Cash
})

// --- İLİŞKİLER (Relations) ---

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  invoices: many(invoices)
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  invoices: many(invoices)
}))

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  payments: many(payments)
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] })
}))
