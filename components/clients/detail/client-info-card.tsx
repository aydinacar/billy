import { DetailCard } from '@/components/common/detail-card'
import { InfoRow } from '@/components/common/info-row'
import type { Client } from '@/types/client'

interface Props {
  client: Client
}

export function ClientInfoCard({ client }: Props) {
  const createdAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(client.createdAt)

  return (
    <DetailCard>
      <InfoRow
        label="Name"
        value={client.name}
      />
      <InfoRow
        label="Email"
        value={client.email}
      />
      <InfoRow
        label="Tax Number"
        value={client.taxNumber || '—'}
      />
      <InfoRow
        label="Address"
        value={client.address || '—'}
      />
      <InfoRow
        label="Created"
        value={createdAt}
      />
    </DetailCard>
  )
}
