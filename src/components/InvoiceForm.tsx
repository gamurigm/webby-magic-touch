
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductSelector from "./ProductSelector";
import ProductTable from "./ProductTable";
import ClientForm from "./ClientForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import InvoicePreview from "./InvoicePreview";

interface InvoiceFormProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  selectedProduct: string;
  onProductSelect: (product: string) => void;
  availableProducts: Array<{ name: string; price: number }>;
  currentProduct: { name: string; quantity: number; price: number };
  onCurrentProductChange: (product: { name: string; quantity: number; price: number }) => void;
  onAddProduct: () => void;
  products: Array<{ name: string; quantity: number; price: number }>;
  onRemoveProduct: (index: number) => void;
  clientName: string;
  onClientNameChange: (name: string) => void;
  clientEmail: string;
  onClientEmailChange: (email: string) => void;
  clientAddress: string;
  onClientAddressChange: (address: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  autoEmailEnabled: boolean;
  onAutoEmailEnabledChange: (enabled: boolean) => void;
  onSubmit: () => void;
}

const InvoiceForm = ({
  productType,
  onProductTypeChange,
  selectedProduct,
  onProductSelect,
  availableProducts,
  currentProduct,
  onCurrentProductChange,
  onAddProduct,
  products,
  onRemoveProduct,
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  clientAddress,
  onClientAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  autoEmailEnabled,
  onAutoEmailEnabledChange,
  onSubmit
}: InvoiceFormProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle className="text-2xl text-center font-bold">NUEVA FACTURA</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Opción de envío automático */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-email"
              checked={autoEmailEnabled}
              onChange={(e) => onAutoEmailEnabledChange(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="auto-email" className="text-sm font-medium">
              Enviar factura automáticamente por email después de crearla
            </Label>
          </div>
        </div>

        <ProductSelector
          productType={productType}
          onProductTypeChange={onProductTypeChange}
          selectedProduct={selectedProduct}
          onProductSelect={onProductSelect}
          availableProducts={availableProducts}
          currentProduct={currentProduct}
          onCurrentProductChange={onCurrentProductChange}
          onAddProduct={onAddProduct}
        />

        <ProductTable 
          products={products}
          onRemoveProduct={onRemoveProduct}
        />

        <ClientForm
          clientName={clientName}
          onClientNameChange={onClientNameChange}
          clientEmail={clientEmail}
          onClientEmailChange={onClientEmailChange}
          clientAddress={clientAddress}
          onClientAddressChange={onClientAddressChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
          />

          <InvoicePreview products={products} />
        </div>

        <div className="text-center pt-6">
          <Button 
            onClick={onSubmit} 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            EMITIR FACTURA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
