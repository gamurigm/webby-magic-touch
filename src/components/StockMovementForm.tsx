
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Upload } from "lucide-react";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { toast } from "@/hooks/use-toast";

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const StockMovementForm = ({ isOpen, onClose }: StockMovementFormProps) => {
  const { laptopModels, registerStockEntry, registerStockExit } = useInventoryManagement();
  const [movementType, setMovementType] = useState<'entry' | 'exit'>('entry');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [reason, setReason] = useState('');
  const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [bulkData, setBulkData] = useState('');

  const handleAddSerialNumber = () => {
    setSerialNumbers([...serialNumbers, '']);
  };

  const handleRemoveSerialNumber = (index: number) => {
    const newSerialNumbers = serialNumbers.filter((_, i) => i !== index);
    setSerialNumbers(newSerialNumbers);
  };

  const handleSerialNumberChange = (index: number, value: string) => {
    const newSerialNumbers = [...serialNumbers];
    newSerialNumbers[index] = value;
    setSerialNumbers(newSerialNumbers);
  };

  // RS-I5: Cargas masivas desde CSV/Excel
  const handleBulkImport = () => {
    const lines = bulkData.trim().split('\n');
    const newSerialNumbers: string[] = [];
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 1 && parts[0].trim()) {
        newSerialNumbers.push(parts[0].trim());
      }
    });
    
    if (newSerialNumbers.length > 0) {
      setSerialNumbers(newSerialNumbers);
      setBulkData('');
      toast({
        title: "Importación exitosa",
        description: `Se importaron ${newSerialNumbers.length} números de serie`
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedModelId || !reason || serialNumbers.every(s => !s.trim())) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const validSerialNumbers = serialNumbers.filter(s => s.trim());
    
    if (movementType === 'entry') {
      registerStockEntry(
        selectedModelId, 
        validSerialNumbers, 
        reason as 'purchase' | 'return' | 'consignment',
        reference || undefined
      );
    } else {
      registerStockExit(
        selectedModelId,
        validSerialNumbers,
        reason as 'sale' | 'promotion' | 'supplier_return',
        reference || undefined
      );
    }

    // Reset form
    setSelectedModelId('');
    setReason('');
    setSerialNumbers(['']);
    setReference('');
    setNotes('');
    setBulkData('');
    onClose();
  };

  const selectedModel = laptopModels.find(m => m.id === selectedModelId);

  const entryReasons = [
    { value: 'purchase', label: 'Compra' },
    { value: 'return', label: 'Devolución de cliente' },
    { value: 'consignment', label: 'Consignación' }
  ];

  const exitReasons = [
    { value: 'sale', label: 'Venta' },
    { value: 'promotion', label: 'Promoción' },
    { value: 'supplier_return', label: 'Devolución a proveedor' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Movimiento */}
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer border-2 ${movementType === 'entry' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              onClick={() => setMovementType('entry')}
            >
              <CardHeader className="text-center">
                <Plus className="h-8 w-8 mx-auto text-green-600" />
                <CardTitle className="text-green-600">Entrada de Stock</CardTitle>
              </CardHeader>
            </Card>
            
            <Card 
              className={`cursor-pointer border-2 ${movementType === 'exit' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              onClick={() => setMovementType('exit')}
            >
              <CardHeader className="text-center">
                <Minus className="h-8 w-8 mx-auto text-red-600" />
                <CardTitle className="text-red-600">Salida de Stock</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Información del Modelo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Modelo de Laptop *</Label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent>
                  {laptopModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.brand} {model.model} - {model.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Motivo *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  {(movementType === 'entry' ? entryReasons : exitReasons).map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información del modelo seleccionado */}
          {selectedModel && (
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedModel.brand} {selectedModel.model}</span>
                  <Badge variant={selectedModel.category === 'gamer' ? 'destructive' : selectedModel.category === 'ultrabook' ? 'default' : 'secondary'}>
                    {selectedModel.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedModel.processor} • {selectedModel.ram} • {selectedModel.storage}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Referencia */}
          <div>
            <Label>Referencia (Factura, Orden, etc.)</Label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: FAC-001, ORD-123"
            />
          </div>

          {/* Importación Masiva */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importación Masiva (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Números de Serie (uno por línea o separados por comas)</Label>
                <Textarea
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  placeholder="SN001&#10;SN002&#10;SN003"
                  rows={4}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBulkImport}
                disabled={!bulkData.trim()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Números de Serie
              </Button>
            </CardContent>
          </Card>

          {/* Números de Serie Individuales */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Números de Serie *</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSerialNumber}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {serialNumbers.map((serial, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={serial}
                    onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                    placeholder={`Número de serie ${index + 1}`}
                  />
                  {serialNumbers.length > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveSerialNumber(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label>Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar {movementType === 'entry' ? 'Entrada' : 'Salida'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;
