'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/page-header'
import { FormDialog } from '@/components/common/form-dialog'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { DataTable } from '@/components/table/data-table'
import { InvoiceForm } from './form/invoice-form'
import { columns } from './columns'
import { deleteInvoice } from '@/actions/invoices'
import type { InvoiceWithClient } from '@/types/invoice'
import type { Client } from '@/types/client'

interface Props {
  invoices: InvoiceWithClient[]
  clients: Client[]
}

export function InvoicesView({ invoices, clients }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<InvoiceWithClient | null>(null)
  const [pendingDelete, setPendingDelete] = useState<InvoiceWithClient | null>(null)
  const [isDeleting, startDelete] = useTransition()

  const isEditMode = !!selected

  function openCreate() {
    setSelected(null)
    setOpen(true)
  }

  function openEdit(invoice: InvoiceWithClient) {
    setSelected(invoice)
    setOpen(true)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setSelected(null)
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return
    const invoice = pendingDelete
    startDelete(async () => {
      try {
        await deleteInvoice(invoice.id)
        setPendingDelete(null)
      } catch (error) {
        console.error('Error deleting invoice:', error)
        toast.error('Failed to delete invoice')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices"
        description="Track the invoices you've issued to your clients."
        action={
          <Button
            onClick={openCreate}
            disabled={clients.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={invoices}
        filterColumn="invoiceNumber"
        filterPlaceholder="Filter by number..."
        onEdit={openEdit}
        onDelete={row => setPendingDelete(row)}
      />
      <FormDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={isEditMode ? 'Edit Invoice' : 'Add New Invoice'}
        description={
          isEditMode
            ? 'Update the invoice information below.'
            : 'Fill out the form below to create a new invoice.'
        }
      >
        <InvoiceForm
          initialData={selected}
          clients={clients}
          onSuccess={() => handleOpenChange(false)}
        />
      </FormDialog>
      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={next => {
          if (!next) setPendingDelete(null)
        }}
        title="Delete invoice?"
        description={
          pendingDelete ? (
            <>
              This will permanently delete invoice <strong>{pendingDelete.invoiceNumber}</strong>. This action cannot be
              undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
