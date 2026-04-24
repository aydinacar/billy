import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function InvoiceDownloadButton({ invoiceId }: { invoiceId: string }) {
  return (
    <Button
      variant="outline"
      asChild
    >
      <a href={`/api/invoices/${invoiceId}/pdf`}>
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </a>
    </Button>
  )
}
