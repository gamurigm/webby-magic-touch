
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import { LaptopModel } from "@/types/inventory";

interface LaptopModelFormProps {
  onClose: () => void;
  onSave: () => void;
  model?: LaptopModel;
}

const LaptopModelForm = ({ onClose, onSave, model }: LaptopModelFormProps) => {
  const { addLaptopModel, updateLaptopModel } = useInventoryManagement();
  const [formData, setFormData] = useState({
    brand: model?.brand || '',
    model: model?.model || '',
    category: model?.category || 'oficina' as const,
    processor: model?.processor || '',
    ram: model?.ram || '',
    storage: model?.storage || '',
    screen: model?.screen || '',
    operatingSystem: model?.operatingSystem || '',
    price: model?.price || 0,
    cost: model?.cost || 0,
    minimumStock: model?.minimumStock || 5,
    location: model?.location || 'Principal'
  });

  const handleSubmit = () => {
    if (model) {
      updateLaptopModel(model.id, formData);
    } else {
      addLaptopModel(formData);
    }
    onSave();
  };

  const isValid = formData.brand && formData.model && formData.processor && 
                 formData.ram && formData.storage && formData.price > 0 && formData.cost > 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {model ? 'Editar Modelo' : 'Agregar Nuevo Modelo'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Marca *</Label>
            <Input
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              placeholder="Ej: Dell, HP, Lenovo"
            />
          </div>

          <div>
            <Label>Modelo *</Label>
            <Input
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              placeholder="Ej: XPS 13, ThinkPad X1"
            />
          </div>

          <div>
            <Label>Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gamer">Gamer</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
                <SelectItem value="ultrabook">Ultrabook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Procesador *</Label>
            <Input
              value={formData.processor}
              onChange={(e) => setFormData({...formData, processor: e.target.value})}
              placeholder="Ej: Intel i7-12700H, AMD Ryzen 7"
            />
          </div>

          <div>
            <Label>RAM *</Label>
            <Input
              value={formData.ram}
              onChange={(e) => setFormData({...formData, ram: e.target.value})}
              placeholder="Ej: 16GB DDR4, 32GB DDR5"
            />
          </div>

          <div>
            <Label>Almacenamiento *</Label>
            <Input
              value={formData.storage}
              onChange={(e) => setFormData({...formData, storage: e.target.value})}
              placeholder="Ej: 512GB SSD, 1TB NVMe"
            />
          </div>

          <div>
            <Label>Pantalla</Label>
            <Input
              value={formData.screen}
              onChange={(e) => setFormData({...formData, screen: e.target.value})}
              placeholder="Ej: 15.6' FHD, 14' 4K OLED"
            />
          </div>

          <div>
            <Label>Sistema Operativo</Label>
            <Input
              value={formData.operatingSystem}
              onChange={(e) => setFormData({...formData, operatingSystem: e.target.value})}
              placeholder="Ej: Windows 11, Ubuntu"
            />
          </div>

          <div>
            <Label>Precio de Venta *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Costo *</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Stock Mínimo</Label>
            <Input
              type="number"
              value={formData.minimumStock}
              onChange={(e) => setFormData({...formData, minimumStock: Number(e.target.value)})}
              placeholder="5"
            />
          </div>

          <div>
            <Label>Ubicación</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Principal"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {model ? 'Actualizar' : 'Crear'} Modelo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaptopModelForm;
