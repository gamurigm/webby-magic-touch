
import { useState } from 'react';
import { Invoice, CreditNote } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Ban, FileText } from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import CancelInvoiceDialog from "./CancelInvoiceDialog";
import CreditNoteDialog from "./CreditNoteDialog";

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateInvoice: (invoice: Invoice) => void;
  onCreateCreditNote: (creditNote: CreditNote) => void;
}

const InvoiceList = ({ invoices, onUpdateInvoice, onCreateCreditNote }: InvoiceListProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCreditNoteDialogOpen, setIsCreditNoteDialogOpen] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState<Invoice | null>(null);
  const [invoiceForCreditNote, setInvoiceForCreditNote] = useState<Invoice | null>(null);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    setInvoiceToCancel(invoice);
    setIsCancelDialogOpen(true);
  };

  const handleCreateCreditNote = (invoice: Invoice) => {
    setInvoiceForCreditNote(invoice);
    setIsCreditNoteDialogOpen(true);
  };

  const handleConfirmCancel = (invoice: Invoice, reason: string) => {
    const updatedInvoice: Invoice = {
      ...invoice,
      status: 'cancelled',
      cancelledDate: new Date().toISOString(),
      cancelReason: reason
    };
    onUpdateInvoice(updatedInvoice);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'sent': return 'Enviada';
      case 'cancelled': return 'Anulada';
      default: return 'Creada';
    }
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No hay facturas creadas aún.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Facturas Creadas ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">#{invoice.number}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Factura
                        </DropdownMenuItem>
                        {invoice.status !== 'cancelled' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleCreateCreditNote(invoice)}
                              className="text-blue-600"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Nota de Crédito
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleCancelInvoice(invoice)}
                              className="text-red-600"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Anular Factura
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InvoiceModal 
        invoice={selectedInvoice}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <CancelInvoiceDialog
        invoice={invoiceToCancel}
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onCancel={handleConfirmCancel}
      />

      <CreditNoteDialog
        invoice={invoiceForCreditNote}
        isOpen={isCreditNoteDialogOpen}
        onClose={() => setIsCreditNoteDialogOpen(false)}
        onCreateCreditNote={onCreateCreditNote}
      />
    </>
  );
};

export default InvoiceList;
