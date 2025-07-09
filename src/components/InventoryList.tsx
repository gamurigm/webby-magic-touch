import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Download, AlertTriangle } from "lucide-react";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";

const InventoryList = () => {
  const { laptopModels, getInventoryByModel, updateLaptopModel } = useInventoryManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const inventoryData = getInventoryByModel();
  
  // Filtros
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.processor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesBrand = brandFilter === '' || item.brand === brandFilter;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const brands = [...new Set(laptopModels.map(model => model.brand))];

  // RU-I5: Generar listados de productos en stock
  const exportInventoryReport = () => {
    const reportData = filteredData.map(item => ({
      'Marca': item.brand,
      'Modelo': item.model,
      'Categoría': item.category,
      'Procesador': item.processor,
      'RAM': item.ram,
      'Almacenamiento': item.storage,
      'Pantalla': item.screen,
      'Sistema Operativo': item.operatingSystem,
      'Stock Actual': item.currentStock,
      'Stock Mínimo': item.minimumStock,
      'Costo Unitario': item.cost,
      'Precio Venta': item.price,
      'Valor Total Stock': item.totalValue,
      'Valor Proyectado Venta': item.projectedSaleValue,
      'Ubicación': item.location
    }));

    // Convertir a CSV
    const headers = Object.keys(reportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Inventario de Laptops ({filteredData.length} modelos)</CardTitle>
          <Button onClick={exportInventoryReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por marca, modelo o procesador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              <SelectItem value="gamer">Gamer</SelectItem>
              <SelectItem value="oficina">Oficina</SelectItem>
              <SelectItem value="ultrabook">Ultrabook</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las marcas</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Especificaciones</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precios</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.brand} {item.model}</span>
                      <Badge variant={
                        item.category === 'gamer' ? 'destructive' : 
                        item.category === 'ultrabook' ? 'default' : 'secondary'
                      }>
                        {item.category}
                      </Badge>
                      {item.currentStock <= item.minimumStock && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>{item.processor}</div>
                    <div>{item.ram} RAM • {item.storage}</div>
                    <div>{item.screen} • {item.operatingSystem}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${item.currentStock <= item.minimumStock ? 'text-orange-600' : 'text-green-600'}`}>
                      {item.currentStock}
                    </div>
                    <div className="text-xs text-muted-foreground">Min: {item.minimumStock}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>Costo: ${item.cost}</div>
                    <div>Venta: ${item.price}</div>
                    <div className="text-green-600">
                      Margen: {((item.price - item.cost) / item.cost * 100).toFixed(1)}%
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div>Stock: ${item.totalValue.toFixed(2)}</div>
                    <div className="text-green-600">
                      Proyectado: ${item.projectedSaleValue.toFixed(2)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm">{item.location}</span>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Modelo
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron modelos con los filtros aplicados.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryList;
