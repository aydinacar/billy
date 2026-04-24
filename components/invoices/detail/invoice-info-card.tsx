import Link from 'next/link'

import { DetailCard } from '@/components/common/detail-card'
import { InfoRow } from '@/components/common/info-row'
import { formatDate } from '@/utils/date'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoiceInfoCard({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <DetailCard>
      <InfoRow
        label="Client"
        value={
          <Link
            href={`/clients/${invoice.client.id}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {invoice.client.name}
          </Link>
        }
      />
      <InfoRow
        label="Email"
        value={invoice.client.email}
      />
      <InfoRow
        label="Issued"
        value={formatDate(invoice.issuedDate)}
      />
      <InfoRow
        label="Due"
        value={formatDate(invoice.dueDate)}
      />
      {invoice.notes && (
        <InfoRow
          label="Notes"
          value={<span className="whitespace-pre-wrap">{invoice.notes}</span>}
        />
      )}
    </DetailCard>
  )
}
