
import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📑 Termos de Uso – LinkShop</h1>
      <p className="text-gray-600 mb-8">Última atualização: 23 de abril de 2025</p>

      <div className="prose max-w-none">
        <p>
          Bem-vindo(a) ao <strong>LinkShop</strong>, uma plataforma que permite aos usuários criarem páginas personalizadas com links de seus produtos, de forma semelhante ao Linktree. Ao utilizar nosso serviço, você concorda com os termos descritos abaixo.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar o <strong>LinkShop</strong>, você declara estar de acordo com estes Termos de Uso, nossa Política de Privacidade e todas as demais diretrizes publicadas em nosso site. Caso não concorde com os termos, por favor, não utilize a plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. Cadastro de Usuário</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cadastro com e-mail válido.</li>
          <li>Responsabilidade pelo uso da conta e segurança da senha.</li>
          <li>Proibição de uso de dados falsos ou não autorizados.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Uso da Plataforma</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Plano gratuito: 1 produto.</li>
          <li>Plano premium: produtos ilimitados e wallpaper personalizado.</li>
          <li>O conteúdo dos catálogos é de responsabilidade do usuário.</li>
          <li>Proibido conteúdo ilegal, ofensivo ou que infrinja direitos de terceiros.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Compartilhamento de Links</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Link de <strong>visualização</strong> (público).</li>
          <li>Link de <strong>edição</strong> (privado, com permissão de modificação).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Planos e Pagamentos</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Assinatura mensal via Stripe: <strong>R$19,90</strong>.</li>
          <li>Cancelamento implica perda de acesso às funções premium.</li>
          <li>Processamento seguro via <strong>Stripe</strong>.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. Cancelamento</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Cancelamento a qualquer momento via Stripe.</li>
          <li>Sem reembolso proporcional.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">7. Modificações nos Termos</h2>
        <p>
          Alterações poderão ser feitas e comunicadas aos usuários. O uso contínuo indica aceitação dos novos termos.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">8. Contato</h2>
        <p>
          📧 <a href="mailto:suporte@linkshop.com" className="text-brand-600 hover:underline">suporte@linkshop.com</a>
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
