// components/register/index.tsx

"use client";

import { RegisterResponse } from "@/app/api/register/route";
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
import { LoaderPinwheel, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function RegisterForm() {
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const password2InputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Função que realiza o cadastro ao enviar o formulário
  const handleRegisterSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError("");
      setFormLoading(true);

      if (
        emailInputRef.current &&
        passwordInputRef.current &&
        password2InputRef.current
      ) {
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        let shouldReturnError = false;

        // Validações básicas
        if (!email) {
          setFormError("O email é obrigatório.");
          shouldReturnError = true;
        }

        if (pass1.length < 6) {
          setFormError("A senha deve ter pelo menos 6 caracteres.");
          shouldReturnError = true;
        }

        if (pass1 !== pass2) {
          setFormError("As senhas não coincidem.");
          shouldReturnError = true;
        }

        if (shouldReturnError) {
          setFormLoading(false);
          setFormSuccess(false);
          return;
        }

        try {
          const response = await axios.post<RegisterResponse>("/api/register", {
            email,
            password: pass1,
            password2: pass2,
          });

          setFormLoading(false);
          setFormSuccess(true);
          
          // Aguarda 2 segundos antes de redirecionar
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          
        } catch (error) {
          if (error instanceof AxiosError) {
            const { error: errorMessage } = error.response
              ?.data as RegisterResponse;

            if (errorMessage === "Este email já está cadastrado") {
              setFormError("Este email já está cadastrado. Tente ir para o login.");
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
    <form onSubmit={(event) => handleRegisterSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta com email e senha.
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
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password2">Repita a senha</Label>
            <Input
              ref={password2InputRef}
              id="password2"
              type="password"
              placeholder="Confirme sua senha"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {formError && (
            <div className="text-amber-600 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Erro no formulário</p>
              </div>
              <p className="text-sm mt-1">{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-green-600 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-semibold">Cadastro realizado com sucesso!</p>
              </div>
              <p className="text-sm mt-1">
                Redirecionando para o login...
              </p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading}
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Cadastrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/login">Já tem conta? Faça login</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
