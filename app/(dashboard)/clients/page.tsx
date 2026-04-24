import { ClientsView } from '@/components/clients/clients-view'
import { getClients } from '@/actions/clients'

export default async function ClientsPage() {
  const clients = await getClients()

  return <ClientsView clients={clients} />
}
