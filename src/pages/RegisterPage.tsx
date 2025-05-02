
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterPage: React.FC = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  // Redirecionar se usuário já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Verificar força da senha
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    
    let strength = "";
    
    // Verificar comprimento
    if (password.length < 8) {
      strength = "fraca";
    } else if (password.length >= 12) {
      strength = "forte";
    } else {
      strength = "média";
    }
    
    // Verificar complexidade
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
    
    const complexity = [hasUppercase, hasLowercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (complexity === 4) {
      strength = "forte";
    } else if (complexity === 3 && strength !== "fraca") {
      strength = "média";
    } else if (complexity < 3) {
      strength = "fraca";
    }
    
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "fraca":
        return "text-red-500";
      case "média":
        return "text-yellow-500";
      case "forte":
        return "text-green-500";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    // Validar força da senha
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem!");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Você precisa concordar com os Termos de Uso e Política de Privacidade.");
      return;
    }
    
    // Validar força da senha
    if (passwordStrength === "fraca") {
      toast.warning("Recomendamos uma senha mais forte para maior segurança");
      // Continuamos o processo, mas alertamos o usuário
    }
    
    setIsLoading(true);

    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Registre-se para criar seu catálogo de produtos
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
                disabled={isLoading}
                autoComplete="email"
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
                  minLength={8}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  A senha deve ter pelo menos 8 caracteres
                </span>
                {passwordStrength && (
                  <span className={`font-medium ${getStrengthColor()}`}>
                    Senha {passwordStrength}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ao criar uma conta, concordo com os{" "}
                  <Link to="/termos" className="text-brand-600 hover:underline" target="_blank">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacidade" className="text-brand-600 hover:underline" target="_blank">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full gradient-button"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
            <p className="text-sm text-center mt-4">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-brand-600 hover:underline">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
