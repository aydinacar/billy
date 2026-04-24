import { Text, View } from '@react-pdf/renderer'

import { styles } from './invoice-pdf-styles'
import type { Client } from '@/types/client'

export function InvoicePdfBillTo({ client }: { client: Client }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>Bill to</Text>
      <Text style={styles.blockValueBold}>{client.name}</Text>
      <Text style={styles.blockValueMuted}>{client.email}</Text>
      {client.address ? <Text style={styles.blockValue}>{client.address}</Text> : null}
      {client.taxNumber ? <Text style={styles.blockValueMuted}>Tax: {client.taxNumber}</Text> : null}
    </View>
  )
}
