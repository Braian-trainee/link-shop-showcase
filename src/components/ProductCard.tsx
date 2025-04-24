
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from "../contexts/CatalogContext";
import { Link, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ProductCardProps {
  product: Product;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isEditMode = false,
  onEdit,
  onDelete 
}) => {
  return (
    <Card className="product-card overflow-hidden bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.imageUrl || "/placeholder.svg"} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        {isEditMode ? (
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Sim, excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <a 
            href={product.redirectUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full"
          >
            <Button 
              className="w-full gradient-button text-white flex items-center justify-center"
            >
              Ver Produto
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
