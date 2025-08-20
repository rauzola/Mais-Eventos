"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { CadastroData } from "./index";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { applyCpfMask, removeCpfMask, validateCpfNumbers, validateCpf } from "@/lib/cpf-mask";

interface DadosPessoaisProps {
  data: CadastroData;
  updateData: (data: Partial<CadastroData>) => void;
  onNext: () => void;
  formError: string;
  setFormError: (error: string) => void;
}

export const DadosPessoais = ({ 
  data, 
  updateData, 
  onNext, 
  setFormError 
}: DadosPessoaisProps) => {
  const [emailValidation, setEmailValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  }>({ isValidating: false, isValid: null, message: "" });

  const [cpfValidation, setCpfValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
  }>({ isValidating: false, isValid: null, message: "" });

  // Função para verificar campos com debounce simples
  const checkFields = useCallback(async (email?: string, cpf?: string) => {
    try {
      const emailToSend = email || data.email;
      const cpfToSend = cpf || data.cpf; // Enviar com máscara
      
      console.log("Verificando campos:", { email: emailToSend, cpf: cpfToSend });
      
      const response = await axios.post('/api/register/check-fields', {
        email: emailToSend,
        cpf: cpfToSend
      }, {
        timeout: 5000, // Timeout de 5 segundos
        signal: AbortSignal.timeout(5000) // Abort signal para cancelar
      });

      const { emailExists, cpfExists } = response.data;
      console.log("Resposta da API:", { emailExists, cpfExists });

      // Atualizar validação do email
      if (email !== undefined) {
        setEmailValidation({
          isValidating: false,
          isValid: !emailExists,
          message: emailExists ? "Este email já está cadastrado" : "Email disponível"
        });
      }

      // Atualizar validação do CPF
      if (cpf !== undefined) {
        setCpfValidation({
          isValidating: false,
          isValid: !cpfExists,
          message: cpfExists ? "Este CPF já está cadastrado" : "CPF disponível"
        });
      }
    } catch (error) {
      console.error("Erro ao verificar campos:", error);
      
      // Em caso de erro, marcar como válido para não bloquear o usuário
      if (email !== undefined) {
        setEmailValidation({
          isValidating: false,
          isValid: null,
          message: "Verificação indisponível"
        });
      }
      if (cpf !== undefined) {
        setCpfValidation({
          isValidating: false,
          isValid: null,
          message: "Verificação indisponível"
        });
      }
    }
  }, [data.email, data.cpf]);

  // Debounce simples usando useRef
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cpfTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar campos quando ambos estiverem preenchidos
  useEffect(() => {
    const emailValid = data.email && data.email.includes('@');
    const cpfValid = data.cpf && data.cpf.length >= 14; // CPF com máscara tem 14 caracteres (000.000.000-00)
    
    // Só dispara a requisição se ambos os campos estiverem preenchidos
    if (emailValid && cpfValid) {
      setEmailValidation(prev => ({ ...prev, isValidating: true }));
      setCpfValidation(prev => ({ ...prev, isValidating: true }));
      
      // Limpar timeouts anteriores
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current);
      }
      if (cpfTimeoutRef.current) {
        clearTimeout(cpfTimeoutRef.current);
      }
      
      // Novo timeout para verificar ambos os campos
      emailTimeoutRef.current = setTimeout(() => {
        checkFields(data.email, data.cpf);
      }, 800);
    } else {
      // Resetar validações se algum campo não estiver preenchido
      if (!emailValid) {
        setEmailValidation({ isValidating: false, isValid: null, message: "" });
      }
      if (!cpfValid) {
        setCpfValidation({ isValidating: false, isValid: null, message: "" });
      }
    }
  }, [data.email, data.cpf, checkFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há erros de validação
    if (emailValidation.isValid === false) {
      setFormError("Este email já está cadastrado.");
      return;
    }
    if (cpfValidation.isValid === false) {
      setFormError("Este CPF já está cadastrado.");
      return;
    }

    // Validar formato do CPF
    const cpfValidationResult = validateCpf(data.cpf);
    if (!cpfValidationResult.isValid) {
      setFormError(cpfValidationResult.error || "CPF inválido.");
      return;
    }
    
    // Basic validation - todos os campos obrigatórios
    if (!data.nomeCompleto) {
      setFormError("Nome Completo é obrigatório.");
      return;
    }
    if (!data.email) {
      setFormError("E-mail é obrigatório.");
      return;
    }
    if (!data.cpf || data.cpf.length !== 14) {
      setFormError("CPF deve estar no formato 000.000.000-00.");
      return;
    }
    if (!data.dataNascimento) {
      setFormError("Data de Nascimento é obrigatória.");
      return;
    }
    if (!data.estadoCivil) {
      setFormError("Estado Civil é obrigatório.");
      return;
    }
    if (!data.tamanhoCamiseta) {
      setFormError("Tamanho da Camiseta é obrigatório.");
      return;
    }
    if (!data.profissao) {
      setFormError("Profissão é obrigatória.");
      return;
    }
    if (!data.telefone) {
      setFormError("Telefone é obrigatório.");
      return;
    }
    if (!data.contatoEmergencia) {
      setFormError("Contato de Emergência é obrigatório.");
      return;
    }
    if (!data.telefoneEmergencia) {
      setFormError("Telefone de Emergência é obrigatório.");
      return;
    }
    if (!data.cidade) {
      setFormError("Cidade é obrigatória.");
      return;
    }
    if (!data.senha || data.senha.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (data.senha !== data.confirmarSenha) {
      setFormError("As senhas digitadas não são iguais.");
      return;
    }
    
    setFormError("");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nomeCompleto">Nome Completo *</Label>
          <Input
            id="nomeCompleto"
            value={data.nomeCompleto}
            onChange={(e) => updateData({ nomeCompleto: e.target.value })}
            placeholder="Digite seu nome completo"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="seu@email.com"
              required
              className={`pr-10 ${
                emailValidation.isValid === false ? 'border-red-500' : 
                emailValidation.isValid === true ? 'border-green-500' : 
                data.email && data.email.includes('@') ? 'border-blue-300' : ''
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {emailValidation.isValidating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
              {emailValidation.isValid === true && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {emailValidation.isValid === false && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              {data.email && data.email.includes('@') && !emailValidation.isValidating && emailValidation.isValid === null && (
                <div className="h-4 w-4 rounded-full border-2 border-blue-300"></div>
              )}
            </div>
          </div>
          {emailValidation.message && (
            <p className={`text-sm mt-1 ${
              emailValidation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {emailValidation.message}
            </p>
          )}
          {data.email && data.email.includes('@') && !data.cpf && (
            <p className="text-sm mt-1 text-blue-600">
              Preencha o CPF para verificar disponibilidade
            </p>
          )}
                     {data.email && data.email.includes('@') && data.cpf && data.cpf.length >= 14 && 
            !emailValidation.isValidating && emailValidation.isValid === null && 
            !cpfValidation.isValidating && cpfValidation.isValid === null && (
            <p className="text-sm mt-1 text-blue-600">
              Verificando disponibilidade...
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <div className="relative">
            <Input
              id="cpf"
              value={data.cpf}
              onChange={(e) => {
                const maskedValue = applyCpfMask(e.target.value);
                updateData({ cpf: maskedValue });
              }}
              placeholder="000.000.000-00"
              required
                             className={`pr-10 ${
                 cpfValidation.isValid === false ? 'border-red-500' : 
                 cpfValidation.isValid === true ? 'border-green-500' : 
                 data.cpf && data.cpf.length >= 14 ? 'border-blue-300' : ''
               }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {cpfValidation.isValidating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
              {cpfValidation.isValid === true && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {cpfValidation.isValid === false && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
                             {data.cpf && data.cpf.length >= 14 && !cpfValidation.isValidating && cpfValidation.isValid === null && (
                <div className="h-4 w-4 rounded-full border-2 border-blue-300"></div>
              )}
            </div>
          </div>
          {cpfValidation.message && (
            <p className={`text-sm mt-1 ${
              cpfValidation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {cpfValidation.message}
            </p>
          )}
                     {data.cpf && data.cpf.length >= 14 && !data.email && (
            <p className="text-sm mt-1 text-blue-600">
              Preencha o email para verificar disponibilidade
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
          <Input
            id="dataNascimento"
            type="date"
            value={data.dataNascimento}
            onChange={(e) => updateData({ dataNascimento: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="estadoCivil">Estado Civil *</Label>
          <Select value={data.estadoCivil} onValueChange={(value) => updateData({ estadoCivil: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
              <SelectItem value="uniao-estavel">União Estável</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tamanhoCamiseta">Tamanho da Camiseta *</Label>
          <Select value={data.tamanhoCamiseta} onValueChange={(value) => updateData({ tamanhoCamiseta: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pp">PP</SelectItem>
              <SelectItem value="p">P</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="g">G</SelectItem>
              <SelectItem value="gg">GG</SelectItem>
              <SelectItem value="xgg">XGG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="profissao">Profissão *</Label>
          <Input
            id="profissao"
            value={data.profissao}
            onChange={(e) => updateData({ profissao: e.target.value })}
            placeholder="Digite sua profissão"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={data.telefone}
            onChange={(e) => updateData({ telefone: e.target.value })}
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contatoEmergencia">Contato de Emergência *</Label>
          <Input
            id="contatoEmergencia"
            value={data.contatoEmergencia}
            onChange={(e) => updateData({ contatoEmergencia: e.target.value })}
            placeholder="Nome do contato"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="telefoneEmergencia">Telefone de Emergência *</Label>
          <Input
            id="telefoneEmergencia"
            value={data.telefoneEmergencia}
            onChange={(e) => updateData({ telefoneEmergencia: e.target.value })}
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cidade">Cidade *</Label>
          <Input
            id="cidade"
            value={data.cidade}
            onChange={(e) => updateData({ cidade: e.target.value })}
            placeholder="Digite sua cidade"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="h-px bg-border my-6"></div>
        </div>
        
        <div>
          <Label htmlFor="senha">Senha *</Label>
          <Input
            id="senha"
            type="password"
            value={data.senha}
            onChange={(e) => updateData({ senha: e.target.value })}
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="confirmarSenha">Repita a Senha *</Label>
          <Input
            id="confirmarSenha"
            type="password"
            value={data.confirmarSenha}
            onChange={(e) => updateData({ confirmarSenha: e.target.value })}
            placeholder="Confirme sua senha"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-6">
        <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
