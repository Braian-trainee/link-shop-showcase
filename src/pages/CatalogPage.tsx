
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import WallpaperSelector from "../components/WallpaperSelector";
import { useCatalog, Product } from "../contexts/CatalogContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../components/ui/sonner";
import { ArrowLeft, Pencil, Image, Plus } from "lucide-react";

const CatalogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = new URLSearchParams(location.search).get("edit") === "true";
  const { catalog, isLoading, products, loadCatalog, addProduct, updateProduct, removeProduct, setWallpaper } = useCatalog();
  const { isPremium } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      loadCatalog(id, isEditMode);
    }
  }, [id, isEditMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white drop-shadow">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Catálogo não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O catálogo que você está procurando não existe ou não está disponível.
          </p>
          <a href="/">
            <Button>Voltar à página inicial</Button>
          </a>
        </div>
      </div>
    );
  }

  const handleAddProduct = () => {
    if (!isEditMode) {
      toast.error("Você não tem permissão para adicionar produtos");
      return;
    }

    if (!isPremium && products.length >= 1) {
      toast.error("Plano gratuito permite apenas 1 produto. Faça upgrade para adicionar mais!");
      return;
    }

    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    if (!isEditMode) {
      toast.error("Você não tem permissão para editar produtos");
      return;
    }
    
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (productData: Omit<Product, "id">) => {
    if (currentProduct) {
      await updateProduct(currentProduct.id, productData);
    } else {
      await addProduct(productData);
    }
    setIsFormOpen(false);
  };

  const handleWallpaperEdit = () => {
    if (!isEditMode) {
      toast.error("Você não tem permissão para editar o papel de parede");
      return;
    }

    if (!isPremium) {
      toast.error("Recurso disponível apenas para assinantes premium");
      return;
    }

    setIsWallpaperOpen(true);
  };

  const handleWallpaperSave = async (url: string) => {
    await setWallpaper(url);
    setIsWallpaperOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!isEditMode) {
      toast.error("Você não tem permissão para remover produtos");
      return;
    }

    await removeProduct(id);
  };

  const wallpaperStyle = catalog.wallpaperUrl
    ? { backgroundImage: `url(${catalog.wallpaperUrl})` }
    : { backgroundColor: "#6D28D9" };

  return (
    <div 
      className="min-h-screen catalog-background"
      style={wallpaperStyle}
    >
      <div className="catalog-content min-h-screen flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl mx-auto">
          <header className="text-center mb-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
              Catálogo de Produtos
            </h1>
            <p className="text-lg opacity-90 drop-shadow">
              Confira os produtos disponíveis
            </p>

            {isEditMode && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleWallpaperEdit}
                  disabled={!isPremium}
                >
                  <Image className="h-4 w-4" />
                  {isPremium ? "Editar Wallpaper" : "Wallpaper (Premium)"}
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleAddProduct}
                  disabled={!isPremium && products.length >= 1}
                >
                  <Plus className="h-4 w-4" />
                  {isPremium || products.length === 0 
                    ? "Adicionar Produto" 
                    : "Limite atingido (Plano Gratuito)"}
                </Button>
              </div>
            )}
          </header>
        </div>

        <main className="w-full max-w-3xl mx-auto flex-1">
          {products.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 text-center shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Nenhum produto no catálogo</h2>
              <p className="text-gray-600 mb-6">
                Este catálogo ainda não possui produtos adicionados.
              </p>
              {isEditMode && (
                <Button onClick={handleAddProduct}>
                  Adicionar Primeiro Produto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isEditMode={isEditMode}
                  onEdit={() => handleEditProduct(product)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-12 w-full max-w-3xl mx-auto text-center text-white/80">
          <p className="text-sm">
            Catálogo criado com <span className="font-semibold">LinkShop</span>
          </p>
          <a 
            href="/"
            className="text-xs hover:underline opacity-70 hover:opacity-100 inline-flex items-center mt-1"
          >
            <ArrowLeft className="h-3 w-3 mr-1" /> 
            Voltar à página inicial
          </a>
        </footer>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialProduct={currentProduct || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWallpaperOpen} onOpenChange={setIsWallpaperOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Personalizar Wallpaper</DialogTitle>
          </DialogHeader>
          <WallpaperSelector
            currentWallpaper={catalog.wallpaperUrl}
            onSave={handleWallpaperSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogPage;
