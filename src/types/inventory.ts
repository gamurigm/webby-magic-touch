
export interface LaptopModel {
  id: string;
  brand: string;
  model: string;
  category: 'gamer' | 'oficina' | 'ultrabook';
  processor: string;
  ram: string;
  storage: string;
  screen: string;
  operatingSystem: string;
  price: number;
  cost: number;
  minimumStock: number;
  location: string;
}

export interface InventoryItem {
  id: string;
  laptopModelId: string;
  serialNumber: string;
  status: 'available' | 'sold' | 'reserved' | 'damaged' | 'consignment';
  dateAdded: string;
  invoiceId?: string;
  location: string;
}

export interface StockMovement {
  id: string;
  laptopModelId: string;
  serialNumber?: string;
  type: 'entry' | 'exit';
  reason: 'purchase' | 'return' | 'consignment' | 'sale' | 'promotion' | 'supplier_return' | 'adjustment';
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
  userId: string;
}

export interface StockAlert {
  id: string;
  laptopModelId: string;
  currentStock: number;
  minimumStock: number;
  alertDate: string;
  isActive: boolean;
}

export interface SalesReport {
  id: string;
  reportType: 'daily' | 'monthly' | 'annual';
  startDate: string;
  endDate: string;
  filterBy: 'model' | 'brand' | 'category';
  filterValue: string;
  data: SalesReportData[];
  generatedDate: string;
}

export interface SalesReportData {
  laptopModelId: string;
  brand: string;
  model: string;
  category: string;
  unitsSold: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
}
