
import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔒 Política de Privacidade – LinkShop</h1>
      <p className="text-gray-600 mb-8">Última atualização: 23 de abril de 2025</p>

      <div className="prose max-w-none">
        <p>
          A sua privacidade é importante para nós. Esta Política de Privacidade explica como o <strong>LinkShop</strong> coleta, usa e protege seus dados.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Informações Coletadas</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Nome, e-mail, senha (via Supabase).</li>
          <li>Produtos, imagens e links cadastrados.</li>
          <li>Dados de pagamento (via Stripe).</li>
          <li>Dados de navegação (cookies, IP, navegador).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. Uso das Informações</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Criação de conta e uso da plataforma.</li>
          <li>Personalização do catálogo e produtos.</li>
          <li>Processamento de pagamentos.</li>
          <li>Envio de notificações e atualizações.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Compartilhamento de Dados</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Não vendemos dados a terceiros.</li>
          <li>Compartilhamos apenas com:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe</strong>, para pagamento.</li>
              <li><strong>Supabase</strong>, para armazenamento seguro.</li>
              <li>Autoridades legais, quando exigido.</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Armazenamento e Segurança</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Dados protegidos com boas práticas.</li>
          <li>Armazenamento seguro via Supabase.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Cookies</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Usamos cookies para melhorar a experiência do usuário.</li>
          <li>Pode desativar nos ajustes do navegador.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. Direitos do Usuário</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Acesso, correção ou exclusão de dados.</li>
          <li>Solicitação via: <a href="mailto:privacidade@linkshop.com" className="text-brand-600 hover:underline">privacidade@linkshop.com</a></li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">7. Retenção de Dados</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Mantemos dados enquanto a conta estiver ativa.</li>
          <li>Após exclusão, retenção limitada por fins legais.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">8. Alterações nesta Política</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Política pode ser modificada.</li>
          <li>Alterações serão comunicadas por e-mail ou via plataforma.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">9. Contato</h2>
        <p>
          📧 <a href="mailto:privacidade@linkshop.com" className="text-brand-600 hover:underline">privacidade@linkshop.com</a>
        </p>

        <div className="mt-12 text-center text-brand-600">
          💙 Obrigado por utilizar o <strong>LinkShop</strong>!
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
