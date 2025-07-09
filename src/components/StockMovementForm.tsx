import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { toast } from "@/hooks/use-toast";
import React from 'react';
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { locations } from "@/data/locations";

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const StockMovementForm = ({ isOpen, onClose }: StockMovementFormProps) => {
  const { laptopModels, registerStockEntry, registerStockExit, addLaptopModel } = useInventoryManagement();
  const [movementType, setMovementType] = useState<'purchase' | 'return' | 'consignment'>('purchase');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [gpu, setGpu] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState('');
  const [location, setLocation] = useState('');

  // Guardar borrador en localStorage
  const handleSaveDraft = () => {
    const draft = {
      movementType, category, brand, model, serial, processor, ram, storage, gpu, quantity, unitCost, location, notes, reason, selectedModelId
    };
    localStorage.setItem('stockEntryDraft', JSON.stringify(draft));
    toast({
      title: "Borrador guardado",
      description: "Puedes continuar más tarde desde este dispositivo."
    });
  };

  // Al abrir, cargar borrador si existe
  React.useEffect(() => {
    if (isOpen) {
      const draft = localStorage.getItem('stockEntryDraft');
      if (draft) {
        const d = JSON.parse(draft);
        setMovementType(d.movementType || 'purchase');
        setCategory(d.category || '');
        setBrand(d.brand || '');
        setModel(d.model || '');
        setSerial(d.serial || '');
        setProcessor(d.processor || '');
        setRam(d.ram || '');
        setStorage(d.storage || '');
        setGpu(d.gpu || '');
        setQuantity(d.quantity || 1);
        setUnitCost(d.unitCost || '');
        setLocation(d.location || '');
        setNotes(d.notes || '');
        setReason(d.reason || '');
        setSelectedModelId(d.selectedModelId || '');
      }
    }
  }, [isOpen]);

  // Autocompletar campos al seleccionar modelo existente
  React.useEffect(() => {
    if (selectedModelId) {
      const m = laptopModels.find(m => m.id === selectedModelId);
      if (m) {
        setCategory(m.category);
        setBrand(m.brand);
        setModel(m.model);
        setProcessor(m.processor);
        setRam(m.ram);
        setStorage(m.storage);
        setLocation(m.location);
        setUnitCost(m.cost.toString());
      }
    }
  }, [selectedModelId]);

  const handleSubmit = () => {
    if (!category || !brand || !model || !processor || !ram || !storage || !gpu || !location || !unitCost || !quantity) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    let modelId = selectedModelId;
    // Si no se seleccionó modelo, crear uno nuevo
    if (!modelId) {
      const validCategories = ['gamer', 'oficina', 'ultrabook'];
      const safeCategory = validCategories.includes(category) ? category : 'oficina';
      const newModel = {
        brand,
        model,
        category: safeCategory as 'gamer' | 'oficina' | 'ultrabook',
        processor,
        ram,
        storage,
        screen: '',
        operatingSystem: '',
        price: 0,
        cost: parseFloat(unitCost),
        minimumStock: 1,
        location
      };
      const createdModel = addLaptopModel(newModel); // Recibe el modelo creado con id
      modelId = createdModel.id;
    }
    if (!modelId) {
      toast({ title: "Error", description: "No se pudo identificar el modelo." });
      return;
    }
    // Generar seriales automáticos vacíos (o puedes usar un patrón)
    const serialNumbers = Array.from({ length: quantity }).map((_, i) => "");
    registerStockEntry(modelId, serialNumbers, movementType, reference);
    toast({
      title: "Ingreso registrado",
      description: `Se registró el ingreso de ${quantity} unidad(es)`
    });
    localStorage.removeItem('stockEntryDraft');
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-blue-200">
        <div className="px-8 py-6">
          <h2 className="text-3xl font-bold text-center mb-1">Ingreso de Stock</h2>
          <p className="text-center text-gray-500 mb-8">Registre nuevas entradas de inventario de laptops accesorios</p>

          {/* Tipo de Ingreso */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded mr-2" />
              <h3 className="text-lg font-semibold">Tipo de Ingreso</h3>
            </div>
            <div className="flex gap-4">
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer ${movementType === 'purchase' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <input type="radio" className="mr-2" checked={movementType === 'purchase'} onChange={() => setMovementType('purchase')} />
                Compra Nueva
              </label>
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer ${movementType === 'return' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <input type="radio" className="mr-2" checked={movementType === 'return'} onChange={() => setMovementType('return')} />
                Devolución Cliente
              </label>
              <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer ${movementType === 'consignment' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <input type="radio" className="mr-2" checked={movementType === 'consignment'} onChange={() => setMovementType('consignment')} />
                Consignación
              </label>
            </div>
          </div>

          {/* Información del Producto */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded mr-2" />
              <h3 className="text-lg font-semibold">Información del Producto</h3>
            </div>
            <div className="mb-4">
              <Label>Modelo existente</Label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo existente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {laptopModels.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.brand} {m.model} ({m.processor}, {m.ram}, {m.storage})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Categoría</Label>
                <Select value={category} onValueChange={setCategory} disabled={!!selectedModelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marca</Label>
                <Select value={brand} onValueChange={setBrand} disabled={!!selectedModelId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modelo</Label>
                <Input value={model} onChange={e => setModel(e.target.value)} placeholder="Ej: E Comprio 52320000" disabled={!!selectedModelId} />
              </div>
              {/* <div>
                <Label>Número de Serie</Label>
                <Input value={serial} onChange={e => setSerial(e.target.value)} placeholder="Ej: AB02345578779" />
              </div> */}
              <div>
                <Label>Procesador</Label>
                <Input value={processor} onChange={e => setProcessor(e.target.value)} placeholder="Ej: Intel Core i7 11700K" disabled={!!selectedModelId} />
              </div>
              <div>
                <Label>RAM (GB)</Label>
                <Input value={ram} onChange={e => setRam(e.target.value)} placeholder="Ej: 16" disabled={!!selectedModelId} />
              </div>
              <div>
                <Label>Almacenamiento</Label>
                <Input value={storage} onChange={e => setStorage(e.target.value)} placeholder="Ej: 512GB SSD" disabled={!!selectedModelId} />
              </div>
              <div>
                <Label>Tarjeta Gráfica</Label>
                <Input value={gpu} onChange={e => setGpu(e.target.value)} placeholder="Ej: NVIDIA GTX 1150" />
              </div>
            </div>
          </div>

          {/* Stock y Precios */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded mr-2" />
              <h3 className="text-lg font-semibold">Stock y Precios</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
              </div>
              <div>
                <Label>Costo Unitario (USD)</Label>
                <Input type="number" min={0} step={0.01} value={unitCost} onChange={e => setUnitCost(e.target.value)} placeholder="$0.00" disabled={!!selectedModelId} />
              </div>
              <div className="md:col-span-2">
                <Label>Ubicación Física</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="mb-8">
            <Label>Notas</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Información adicional..." rows={2} />
          </div>

          {/* Barra inferior de resumen y acciones */}
          <div className="w-full rounded-b-xl bg-gradient-to-r from-blue-600 via-purple-500 to-green-400 px-8 py-5 mt-0 flex flex-col gap-2">
            <div className="text-white font-semibold mb-2">Reesumen del Ingreso</div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-end">
              <Button variant="outline" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold">
                CANCELAR
              </Button>
              <Button variant="outline" className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50 font-semibold" onClick={handleSaveDraft}>
                GUARDAR BORRADOR
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                REGISTRAR INGRESO
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementForm;
