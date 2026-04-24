import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney } from '@/utils/money'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoiceItemsTable({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-24 text-right">Qty</TableHead>
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
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-right font-medium"
            >
              Total
            </TableCell>
            <TableCell className="text-right font-medium">{formatMoney(invoice.amount, invoice.currency)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
