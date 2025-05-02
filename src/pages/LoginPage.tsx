
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Redirecionar se usuário já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Timer para desbloquear login após tentativas falhas
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, lockTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se conta está bloqueada
    if (isLocked) {
      toast.error(`Muitas tentativas. Tente novamente em ${lockTimer} segundos.`);
      return;
    }
    
    // Validação básica
    if (!email.trim() || !password.trim()) {
      toast.error("Email e senha são obrigatórios");
      return;
    }
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Formato de email inválido");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      setLoginAttempts(0);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      // Incrementar tentativas de login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Bloquear login após 5 tentativas falhas
      if (newAttempts >= 5) {
        setIsLocked(true);
        const lockTime = 30; // 30 segundos
        setLockTimer(lockTime);
        toast.error(`Muitas tentativas. Login bloqueado por ${lockTime} segundos.`);
      } else {
        toast.error("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre na sua conta para acessar seu catálogo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isLocked}
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            {isLocked && (
              <div className="text-center text-sm text-red-500">
                Login temporariamente bloqueado. 
                Tente novamente em {lockTimer} segundos.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full gradient-button"
              disabled={isLoading || isLocked}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-center mt-4">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-brand-600 hover:underline">
                Registre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
