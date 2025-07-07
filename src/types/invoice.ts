
export interface Invoice {
  id: string;
  number: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  products: Product[];
  paymentMethod: string;
  total: number;
  status: 'created' | 'sent' | 'paid' | 'cancelled';
  cancelledDate?: string;
  cancelReason?: string;
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
}

export interface CreditNote {
  id: string;
  number: string;
  date: string;
  originalInvoiceId: string;
  originalInvoiceNumber: string;
  clientName: string;
  clientEmail: string;
  products: Product[];
  total: number;
  reason: string;
}
