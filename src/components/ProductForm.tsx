
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Product } from "../contexts/CatalogContext";
import { toast } from "./ui/sonner";
import { Link, Upload, Image as ImageIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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
  
  // New state for image upload method and file
  const [imageMethod, setImageMethod] = useState(initialProduct?.imageUrl ? "url" : "upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProduct?.imageUrl || null);

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    let finalImageUrl = imageUrl;

    // If image method is upload and there's a file, process it
    if (imageMethod === "upload" && imageFile) {
      try {
        // In a real app with Supabase, this would upload to storage
        // For now, we'll create an object URL as a placeholder
        finalImageUrl = URL.createObjectURL(imageFile);
        
        // Note: In a real implementation with Supabase, you would:
        // 1. Upload the file to Supabase Storage
        // 2. Get the URL from the response
        // const { data, error } = await supabase.storage
        //   .from('products')
        //   .upload(`${Date.now()}-${imageFile.name}`, imageFile);
        // if (error) throw error;
        // finalImageUrl = supabase.storage.from('products').getPublicUrl(data.path).data.publicUrl;
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Erro ao processar a imagem");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      onSubmit({
        name,
        description,
        imageUrl: finalImageUrl || "/placeholder.svg",
        redirectUrl
      });
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the previous URL if it exists
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
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
        <Label>Imagem do Produto</Label>
        <RadioGroup 
          value={imageMethod} 
          onValueChange={setImageMethod}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url" className="flex items-center cursor-pointer">
              <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              URL da imagem
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload" className="flex items-center cursor-pointer">
              <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
              Upload do computador
            </Label>
          </div>
        </RadioGroup>

        {imageMethod === "url" ? (
          <div className="pt-2">
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              type="url"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Deixe em branco para usar uma imagem padrão
            </p>
          </div>
        ) : (
          <div className="pt-2 space-y-3">
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JPG, PNG, GIF (max 2MB)
            </p>
            
            {previewUrl && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <div className="border rounded-md overflow-hidden w-32 h-32">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
