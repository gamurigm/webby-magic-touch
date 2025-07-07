
import { useState } from 'react';
import { Invoice, Product, CreditNote } from "@/types/invoice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface CreditNoteDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateCreditNote: (creditNote: CreditNote) => void;
}

const CreditNoteDialog = ({ invoice, isOpen, onClose, onCreateCreditNote }: CreditNoteDialogProps) => {
  const [reason, setReason] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{[key: number]: { selected: boolean, quantity: number }}>({});

  const handleProductSelection = (index: number, selected: boolean) => {
    setSelectedProducts(prev => ({
      ...prev,
      [index]: {
        selected,
        quantity: selected ? invoice?.products[index]?.quantity || 0 : 0
      }
    }));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const maxQuantity = invoice?.products[index]?.quantity || 0;
    const validQuantity = Math.min(Math.max(0, quantity), maxQuantity);
    
    setSelectedProducts(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        quantity: validQuantity
      }
    }));
  };

  const calculateTotal = () => {
    if (!invoice) return 0;
    
    return Object.entries(selectedProducts).reduce((total, [index, data]) => {
      if (data.selected && data.quantity > 0) {
        const product = invoice.products[parseInt(index)];
        return total + (product.price * data.quantity);
      }
      return total;
    }, 0);
  };

  const handleCreateCreditNote = () => {
    if (!invoice || !reason.trim()) return;

    const creditNoteProducts: Product[] = Object.entries(selectedProducts)
      .filter(([_, data]) => data.selected && data.quantity > 0)
      .map(([index, data]) => {
        const originalProduct = invoice.products[parseInt(index)];
        return {
          name: originalProduct.name,
          quantity: data.quantity,
          price: originalProduct.price
        };
      });

    if (creditNoteProducts.length === 0) return;

    const creditNote: CreditNote = {
      id: Date.now().toString(),
      number: `NC-${Date.now()}`,
      date: new Date().toISOString(),
      originalInvoiceId: invoice.id,
      originalInvoiceNumber: invoice.number,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      products: creditNoteProducts,
      total: calculateTotal(),
      reason
    };

    onCreateCreditNote(creditNote);
    setReason('');
    setSelectedProducts({});
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setSelectedProducts({});
    onClose();
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nota de Crédito - Factura #{invoice.number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Selecciona los productos y cantidades para los que deseas emitir la nota de crédito.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit-reason">Motivo de la nota de crédito *</Label>
            <Textarea
              id="credit-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Especifica el motivo (devolución, error, descuento, etc.)..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Productos de la factura original</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Seleccionar</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cant. Original</TableHead>
                  <TableHead>Cant. Nota Crédito</TableHead>
                  <TableHead>Precio Unit.</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.products.map((product, index) => {
                  const selection = selectedProducts[index] || { selected: false, quantity: 0 };
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selection.selected}
                          onCheckedChange={(checked) => handleProductSelection(index, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-center">{product.quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={product.quantity}
                          value={selection.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                          disabled={!selection.selected}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(selection.selected ? product.price * selection.quantity : 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <div className="text-right border-t pt-4">
              <p className="text-lg font-bold">
                Total Nota de Crédito: ${calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCreditNote}
            disabled={!reason.trim() || calculateTotal() === 0}
          >
            Crear Nota de Crédito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteDialog;
