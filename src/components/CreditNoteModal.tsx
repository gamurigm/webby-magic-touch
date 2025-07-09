
import { CreditNote } from "@/types/invoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreditNoteViewer from "./CreditNoteViewer";

interface CreditNoteModalProps {
  creditNote: CreditNote | null;
  isOpen: boolean;
  onClose: () => void;
}

const CreditNoteModal = ({ creditNote, isOpen, onClose }: CreditNoteModalProps) => {
  if (!creditNote) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Crear un elemento temporal para imprimir solo la nota de crédito
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Nota de Crédito ${creditNote.number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .no-print { display: none !important; }
              @media print {
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${document.querySelector('.credit-note-content')?.innerHTML || ''}
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
          <DialogTitle>Nota de Crédito #{creditNote.number}</DialogTitle>
        </DialogHeader>
        <div className="credit-note-content">
          <CreditNoteViewer 
            creditNote={creditNote} 
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteModal;
