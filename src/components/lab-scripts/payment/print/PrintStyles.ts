export const getPrintStyles = () => `
  @page { 
    size: A4;
    margin: 2.5cm;
  }
  @media print {
    body { 
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background: white !important;
    }
    * {
      color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .invoice-content {
      padding: 0 !important;
      margin: 0 !important;
      background: white !important;
      box-shadow: none !important;
      width: 100% !important;
      font-size: 12pt !important;
    }
    .bg-emerald-100 {
      background-color: #d1fae5 !important;
      color: #047857 !important;
      border: 1px solid #047857 !important;
    }
    .text-primary {
      color: #375bdc !important;
    }
    .text-emerald-600 {
      color: #059669 !important;
    }
    .text-emerald-700 {
      color: #047857 !important;
    }
    .text-gray-900 {
      color: #111827 !important;
    }
    .text-gray-600 {
      color: #4B5563 !important;
    }
    .text-gray-500 {
      color: #6B7280 !important;
    }
    .border-gray-200 {
      border-color: #E5E7EB !important;
    }
    .border-emerald-200 {
      border-color: #A7F3D0 !important;
    }
    .bg-gray-50 {
      background-color: #F9FAFB !important;
    }
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
    }
    .font-semibold {
      font-weight: 600 !important;
    }
    .font-medium {
      font-weight: 500 !important;
    }
    .divide-y > * + * {
      border-top: 1px solid #E5E7EB !important;
    }
    table {
      width: 100% !important;
      border-collapse: collapse !important;
    }
    th {
      background-color: #F9FAFB !important;
      color: #4B5563 !important;
      font-weight: 500 !important;
      text-align: left !important;
      padding: 0.75rem 1rem !important;
    }
    td {
      padding: 1rem !important;
      color: #111827 !important;
    }
    tfoot {
      background-color: #F9FAFB !important;
    }
    tfoot td {
      padding: 1rem !important;
      font-weight: 500 !important;
    }
    .print-hidden {
      display: none !important;
    }
  }
`;