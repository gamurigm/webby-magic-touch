
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProductSelectorProps {
  productType: string;
  onProductTypeChange: (type: string) => void;
  selectedProduct: string;
  onProductSelect: (product: string) => void;
  availableProducts: Array<{ name: string; price: number }>;
  currentProduct: { name: string; quantity: number; price: number };
  onCurrentProductChange: (product: { name: string; quantity: number; price: number }) => void;
  onAddProduct: () => void;
}

const ProductSelector = ({
  productType,
  onProductTypeChange,
  selectedProduct,
  onProductSelect,
  availableProducts,
  currentProduct,
  onCurrentProductChange,
  onAddProduct
}: ProductSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selección de productos</h3>
      
      <RadioGroup value={productType} onValueChange={onProductTypeChange} className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="laptops" id="laptops" />
          <Label htmlFor="laptops">Laptops</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="accessories" id="accessories" />
          <Label htmlFor="accessories">Accesorios</Label>
        </div>
      </RadioGroup>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="product-select">Seleccionar producto</Label>
          <Select value={selectedProduct} onValueChange={onProductSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.name} value={product.name}>
                  {product.name} - ${product.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            type="number"
            min="1"
            value={currentProduct.quantity}
            onChange={(e) => onCurrentProductChange({
              ...currentProduct, 
              quantity: parseInt(e.target.value) || 1
            })}
          />
        </div>
        
        <div>
          <Label htmlFor="price">Precio</Label>
          <Input
            type="number"
            step="0.01"
            value={currentProduct.price}
            onChange={(e) => onCurrentProductChange({
              ...currentProduct, 
              price: parseFloat(e.target.value) || 0
            })}
          />
        </div>
      </div>
      
      <Button onClick={onAddProduct} disabled={!currentProduct.name}>
        Agregar Producto
      </Button>
    </div>
  );
};

export default ProductSelector;
