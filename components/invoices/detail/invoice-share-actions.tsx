'use client'

import Link from 'next/link'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface Props {
  publicToken: string
}

export function InvoiceShareActions({ publicToken }: Props) {
  const path = `/pay/${publicToken}`

  async function handleCopy() {
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Pay link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleCopy}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy pay link
      </Button>
      <Button
        variant="outline"
        asChild
      >
        <Link
          href={path}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View as customer
        </Link>
      </Button>
    </>
  )
}
