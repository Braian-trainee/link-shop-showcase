
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "./ui/sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumBanner: React.FC = () => {
  const { user, isPremium, startPremiumSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Por favor, faça login para assinar o plano premium");
      navigate("/login"); // Redireciona para a página de login
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting premium subscription from banner");
      await startPremiumSubscription();
      // Note: We don't set isLoading to false here because we're redirecting to Stripe
    } catch (error) {
      console.error("Upgrade error:", error);
      setIsLoading(false);
      toast.error("Erro ao iniciar o processo de assinatura. Tente novamente.");
    }
  };

  if (isPremium) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-brand-50 to-brand-100 border-brand-200">
      <CardHeader>
        <CardTitle className="text-brand-700">Plano Gratuito</CardTitle>
        <CardDescription>Você está usando o plano gratuito com recursos limitados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Produtos permitidos:</span>
          <span>1 (Limitado)</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Wallpaper personalizado:</span>
          <span>Indisponível</span>
        </div>

        <Button 
          className="w-full gradient-button"
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Upgrade para Premium por R$19,90/mês"
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Desbloqueie produtos ilimitados e wallpaper personalizado
        </p>
      </CardContent>
    </Card>
  );
};

export default PremiumBanner;
