
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Product } from "../contexts/CatalogContext";
import { toast } from "./ui/sonner";
import { Link } from "lucide-react";

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  onSubmit: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl || "");
  const [redirectUrl, setRedirectUrl] = useState(initialProduct?.redirectUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !redirectUrl) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Validate URL format
    try {
      new URL(redirectUrl);
    } catch (err) {
      toast.error("URL de redirecionamento inválida. Inclua http:// ou https://");
      return;
    }

    setIsLoading(true);
    
    // In a real app, this would upload the image to Supabase Storage
    // For now, we'll just use the URL directly
    try {
      onSubmit({
        name,
        description,
        imageUrl: imageUrl || "/placeholder.svg",
        redirectUrl
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Camiseta Estampada"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Uma breve descrição do seu produto"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
          type="url"
        />
        <p className="text-xs text-muted-foreground">
          Deixe em branco para usar uma imagem padrão
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="redirectUrl">URL de Redirecionamento *</Label>
        <div className="flex items-center space-x-2">
          <Link className="h-4 w-4 text-muted-foreground" />
          <Input
            id="redirectUrl"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://lojinha.com/produto"
            type="url"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="gradient-button"
        >
          {isLoading ? 'Salvando...' : initialProduct?.id ? 'Atualizar Produto' : 'Adicionar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
