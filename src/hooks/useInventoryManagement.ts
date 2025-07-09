import { useState, useEffect } from 'react';
import { LaptopModel, InventoryItem, StockMovement, StockAlert } from "@/types/inventory";
import { toast } from "@/hooks/use-toast";
import { initialLaptopModels } from "@/data/initialLaptopModels";

export const useInventoryManagement = () => {
  const [laptopModels, setLaptopModels] = useState<LaptopModel[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedModels = localStorage.getItem('laptopModels');
    const savedInventory = localStorage.getItem('inventory');
    const savedMovements = localStorage.getItem('stockMovements');
    const savedAlerts = localStorage.getItem('stockAlerts');
    
    if (savedModels) {
      setLaptopModels(JSON.parse(savedModels));
    } else {
      setLaptopModels(initialLaptopModels);
      localStorage.setItem('laptopModels', JSON.stringify(initialLaptopModels));
    }

    // Generar inventario inicial según el mínimo de cada modelo si no hay inventario
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      const initialInventory = initialLaptopModels.flatMap(model =>
        Array.from({ length: model.minimumStock }).map((_, idx) => ({
          id: `${model.id}-SN${idx+1}`,
          laptopModelId: model.id,
          serialNumber: `${model.id}-SN${idx+1}`,
          status: "available" as const,
          dateAdded: new Date().toISOString(),
          location: model.location
        }))
      );
      setInventory(initialInventory);
      localStorage.setItem('inventory', JSON.stringify(initialInventory));
    }
    if (savedMovements) setStockMovements(JSON.parse(savedMovements));
    if (savedAlerts) setStockAlerts(JSON.parse(savedAlerts));
  }, []);

  // RS-I1: Actualizar stock en tiempo real
  const updateStock = (laptopModelId: string, serialNumbers: string[], operation: 'add' | 'remove', reason: StockMovement['reason'], reference?: string) => {
    const movements: StockMovement[] = [];
    const updatedInventory = [...inventory];

    serialNumbers.forEach(serialNumber => {
      if (operation === 'add') {
        const newItem: InventoryItem = {
          id: Date.now().toString() + Math.random(),
          laptopModelId,
          serialNumber,
          status: reason === 'consignment' ? 'consignment' : 'available',
          dateAdded: new Date().toISOString(),
          location: 'Principal'
        };
        updatedInventory.push(newItem);
      } else {
        const itemIndex = updatedInventory.findIndex(item => 
          item.serialNumber === serialNumber && item.status === 'available'
        );
        if (itemIndex !== -1) {
          updatedInventory[itemIndex].status = 'sold';
          updatedInventory[itemIndex].invoiceId = reference;
        }
      }

      movements.push({
        id: Date.now().toString() + Math.random(),
        laptopModelId,
        serialNumber,
        type: operation === 'add' ? 'entry' : 'exit',
        reason,
        quantity: 1,
        date: new Date().toISOString(),
        reference,
        userId: 'current-user'
      });
    });

    setInventory(updatedInventory);
    setStockMovements([...stockMovements, ...movements]);
    
    // Guardar en localStorage
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    localStorage.setItem('stockMovements', JSON.stringify([...stockMovements, ...movements]));

    // RS-I2: Generar alertas automáticas
    checkStockAlerts(laptopModelId, updatedInventory);
  };

  // RU-I4, RS-I2: Configurar y generar alertas automáticas
  const checkStockAlerts = (laptopModelId: string, currentInventory: InventoryItem[]) => {
    const model = laptopModels.find(m => m.id === laptopModelId);
    if (!model) return;

    const currentStock = getCurrentStock(laptopModelId, currentInventory);
    
    if (currentStock <= model.minimumStock) {
      const existingAlert = stockAlerts.find(alert => 
        alert.laptopModelId === laptopModelId && alert.isActive
      );

      if (!existingAlert) {
        const newAlert: StockAlert = {
          id: Date.now().toString(),
          laptopModelId,
          currentStock,
          minimumStock: model.minimumStock,
          alertDate: new Date().toISOString(),
          isActive: true
        };

        const updatedAlerts = [...stockAlerts, newAlert];
        setStockAlerts(updatedAlerts);
        localStorage.setItem('stockAlerts', JSON.stringify(updatedAlerts));

        toast({
          title: "Alerta de Stock Bajo",
          description: `${model.brand} ${model.model} tiene solo ${currentStock} unidades disponibles`,
          variant: "destructive"
        });
      }
    }
  };

  // RU-I3: Consultar niveles de inventario en tiempo real
  const getCurrentStock = (laptopModelId: string, currentInventory?: InventoryItem[]) => {
    const inventoryToUse = currentInventory || inventory;
    return inventoryToUse.filter(item => 
      item.laptopModelId === laptopModelId && 
      (item.status === 'available' || item.status === 'consignment')
    ).length;
  };

  const getInventoryByModel = () => {
    return laptopModels.map(model => ({
      ...model,
      currentStock: getCurrentStock(model.id),
      totalValue: getCurrentStock(model.id) * model.cost,
      projectedSaleValue: getCurrentStock(model.id) * model.price
    }));
  };

  // RU-I1: Registrar entradas de stock
  const registerStockEntry = (laptopModelId: string, serialNumbers: string[], reason: 'purchase' | 'return' | 'consignment', reference?: string) => {
    updateStock(laptopModelId, serialNumbers, 'add', reason, reference);
    toast({
      title: "Entrada de Stock Registrada",
      description: `Se agregaron ${serialNumbers.length} unidades al inventario`
    });
  };

  // RU-I2: Registrar salidas de stock
  const registerStockExit = (laptopModelId: string, serialNumbers: string[], reason: 'sale' | 'promotion' | 'supplier_return', reference?: string) => {
    updateStock(laptopModelId, serialNumbers, 'remove', reason, reference);
    toast({
      title: "Salida de Stock Registrada",
      description: `Se retiraron ${serialNumbers.length} unidades del inventario`
    });
  };

  const addLaptopModel = (model: Omit<LaptopModel, 'id'>) => {
    const newModel: LaptopModel = {
      ...model,
      id: Date.now().toString()
    };
    const updatedModels = [...laptopModels, newModel];
    setLaptopModels(updatedModels);
    localStorage.setItem('laptopModels', JSON.stringify(updatedModels));
    return newModel; // Ahora retorna el modelo creado
  };

  const updateLaptopModel = (modelId: string, updates: Partial<LaptopModel>) => {
    const updatedModels = laptopModels.map(model => 
      model.id === modelId ? { ...model, ...updates } : model
    );
    setLaptopModels(updatedModels);
    localStorage.setItem('laptopModels', JSON.stringify(updatedModels));
  };

  const dismissAlert = (alertId: string) => {
    const updatedAlerts = stockAlerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false } : alert
    );
    setStockAlerts(updatedAlerts);
    localStorage.setItem('stockAlerts', JSON.stringify(updatedAlerts));
  };

  return {
    laptopModels,
    inventory,
    stockMovements,
    stockAlerts: stockAlerts.filter(alert => alert.isActive),
    getCurrentStock,
    getInventoryByModel,
    registerStockEntry,
    registerStockExit,
    addLaptopModel,
    updateLaptopModel,
    dismissAlert,
    checkStockAlerts
  };
};
