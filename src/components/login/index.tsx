"use client";

import { LoginResponse } from "@/app/api/login/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { Heart, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

export function LoginForm() {
  const router = useRouter();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Função que realiza o login ao enviar o formulário
  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError("");
      setFormLoading(true);

      // Validações básicas
      if (!email || !password) {
        setFormError("Email e senha são obrigatórios.");
        setFormLoading(false);
        return;
      }

      try {
        // tenta realizar o login
        await axios.post<LoginResponse>("/api/login", {
          email,
          password,
        });

        // se chegar aqui, o login deu certo
        setFormLoading(false);
        setFormSuccess(true);
        
        // Aguarda 1 segundo antes de redirecionar e força refresh do layout
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 500);
        
      } catch (error) {
        // Tratamento de erro melhorado
        if (error instanceof AxiosError) {
          const { error: errorMessage } = error.response?.data as LoginResponse;
          
          if (errorMessage === "Credenciais inválidas") {
            setFormError("Email ou senha incorretos.");
          } else {
            setFormError(errorMessage || "Erro interno do servidor. Tente novamente.");
          }
        } else {
          setFormError("Erro inesperado. Tente novamente.");
        }
        
        setFormLoading(false);
        setFormSuccess(false);
      }
    },
    [email, password, router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-blue-600">Projeto Mais Vida</h1>
          </div>
          <p className="text-gray-600">
            Bem-vindo de volta! Faça login para continuar sua jornada.
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              {formError && (
                <div className="text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm font-semibold">Erro no login</p>
                  </div>
                  <p className="text-sm mt-1">{formError}</p>
                </div>
              )}
              {formSuccess && (
                <div className="text-green-600 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <p className="text-sm font-semibold">Login realizado com sucesso!</p>
                  </div>
                  <p className="text-sm mt-1">Redirecionando para o dashboard...</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
                disabled={formLoading}
              >
                {formLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-gray-600">Não tem uma conta? </span>
                <Link 
                  href="/cadastro" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Cadastre-se
                </Link>
              </div>
              <div className="text-center">
                <Link 
                  href="#" 
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
