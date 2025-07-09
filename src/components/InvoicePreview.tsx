
import { Product } from "@/types/invoice";
import { calculateTaxes } from "@/utils/taxCalculations";

interface InvoicePreviewProps {
  products: Product[];
}

const InvoicePreview = ({ products }: InvoicePreviewProps) => {
  const { subtotal, iva, total } = calculateTaxes(products);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vista previa de factura</h3>
      <div className="bg-white border rounded-lg p-4 min-h-[200px]">
        {products.length > 0 && (
          <div className="space-y-2">
            <div className="border-b pb-2">
              <h4 className="font-medium">Productos:</h4>
            </div>
            {products.map((product, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{product.name}</span>
                <span>{product.quantity}</span>
                <span>${(product.quantity * product.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (12%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
