'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/page-header'
import { FormDialog } from '@/components/common/form-dialog'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { BackLink } from '@/components/common/back-link'
import { ClientForm } from '../form/client-form'
import { ClientInfoCard } from './client-info-card'
import { deleteClient } from '@/actions/clients'
import type { Client } from '@/types/client'

interface Props {
  client: Client
}

export function ClientDetailView({ client }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, startDelete] = useTransition()

  function handleEditSuccess() {
    setOpen(false)
    router.refresh()
  }

  function handleConfirmDelete() {
    startDelete(async () => {
      try {
        await deleteClient(client.id)
        router.push('/clients')
      } catch (error) {
        console.error('Error deleting client:', error)
        toast.error('Failed to delete client')
        setConfirmOpen(false)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/clients">Back to clients</BackLink>

      <PageHeader
        title={client.name}
        description={client.email}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      <ClientInfoCard client={client} />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Client"
        description="Update the client information below."
      >
        <ClientForm
          initialData={client}
          onSuccess={handleEditSuccess}
        />
      </FormDialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete client?"
        description={
          <>
            This will permanently delete <strong>{client.name}</strong>. This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
