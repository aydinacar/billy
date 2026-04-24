import { Text, View } from '@react-pdf/renderer'

import { styles } from './invoice-pdf-styles'
import { formatDate } from '@/utils/date'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoicePdfMeta({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>Details</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Issue date</Text>
        <Text>{formatDate(invoice.issuedDate)}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>Due date</Text>
        <Text>{formatDate(invoice.dueDate)}</Text>
      </View>
    </View>
  )
}
