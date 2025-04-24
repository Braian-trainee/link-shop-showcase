
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../components/ui/sonner";
import { Loader2 } from "lucide-react";

const PricingPage: React.FC = () => {
  const { user, isPremium, startPremiumSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleFreePlan = () => {
    if (user) {
      toast.success("Você já está usando o plano gratuito!");
    } else {
      window.location.href = "/register";
    }
  };

  const handlePremiumPlan = async () => {
    if (!user) {
      toast.info("Faça login para assinar o plano premium");
      window.location.href = "/login";
      return;
    }

    if (isPremium) {
      toast.success("Você já possui o plano premium!");
      return;
    }

    setIsLoading(true);
    try {
      await startPremiumSubscription();
    } catch (error) {
      console.error("Premium subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Planos e Preços
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano perfeito para o seu catálogo de produtos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Gratuito */}
          <Card className="border-2 border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">R$0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <CardDescription>Para pequenos vendedores</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>1 produto permitido</span>
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Links de visualização e edição</span>
                </li>
                <li className="flex items-center justify-center opacity-50">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Sem wallpaper personalizado</span>
                </li>
                <li className="flex items-center justify-center opacity-50">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Sem estatísticas de acesso</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleFreePlan}
              >
                {user ? "Plano Atual" : "Começar Grátis"}
              </Button>
            </CardFooter>
          </Card>

          {/* Plano Premium */}
          <Card className="border-2 border-brand-500 rounded-xl bg-gradient-to-b from-brand-50 to-white hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
              RECOMENDADO
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Plano Premium</CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">R$19,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <CardDescription>Para vendedores profissionais</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Produtos ilimitados</span>
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Links de visualização e edição</span>
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Wallpaper personalizado</span>
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Suporte prioritário</span>
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Estatísticas básicas <span className="text-xs">(em breve)</span></span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                className="w-full gradient-button"
                onClick={handlePremiumPlan}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : isPremium ? (
                  "Plano Atual"
                ) : (
                  "Assinar Premium"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
          
          <div className="space-y-6 text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">Como funciona o pagamento?</h3>
              <p className="text-gray-600">
                O pagamento é feito via Stripe com renovação mensal automática. Você pode cancelar a qualquer momento.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Posso mudar de plano depois?</h3>
              <p className="text-gray-600">
                Sim! Você pode fazer upgrade para o plano Premium a qualquer momento. Se você cancelar a assinatura Premium, voltará automaticamente para o plano Gratuito.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">O que acontece aos meus produtos adicionais se eu voltar ao plano gratuito?</h3>
              <p className="text-gray-600">
                Seus produtos adicionais ficarão ocultos, mas não serão excluídos. Ao reativar o plano Premium, todos seus produtos ficarão visíveis novamente.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Ainda tem dúvidas? Entre em contato conosco pelo e-mail <a href="mailto:contato@linkshop.com" className="text-brand-600 hover:underline">contato@linkshop.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
