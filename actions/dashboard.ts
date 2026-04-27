'use server'

import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/db'
import { clientsTable, invoicesTable, paymentsTable } from '@/db/schema'

export interface CurrencyAmount {
  currency: string
  amount: number
}

export interface TrendPoint {
  month: string
  amount: number
}

export interface TopClient {
  id: string
  name: string
  amount: number
}

export interface LatestInvoice {
  id: string
  invoiceNumber: string
  clientName: string
  amount: string
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  createdAt: Date
}

export interface DashboardData {
  hasInvoices: boolean
  metrics: {
    totalRevenue: CurrencyAmount[]
    pending: CurrencyAmount[]
    overdue: CurrencyAmount[]
  }
  trend: { primaryCurrency: string; points: TrendPoint[] } | null
  topClients: { primaryCurrency: string; clients: TopClient[] } | null
  latestInvoices: LatestInvoice[]
}

async function requireUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

function startOfMonth(date: Date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function fillTwelveMonths(rows: { month: string; amount: string }[]): TrendPoint[] {
  const map = new Map(rows.map((r) => [r.month, Number(r.amount)]))
  const start = startOfMonth(new Date())
  start.setMonth(start.getMonth() - 11)
  const points: TrendPoint[] = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(start)
    d.setMonth(start.getMonth() + i)
    const key = monthKey(d)
    points.push({ month: key, amount: map.get(key) ?? 0 })
  }
  return points
}

export async function getDashboardData(): Promise<DashboardData> {
  const userId = await requireUserId()
  const now = new Date()
  const windowStart = startOfMonth(now)
  windowStart.setMonth(windowStart.getMonth() - 11)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(invoicesTable)
    .where(eq(invoicesTable.userId, userId))

  if (count === 0) {
    return {
      hasInvoices: false,
      metrics: { totalRevenue: [], pending: [], overdue: [] },
      trend: null,
      topClients: null,
      latestInvoices: []
    }
  }

  const totalRevenueRows = await db
    .select({
      currency: invoicesTable.currency,
      amount: sql<string>`COALESCE(SUM(${paymentsTable.amount}), 0)`.as('amount')
    })
    .from(paymentsTable)
    .innerJoin(invoicesTable, eq(invoicesTable.id, paymentsTable.invoiceId))
    .where(eq(invoicesTable.userId, userId))
    .groupBy(invoicesTable.currency)

  const totalRevenue: CurrencyAmount[] = totalRevenueRows
    .map((r) => ({ currency: r.currency, amount: Number(r.amount) }))
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const sentRows = await db
    .select({
      currency: invoicesTable.currency,
      amount: invoicesTable.amount,
      dueDate: invoicesTable.dueDate,
      paid: sql<string>`COALESCE((SELECT SUM(${paymentsTable.amount}) FROM ${paymentsTable} WHERE ${paymentsTable.invoiceId} = ${invoicesTable.id}), 0)`.as(
        'paid'
      )
    })
    .from(invoicesTable)
    .where(and(eq(invoicesTable.userId, userId), eq(invoicesTable.status, 'sent')))

  const pendingMap = new Map<string, number>()
  const overdueMap = new Map<string, number>()
  for (const row of sentRows) {
    const due = Math.max(0, Number(row.amount) - Number(row.paid))
    if (due === 0) continue
    const target = row.dueDate.getTime() < now.getTime() ? overdueMap : pendingMap
    target.set(row.currency, (target.get(row.currency) ?? 0) + due)
  }
  const toCurrencyAmounts = (m: Map<string, number>) =>
    [...m.entries()].map(([currency, amount]) => ({ currency, amount })).sort((a, b) => b.amount - a.amount)

  const primaryCurrency = totalRevenue[0]?.currency ?? null

  let trend: DashboardData['trend'] = null
  let topClients: DashboardData['topClients'] = null

  if (primaryCurrency) {
    const trendRows = await db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${paymentsTable.paymentDate}), 'YYYY-MM')`.as('month'),
        amount: sql<string>`SUM(${paymentsTable.amount})`.as('amount')
      })
      .from(paymentsTable)
      .innerJoin(invoicesTable, eq(invoicesTable.id, paymentsTable.invoiceId))
      .where(
        and(
          eq(invoicesTable.userId, userId),
          eq(invoicesTable.currency, primaryCurrency),
          gte(paymentsTable.paymentDate, windowStart)
        )
      )
      .groupBy(sql`date_trunc('month', ${paymentsTable.paymentDate})`)

    trend = { primaryCurrency, points: fillTwelveMonths(trendRows) }

    const clientRows = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        amount: sql<string>`SUM(${paymentsTable.amount})`.as('amount')
      })
      .from(paymentsTable)
      .innerJoin(invoicesTable, eq(invoicesTable.id, paymentsTable.invoiceId))
      .innerJoin(clientsTable, eq(clientsTable.id, invoicesTable.clientId))
      .where(
        and(
          eq(invoicesTable.userId, userId),
          eq(invoicesTable.currency, primaryCurrency),
          gte(paymentsTable.paymentDate, windowStart)
        )
      )
      .groupBy(clientsTable.id, clientsTable.name)
      .orderBy(desc(sql`SUM(${paymentsTable.amount})`))
      .limit(5)

    topClients = {
      primaryCurrency,
      clients: clientRows.map((r) => ({ id: r.id, name: r.name, amount: Number(r.amount) }))
    }
  }

  const latestRows = await db
    .select({
      id: invoicesTable.id,
      invoiceNumber: invoicesTable.invoiceNumber,
      clientName: clientsTable.name,
      amount: invoicesTable.amount,
      currency: invoicesTable.currency,
      status: invoicesTable.status,
      dueDate: invoicesTable.dueDate,
      createdAt: invoicesTable.createdAt
    })
    .from(invoicesTable)
    .innerJoin(clientsTable, eq(clientsTable.id, invoicesTable.clientId))
    .where(eq(invoicesTable.userId, userId))
    .orderBy(desc(invoicesTable.createdAt))
    .limit(5)

  return {
    hasInvoices: true,
    metrics: {
      totalRevenue,
      pending: toCurrencyAmounts(pendingMap),
      overdue: toCurrencyAmounts(overdueMap)
    },
    trend,
    topClients,
    latestInvoices: latestRows
  }
}
