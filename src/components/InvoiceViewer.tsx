import { Invoice } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileText } from "lucide-react";

interface InvoiceViewerProps {
  invoice: Invoice;
  onPrint?: () => void;
  onExportPDF?: () => void;
}

const InvoiceViewer = ({ invoice, onPrint, onExportPDF }: InvoiceViewerProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">FACTURA</h1>
          <p className="text-lg text-gray-600">#{invoice.number}</p>
          <p className="text-sm text-gray-500">Fecha: {new Date(invoice.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            <p className="font-semibold">Estado:</p>
            <span className={`px-2 py-1 rounded text-xs ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
              invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {invoice.status === 'paid' ? 'Pagada' :
               invoice.status === 'sent' ? 'Enviada' : 'Creada'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {invoice.clientName}</p>
              <p><span className="font-medium">Email:</span> {invoice.clientEmail}</p>
              {invoice.clientAddress && (
                <p><span className="font-medium">Dirección:</span> {invoice.clientAddress}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p><span className="font-medium">Método de pago:</span> {
              invoice.paymentMethod === 'credit-card' ? 'Tarjeta de crédito' :
              invoice.paymentMethod === 'bank-transfer' ? 'Transferencia bancaria' :
              'PayPal'
            }</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Productos</CardTitle>
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
              {invoice.products.map((product, index) => (
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
              <div className="text-right space-y-2 min-w-[200px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (12%):</span>
                  <span>${invoice.iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
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

export default InvoiceViewer;
