'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { FormDialog } from '@/components/common/form-dialog'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { BackLink } from '@/components/common/back-link'
import { InvoiceForm } from '../form/invoice-form'
import { InvoiceStatusBadge } from '../status-badge'
import { InvoiceInfoCard } from './invoice-info-card'
import { InvoiceItemsTable } from './invoice-items-table'
import { InvoicePaymentsList } from './invoice-payments-list'
import { InvoiceStatusActions } from './invoice-status-actions'
import { InvoiceCopyLinkButton } from './invoice-share-actions'
import { InvoiceMoreMenu } from './invoice-more-menu'
import { InvoiceAmountSummary } from './invoice-amount-summary'
import { deleteInvoice } from '@/actions/invoices'
import { getAmountDue, getAmountPaid, getEffectiveStatus } from '@/utils/invoice-status'
import type { InvoiceDetail } from '@/types/invoice'
import type { Client } from '@/types/client'

interface Props {
  invoice: InvoiceDetail
  clients: Client[]
}

export function InvoiceDetailView({ invoice, clients }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, startDelete] = useTransition()

  const effectiveStatus = getEffectiveStatus(invoice)
  const amountPaid = getAmountPaid(invoice.payments)
  const amountDue = getAmountDue(invoice, invoice.payments)
  const canPayWithStripe = amountDue > 0 && invoice.status !== 'cancelled'

  function handleEditSuccess() {
    setOpen(false)
    router.refresh()
  }

  function handleConfirmDelete() {
    startDelete(async () => {
      try {
        await deleteInvoice(invoice.id)
        router.push('/invoices')
      } catch (error) {
        console.error('Error deleting invoice:', error)
        toast.error('Failed to delete invoice')
        setConfirmOpen(false)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/invoices">Back to invoices</BackLink>

      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            Invoice {invoice.invoiceNumber}
            <InvoiceStatusBadge status={effectiveStatus} />
          </span>
        }
        description={invoice.client.name}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {canPayWithStripe && <InvoiceCopyLinkButton publicToken={invoice.publicToken} />}
            <InvoiceStatusActions
              invoiceId={invoice.id}
              status={invoice.status}
            />
            <InvoiceMoreMenu
              invoiceId={invoice.id}
              publicToken={invoice.publicToken}
              canShare={canPayWithStripe}
              onEdit={() => setOpen(true)}
              onDelete={() => setConfirmOpen(true)}
              isDeleting={isDeleting}
            />
          </div>
        }
      />

      <InvoiceAmountSummary
        invoice={invoice}
        amountPaid={amountPaid}
        amountDue={amountDue}
        effectiveStatus={effectiveStatus}
      />
      <InvoiceInfoCard invoice={invoice} />
      <InvoiceItemsTable invoice={invoice} />
      <InvoicePaymentsList
        invoiceId={invoice.id}
        payments={invoice.payments}
        currency={invoice.currency}
        amountDue={amountDue}
      />

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Invoice"
        description="Update the invoice information below."
      >
        <InvoiceForm
          initialData={invoice}
          clients={clients}
          onSuccess={handleEditSuccess}
          onCancel={() => setOpen(false)}
        />
      </FormDialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete invoice?"
        description={
          <>
            This will permanently delete invoice <strong>{invoice.invoiceNumber}</strong>. This action cannot be undone.
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
