'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Send, Undo2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { updateInvoiceStatus } from '@/actions/invoices'
import type { InvoiceStatus } from '@/types/invoice'

interface Props {
  invoiceId: string
  status: InvoiceStatus
}

export function InvoiceStatusActions({ invoiceId, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function transition(to: InvoiceStatus, successMessage: string) {
    startTransition(async () => {
      try {
        await updateInvoiceStatus(invoiceId, to)
        toast.success(successMessage)
        router.refresh()
      } catch (error) {
        console.error('Error updating status:', error)
        toast.error('Failed to update status')
      }
    })
  }

  if (status === 'draft') {
    return (
      <Button
        variant="outline"
        onClick={() => transition('sent', 'Invoice marked as sent')}
        disabled={isPending}
      >
        <Send className="mr-2 h-4 w-4" />
        Mark as sent
      </Button>
    )
  }

  if (status === 'sent' || status === 'overdue') {
    return (
      <Button
        variant="outline"
        onClick={() => transition('paid', 'Invoice marked as paid')}
        disabled={isPending}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Mark as paid
      </Button>
    )
  }

  if (status === 'paid') {
    return (
      <Button
        variant="outline"
        onClick={() => transition('sent', 'Invoice reopened')}
        disabled={isPending}
      >
        <Undo2 className="mr-2 h-4 w-4" />
        Reopen
      </Button>
    )
  }

  return null
}
