import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 32,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: '40%',
    textAlign: 'right',
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    color: '#375bdc',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  paidBadge: {
    backgroundColor: '#d1fae5',
    color: '#047857',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
  },
  companyInfo: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    color: '#375bdc',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  billingSection: {
    marginTop: 32,
    marginBottom: 32,
    flexDirection: 'row',
    gap: 48,
  },
  billingColumn: {
    flex: 1,
  },
  billingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
  },
  billingContent: {
    paddingLeft: 28,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.5,
  },
  table: {
    marginTop: 32,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: '12 16',
    borderBottom: '1 solid #e2e8f0',
  },
  tableHeaderText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: 'medium',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e2e8f0',
    padding: '16',
  },
  tableCell: {
    fontSize: 14,
    color: '#0f172a',
  },
  col1: { flex: 2 },
  col2: { width: 80, textAlign: 'center' },
  col3: { width: 120, textAlign: 'right' },
  totalSection: {
    backgroundColor: '#f8fafc',
    padding: '16',
    borderTop: '2 solid #e2e8f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 16,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    width: 120,
    textAlign: 'right',
  },
  paidAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    width: 120,
    textAlign: 'right',
  },

  discountText: {
    color: '#DC2626', // Red color for discount amount
  },
});
