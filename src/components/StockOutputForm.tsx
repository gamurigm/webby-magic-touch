import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StockOutputFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const paymentMethods = [
  "Efectivo",
  "Transferencia",
  "Tarjeta de crédito",
  "Cheque",
  "Otro"
];

const StockOutputForm = ({ isOpen, onClose }: StockOutputFormProps) => {
  const [outputType, setOutputType] = useState<'sale' | 'supplier_return'>('sale');
  const [client, setClient] = useState('');
  const [contact, setContact] = useState('');
  const [invoice, setInvoice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState('0.00');
  const [discount, setDiscount] = useState('0');
  const [taxes, setTaxes] = useState('0.00');

  // TODO: lógica de cálculo real de subtotal, descuento e impuestos

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fff7f2] border-0 rounded-2xl p-0">
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-center mb-1 flex items-center gap-2">
            <span role="img" aria-label="salida">\uD83D\uDD25</span> Salida de Stock
          </h2>
          <p className="text-center text-orange-900 mb-8">Registra salidas de inventario por ventas, promociones y devoluciones</p>

          {/* Tipo de Salida */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <input type="checkbox" checked readOnly className="accent-orange-600 w-5 h-5 mr-2" />
              <h3 className="text-lg font-bold text-orange-900">Tipo de Salida</h3>
            </div>
            <div className="flex gap-4">
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer ${outputType === 'sale' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                <input type="radio" className="mr-2" checked={outputType === 'sale'} onChange={() => setOutputType('sale')} />
                Venta
              </label>
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer ${outputType === 'supplier_return' ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>
                <input type="radio" className="mr-2" checked={outputType === 'supplier_return'} onChange={() => setOutputType('supplier_return')} />
                Devolucion a Proveedor
              </label>
            </div>
            <div className="text-gray-600 mt-2 text-sm">Seleccionar salidas de inventario por ventas,</div>
          </div>

          {/* Información de Transacción */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-orange-600 rounded mr-2" />
              <h3 className="text-lg font-bold text-orange-900">Información de Transacción</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Cliente/Destinatario</Label>
                <Input value={client} onChange={e => setClient(e.target.value)} placeholder="Nombre del cliente.o proveedor" />
              </div>
              <div>
                <Label>Contacto</Label>
                <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="Teléfono o email" />
              </div>
              <div>
                <Label>Numero de Factura/Documento</Label>
                <Input value={invoice} onChange={e => setInvoice(e.target.value)} placeholder="FAC-2024-0401" />
              </div>
              <div>
                <Label>Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Motivo/Observaciones</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Detalles sobre la salida del producto...." rows={2} />
            </div>
          </div>

          {/* Resumen de la Salida */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-orange-600 rounded mr-2" />
              <h3 className="text-lg font-bold text-orange-900">Resumen de la Salida</h3>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
              </div>
              <div>
                <Label>Subtotal (%)</Label>
                <Input type="text" value={subtotal} onChange={e => setSubtotal(e.target.value)} />
              </div>
              <div>
                <Label>Descuento (%)</Label>
                <Input type="text" value={discount} onChange={e => setDiscount(e.target.value)} />
              </div>
              <div>
                <Label>Impuestos (%)</Label>
                <Input type="text" value={taxes} onChange={e => setTaxes(e.target.value)} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end">
              <Button variant="outline" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold">
                CANCELAR
              </Button>
              <Button variant="outline" className="bg-white text-orange-700 border-orange-300 hover:bg-orange-50 font-semibold">
                VISTA PREVIA
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold">
                REGISTRAR SALIDA
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockOutputForm;
