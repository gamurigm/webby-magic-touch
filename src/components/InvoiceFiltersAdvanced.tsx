
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X, Download } from "lucide-react";

export interface AdvancedInvoiceFilters {
  searchTerm: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  clientName: string;
  laptopModel: string;
  serialNumber: string;
  minAmount: string;
  maxAmount: string;
}

interface InvoiceFiltersAdvancedProps {
  filters: AdvancedInvoiceFilters;
  onFiltersChange: (filters: AdvancedInvoiceFilters) => void;
  onClearFilters: () => void;
  onExportReport: () => void;
  totalResults: number;
}

const InvoiceFiltersAdvanced = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  onExportReport,
  totalResults 
}: InvoiceFiltersAdvancedProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof AdvancedInvoiceFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda Avanzada de Facturas ({totalResults} resultados)
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExportReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* RU-F5: Búsqueda general por múltiples campos */}
        <div>
          <Label htmlFor="search">Búsqueda General</Label>
          <Input
            id="search"
            placeholder="Buscar por número, cliente, email, modelo, serie..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Filtros avanzados expandibles */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <Label htmlFor="status">Estado de Transacción</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="created">Creada</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                  <SelectItem value="cancelled">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                placeholder="Nombre del cliente"
                value={filters.clientName}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="laptop-model">Modelo de Laptop</Label>
              <Input
                id="laptop-model"
                placeholder="Ej: MacBook Air, XPS 13"
                value={filters.laptopModel}
                onChange={(e) => handleFilterChange('laptopModel', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="serial">Número de Serie</Label>
              <Input
                id="serial"
                placeholder="Número de serie"
                value={filters.serialNumber}
                onChange={(e) => handleFilterChange('serialNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-from">Fecha Desde</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date-to">Fecha Hasta</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="min-amount">Monto Mínimo</Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="0.00"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="max-amount">Monto Máximo</Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="0.00"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceFiltersAdvanced;
