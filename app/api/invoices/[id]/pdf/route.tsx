import { renderToBuffer } from '@react-pdf/renderer'

import { getInvoiceById } from '@/actions/invoices'
import { InvoiceDocument } from '@/components/invoices/pdf/invoice-document'

export const runtime = 'nodejs'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Context) {
  const { id } = await params
  const invoice = await getInvoiceById(id)
  if (!invoice) return new Response('Not found', { status: 404 })

  const pdf = await renderToBuffer(<InvoiceDocument invoice={invoice} />)

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Cache-Control': 'private, no-store'
    }
  })
}
