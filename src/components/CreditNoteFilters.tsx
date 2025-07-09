
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";

export interface CreditNoteFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  clientName: string;
  reason: string;
}

interface CreditNoteFiltersProps {
  filters: CreditNoteFilters;
  onFiltersChange: (filters: CreditNoteFilters) => void;
  onClearFilters: () => void;
}

const CreditNoteFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: CreditNoteFiltersProps) => {
  const updateFilter = (key: keyof CreditNoteFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Búsqueda General</label>
            <Input
              placeholder="Número, cliente, factura..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Cliente</label>
            <Input
              placeholder="Nombre del cliente"
              value={filters.clientName}
              onChange={(e) => updateFilter('clientName', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Motivo</label>
            <Input
              placeholder="Motivo de la nota"
              value={filters.reason}
              onChange={(e) => updateFilter('reason', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Fecha Desde</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Fecha Hasta</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>

          <div className="flex items-end">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditNoteFiltersComponent;
