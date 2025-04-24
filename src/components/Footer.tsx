
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-800 mb-4">LinkShop</h3>
            <p className="text-gray-600 text-sm">
              Crie catálogos digitais para seus produtos e compartilhe com seus clientes de forma fácil e elegante.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-800 mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/planos" className="text-gray-600 hover:text-brand-500 transition-colors">
                  Planos
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-600 hover:text-brand-500 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-600 hover:text-brand-500 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-800 mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">contato@linkshop.com</li>
              <li className="text-gray-600">© {new Date().getFullYear()} LinkShop. Todos os direitos reservados.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
