'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ClientForm } from './form/client-form'
import type { ClientDto } from '@/types/client'

interface ClientDialogProps {
  client?: ClientDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDialog({ client, open, onOpenChange }: ClientDialogProps) {
  const isEditMode = !!client

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the client information below.'
              : 'Add a new client to the system by filling out the form below.'}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          initialData={client}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
