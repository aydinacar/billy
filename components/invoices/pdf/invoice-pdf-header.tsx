import { Text, View } from '@react-pdf/renderer'

import { styles, statusBadgeColor, type StatusKey } from './invoice-pdf-styles'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoicePdfHeader({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>BILLY</Text>
        <Text style={styles.brandSub}>Invoicing for freelancers</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
        <Text style={[styles.statusBadge, statusBadgeColor(invoice.status as StatusKey)]}>{invoice.status}</Text>
      </View>
    </View>
  )
}
