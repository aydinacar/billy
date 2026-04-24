'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function InvoiceCheckoutToast() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  useEffect(() => {
    if (!params) return
    const result = params.get('checkout')
    if (!result) return

    if (result === 'success') {
      toast.success('Payment received. Updating invoice…')
    } else if (result === 'cancelled') {
      toast.info('Checkout cancelled.')
    }

    const next = new URLSearchParams(params.toString())
    next.delete('checkout')
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
    router.refresh()
  }, [params, pathname, router])

  return null
}
