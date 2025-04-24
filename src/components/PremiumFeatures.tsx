
import React from "react";
import { Check } from "lucide-react";

interface PremiumFeaturesProps {
  isPremium: boolean;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ isPremium }) => {
  return (
    <div className="rounded-lg bg-white/80 backdrop-blur-sm shadow-md p-5">
      <h3 className="text-lg font-semibold mb-4">
        {isPremium ? "Seu Plano Atual: Premium" : "Recursos Premium"}
      </h3>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Check className={`h-5 w-5 mt-0.5 ${isPremium ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <p className="text-sm font-medium">
              Produtos ilimitados
              {isPremium && <span className="text-green-500 ml-1">(Disponível)</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              Adicione quantos produtos quiser ao seu catálogo
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Check className={`h-5 w-5 mt-0.5 ${isPremium ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <p className="text-sm font-medium">
              Wallpaper personalizado
              {isPremium && <span className="text-green-500 ml-1">(Disponível)</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              Defina uma imagem de fundo personalizada para o seu catálogo
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Check className={`h-5 w-5 mt-0.5 ${isPremium ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <p className="text-sm font-medium">
              Suporte prioritário
              {isPremium && <span className="text-green-500 ml-1">(Disponível)</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              Atendimento prioritário para suas dúvidas e solicitações
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Check className={`h-5 w-5 mt-0.5 ${isPremium ? "text-green-500" : "text-gray-400"}`} />
          <div>
            <p className="text-sm font-medium">
              Estatísticas de visitas
              {isPremium && <span className="text-green-500 ml-1">(Em breve)</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              Acompanhe o desempenho dos seus links [Em desenvolvimento]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;
