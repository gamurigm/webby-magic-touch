
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/invoice";
import { calculateTaxes } from "@/utils/taxCalculations";

interface ProductTableProps {
  products: Product[];
  onRemoveProduct: (index: number) => void;
}

const ProductTable = ({ products, onRemoveProduct }: ProductTableProps) => {
  const { subtotal, iva, total } = calculateTaxes(products);

  if (products.length === 0) return null;

  return (
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
                  onClick={() => onRemoveProduct(index)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 space-y-2 text-right">
        <p className="text-lg">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="text-lg">IVA (12%): ${iva.toFixed(2)}</p>
        <p className="text-xl font-bold border-t pt-2">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductTable;
