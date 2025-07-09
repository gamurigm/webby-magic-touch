
import { useState, useMemo } from 'react';
import { CreditNote } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Printer, FileText } from "lucide-react";
import CreditNoteModal from "./CreditNoteModal";
import CreditNoteFiltersComponent, { CreditNoteFilters } from "./CreditNoteFilters";

interface CreditNoteListProps {
  creditNotes: CreditNote[];
}

const CreditNoteList = ({ creditNotes }: CreditNoteListProps) => {
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para filtros
  const [filters, setFilters] = useState<CreditNoteFilters>({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    clientName: '',
    reason: ''
  });

  // Filtrar notas de crédito basado en los filtros aplicados
  const filteredCreditNotes = useMemo(() => {
    return creditNotes.filter(creditNote => {
      // Búsqueda general
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          creditNote.number.toLowerCase().includes(searchLower) ||
          creditNote.clientName.toLowerCase().includes(searchLower) ||
          creditNote.clientEmail.toLowerCase().includes(searchLower) ||
          creditNote.originalInvoiceNumber.toLowerCase().includes(searchLower) ||
          creditNote.reason.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por nombre de cliente
      if (filters.clientName && !creditNote.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }

      // Filtro por motivo
      if (filters.reason && !creditNote.reason.toLowerCase().includes(filters.reason.toLowerCase())) {
        return false;
      }

      // Filtro por fecha
      if (filters.dateFrom) {
        const creditNoteDate = new Date(creditNote.date);
        const fromDate = new Date(filters.dateFrom);
        if (creditNoteDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const creditNoteDate = new Date(creditNote.date);
        const toDate = new Date(filters.dateTo);
        if (creditNoteDate > toDate) return false;
      }

      return true;
    });
  }, [creditNotes, filters]);

  const handleViewCreditNote = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setIsModalOpen(true);
  };

  const handlePrintCreditNote = (creditNote: CreditNote) => {
    // Implementar lógica de impresión
    console.log('Imprimir nota de crédito:', creditNote.number);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCreditNote(null);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      clientName: '',
      reason: ''
    });
  };

  if (creditNotes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No hay notas de crédito creadas aún.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <CreditNoteFiltersComponent 
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            Notas de Crédito ({filteredCreditNotes.length} de {creditNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCreditNotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron notas de crédito con los filtros aplicados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Factura Original</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreditNotes.map((creditNote) => (
                  <TableRow key={creditNote.id}>
                    <TableCell className="font-medium">#{creditNote.number}</TableCell>
                    <TableCell>{new Date(creditNote.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{creditNote.clientName}</div>
                        <div className="text-sm text-gray-500">{creditNote.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>#{creditNote.originalInvoiceNumber}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{creditNote.reason}</TableCell>
                    <TableCell className="text-red-600 font-medium">${creditNote.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCreditNote(creditNote)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Nota de Crédito
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintCreditNote(creditNote)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </DropdownMenuItem>
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

      <CreditNoteModal 
        creditNote={selectedCreditNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CreditNoteList;
