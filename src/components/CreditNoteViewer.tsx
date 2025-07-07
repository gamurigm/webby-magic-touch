
import { CreditNote } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";

interface CreditNoteViewerProps {
  creditNote: CreditNote;
  onPrint?: () => void;
  onExportPDF?: () => void;
}

const CreditNoteViewer = ({ creditNote, onPrint, onExportPDF }: CreditNoteViewerProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-red-600">NOTA DE CRÉDITO</h1>
          <p className="text-lg text-gray-600">#{creditNote.number}</p>
          <p className="text-sm text-gray-500">Fecha: {new Date(creditNote.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Factura Original: #{creditNote.originalInvoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {creditNote.clientName}</p>
              <p><span className="font-medium">Email:</span> {creditNote.clientEmail}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de la Nota</CardTitle>
          </CardHeader>
          <CardContent>
            <p><span className="font-medium">Motivo:</span> {creditNote.reason}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Productos Devueltos/Acreditados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditNote.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-center">{product.quantity}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(product.quantity * product.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="text-right space-y-2">
                <div className="text-2xl font-bold text-red-600">
                  Total Acreditado: ${creditNote.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4 no-print">
        {onPrint && (
          <Button onClick={onPrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        )}
        {onExportPDF && (
          <Button onClick={onExportPDF} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Exportar PDF
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreditNoteViewer;
