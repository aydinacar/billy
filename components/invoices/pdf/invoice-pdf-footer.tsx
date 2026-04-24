import { Text, View } from '@react-pdf/renderer'

import { styles } from './invoice-pdf-styles'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoicePdfFooter({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <View style={styles.footer}>
      {invoice.notes ? (
        <View>
          <Text style={styles.footerLabel}>Notes</Text>
          <Text>{invoice.notes}</Text>
        </View>
      ) : null}
      <Text style={styles.thankYou}>Thank you for your business.</Text>
    </View>
  )
}
