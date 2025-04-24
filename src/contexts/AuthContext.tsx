import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "../components/ui/sonner";

type User = {
  id: string;
  email: string;
  isPremium: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPremiumStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsPremium(parsedUser.isPremium || false);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email && password) {
        const mockUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          isPremium: false
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success("Login bem-sucedido!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email && password) {
        const mockUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          email,
          isPremium: false
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success("Conta criada com sucesso!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    }
  };

  const checkPremiumStatus = async () => {
    try {
      if (user) {
        const premium = user.isPremium;
        setIsPremium(premium);
        return premium;
      }
      return false;
    } catch (error) {
      console.error("Premium check error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isPremium, 
      login, 
      register, 
      logout,
      checkPremiumStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
