'use client'

import { useTransition } from 'react'
import { CreditCard } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/actions/payments'

interface Props {
  invoiceId: string
  disabled?: boolean
}

export function InvoicePayButton({ invoiceId, disabled }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      try {
        const url = await createCheckoutSession(invoiceId)
        window.location.href = url
      } catch (error) {
        console.error('Error starting checkout:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
      }
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Pay with Stripe
    </Button>
  )
}
