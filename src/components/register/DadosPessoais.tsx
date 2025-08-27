"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { CadastroData } from "./index";
import { applyCpfMask, applyPhoneMask, applyDateMask, convertDateToHtmlFormat, validatePassword } from "@/lib/masks";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";

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
  formError, 
  setFormError 
}: DadosPessoaisProps) => {
  const { showError } = useToast();
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  }>({ isValid: false, errors: [], strength: 'weak' });

  // Estados para controlar a visibilidade das senhas
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Validar senha sempre que ela mudar
  useEffect(() => {
    if (data.senha) {
      const validation = validatePassword(data.senha);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, errors: [], strength: 'weak' });
    }
  }, [data.senha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação detalhada com toast para cada campo
    if (!data.nomeCompleto?.trim()) {
      showError("Nome Completo é obrigatório");
      return;
    }
    if (!data.email?.trim()) {
      showError("E-mail é obrigatório");
      return;
    }
    if (!data.cpf?.trim()) {
      showError("CPF é obrigatório");
      return;
    }
    if (!data.dataNascimento?.trim()) {
      showError("Data de Nascimento é obrigatória");
      return;
    }
    if (!data.estadoCivil) {
      showError("Estado Civil é obrigatório");
      return;
    }
    if (!data.tamanhoCamiseta) {
      showError("Tamanho da Camiseta é obrigatório");
      return;
    }
    if (!data.profissao?.trim()) {
      showError("Profissão é obrigatória");
      return;
    }
    if (!data.telefone?.trim()) {
      showError("Telefone é obrigatório");
      return;
    }
    if (!data.contatoEmergencia?.trim()) {
      showError("Contato de Emergência é obrigatório");
      return;
    }
    if (!data.telefoneEmergencia?.trim()) {
      showError("Telefone de Emergência é obrigatório");
      return;
    }
    if (!data.cidade?.trim()) {
      showError("Cidade é obrigatória");
      return;
    }
    
    // Validação da senha usando a nova função
    if (!passwordValidation.isValid) {
      if (passwordValidation.errors.length > 0) {
        showError(passwordValidation.errors[0]);
      } else {
        showError("A senha não atende aos requisitos de segurança");
      }
      return;
    }
    
    if (data.senha !== data.confirmarSenha) {
      showError("As senhas digitadas não são iguais");
      return;
    }
    
    setFormError("");
    onNext();
  };

  // Funções para aplicar máscaras
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyCpfMask(e.target.value);
    updateData({ cpf: maskedValue });
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    updateData({ telefone: maskedValue });
  };

  const handleTelefoneEmergenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    updateData({ telefoneEmergencia: maskedValue });
  };

  const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value);
    updateData({ dataNascimento: maskedValue });
  };

  // Função para obter a cor da força da senha
  const getPasswordStrengthColor = () => {
    switch (passwordValidation.strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Função para obter o texto da força da senha
  const getPasswordStrengthText = () => {
    switch (passwordValidation.strength) {
      case 'weak': return 'Fraca';
      case 'medium': return 'Média';
      case 'strong': return 'Forte';
      default: return '';
    }
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
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={data.cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            maxLength={14}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
          <Input
            id="dataNascimento"
            type="text"
            value={data.dataNascimento}
            onChange={handleDataNascimentoChange}
            placeholder="dd/mm/aaaa"
            maxLength={10}
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
            onChange={handleTelefoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
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
            onChange={handleTelefoneEmergenciaChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
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
          <div className="relative">
            <Input
              id="senha"
              type={showSenha ? "text" : "password"}
              value={data.senha}
              onChange={(e) => updateData({ senha: e.target.value })}
              placeholder="Mín. 6 chars, letra, número e caractere especial"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => setShowSenha(!showSenha)}
            >
              {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {data.senha && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Força da senha:</span>
                <span className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordValidation.strength === 'weak' ? 'bg-red-500 w-1/3' :
                    passwordValidation.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                    passwordValidation.strength === 'strong' ? 'bg-green-500 w-full' : 'bg-gray-300 w-0'
                  }`}
                />
              </div>
              {passwordValidation.errors.length > 0 && (
                <div className="text-sm text-red-600 space-y-1">
                  {passwordValidation.errors.map((error: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>•</span>
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="confirmarSenha">Repita a Senha *</Label>
          <div className="relative">
            <Input
              id="confirmarSenha"
              type={showConfirmarSenha ? "text" : "password"}
              value={data.confirmarSenha}
              onChange={(e) => updateData({ confirmarSenha: e.target.value })}
              placeholder="Confirme sua senha"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
            >
              {showConfirmarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {data.confirmarSenha && data.senha !== data.confirmarSenha && (
            <div className="mt-2 text-sm text-red-600">
              As senhas não coincidem
            </div>
          )}
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
