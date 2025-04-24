
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "../components/ui/sonner";

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
};

export type Catalog = {
  id: string;
  userId: string;
  wallpaperUrl: string | null;
  products: Product[];
};

type CatalogContextType = {
  catalog: Catalog | null;
  isLoading: boolean;
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setWallpaper: (url: string) => Promise<void>;
  getViewLink: () => string;
  getEditLink: () => string;
  loadCatalog: (catalogId: string, isEditMode?: boolean) => Promise<void>;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

// Mock data for initial development
const MOCK_CATALOG: Catalog = {
  id: "catalog_default",
  userId: "",
  wallpaperUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  products: [
    {
      id: "product_1",
      name: "Produto Exemplo",
      description: "Este é um produto de demonstração para o plano gratuito.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      redirectUrl: "https://example.com/product"
    }
  ]
};

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isPremium } = useAuth();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's catalog on auth change
  useEffect(() => {
    if (user) {
      loadUserCatalog();
    } else {
      setCatalog(null);
    }
  }, [user]);

  const loadUserCatalog = async () => {
    setIsLoading(true);
    try {
      // Mock loading catalog from database - will be replaced with Supabase query
      const storedCatalog = localStorage.getItem(`catalog_${user?.id}`);
      if (storedCatalog) {
        setCatalog(JSON.parse(storedCatalog));
      } else {
        // Create a new catalog for user
        const newCatalog = {
          ...MOCK_CATALOG,
          userId: user?.id || "",
          id: `catalog_${user?.id}`
        };
        setCatalog(newCatalog);
        localStorage.setItem(`catalog_${user?.id}`, JSON.stringify(newCatalog));
      }
    } catch (error) {
      console.error("Error loading catalog:", error);
      toast.error("Erro ao carregar o catálogo");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCatalog = async (catalogId: string, isEditMode = false) => {
    setIsLoading(true);
    try {
      // This would be a database query in a real app
      // For now, try to load from localStorage as a mock
      const storedCatalog = localStorage.getItem(catalogId);
      if (storedCatalog) {
        setCatalog(JSON.parse(storedCatalog));
      } else if (!isEditMode) {
        // For view mode, create a default catalog
        setCatalog(MOCK_CATALOG);
      } else {
        throw new Error("Catálogo não encontrado");
      }
    } catch (error) {
      console.error("Error loading catalog:", error);
      toast.error("Erro ao carregar o catálogo");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCatalog = async (updatedCatalog: Catalog) => {
    try {
      // Mock saving to database - will be replaced with Supabase upsert
      localStorage.setItem(`catalog_${user?.id}`, JSON.stringify(updatedCatalog));
      localStorage.setItem(updatedCatalog.id, JSON.stringify(updatedCatalog));
    } catch (error) {
      console.error("Error saving catalog:", error);
      toast.error("Erro ao salvar o catálogo");
    }
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    if (!catalog) return;
    if (!isPremium && catalog.products.length >= 1) {
      toast.error("Plano gratuito permite apenas 1 produto. Faça upgrade para adicionar mais!");
      return;
    }

    const newProduct = {
      ...product,
      id: "product_" + Math.random().toString(36).substr(2, 9)
    };

    const updatedCatalog = {
      ...catalog,
      products: [...catalog.products, newProduct]
    };

    setCatalog(updatedCatalog);
    await saveCatalog(updatedCatalog);
    toast.success("Produto adicionado com sucesso!");
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    if (!catalog) return;

    const updatedProducts = catalog.products.map(p => 
      p.id === id ? { ...p, ...product } : p
    );

    const updatedCatalog = {
      ...catalog,
      products: updatedProducts
    };

    setCatalog(updatedCatalog);
    await saveCatalog(updatedCatalog);
    toast.success("Produto atualizado com sucesso!");
  };

  const removeProduct = async (id: string) => {
    if (!catalog) return;

    const updatedCatalog = {
      ...catalog,
      products: catalog.products.filter(p => p.id !== id)
    };

    setCatalog(updatedCatalog);
    await saveCatalog(updatedCatalog);
    toast.success("Produto removido com sucesso!");
  };

  const setWallpaper = async (url: string) => {
    if (!catalog) return;

    const updatedCatalog = {
      ...catalog,
      wallpaperUrl: url
    };

    setCatalog(updatedCatalog);
    await saveCatalog(updatedCatalog);
    toast.success("Papel de parede atualizado com sucesso!");
  };

  const getViewLink = () => {
    if (!catalog) return "";
    return `/catalogo/${catalog.id}`;
  };

  const getEditLink = () => {
    if (!catalog) return "";
    return `/catalogo/${catalog.id}?edit=true`;
  };

  return (
    <CatalogContext.Provider 
      value={{ 
        catalog, 
        isLoading, 
        products: catalog?.products || [],
        addProduct,
        updateProduct,
        removeProduct,
        setWallpaper,
        getViewLink,
        getEditLink,
        loadCatalog
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
};
