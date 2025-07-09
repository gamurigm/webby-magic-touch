
import { useState, useMemo } from 'react';
import { Invoice, CreditNote } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Ban, FileText, Mail } from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import CancelInvoiceDialog from "./CancelInvoiceDialog";
import CreditNoteDialog from "./CreditNoteDialog";
import EmailInvoiceDialog from "./EmailInvoiceDialog";
import InvoiceFiltersComponent, { InvoiceFilters } from "./InvoiceFilters";

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
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState<Invoice | null>(null);
  const [invoiceForCreditNote, setInvoiceForCreditNote] = useState<Invoice | null>(null);
  const [invoiceToEmail, setInvoiceToEmail] = useState<Invoice | null>(null);

  // Estado para filtros
  const [filters, setFilters] = useState<InvoiceFilters>({
    searchTerm: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    clientName: '',
    productType: ''
  });

  // Filtrar facturas basado en los filtros aplicados
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      // Búsqueda general
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          invoice.number.toLowerCase().includes(searchLower) ||
          invoice.clientName.toLowerCase().includes(searchLower) ||
          invoice.clientEmail.toLowerCase().includes(searchLower) ||
          invoice.products.some(p => p.name.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (filters.status && invoice.status !== filters.status) return false;

      // Filtro por nombre de cliente
      if (filters.clientName && !invoice.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }

      // Filtro por tipo de producto
      if (filters.productType) {
        const hasProductType = invoice.products.some(product => {
          if (filters.productType === 'laptop') {
            return product.name.toLowerCase().includes('macbook') || 
                   product.name.toLowerCase().includes('dell') ||
                   product.name.toLowerCase().includes('hp') ||
                   product.name.toLowerCase().includes('lenovo');
          } else if (filters.productType === 'accessory') {
            return product.name.toLowerCase().includes('mouse') ||
                   product.name.toLowerCase().includes('teclado') ||
                   product.name.toLowerCase().includes('monitor') ||
                   product.name.toLowerCase().includes('webcam');
          }
          return false;
        });
        if (!hasProductType) return false;
      }

      // Filtro por fecha
      if (filters.dateFrom) {
        const invoiceDate = new Date(invoice.date);
        const fromDate = new Date(filters.dateFrom);
        if (invoiceDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const invoiceDate = new Date(invoice.date);
        const toDate = new Date(filters.dateTo);
        if (invoiceDate > toDate) return false;
      }

      return true;
    });
  }, [invoices, filters]);

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

  const handleEmailInvoice = (invoice: Invoice) => {
    setInvoiceToEmail(invoice);
    setIsEmailDialogOpen(true);
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

  const handleEmailSent = (invoice: Invoice) => {
    onUpdateInvoice(invoice);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      clientName: '',
      productType: ''
    });
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
      <InvoiceFiltersComponent 
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Facturas ({filteredInvoices.length} de {invoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron facturas con los filtros aplicados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.number}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {invoice.products.slice(0, 2).map((product, idx) => (
                          <div key={idx}>{product.name} (x{product.quantity})</div>
                        ))}
                        {invoice.products.length > 2 && (
                          <div className="text-gray-500">+{invoice.products.length - 2} más</div>
                        )}
                      </div>
                    </TableCell>
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
                                onClick={() => handleEmailInvoice(invoice)}
                                className="text-blue-600"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar por Email
                              </DropdownMenuItem>
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
          )}
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

      <EmailInvoiceDialog
        invoice={invoiceToEmail}
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        onEmailSent={handleEmailSent}
      />
    </>
  );
};

export default InvoiceList;
