import { useEffect, useState } from "react";
import Login from "./Login";
import { Button } from "@/components/ui/button";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";
import { useInventoryManagement } from "@/hooks/useInventoryManagement";
import InvoiceModal from "@/components/InvoiceModal";
import InvoiceList from "@/components/InvoiceList";
import CreditNoteList from "@/components/CreditNoteList";
import EmailInvoiceDialog from "@/components/EmailInvoiceDialog";
import InvoiceForm from "@/components/InvoiceForm";
import InventoryDashboard from "@/components/InventoryDashboard";

const Index = () => {
  // Estado de autenticación persistente
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  });
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

  // Hook de inventario
  const { registerStockExit, inventory, laptopModels } = useInventoryManagement();

  // Estados para navegación
  const [showCreditNotes, setShowCreditNotes] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Forzar dashboard de inventario tras login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setShowInventory(true);
    setShowCreditNotes(false);
    setShowInvoiceList(false); // Usar el setter del hook
  };

  // Envolver handleSubmit para descontar inventario
  const handleSubmitWithInventory = () => {
    // Antes de emitir la factura, descontar inventario
    products.forEach(product => {
      // Buscar el modelo correspondiente
      const model = laptopModels.find(m => m.model === product.name);
      if (model) {
        // Buscar seriales disponibles para ese modelo
        const availableSerials = inventory
          .filter(item => item.laptopModelId === model.id && item.status === 'available')
          .slice(0, product.quantity)
          .map(item => item.serialNumber);
        if (availableSerials.length >= product.quantity) {
          registerStockExit(model.id, availableSerials, 'sale');
        } else {
          // Si no hay suficiente stock, mostrar advertencia
          // (opcional: podrías bloquear la emisión de la factura aquí)
          // Por ahora, solo descontamos lo que hay
          registerStockExit(model.id, availableSerials, 'sale');
        }
      }
    });
    handleSubmit();
  };

  // Al cerrar sesión, limpiar navegación
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setShowInventory(false);
    setShowCreditNotes(false);
    setShowInvoiceList(false); // Usar el setter del hook
  };


  // Si no está logueado, mostrar login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Botón de cerrar sesión
  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="ml-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-bold shadow-md transition-all duration-200 text-sm flex items-center gap-1 border-0 focus:outline-none focus:ring-2 focus:ring-red-300"
      style={{ minWidth: 90 }}
      title="Cerrar sesión"
    >
      <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1' />
      </svg>
      Cerrar sesión
    </button>
  );

  // Vista de Inventario (pantalla principal tras login)
  if (showInventory) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Sistema de Inventario</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowInventory(false);
                  setShowInvoiceList(true);
                }}
              >
                Ver Facturas ({invoices.length})
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold shadow"
                onClick={() => setShowInventory(false)}
              >
                Crear Nueva Factura
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreditNotes(true)}
                disabled={creditNotes.length === 0}
              >
                Ver Notas de Crédito ({creditNotes.length})
              </Button>
              <LogoutButton />
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
              <LogoutButton />
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
              <LogoutButton />
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
  // Si no está ninguna navegación, mostrar dashboard de inventario por defecto
  // (esto es redundante, pero asegura que siempre se muestre el dashboard si todo está en false)
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
            <LogoutButton />
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
          onSubmit={handleSubmitWithInventory}
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
