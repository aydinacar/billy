import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface Props {
  href: string
  children: ReactNode
}

export function BackLink({ href, children }: Props) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="w-fit -ml-2"
    >
      <Link href={href}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  )
}
