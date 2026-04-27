import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InvoiceStatusBadge } from '@/components/invoices/status-badge'
import { formatMoney } from '@/utils/money'
import { formatDate } from '@/utils/date'
import { getEffectiveStatus } from '@/utils/invoice-status'
import type { LatestInvoice } from '@/actions/dashboard'

interface Props {
  invoices: LatestInvoice[]
}

export function LatestInvoicesCard({ invoices }: Props) {
  return (
    <div className="rounded-lg border bg-card flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Latest Invoices</h3>
        <Link
          href="/invoices"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {invoices.length === 0 ? (
        <p className="px-6 pb-6 text-sm text-muted-foreground">No invoices yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">
                  <Link href={`/invoices/${inv.id}`} className="hover:underline">
                    {inv.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{inv.clientName}</TableCell>
                <TableCell className="text-right">{formatMoney(inv.amount, inv.currency)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={getEffectiveStatus(inv)} />
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{formatDate(inv.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
