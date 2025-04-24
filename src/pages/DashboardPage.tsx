
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { useCatalog, Product } from "../contexts/CatalogContext";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import WallpaperSelector from "../components/WallpaperSelector";
import ShareLinks from "../components/ShareLinks";
import PremiumBanner from "../components/PremiumBanner";
import PremiumFeatures from "../components/PremiumFeatures";

const DashboardPage: React.FC = () => {
  const { user, isPremium } = useAuth();
  const { catalog, isLoading, products, addProduct, updateProduct, removeProduct, setWallpaper, getViewLink, getEditLink } = useCatalog();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
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

  const handleDeleteProduct = async (id: string) => {
    await removeProduct(id);
  };

  const handlePreview = () => {
    window.open(getViewLink(), "_blank");
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
          </div>
          <Button onClick={handlePreview}>Visualizar Catálogo</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="products">Produtos</TabsTrigger>
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="share">Compartilhar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Seus Produtos</h2>
                    <Button
                      onClick={handleAddProduct}
                      disabled={!isPremium && products.length >= 1}
                      title={!isPremium && products.length >= 1 ? "Plano gratuito permite apenas 1 produto" : ""}
                    >
                      Adicionar Produto
                    </Button>
                  </div>

                  {products.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
                      <h3 className="font-medium text-lg mb-2">Nenhum produto adicionado</h3>
                      <p className="text-gray-600 mb-4">
                        Adicione seu primeiro produto para começar a criar seu catálogo.
                      </p>
                      <Button onClick={handleAddProduct}>Adicionar Primeiro Produto</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isEditMode={true}
                          onEdit={() => handleEditProduct(product)}
                          onDelete={() => handleDeleteProduct(product.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="appearance">
                <WallpaperSelector 
                  currentWallpaper={catalog?.wallpaperUrl || null} 
                  onSave={setWallpaper} 
                />
              </TabsContent>
              
              <TabsContent value="share">
                <ShareLinks 
                  viewLink={getViewLink()} 
                  editLink={getEditLink()} 
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <PremiumBanner />
            <PremiumFeatures isPremium={isPremium} />
          </div>
        </div>
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
    </div>
  );
};

export default DashboardPage;
