import { Text, View } from '@react-pdf/renderer'

import { styles } from './invoice-pdf-styles'
import { formatMoney } from '@/utils/money'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoicePdfTotals({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <View style={styles.totalsContainer}>
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Total due</Text>
        <Text style={styles.totalsValue}>{formatMoney(invoice.amount, invoice.currency)}</Text>
      </View>
    </View>
  )
}
