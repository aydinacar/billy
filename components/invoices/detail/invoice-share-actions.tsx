'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface Props {
  publicToken: string
}

export function InvoiceCopyLinkButton({ publicToken }: Props) {
  async function handleCopy() {
    const url = `${window.location.origin}/pay/${publicToken}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Pay link copied to clipboard')
    } catch {
      toast.error('Could not copy link')
    }
  }

  return (
    <Button onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      <span className="hidden sm:inline">Copy pay link</span>
      <span className="sm:hidden">Copy link</span>
    </Button>
  )
}
