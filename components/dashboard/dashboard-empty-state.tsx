import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 rounded-lg border border-dashed bg-card py-16 px-6">
      <div className="rounded-full bg-muted p-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">No invoices yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Once you create your first invoice, your revenue, pending balance, and recent activity will appear here.
        </p>
      </div>
      <Button asChild>
        <Link href="/invoices">
          <Plus className="mr-2 h-4 w-4" />
          Create your first invoice
        </Link>
      </Button>
    </div>
  )
}
