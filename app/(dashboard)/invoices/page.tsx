import { getInvoices } from '@/actions/invoices'
import { getClients } from '@/actions/clients'
import { InvoicesView } from '@/components/invoices/invoices-view'

export default async function InvoicesPage() {
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()])
  return (
    <InvoicesView
      invoices={invoices}
      clients={clients}
    />
  )
}
