import { notFound } from 'next/navigation'

import { getInvoiceById } from '@/actions/invoices'
import { getClients } from '@/actions/clients'
import { InvoiceDetailView } from '@/components/invoices/detail/invoice-detail-view'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params
  const [invoice, clients] = await Promise.all([getInvoiceById(id), getClients()])
  if (!invoice) notFound()
  return (
    <InvoiceDetailView
      invoice={invoice}
      clients={clients}
    />
  )
}
