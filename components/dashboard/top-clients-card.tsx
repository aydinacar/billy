import Link from 'next/link'

import { formatMoney } from '@/utils/money'
import type { TopClient } from '@/actions/dashboard'

interface Props {
  clients: TopClient[]
  currency: string
}

export function TopClientsCard({ clients, currency }: Props) {
  return (
    <div className="rounded-lg border bg-card flex flex-col">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-muted-foreground">Top Clients</h3>
          <p className="text-xs text-muted-foreground">Last 12 months · {currency}</p>
        </div>
      </div>
      {clients.length === 0 ? (
        <p className="px-6 pb-6 text-sm text-muted-foreground">No payments in the last 12 months.</p>
      ) : (
        <ol className="divide-y">
          {clients.map((client, index) => (
            <li key={client.id} className="flex items-center gap-4 px-6 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <Link href={`/clients/${client.id}`} className="flex-1 min-w-0 truncate font-medium hover:underline">
                {client.name}
              </Link>
              <span className="font-medium tabular-nums">{formatMoney(client.amount, currency)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
