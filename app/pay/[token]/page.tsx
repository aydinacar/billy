import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Building2, CheckCircle2, XCircle } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney } from '@/utils/money'
import { formatDate } from '@/utils/date'
import { getAmountDue, getAmountPaid, getEffectiveStatus } from '@/utils/invoice-status'
import { getPublicInvoice } from '@/actions/payments'
import { InvoiceStatusBadge } from '@/components/invoices/status-badge'
import { PublicPayButton } from './pay-button'
import { PublicCheckoutToast } from './checkout-toast'

interface Props {
  params: Promise<{ token: string }>
}

export default async function PayPage({ params }: Props) {
  const { token } = await params
  const invoice = await getPublicInvoice(token)
  if (!invoice) notFound()

  const issuer = invoice.user
  const issuerName = issuer.businessName || issuer.name || 'Issuer'
  const effectiveStatus = getEffectiveStatus(invoice)
  const amountPaid = getAmountPaid(invoice.payments)
  const amountDue = getAmountDue(invoice, invoice.payments)
  const isCancelled = invoice.status === 'cancelled'
  const isPaid = amountDue <= 0 && invoice.payments.length > 0
  const lastPayment = invoice.payments
    .slice()
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <Suspense fallback={null}>
        <PublicCheckoutToast />
      </Suspense>

      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-5 w-5" />
          <span className="text-sm">Powered by Billy</span>
        </header>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 p-6 border-b">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-sm text-muted-foreground">From {issuerName}</p>
            </div>
            <InvoiceStatusBadge status={effectiveStatus} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-b">
            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">From</h2>
              <p className="font-medium">{issuerName}</p>
              {issuer.businessEmail && <p className="text-sm">{issuer.businessEmail}</p>}
              {issuer.businessPhone && <p className="text-sm">{issuer.businessPhone}</p>}
              {issuer.businessAddress && (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{issuer.businessAddress}</p>
              )}
              {issuer.businessTaxNumber && (
                <p className="text-xs text-muted-foreground">Tax No: {issuer.businessTaxNumber}</p>
              )}
            </section>

            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">Bill To</h2>
              <p className="font-medium">{invoice.client.name}</p>
              <p className="text-sm">{invoice.client.email}</p>
              {invoice.client.address && (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{invoice.client.address}</p>
              )}
              {invoice.client.taxNumber && (
                <p className="text-xs text-muted-foreground">Tax No: {invoice.client.taxNumber}</p>
              )}
            </section>

            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">Issued</h2>
              <p className="text-sm">{formatDate(invoice.issuedDate)}</p>
            </section>

            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wide text-muted-foreground">Due</h2>
              <p className="text-sm">{formatDate(invoice.dueDate)}</p>
            </section>
          </div>

          <div className="p-6 border-b">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20 text-right">Qty</TableHead>
                  <TableHead className="w-32 text-right">Unit price</TableHead>
                  <TableHead className="w-32 text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map(item => {
                  const lineTotal = Number(item.quantity) * Number(item.unitPrice)
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatMoney(item.unitPrice, invoice.currency)}</TableCell>
                      <TableCell className="text-right">{formatMoney(lineTotal, invoice.currency)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {invoice.notes && (
              <p className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
            )}
          </div>

          <div className="p-6 space-y-4">
            <dl className="space-y-2 ml-auto max-w-xs text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total</dt>
                <dd>{formatMoney(invoice.amount, invoice.currency)}</dd>
              </div>
              {amountPaid > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd>−{formatMoney(amountPaid, invoice.currency)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Amount due</dt>
                <dd>{formatMoney(amountDue, invoice.currency)}</dd>
              </div>
            </dl>

            <div className="flex justify-end pt-2">
              {isCancelled ? (
                <CancelledNotice />
              ) : isPaid ? (
                <PaidNotice
                  date={lastPayment?.paymentDate ?? null}
                  amount={amountPaid}
                  currency={invoice.currency}
                />
              ) : (
                <PublicPayButton token={token} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CancelledNotice() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <XCircle className="h-4 w-4" />
      This invoice has been cancelled.
    </div>
  )
}

function PaidNotice({
  date,
  amount,
  currency
}: {
  date: Date | string | null
  amount: number
  currency: string
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
      <span>
        Paid {formatMoney(amount, currency)}
        {date && ` on ${formatDate(date)}`}
      </span>
    </div>
  )
}
