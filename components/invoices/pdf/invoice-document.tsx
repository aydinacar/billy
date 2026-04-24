import { Document, Page, View } from '@react-pdf/renderer'

import { InvoicePdfHeader } from './invoice-pdf-header'
import { InvoicePdfBillTo } from './invoice-pdf-bill-to'
import { InvoicePdfMeta } from './invoice-pdf-meta'
import { InvoicePdfItems } from './invoice-pdf-items'
import { InvoicePdfTotals } from './invoice-pdf-totals'
import { InvoicePdfFooter } from './invoice-pdf-footer'
import { styles } from './invoice-pdf-styles'
import type { InvoiceDetail } from '@/types/invoice'

export function InvoiceDocument({ invoice }: { invoice: InvoiceDetail }) {
  return (
    <Document
      title={`Invoice ${invoice.invoiceNumber}`}
      author="Billy"
      subject={`Invoice ${invoice.invoiceNumber} for ${invoice.client.name}`}
    >
      <Page
        size="A4"
        style={styles.page}
      >
        <InvoicePdfHeader invoice={invoice} />
        <View style={styles.details}>
          <InvoicePdfBillTo client={invoice.client} />
          <InvoicePdfMeta invoice={invoice} />
        </View>
        <InvoicePdfItems invoice={invoice} />
        <InvoicePdfTotals invoice={invoice} />
        <InvoicePdfFooter invoice={invoice} />
      </Page>
    </Document>
  )
}
