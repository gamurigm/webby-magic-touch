
import { Invoice } from "@/types/invoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InvoiceViewer from "./InvoiceViewer";

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal = ({ invoice, isOpen, onClose }: InvoiceModalProps) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Crear un elemento temporal para imprimir solo la factura
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura ${invoice.number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .no-print { display: none !important; }
              @media print {
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${document.querySelector('.invoice-content')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Factura #{invoice.number}</DialogTitle>
        </DialogHeader>
        <div className="invoice-content">
          <InvoiceViewer 
            invoice={invoice} 
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
