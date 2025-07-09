import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, MapPin, Cpu, MemoryStick, HardDrive, Monitor, Layers } from "lucide-react";

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
      <DialogContent
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl p-0 rounded-3xl border-0 shadow-2xl bg-white/80 backdrop-blur-xl animate-fade-in"
        style={{ overflow: "visible" }}
      >
        {/* Solo este botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 bg-white/90 hover:bg-red-100 rounded-full p-2 shadow-lg transition"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
        <DialogHeader>
          <DialogTitle className="w-full flex flex-col items-center justify-center text-center mt-6 mb-2">
            <span className="text-3xl font-extrabold text-blue-900 flex items-center gap-2 justify-center">
              {product.brand} {product.model}
              <Badge
                className={`ml-2 px-4 py-1 text-base rounded-full shadow-lg ${categoryVariant === "destructive" ? "bg-red-500 text-white" : categoryVariant === "default" ? "bg-blue-500 text-white" : "bg-gray-400 text-white"}`}
                variant={categoryVariant}
              >
                {product.category}
              </Badge>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-7 px-10 pb-10 pt-2">
          <div className="relative group -mt-4">
            <img
              src={imageUrl}
              alt={`${product.brand} ${product.model}`}
              className="w-64 h-64 object-contain rounded-2xl border-4 border-white shadow-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop";
              }}
            />
            {product.currentStock <= product.minimumStock && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs px-4 py-1 rounded-full shadow-lg animate-pulse font-semibold">
                Stock bajo
              </div>
            )}
          </div>
          <Card className="w-full border-0 shadow-none bg-transparent">
            <CardContent className="flex flex-col gap-4 p-0">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base text-gray-700">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <span><strong>Procesador:</strong> <span className="text-gray-900">{product.processor}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <MemoryStick className="w-5 h-5 text-purple-500" />
                  <span><strong>RAM:</strong> <span className="text-gray-900">{product.ram}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-green-500" />
                  <span><strong>Almacenamiento:</strong> <span className="text-gray-900">{product.storage}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-pink-500" />
                  <span><strong>Pantalla:</strong> <span className="text-gray-900">{product.screen}</span></span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>
                    <strong>Ubicación:</strong>{" "}
                    <span className="text-gray-900 font-semibold">{product.location}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gray-500" />
                  <span>
                    <strong>Stock:</strong>{" "}
                    <span className={product.currentStock <= product.minimumStock ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                      {product.currentStock}
                    </span>
                    <span className="text-gray-500"> (mín: {product.minimumStock})</span>
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">Valor total:</span>
                  <span className="text-green-700 font-semibold text-lg">${product.totalValue.toFixed(2)}</span>
                </div>
              </div>
              {product.description && (
                <div className="mt-2 text-sm text-gray-700 bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400 shadow-inner text-center">
                  {product.description}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;