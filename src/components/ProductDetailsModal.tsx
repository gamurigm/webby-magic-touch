import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    brand: string;
    model: string;
    category: string;
    processor: string;
    ram: string;
    storage: string;
    screen: string;
    location: string;
    imageUrl?: string;
    description?: string;
    currentStock: number;
    minimumStock: number;
    totalValue: number;
  } | null;
}

// Función para generar URLs de imágenes basadas en el producto
const getProductImageUrl = (product: any): string => {
  // Si ya tiene una URL de imagen, la usa
  if (product.imageUrl) {
    return product.imageUrl;
  }

  const brand = product.brand.toLowerCase();
  const category = product.category.toLowerCase();
  
  // URLs de imágenes por marca y categoría
  const imageUrls: { [key: string]: { [key: string]: string } } = {
    hp: {
      gamer: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop"
    },
    dell: {
      gamer: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop"
    },
    lenovo: {
      gamer: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=400&fit=crop"
    },
    asus: {
      gamer: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop"
    },
    acer: {
      gamer: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop"
    },
    msi: {
      gamer: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop"
    },
    apple: {
      gamer: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
      ultrabook: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop",
      corporativo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      default: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop"
    }
  };

  // Imagen por defecto para laptops
  const defaultLaptopImage = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop";

  // Buscar imagen por marca y categoría
  if (imageUrls[brand]) {
    return imageUrls[brand][category] || imageUrls[brand].default || defaultLaptopImage;
  }

  // Si no encuentra la marca, usar imagen por categoría
  const categoryImages: { [key: string]: string } = {
    gamer: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop",
    ultrabook: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    corporativo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop"
  };

  return categoryImages[category] || defaultLaptopImage;
};

// Función para obtener el color de la categoría
const getCategoryVariant = (category: string): "destructive" | "default" | "secondary" => {
  switch (category.toLowerCase()) {
    case 'gamer':
      return 'destructive';
    case 'ultrabook':
      return 'default';
    default:
      return 'secondary';
  }
};

const ProductDetailsModal = ({ isOpen, onClose, product }: ProductDetailsModalProps) => {
  if (!product) return null;

  const imageUrl = getProductImageUrl(product);
  const categoryVariant = getCategoryVariant(product.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 mb-2">
            {product.brand} {product.model}
            <Badge className="ml-2" variant={categoryVariant}>
              {product.category}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <Card className="border-none shadow-none">
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <div className="relative">
              <img
                src={imageUrl}
                alt={`${product.brand} ${product.model}`}
                className="w-40 h-40 object-contain rounded-lg border bg-gray-50 shadow-sm"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.currentTarget.src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop";
                }}
              />
              {/* Indicador de stock bajo */}
              {product.currentStock <= product.minimumStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Stock bajo
                </div>
              )}
            </div>
            <div className="w-full space-y-2">
              <div className="text-sm text-gray-700">
                <strong>Procesador:</strong> {product.processor}
              </div>
              <div className="text-sm text-gray-700">
                <strong>RAM:</strong> {product.ram}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Almacenamiento:</strong> {product.storage}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Pantalla:</strong> {product.screen}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Ubicación:</strong> {product.location}
              </div>
              <div className="text-sm text-gray-700">
                <strong>Stock disponible:</strong> 
                <span className={product.currentStock <= product.minimumStock ? 'text-red-600 font-semibold' : 'text-green-600'}>
                  {product.currentStock}
                </span>
                <span className="text-gray-500"> (mínimo: {product.minimumStock})</span>
              </div>
              <div className="text-sm text-green-700">
                <strong>Valor total:</strong> ${product.totalValue.toFixed(2)}
              </div>
              {product.description && (
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  {product.description}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;