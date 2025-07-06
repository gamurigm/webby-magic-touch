
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Product {
  name: string;
  quantity: number;
  price: number;
}

const Index = () => {
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

  const laptops = [
    { name: 'MacBook Air M2', price: 1199 },
    { name: 'Dell XPS 13', price: 999 },
    { name: 'HP Spectre x360', price: 1299 },
    { name: 'Lenovo ThinkPad X1', price: 1399 }
  ];

  const accessories = [
    { name: 'Mouse inalámbrico', price: 29 },
    { name: 'Teclado mecánico', price: 89 },
    { name: 'Monitor 24"', price: 199 },
    { name: 'Webcam HD', price: 59 }
  ];

  const availableProducts = productType === 'laptops' ? laptops : accessories;

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

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.quantity * product.price), 0);
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

    toast({
      title: "Factura creada exitosamente",
      description: `Factura para ${clientName} por $${calculateTotal().toFixed(2)}`,
    });

    // Reset form
    setProducts([]);
    setClientName('');
    setClientEmail('');
    setClientAddress('');
    setCurrentProduct({ name: '', quantity: 1, price: 0 });
    setSelectedProduct('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="text-2xl text-center font-bold">NUEVA FACTURA</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Selección de productos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selección de productos</h3>
              
              <RadioGroup value={productType} onValueChange={setProductType} className="flex gap-6">
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
                  <Select value={selectedProduct} onValueChange={(value) => {
                    setSelectedProduct(value);
                    handleProductSelect(value);
                  }}>
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
                    onChange={(e) => setCurrentProduct({...currentProduct, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <Button onClick={addProduct} disabled={!currentProduct.name}>
                Agregar Producto
              </Button>
            </div>

            {/* Tabla de productos */}
            {products.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Productos agregados</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>${(product.quantity * product.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeProduct(index)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <p className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            )}

            {/* Datos del cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Datos del cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Nombre *</Label>
                  <Input
                    id="client-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="client-email">Correo electrónico *</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="client-address">Dirección</Label>
                <Textarea
                  id="client-address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Dirección completa"
                  rows={3}
                />
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Métodos de pago</h3>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card">Tarjeta de crédito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer">Transferencia bancaria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Vista previa de factura */}
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
                      <div className="border-t pt-2 font-bold text-right">
                        Total: ${calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de emisión */}
            <div className="text-center pt-6">
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                EMITIR FACTURA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
