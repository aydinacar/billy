import { Text, View } from '@react-pdf/renderer'

import { styles } from './invoice-pdf-styles'
import { formatMoney } from '@/utils/money'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoicePdfItems({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.cellDescription}>Description</Text>
        <Text style={styles.cellQty}>Qty</Text>
        <Text style={styles.cellPrice}>Unit price</Text>
        <Text style={styles.cellTotal}>Total</Text>
      </View>
      {invoice.items.map(item => {
        const lineTotal = Number(item.quantity) * Number(item.unitPrice)
        return (
          <View
            key={item.id}
            style={styles.tableRow}
          >
            <Text style={styles.cellDescription}>{item.description}</Text>
            <Text style={styles.cellQty}>{item.quantity}</Text>
            <Text style={styles.cellPrice}>{formatMoney(item.unitPrice, invoice.currency)}</Text>
            <Text style={styles.cellTotal}>{formatMoney(lineTotal, invoice.currency)}</Text>
          </View>
        )
      })}
    </View>
  )
}
