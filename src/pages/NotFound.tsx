
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-8xl font-bold text-brand-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button className="gradient-button">Voltar à página inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
