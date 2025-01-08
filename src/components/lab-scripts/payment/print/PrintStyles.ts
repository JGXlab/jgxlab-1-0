export const getPrintStyles = () => `
  @page { 
    size: A4;
    margin: 0;
  }
  @media print {
    body { 
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    * {
      color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background-color: transparent !important;
    }
    .invoice-content {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm;
      margin: 0;
      background: white !important;
      box-shadow: none;
      font-size: 12pt;
    }
    .text-primary {
      color: #375bdc !important;
      background: none !important;
    }
    .bg-primary {
      background-color: #375bdc !important;
      color: white !important;
    }
    .border-primary {
      border-color: #375bdc !important;
    }
    .text-success {
      color: #22c55e !important;
      background: none !important;
    }
    .bg-success {
      background-color: #22c55e !important;
    }
    .text-muted {
      color: #64748b !important;
      background: none !important;
    }
    .bg-muted {
      background-color: #64748b !important;
    }
    .text-card-foreground {
      color: #0f172a !important;
      background: none !important;
    }
    .bg-accent {
      background-color: #f8fafc !important;
    }
    [class*="text-"] {
      background: none !important;
    }
  }
`;