const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})

function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function toDateInput(value: Date | string | null | undefined): string {
  const date = toDate(value)
  return date ? date.toISOString().slice(0, 10) : ''
}

export function formatDate(value: Date | string | null | undefined): string {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : ''
}
