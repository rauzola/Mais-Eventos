"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Search } from "lucide-react";
import { CadastroData } from "./index";
import { applyCpfMask, applyPhoneMask, applyDateMask, validatePassword } from "@/lib/masks";
import { citiesParana } from "@/lib/cities-parana";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface DadosPessoaisProps {
  data: CadastroData;
  updateData: (data: Partial<CadastroData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  setFormError: (error: string) => void;
}

export const DadosPessoais = ({ 
  data, 
  updateData, 
  onPrevious,
  onNext, 
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
  
  // Estado para controlar se a opção "Outros" foi selecionada para cidade
  const [showOutraCidade, setShowOutraCidade] = useState(false);
  
  // Estados para busca de cidades
  const [cidadeSearch, setCidadeSearch] = useState("");
  const [showCidadeSelect, setShowCidadeSelect] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Estados para validação de email e CPF
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
    isFormatValid: boolean;
  }>({ isValid: true, message: "", isChecking: false, isFormatValid: true });
  
  const [cpfValidation, setCpfValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
    isFormatValid: boolean;
  }>({ isValid: true, message: "", isChecking: false, isFormatValid: true });
  
  // Estado para validação de telefones diferentes
  const [telefoneValidation, setTelefoneValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: "" });
  
  const emailTimeoutRef = useRef<number | null>(null);
  const cpfTimeoutRef = useRef<number | null>(null);

  // Memoização das cidades filtradas para melhor performance
  const filteredCities = useMemo(() => {
    if (!cidadeSearch.trim()) {
      return citiesParana;
    }
    
    const searchTerm = cidadeSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return citiesParana.filter(city => 
      city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm)
    );
  }, [cidadeSearch]);

  // Debounce para busca de cidades
  const handleCidadeSearch = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = window.setTimeout(() => {
      setCidadeSearch(value);
    }, 300);
  }, []);

  // Limpar timeouts quando componente desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
      if (emailTimeoutRef.current) {
        window.clearTimeout(emailTimeoutRef.current);
      }
      if (cpfTimeoutRef.current) {
        window.clearTimeout(cpfTimeoutRef.current);
      }
    };
  }, []);

  // Validar telefones quando os dados mudarem
  useEffect(() => {
    if (data.telefone && data.telefoneEmergencia) {
      validateTelefonesDiferentes(data.telefone, data.telefoneEmergencia);
    }
  }, [data.telefone, data.telefoneEmergencia]);

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
    if (!emailValidation.isFormatValid) {
      showError("Formato de e-mail inválido");
      return;
    }
    if (!emailValidation.isValid) {
      showError("E-mail já está cadastrado no sistema");
      return;
    }
    if (!data.cpf?.trim()) {
      showError("CPF é obrigatório");
      return;
    }
    if (!cpfValidation.isFormatValid) {
      showError("CPF inválido");
      return;
    }
    if (!cpfValidation.isValid) {
      showError("CPF já está cadastrado no sistema");
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
    
    // Validação dos telefones diferentes
    if (!validateTelefonesDiferentes(data.telefone, data.telefoneEmergencia)) {
      showError("O telefone de emergência deve ser diferente do telefone principal");
      return;
    }
    
    setFormError("");
    onNext();
  };

  // Função para validar se os telefones são diferentes
  const validateTelefonesDiferentes = (telefone: string, telefoneEmergencia: string) => {
    // Remove todos os caracteres não numéricos para comparação
    const telefoneNumeros = telefone.replace(/\D/g, '');
    const telefoneEmergenciaNumeros = telefoneEmergencia.replace(/\D/g, '');
    
    if (telefoneNumeros && telefoneEmergenciaNumeros && telefoneNumeros === telefoneEmergenciaNumeros) {
      setTelefoneValidation({
        isValid: false,
        message: "O telefone de emergência deve ser diferente do telefone principal"
      });
      return false;
    } else {
      setTelefoneValidation({
        isValid: true,
        message: ""
      });
      return true;
    }
  };

  // Funções para aplicar máscaras

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    updateData({ telefone: maskedValue });
    
    // Valida se os telefones são diferentes
    validateTelefonesDiferentes(maskedValue, data.telefoneEmergencia);
  };

  const handleTelefoneEmergenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    updateData({ telefoneEmergencia: maskedValue });
    
    // Valida se os telefones são diferentes
    validateTelefonesDiferentes(data.telefone, maskedValue);
  };

  const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value);
    updateData({ dataNascimento: maskedValue });
  };

  // Função para lidar com a mudança da cidade
  const handleCidadeChange = useCallback((value: string) => {
    if (value === "outros") {
      setShowOutraCidade(true);
      updateData({ cidade: "" });
    } else {
      setShowOutraCidade(false);
      updateData({ cidade: value });
    }
  }, [updateData]);

  // Função para voltar à lista de cidades
  const handleVoltarLista = useCallback(() => {
    setShowOutraCidade(false);
    updateData({ cidade: "" });
  }, [updateData]);

  // Função para validar email
  const validateEmail = useCallback(async (email: string) => {
    if (!email || email.length < 5) {
      setEmailValidation({ isValid: true, message: "", isChecking: false, isFormatValid: true });
      return;
    }

    // Debounce de 500ms para evitar muitas requisições
    if (emailTimeoutRef.current) {
      window.clearTimeout(emailTimeoutRef.current);
    }

    emailTimeoutRef.current = window.setTimeout(async () => {
      try {
        setEmailValidation(prev => ({ ...prev, isChecking: true }));
        
        const response = await fetch('/api/validate-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          const data = await response.json();
          const emailResult = data.results.email;
          
          setEmailValidation({
            isValid: !emailResult.exists,
            message: emailResult.message,
            isChecking: false,
            isFormatValid: !emailResult.message.includes('inválido')
          });
        } else {
          setEmailValidation({
            isValid: true,
            message: "Erro na validação",
            isChecking: false,
            isFormatValid: true
          });
        }
      } catch {
        setEmailValidation({
          isValid: true,
          message: "Erro na validação",
          isChecking: false,
          isFormatValid: true
        });
      }
    }, 500);
  }, []);

  // Função para validar CPF
  const validateCpf = useCallback(async (cpf: string) => {
    if (!cpf || cpf.length < 11) {
      setCpfValidation({ isValid: true, message: "", isChecking: false, isFormatValid: true });
      return;
    }

    // Debounce de 500ms para evitar muitas requisições
    if (cpfTimeoutRef.current) {
      window.clearTimeout(cpfTimeoutRef.current);
    }

    cpfTimeoutRef.current = window.setTimeout(async () => {
      try {
        setCpfValidation(prev => ({ ...prev, isChecking: true }));
        
        const response = await fetch('/api/validate-registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf })
        });

        if (response.ok) {
          const data = await response.json();
          const cpfResult = data.results.cpf;
          
          setCpfValidation({
            isValid: !cpfResult.exists,
            message: cpfResult.message,
            isChecking: false,
            isFormatValid: !cpfResult.message.includes('inválido')
          });
        } else {
          setCpfValidation({
            isValid: true,
            message: "Erro na validação",
            isChecking: false,
            isFormatValid: true
          });
        }
      } catch {
        setCpfValidation({
          isValid: true,
          message: "Erro na validação",
          isChecking: false,
          isFormatValid: true
        });
      }
    }, 500);
  }, []);

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
            autoComplete="name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => {
              updateData({ email: e.target.value });
              validateEmail(e.target.value);
            }}
            placeholder="seu@email.com"
            autoComplete="email"
            required
            className={`${
              !emailValidation.isFormatValid ? 'border-red-500 focus-visible:ring-red-500' :
              !emailValidation.isValid ? 'border-orange-500 focus-visible:ring-orange-500' :
              'border-green-500 focus-visible:ring-green-500'
            }`}
          />
          {emailValidation.isChecking && (
            <div className="mt-1 text-sm text-blue-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Verificando...
            </div>
          )}
          {!emailValidation.isChecking && emailValidation.message && (
            <div className={`mt-1 text-sm ${
              !emailValidation.isFormatValid ? 'text-red-600' :
              !emailValidation.isValid ? 'text-orange-600' :
              'text-green-600'
            } flex items-center gap-2`}>
              {!emailValidation.isFormatValid ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : !emailValidation.isValid ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {emailValidation.message}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={data.cpf}
            onChange={(e) => {
              const maskedValue = applyCpfMask(e.target.value);
              updateData({ cpf: maskedValue });
              validateCpf(maskedValue);
            }}
            placeholder="000.000.000-00"
            maxLength={14}
            autoComplete="off"
            required
            className={`${
              !cpfValidation.isFormatValid ? 'border-red-500 focus-visible:ring-red-500' :
              !cpfValidation.isValid ? 'border-orange-500 focus-visible:ring-orange-500' :
              'border-green-500 focus-visible:ring-green-500'
            }`}
          />
          {cpfValidation.isChecking && (
            <div className="mt-1 text-sm text-blue-600 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Verificando...
            </div>
          )}
          {!cpfValidation.isChecking && cpfValidation.message && (
            <div className={`mt-1 text-sm ${
              !cpfValidation.isFormatValid ? 'text-red-600' :
              !cpfValidation.isValid ? 'text-orange-600' :
              'text-green-600'
            } flex items-center gap-2`}>
              {!cpfValidation.isFormatValid ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {cpfValidation.message}
            </div>
          )}
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
            autoComplete="tel"
            required
            className={!telefoneValidation.isValid ? "border-red-500" : ""}
          />
          {!telefoneValidation.isValid && (
            <p className="text-red-500 text-sm mt-1">{telefoneValidation.message}</p>
          )}
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
            autoComplete="tel"
            required
            className={!telefoneValidation.isValid ? "border-red-500" : ""}
          />
          {!telefoneValidation.isValid && (
            <p className="text-red-500 text-sm mt-1">{telefoneValidation.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="cidade">Cidade *</Label>
          {showOutraCidade ? (
            <div className="space-y-2">
              <Input
                id="cidade"
                value={data.cidade}
                onChange={(e) => updateData({ cidade: e.target.value })}
                placeholder="Digite o nome da sua cidade"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVoltarLista}
                className="text-sm"
              >
                ← Voltar para a lista
              </Button>
            </div>
          ) : (
            <Select 
              value={data.cidade} 
              onValueChange={handleCidadeChange}
              open={showCidadeSelect}
              onOpenChange={setShowCidadeSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione sua cidade" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {/* Campo de busca */}
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar cidade..."
                      value={cidadeSearch}
                      onChange={(e) => handleCidadeSearch(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                </div>
                
                {/* Lista de cidades com virtualização básica */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <SelectItem key={`city-${city}`} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500 text-center">
                      Nenhuma cidade encontrada
                    </div>
                  )}
                </div>
                
                {/* Separador */}
                <div className="h-px bg-gray-200 my-2"></div>
                
                {/* Opção Outros */}
                <SelectItem value="outros" className="font-medium text-gray-600">
                  ✏️ Outros (digite sua cidade)
                </SelectItem>
              </SelectContent>
            </Select>
          )}
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
              autoComplete="new-password"
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
              autoComplete="new-password"
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
      
      <div className="flex justify-between pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="w-full md:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button type="submit" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
