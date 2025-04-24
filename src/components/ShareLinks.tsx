
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "./ui/sonner";
import { Copy, Share, Link } from "lucide-react";

interface ShareLinksProps {
  viewLink: string;
  editLink: string;
}

const ShareLinks: React.FC<ShareLinksProps> = ({ viewLink, editLink }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const getFullUrl = (path: string) => {
    return window.location.origin + path;
  };

  const handleCopy = (type: string, link: string) => {
    const fullUrl = getFullUrl(link);
    navigator.clipboard.writeText(fullUrl);
    setCopied(type);
    toast.success("Link copiado para a área de transferência!");
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  const handleShare = async (link: string) => {
    const fullUrl = getFullUrl(link);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Meu Catálogo de Produtos',
          text: 'Confira os produtos no meu catálogo digital!',
          url: fullUrl
        });
        toast.success("Compartilhado com sucesso!");
      } else {
        handleCopy('view', link);
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      toast.error("Erro ao compartilhar. Tente copiar o link manualmente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Share className="h-5 w-5" />
          Compartilhar Catálogo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Link className="h-4 w-4" />
            Link para visualização:
          </p>
          <div className="flex space-x-2">
            <Input 
              value={getFullUrl(viewLink)} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy('view', viewLink)}
              className={copied === 'view' ? "bg-green-100 text-green-700" : ""}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleShare(viewLink)}>
              Compartilhar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Compartilhe este link com seus clientes. Eles poderão ver seus produtos.
          </p>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Link className="h-4 w-4" />
            Link para edição:
          </p>
          <div className="flex space-x-2">
            <Input 
              value={getFullUrl(editLink)} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopy('edit', editLink)}
              className={copied === 'edit' ? "bg-green-100 text-green-700" : ""}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-amber-600">
            Este link permite editar seu catálogo. Compartilhe apenas com pessoas de confiança.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareLinks;
