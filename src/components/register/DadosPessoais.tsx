"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { CadastroData } from "./index";
import { applyCpfMask, applyPhoneMask, applyDateMask, convertDateToHtmlFormat } from "@/lib/masks";

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - todos os campos obrigatórios
    if (!data.nomeCompleto) {
      setFormError("Nome Completo é obrigatório.");
      return;
    }
    if (!data.email) {
      setFormError("E-mail é obrigatório.");
      return;
    }
    if (!data.cpf) {
      setFormError("CPF é obrigatório.");
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

  // Converter data para formato HTML quando necessário
  const getHtmlDateValue = () => {
    if (!data.dataNascimento) return '';
    // Se já está no formato dd/mm/aaaa, converter para aaaa-mm-dd
    if (data.dataNascimento.includes('/')) {
      return convertDateToHtmlFormat(data.dataNascimento);
    }
    return data.dataNascimento;
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
