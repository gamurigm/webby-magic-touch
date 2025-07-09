
import { Button } from "@/components/ui/button";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";
import InvoiceModal from "@/components/InvoiceModal";
import InvoiceList from "@/components/InvoiceList";
import EmailInvoiceDialog from "@/components/EmailInvoiceDialog";
import InvoiceForm from "@/components/InvoiceForm";

const Index = () => {
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
    currentInvoice,
    isInvoiceModalOpen,
    showInvoiceList,
    setShowInvoiceList,
    showEmailDialog,
    setShowEmailDialog,
    invoiceToEmail,
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
  } = useInvoiceForm();

  if (showInvoiceList) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Gestión de Facturas</h1>
            <Button onClick={() => setShowInvoiceList(false)}>
              Crear Nueva Factura
            </Button>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div></div>
          <Button 
            variant="outline" 
            onClick={() => setShowInvoiceList(true)}
            disabled={invoices.length === 0}
          >
            Ver Facturas ({invoices.length})
          </Button>
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
