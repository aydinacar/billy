export const invoiceStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'] as const

export const supportedCurrencies = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'TRY', label: 'Turkish Lira' },
  { code: 'JPY', label: 'Japanese Yen' }
] as const

export const currencyCodes = supportedCurrencies.map(c => c.code) as [string, ...string[]]

type InvoiceStatus = (typeof invoiceStatuses)[number]

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
}

export const emptyInvoiceItem = { description: '', quantity: '1', unitPrice: '' } as const
