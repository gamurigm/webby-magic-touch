import { useState } from 'react';
import ProductDetailsModal from './ProductDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, AlertTriangle, TrendingDown, TrendingUp, Plus } from "lucide-react";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import InventoryList from "./InventoryList";
import StockMovementForm from "./StockMovementForm";

const InventoryDashboard = () => {
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const {
    laptopModels,
    stockAlerts,
    getInventoryByModel,
    dismissAlert
  } = useInventoryManagement();

  const inventoryData = getInventoryByModel();
  const totalItems = inventoryData.reduce((sum, item) => sum + item.currentStock, 0);
  const totalValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventoryData.filter(item => item.currentStock <= item.minimumStock);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard de Inventario</h1>
      <div className="flex gap-2">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white font-bold shadow"
          onClick={() => setShowMovementForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Gestión de Stock
        </Button>
      </div>
      </div>
      <StockMovementForm isOpen={showMovementForm} onClose={() => setShowMovementForm(false)} />

      {/* Alertas de Stock Bajo */}
      {stockAlerts.length > 0 && (
        <div className="space-y-2">
          {stockAlerts.map(alert => {
            const model = laptopModels.find(m => m.id === alert.laptopModelId);
            return (
              <Alert key={alert.id} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>
                    <strong>{model?.brand} {model?.model}</strong> tiene stock bajo: 
                    {alert.currentStock} unidades (mínimo: {alert.minimumStock})
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Descartar
                  </Button>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dark:bg-[#181c2b] dark:border-[#3b4252]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium dark:text-[#8fbcbb]">Total Items</CardTitle>
            <Package className="h-5 w-5 dark:text-[#88c0d0]" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl md:text-3xl dark:text-[#a3be8c]">{totalItems}</div>
            <p className="text-base dark:text-[#88c0d0]">unidades en stock</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#181c2b] dark:border-[#3b4252]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium dark:text-[#b48ead]">Valor Total</CardTitle>
            <TrendingUp className="h-5 w-5 dark:text-[#b48ead]" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl md:text-3xl dark:text-[#b48ead]">${totalValue.toFixed(2)}</div>
            <p className="text-base dark:text-[#b48ead]">valor del inventario</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#181c2b] dark:border-[#3b4252]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium dark:text-[#ebcb8b]">Modelos</CardTitle>
            <Package className="h-5 w-5 dark:text-[#ebcb8b]" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl md:text-3xl dark:text-[#ebcb8b]">{laptopModels.length}</div>
            <p className="text-base dark:text-[#ebcb8b]">modelos registrados</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-[#181c2b] dark:border-[#3b4252]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium dark:text-[#d08770]">Stock Bajo</CardTitle>
            <TrendingDown className="h-5 w-5 dark:text-[#d08770]" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl md:text-3xl dark:text-[#d08770]">{lowStockItems.length}</div>
            <p className="text-base dark:text-[#d08770]">modelos con stock bajo</p>
          </CardContent>
        </Card>
      </div>

      {/* RU-I3: Consulta de niveles de inventario en tiempo real */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold dark:text-[#8fbcbb]">Niveles de Inventario por Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-all bg-white dark:bg-[#181c2b] dark:border-[#3b4252]"
                onClick={() => {
                  setSelectedProduct(item);
                  setShowProductModal(true);
                }}
                title="Ver detalles del producto"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg md:text-xl dark:text-[#8fbcbb]">{item.brand} {item.model}</h3>
                    <Badge variant={item.category === 'gamer' ? 'destructive' : item.category === 'ultrabook' ? 'default' : 'secondary'} className="text-base md:text-lg dark:bg-[#3b4252] dark:text-[#ebcb8b]">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 dark:text-[#b48ead]">
                    {item.processor} • {item.ram} RAM • {item.storage} • {item.screen}
                  </p>
                  <p className="text-base dark:text-[#a3be8c]">Ubicación: {item.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl md:text-3xl dark:text-[#a3be8c]">{item.currentStock}</span>
                    {item.currentStock <= item.minimumStock && (
                      <AlertTriangle className="h-5 w-5 dark:text-[#d08770]" />
                    )}
                  </div>
                  <p className="text-base dark:text-[#ebcb8b]">Stock disponible</p>
                  <p className="text-base dark:text-[#b48ead]">Mínimo: {item.minimumStock}</p>
                  <p className="text-base dark:text-[#a3be8c] font-bold">Valor: ${item.totalValue.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <ProductDetailsModal
              isOpen={showProductModal}
              onClose={() => setShowProductModal(false)}
              product={selectedProduct}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDashboard;
