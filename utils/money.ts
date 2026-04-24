export function formatMoney(value: string | number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value))
}
