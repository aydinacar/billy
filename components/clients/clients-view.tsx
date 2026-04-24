'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/page-header'
import { FormDialog } from '@/components/common/form-dialog'
import { ClientForm } from './form/client-form'
import { columns } from './columns'
import { DataTable } from '@/components/table/data-table'
import type { ClientDto } from '@/types/client'

interface ClientsViewProps {
  clients: ClientDto[]
}

export function ClientsView({ clients }: ClientsViewProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<ClientDto | null>(null)

  const isEditMode = !!selected

  function openCreate() {
    setSelected(null)
    setOpen(true)
  }

  function openEdit(client: ClientDto) {
    setSelected(client)
    setOpen(true)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setSelected(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clients"
        description="Manage your clients and their information."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={clients}
        filterColumn="email"
        filterPlaceholder="Filter emails..."
        onEdit={openEdit}
      />
      <FormDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={isEditMode ? 'Edit Client' : 'Add New Client'}
        description={
          isEditMode
            ? 'Update the client information below.'
            : 'Add a new client to the system by filling out the form below.'
        }
      >
        <ClientForm
          initialData={selected}
          onSuccess={() => handleOpenChange(false)}
        />
      </FormDialog>
    </div>
  )
}
