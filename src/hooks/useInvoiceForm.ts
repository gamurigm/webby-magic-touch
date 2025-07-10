
import { useState, useEffect } from 'react';
import { Invoice, Product, CreditNote } from "@/types/invoice";
import { calculateTaxes } from "@/utils/taxCalculations";
import { toast } from "@/hooks/use-toast";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";

export const useInvoiceForm = () => {
  // Obtener modelos reales del inventario
  const { laptopModels } = useInventoryManagement();
  const [productType, setProductType] = useState<string>('laptops');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState({ name: '', quantity: 1, price: 0 });
  
  // Cliente data
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');

  // Facturas guardadas
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [showInvoiceList, setShowInvoiceList] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [invoiceToEmail, setInvoiceToEmail] = useState<Invoice | null>(null);
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(false);

  // Productos disponibles: usar modelos reales del inventario
  const availableProducts = productType === 'laptops'
    ? laptopModels.map(m => ({ name: m.model, price: m.price }))
    : [
        { name: 'Mouse inalámbrico', price: 29 },
        { name: 'Teclado mecánico', price: 89 },
        { name: 'Monitor 24"', price: 199 },
        { name: 'Webcam HD', price: 59 }
      ];

  const handleProductSelect = (productName: string) => {
    const product = availableProducts.find(p => p.name === productName);
    if (product) {
      setCurrentProduct({ ...currentProduct, name: product.name, price: product.price });
    }
  };

  const addProduct = () => {
    if (currentProduct.name && currentProduct.quantity > 0 && currentProduct.price > 0) {
      setProducts([...products, currentProduct]);
      setCurrentProduct({ name: '', quantity: 1, price: 0 });
      setSelectedProduct('');
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const generateInvoiceNumber = () => {
    return `INV-${Date.now()}`;
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast({
      title: updatedInvoice.status === 'cancelled' ? "Factura anulada" : "Factura actualizada",
      description: updatedInvoice.status === 'cancelled' 
        ? `La factura ${updatedInvoice.number} ha sido anulada`
        : `La factura ${updatedInvoice.number} ha sido actualizada`,
    });
  };

  const handleCreateCreditNote = (creditNote: CreditNote) => {
    const updatedCreditNotes = [...creditNotes, creditNote];
    setCreditNotes(updatedCreditNotes);
    localStorage.setItem('creditNotes', JSON.stringify(updatedCreditNotes));
    
    toast({
      title: "Nota de crédito creada",
      description: `Nota de crédito ${creditNote.number} por $${creditNote.total.toFixed(2)}`,
    });
  };

  const handleSubmit = () => {
    if (!clientName || !clientEmail || products.length === 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Calcular impuestos
    const { subtotal, iva, total } = calculateTaxes(products);

    // Crear nueva factura
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: generateInvoiceNumber(),
      date: new Date().toISOString(),
      clientName,
      clientEmail,
      clientAddress,
      products: [...products],
      paymentMethod,
      subtotal,
      iva,
      total,
      status: 'created'
    };

    // Guardar factura
    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

    // Mostrar factura creada
    setCurrentInvoice(newInvoice);
    setIsInvoiceModalOpen(true);

    toast({
      title: "Factura creada exitosamente",
      description: `Factura ${newInvoice.number} para ${clientName} por $${total.toFixed(2)}`,
    });

    // Si el envío automático está habilitado, abrir diálogo de email
    if (autoEmailEnabled) {
      setInvoiceToEmail(newInvoice);
      setShowEmailDialog(true);
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setProducts([]);
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setCurrentProduct({ name: '', quantity: 1, price: 0 });
    setSelectedProduct('');
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setCurrentInvoice(null);
  };

  const handleEmailSent = (invoice: Invoice) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoice.id ? invoice : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  // Load saved data on initialization
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const savedCreditNotes = localStorage.getItem('creditNotes');
    
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    if (savedCreditNotes) {
      setCreditNotes(JSON.parse(savedCreditNotes));
    }
  }, []);

  return {
    // Product state
    productType,
    setProductType,
    selectedProduct,
    setSelectedProduct,
    products,
    currentProduct,
    setCurrentProduct,
    availableProducts,
    
    // Client state
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientAddress,
    setClientAddress,
    
    // Payment state
    paymentMethod,
    setPaymentMethod,
    
    // Invoice state
    invoices,
    creditNotes,
    currentInvoice,
    isInvoiceModalOpen,
    showInvoiceList,
    setShowInvoiceList,
    showEmailDialog,
    setShowEmailDialog,
    invoiceToEmail,
    setInvoiceToEmail,
    autoEmailEnabled,
    setAutoEmailEnabled,
    
    // Actions
    handleProductSelect,
    addProduct,
    removeProduct,
    handleSubmit,
    handleUpdateInvoice,
    handleCreateCreditNote,
    handleCloseInvoiceModal,
    handleEmailSent
  };
};
