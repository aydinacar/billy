import { notFound } from 'next/navigation'

import { getClientById } from '@/actions/clients'
import { ClientDetailView } from '@/components/clients/detail/client-detail-view'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params
  const client = await getClientById(id)
  if (!client) notFound()
  return <ClientDetailView client={client} />
}
