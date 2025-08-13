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
import { LoaderPinwheel, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function LoginForm() {
  // Router serve para fazer redirect de páginas
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o login ao enviar o formulário
  const handleLoginSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      // Previne o envio do formulário pelo navegador
      event.preventDefault();
      // Reseta os estados do formulário
      setFormError("");
      setFormLoading(true);

      // Verifica se os inputs existem na página
      if (emailInputRef.current && passwordInputRef.current) {
        // Pega os valores preenchidos nos inputs
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;

        // Validações básicas
        if (!email || !pass1) {
          setFormError("Email e senha são obrigatórios.");
          setFormLoading(false);
          return;
        }

        try {
          // tenta realizar o login
          const response = await axios.post<LoginResponse>("/api/login", {
            email,
            password: pass1,
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
      }
    },
    [router]
  );

  return (
    <form onSubmit={(event) => handleLoginSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            
            Entre com suas credenciais para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {formError && (
            <div className="text-amber-600 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Erro no login</p>
              </div>
              <p className="text-sm mt-1">{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-green-600 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Login realizado com sucesso!</p>
              </div>
              <p className="text-sm mt-1">Redirecionando para o dashboard...</p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading}
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Entrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/cadastro">Não tem conta? Cadastre-se</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
