// components/register/index.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function RegisterForm() {
  const router = useRouter();

  // Referência para os inputs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nomeInputRef = useRef<HTMLInputElement>(null);
  const dataNascimentoInputRef = useRef<HTMLInputElement>(null);
  const profissaoInputRef = useRef<HTMLInputElement>(null);
  const telefoneContatoInputRef = useRef<HTMLInputElement>(null);
  const contatoEmergenciaInputRef = useRef<HTMLInputElement>(null);
  const telefoneContatoEmergenciaInputRef = useRef<HTMLInputElement>(null);
  const cpfInputRef = useRef<HTMLInputElement>(null);
  const estadoCivilInputRef = useRef<HTMLInputElement>(null);
  const tamanhoCamisetaInputRef = useRef<HTMLInputElement>(null);
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

      const emailReg = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );

      if (
        emailInputRef.current &&
        nomeInputRef.current &&
        dataNascimentoInputRef.current &&
        profissaoInputRef.current &&
        telefoneContatoInputRef.current &&
        contatoEmergenciaInputRef.current &&
        telefoneContatoEmergenciaInputRef.current &&
        cpfInputRef.current &&
        estadoCivilInputRef.current &&
        tamanhoCamisetaInputRef.current &&
        passwordInputRef.current &&
        password2InputRef.current
      ) {
        const email = emailInputRef.current.value;
        const nome = nomeInputRef.current.value;
        const dataNascimento = dataNascimentoInputRef.current.value;
        const profissao = profissaoInputRef.current.value;
        const telefoneContato = telefoneContatoInputRef.current.value;
        const contatoEmergencia = contatoEmergenciaInputRef.current.value;
        const telefoneContatoEmergencia =
          telefoneContatoEmergenciaInputRef.current.value;
        const cpf = cpfInputRef.current.value;
        const estadoCivil = estadoCivilInputRef.current.value;
        const tamanhoCamiseta = tamanhoCamisetaInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        let shouldReturnError = false;

        // Validações
        if (!emailReg.test(email)) {
          setFormError("Digite um e-mail válido.");
          shouldReturnError = true;
        }

        if (!nome) {
          setFormError("O nome é obrigatório.");
          shouldReturnError = true;
        }

        if (!dataNascimento) {
          setFormError("A data de nascimento é obrigatória.");
          shouldReturnError = true;
        } else {
          const hoje = new Date();
          const nascimento = new Date(dataNascimento);
          const idade = hoje.getFullYear() - nascimento.getFullYear();
          if (idade < 18) {
            setFormError("Você deve ter pelo menos 18 anos para se cadastrar.");
            shouldReturnError = true;
          }
        }

        if (!profissao) {
          setFormError("A profissão é obrigatória.");
          shouldReturnError = true;
        }

        if (telefoneContato.length < 11 || !/^\d+$/.test(telefoneContato)) {
          setFormError("Telefone de contato inválido. Deve conter 11 dígitos.");
          shouldReturnError = true;
        }

        if (!contatoEmergencia) {
          setFormError("O contato de emergência é obrigatório.");
          shouldReturnError = true;
        }

        if (
          telefoneContatoEmergencia.length < 11 ||
          !/^\d+$/.test(telefoneContatoEmergencia)
        ) {
          setFormError(
            "Telefone de contato de emergência inválido. Deve conter 11 dígitos."
          );
          shouldReturnError = true;
        }

        if (cpf.length !== 14 || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
          setFormError("CPF inválido. Use o formato XXX.XXX.XXX-XX.");
          shouldReturnError = true;
        }

        if (!estadoCivil) {
          setFormError("Selecione o estado civil.");
          shouldReturnError = true;
        }

        if (!tamanhoCamiseta) {
          setFormError("Selecione o tamanho da camiseta.");
          shouldReturnError = true;
        }

        if (pass1.length < 8) {
          setFormError("A senha precisa ter pelo menos 8 caracteres.");
          shouldReturnError = true;
        }

        if (pass1 !== pass2) {
          setFormError("As senhas não são iguais.");
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
            nome,
            dataNascimento,
            profissao,
            telefoneContato,
            contatoEmergencia,
            telefoneContatoEmergencia,
            cpf,
            estadoCivil,
            tamanhoCamiseta,
            password: pass1,
            password2: pass2,
          });

          router.push("/");
          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          if (error instanceof AxiosError) {
            const { error: errorMessage } = error.response
              ?.data as RegisterResponse;

            if (errorMessage === "user already exists") {
              setFormError(
                "Esse e-mail já está registrado. Tente ir para o login."
              );
            } else {
              setFormError(errorMessage || error.message);
            }
          }
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    [router]
  );

  // Função para formatar o CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  return (
    <form onSubmit={(event) => handleRegisterSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            Insira seus dados para se cadastrar.
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
            <Label htmlFor="nome">Nome</Label>
            <Input
              ref={nomeInputRef}
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              ref={dataNascimentoInputRef}
              id="dataNascimento"
              type="date"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              ref={profissaoInputRef}
              id="profissao"
              type="text"
              placeholder="Sua profissão"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefoneContato">Telefone de Contato</Label>
            <Input
              ref={telefoneContatoInputRef}
              id="telefoneContato"
              type="tel"
              placeholder="11999999999"
              required
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contatoEmergencia">Contato de Emergência</Label>
            <Input
              ref={contatoEmergenciaInputRef}
              id="contatoEmergencia"
              type="text"
              placeholder="Nome do contato de emergência"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefoneContatoEmergencia">
              Telefone de Contato de Emergência
            </Label>
            <Input
              ref={telefoneContatoEmergenciaInputRef}
              id="telefoneContatoEmergencia"
              type="tel"
              placeholder="11999999999"
              required
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              ref={cpfInputRef}
              id="cpf"
              type="text"
              placeholder="XXX.XXX.XXX-XX"
              required
              onChange={(e) => {
                e.target.value = formatCPF(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Estado Civil</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  ref={estadoCivilInputRef}
                  type="radio"
                  name="estadoCivil"
                  value="solteiro"
                  required
                />
                Solteiro(a)
              </label>
              <label className="flex items-center gap-2">
                <input
                  ref={estadoCivilInputRef}
                  type="radio"
                  name="estadoCivil"
                  value="casado"
                  required
                />
                Casado(a)
              </label>
              <label className="flex items-center gap-2">
                <input
                  ref={estadoCivilInputRef}
                  type="radio"
                  name="estadoCivil"
                  value="outro"
                  required
                />
                Outro
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tamanho da Camiseta</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  ref={tamanhoCamisetaInputRef}
                  type="radio"
                  name="tamanhoCamiseta"
                  value="P"
                  required
                />
                P
              </label>
              <label className="flex items-center gap-2">
                <input
                  ref={tamanhoCamisetaInputRef}
                  type="radio"
                  name="tamanhoCamiseta"
                  value="M"
                  required
                />
                M
              </label>
              <label className="flex items-center gap-2">
                <input
                  ref={tamanhoCamisetaInputRef}
                  type="radio"
                  name="tamanhoCamiseta"
                  value="G"
                  required
                />
                G
              </label>
              <label className="flex items-center gap-2">
                <input
                  ref={tamanhoCamisetaInputRef}
                  type="radio"
                  name="tamanhoCamiseta"
                  value="GG"
                  required
                />
                GG
              </label>
            </div>
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
          <div className="grid gap-2">
            <Label htmlFor="password2">Repita a senha</Label>
            <Input
              ref={password2InputRef}
              id="password2"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no formulário</p>
              <p>{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-rose-600 mb-4">
              <p className="text-sm font-semibold">
                Cadastro realizado, redirecionando para o app
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
            <Link href="/login">Ir para o login</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}