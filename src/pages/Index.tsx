import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";
import InvoiceModal from "@/components/InvoiceModal";
import InvoiceList from "@/components/InvoiceList";
import CreditNoteList from "@/components/CreditNoteList";
import EmailInvoiceDialog from "@/components/EmailInvoiceDialog";
import InvoiceForm from "@/components/InvoiceForm";
import InventoryDashboard from "@/components/InventoryDashboard";

const Index = () => {
  // Tema oscuro/claro
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const {
    // Product state
    productType,
    setProductType,
    selectedProduct,
    setSelectedProduct,
    products,
    currentProduct,
    setCurrentProduct,
    availableProducts,
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientAddress,
    setClientAddress,
    paymentMethod,
    setPaymentMethod,
    invoices,
    creditNotes,
    currentInvoice,
    isInvoiceModalOpen,
    showInvoiceList,
    setShowInvoiceList,
    showEmailDialog,
    setShowEmailDialog,
    invoiceToEmail,
    autoEmailEnabled,
    setAutoEmailEnabled,
    handleProductSelect,
    addProduct,
    removeProduct,
    handleSubmit,
    handleUpdateInvoice,
    handleCreateCreditNote,
    handleCloseInvoiceModal,
    handleEmailSent
  } = useInvoiceForm();

  // Estados para navegación
  const [showCreditNotes, setShowCreditNotes] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Vista de Inventario
  if (showInventory) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Sistema de Inventario</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowInventory(false)}>
                Crear Nueva Factura
              </Button>
              <Button variant="outline" onClick={() => setShowInvoiceList(true)}>
                Ver Facturas
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreditNotes(true)}
                disabled={creditNotes.length === 0}
              >
                Ver Notas de Crédito ({creditNotes.length})
              </Button>
            </div>
          </div>
          <InventoryDashboard />
        </div>
      </div>
    );
  }

  // Vista de Notas de Crédito
  if (showCreditNotes) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestión de Notas de Crédito</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreditNotes(false)}>
                Crear Nueva Factura
              </Button>
              <Button variant="outline" onClick={() => setShowInvoiceList(true)}>
                Ver Facturas
              </Button>
              <Button variant="outline" onClick={() => setShowInventory(true)}>
                Ver Inventario
              </Button>
            </div>
          </div>
          <CreditNoteList creditNotes={creditNotes} />
        </div>
      </div>
    );
  }

  // Vista de Lista de Facturas
  if (showInvoiceList) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestión de Facturas</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowInvoiceList(false)}>
                Crear Nueva Factura
              </Button>
              <Button variant="outline" onClick={() => setShowInventory(true)}>
                Ver Inventario
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreditNotes(true)}
                disabled={creditNotes.length === 0}
              >
                Ver Notas de Crédito ({creditNotes.length})
              </Button>
            </div>
          </div>
          <InvoiceList 
            invoices={invoices} 
            onUpdateInvoice={handleUpdateInvoice}
            onCreateCreditNote={handleCreateCreditNote}
          />
        </div>
      </div>
    );
  }

  // Vista Principal - Crear Factura
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sistema de Facturación</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInventory(true)}
            >
              Inventario
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowInvoiceList(true)}
              disabled={invoices.length === 0}
            >
              Ver Facturas ({invoices.length})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreditNotes(true)}
              disabled={creditNotes.length === 0}
            >
              Ver Notas de Crédito ({creditNotes.length})
            </Button>
          </div>
        </div>

        <InvoiceForm
          productType={productType}
          onProductTypeChange={setProductType}
          selectedProduct={selectedProduct}
          onProductSelect={(product) => {
            setSelectedProduct(product);
            handleProductSelect(product);
          }}
          availableProducts={availableProducts}
          currentProduct={currentProduct}
          onCurrentProductChange={setCurrentProduct}
          onAddProduct={addProduct}
          products={products}
          onRemoveProduct={removeProduct}
          clientName={clientName}
          onClientNameChange={setClientName}
          clientEmail={clientEmail}
          onClientEmailChange={setClientEmail}
          clientAddress={clientAddress}
          onClientAddressChange={setClientAddress}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          autoEmailEnabled={autoEmailEnabled}
          onAutoEmailEnabledChange={setAutoEmailEnabled}
          onSubmit={handleSubmit}
        />
      </div>

      <InvoiceModal 
        invoice={currentInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
      />

      <EmailInvoiceDialog
        invoice={invoiceToEmail}
        isOpen={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        onEmailSent={handleEmailSent}
      />
    </div>
  );
};

export default Index;
