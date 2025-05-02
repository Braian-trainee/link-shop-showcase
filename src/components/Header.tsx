
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Home, LogIn, LogOut, User } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              LinkShop
            </span>
          </Link>
          {isMobile && (
            <Link to="/" className="ml-1 p-1.5 rounded-full text-gray-600 hover:bg-gray-100">
              <Home className="h-5 w-5" />
              <span className="sr-only">Página Inicial</span>
            </Link>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-brand-500 transition-colors">
            Início
          </Link>
          {user && (
            <Link to="/dashboard" className="text-gray-700 hover:text-brand-500 transition-colors">
              Dashboard
            </Link>
          )}
          <Link to="/planos" className="text-gray-700 hover:text-brand-500 transition-colors">
            Planos
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Meu Catálogo</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Entrar</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
