import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0'
}

const statusColors = {
  draft: { bg: '#f1f5f9', text: '#475569' },
  sent: { bg: '#dbeafe', text: '#1e40af' },
  paid: { bg: '#dcfce7', text: '#166534' },
  overdue: { bg: '#fee2e2', text: '#991b1b' },
  cancelled: { bg: '#e2e8f0', text: '#1f2937' }
} as const

export type StatusKey = keyof typeof statusColors

export function statusBadgeColor(status: StatusKey) {
  return {
    backgroundColor: statusColors[status].bg,
    color: statusColors[status].text
  }
}

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50
  },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  brandSub: { fontSize: 9, color: colors.muted, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: colors.muted, letterSpacing: 2 },
  invoiceNumber: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 4 },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase'
  },

  details: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  block: { flexDirection: 'column' },
  blockLabel: { fontSize: 8, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  blockValue: { fontSize: 10, marginBottom: 2 },
  blockValueBold: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  blockValueMuted: { fontSize: 10, color: colors.muted, marginBottom: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, minWidth: 180 },
  metaLabel: { color: colors.muted, marginRight: 16 },

  table: { borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border
  },
  cellDescription: { flex: 4 },
  cellQty: { flex: 1, textAlign: 'right' },
  cellPrice: { flex: 1.5, textAlign: 'right' },
  cellTotal: { flex: 1.5, textAlign: 'right' },

  totalsContainer: { marginTop: 16, alignItems: 'flex-end' },
  totalsRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
  totalsLabel: { fontFamily: 'Helvetica-Bold', marginRight: 16, color: colors.muted },
  totalsValue: { fontFamily: 'Helvetica-Bold', fontSize: 14 },

  footer: { marginTop: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  footerLabel: { fontSize: 8, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  thankYou: { marginTop: 24, fontSize: 9, color: colors.muted, textAlign: 'center' }
})
