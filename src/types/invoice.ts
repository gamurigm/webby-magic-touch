
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
  status: 'created' | 'sent' | 'paid';
}

export interface Product {
  name: string;
  quantity: number;
  price: number;
}
