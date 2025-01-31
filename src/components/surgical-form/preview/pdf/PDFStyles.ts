import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#111827',
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 4,
    width: '100%',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 'medium',
    flexWrap: 'wrap',
  },
  instructionsBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 4,
    width: '100%',
    minHeight: 60,
  },
  instructionsText: {
    fontSize: 12,
    color: '#111827',
    lineHeight: 1.5,
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    wordBreak: 'break-word',
  },
  placeholder: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  table: {
    marginTop: 24,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: '12 16',
    borderBottom: '1 solid #E2E8F0',
  },
  tableHeaderText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'medium',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #E2E8F0',
    padding: '16',
  },
  tableCell: {
    fontSize: 12,
    color: '#0F172A',
    flexWrap: 'wrap',
  },
  col1: { 
    width: '60%',
    flexWrap: 'wrap',
  },
  col2: { 
    width: '20%',
    textAlign: 'center',
  },
  col3: { 
    width: '20%',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    padding: '16',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    marginRight: 16,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
    width: '20%',
    textAlign: 'right',
  },
  statusBadge: {
    padding: '4 8',
    borderRadius: 4,
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  statusPaid: {
    backgroundColor: '#D1FAE5',
    color: '#047857',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
});