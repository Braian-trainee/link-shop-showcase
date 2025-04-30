
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "./ui/sonner";
import { Image, Upload, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface WallpaperSelectorProps {
  currentWallpaper: string | null;
  onSave: (url: string) => void;
}

const SAMPLE_WALLPAPERS = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff"
];

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ currentWallpaper, onSave }) => {
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveWallpaper(customWallpaperUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true);
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        setIsLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Use the data URL as the wallpaper
          saveWallpaper(event.target.result as string);
        }
      };
      reader.onerror = () => {
        toast.error("Erro ao carregar imagem");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const saveWallpaper = async (url: string) => {
    if (!url) {
      toast.error("Por favor insira uma URL válida ou selecione uma imagem");
      return;
    }

    // Validate image URL
    try {
      setIsLoading(true);
      // In a real app, this would upload the image to Supabase Storage
      // For now, we'll just validate the URL and pass it on
      onSave(url);
      toast.success("Papel de parede atualizado com sucesso!");
    } catch (error) {
      console.error("Error saving wallpaper:", error);
      toast.error("Erro ao salvar papel de parede");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Image className="h-5 w-5" />
            Personalizar Papel de Parede
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-medium text-sm mb-2">Atual:</h3>
            {currentWallpaper ? (
              <div className="h-24 w-full rounded-md overflow-hidden">
                <img 
                  src={currentWallpaper} 
                  alt="Papel de parede atual" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                    toast.error("Erro ao carregar imagem");
                  }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum papel de parede definido</p>
            )}
          </div>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" /> URL da Imagem
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload de Arquivo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallpaperUrl">URL da Imagem Personalizada:</Label>
                  <Input
                    id="wallpaperUrl"
                    value={customWallpaperUrl}
                    onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    type="url"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !customWallpaperUrl}
                  className="w-full"
                >
                  {isLoading ? "Salvando..." : "Usar URL Personalizada"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="upload">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Arraste e solte uma imagem ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PNG, JPG, JPEG ou GIF (máx. 5MB)
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleUploadClick}
                    disabled={isLoading}
                    className="mt-2"
                  >
                    Selecionar Arquivo
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Ou escolha um dos nossos wallpapers:</h3>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_WALLPAPERS.map((url) => (
                <button
                  key={url}
                  onClick={() => saveWallpaper(url)}
                  className={`h-16 rounded-md overflow-hidden border-2 hover:opacity-80 transition-opacity ${
                    currentWallpaper === url ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img 
                    src={url} 
                    alt="Wallpaper option" 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WallpaperSelector;
