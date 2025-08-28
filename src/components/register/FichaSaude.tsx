"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Heart, Shield, FileText } from 'lucide-react';

interface FichaSaudeProps {
  data: {
    portadorDoenca: string;
    alergiaIntolerancia: string;
    medicacaoUso: string;
    restricaoAlimentar: string;
    planoSaude: string;
    operadora?: string;
    numeroPlano?: string;
    termo1: boolean;
    termo2: boolean;
    termo3: boolean;
  };
  updateData: (data: Partial<FichaSaudeProps['data']>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  formError: string;
  setFormError: (error: string) => void;
  formLoading: boolean;
}

export default function FichaSaude({ 
  data, 
  updateData, 
  onPrevious, 
  onSubmit, 
  formError, 
  setFormError,
  formLoading 
}: FichaSaudeProps) {
  // Estados para controlar quais checkboxes estão marcados
  const [checkedFields, setCheckedFields] = useState({
    portadorDoenca: !!data.portadorDoenca,
    alergiaIntolerancia: !!data.alergiaIntolerancia,
    medicacaoUso: !!data.medicacaoUso,
    restricaoAlimentar: !!data.restricaoAlimentar,
    planoSaude: !!data.planoSaude,
  });

  // Função para lidar com mudanças nos checkboxes
  const handleCheckboxChange = (field: keyof typeof checkedFields, checked: boolean) => {
    setCheckedFields(prev => ({ ...prev, [field]: checked }));
    
    // Se desmarcar o checkbox, limpar o campo correspondente
    if (!checked) {
      updateData({ [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required terms
    if (!data.termo1) {
      setFormError("Você deve aceitar o termo 1 para continuar");
      return;
    }
    if (!data.termo2) {
      setFormError("Você deve aceitar o termo 2 para continuar");
      return;
    }
    if (!data.termo3) {
      setFormError("Você deve aceitar o termo 3 para continuar");
      return;
    }
    
    setFormError("");
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção de Saúde */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Heart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Informações de Saúde</h3>
            <p className="text-sm text-gray-600">Marque os campos relevantes e forneça detalhes quando necessário</p>
          </div>
        </div>

        {/* Portador de Doença */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox
              id="portadorDoenca"
              checked={checkedFields.portadorDoenca}
              onCheckedChange={(checked) => handleCheckboxChange('portadorDoenca', checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="portadorDoenca" className="text-base font-medium cursor-pointer text-gray-700">
              É portador de alguma doença?
            </Label>
          </div>
          {checkedFields.portadorDoenca && (
            <div className="ml-6 animate-in slide-in-from-left-2 duration-300">
              <Textarea
                value={data.portadorDoenca}
                onChange={(e) => updateData({ portadorDoenca: e.target.value })}
                placeholder="Descreva se possui alguma doença ou condição de saúde..."
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Alergia ou Intolerância */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox
              id="alergiaIntolerancia"
              checked={checkedFields.alergiaIntolerancia}
              onCheckedChange={(checked) => handleCheckboxChange('alergiaIntolerancia', checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="alergiaIntolerancia" className="text-base font-medium cursor-pointer text-gray-700">
              É alérgico ou intolerante?
            </Label>
          </div>
          {checkedFields.alergiaIntolerancia && (
            <div className="ml-6 animate-in slide-in-from-left-2 duration-300">
              <Textarea
                value={data.alergiaIntolerancia}
                onChange={(e) => updateData({ alergiaIntolerancia: e.target.value })}
                placeholder="Descreva alergias ou intolerâncias alimentares ou medicamentosas..."
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Medicação de Uso Contínuo */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox
              id="medicacaoUso"
              checked={checkedFields.medicacaoUso}
              onCheckedChange={(checked) => handleCheckboxChange('medicacaoUso', checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="medicacaoUso" className="text-base font-medium cursor-pointer text-gray-700">
              Utiliza medicação de uso contínuo?
            </Label>
          </div>
          {checkedFields.medicacaoUso && (
            <div className="ml-6 animate-in slide-in-from-left-2 duration-300">
              <Textarea
                value={data.medicacaoUso}
                onChange={(e) => updateData({ medicacaoUso: e.target.value })}
                placeholder="Liste os medicamentos de uso contínuo..."
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Restrição Alimentar */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox
              id="restricaoAlimentar"
              checked={checkedFields.restricaoAlimentar}
              onCheckedChange={(checked) => handleCheckboxChange('restricaoAlimentar', checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="restricaoAlimentar" className="text-base font-medium cursor-pointer text-gray-700">
              Possui alguma restrição alimentar?
            </Label>
          </div>
          {checkedFields.restricaoAlimentar && (
            <div className="ml-6 animate-in slide-in-from-left-2 duration-300">
              <Textarea
                value={data.restricaoAlimentar}
                onChange={(e) => updateData({ restricaoAlimentar: e.target.value })}
                placeholder="Descreva restrições alimentares específicas..."
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Plano de Saúde */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <Checkbox
              id="planoSaude"
              checked={checkedFields.planoSaude}
              onCheckedChange={(checked) => handleCheckboxChange('planoSaude', checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="planoSaude" className="text-base font-medium cursor-pointer text-gray-700">
              Possui plano de saúde?
            </Label>
          </div>
          {checkedFields.planoSaude && (
            <div className="ml-6 animate-in slide-in-from-left-2 duration-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operadora" className="text-sm font-medium text-gray-700 mb-2 block">
                    Operadora
                  </Label>
                  <input
                    type="text"
                    id="operadora"
                    value={data.operadora || ''}
                    onChange={(e) => updateData({ operadora: e.target.value })}
                    placeholder="Ex: Unimed, Amil, SulAmérica..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroPlano" className="text-sm font-medium text-gray-700 mb-2 block">
                    Número do Plano
                  </Label>
                  <input
                    type="text"
                    id="numeroPlano"
                    value={data.numeroPlano || ''}
                    onChange={(e) => updateData({ numeroPlano: e.target.value })}
                    placeholder="Digite o número do seu plano"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="planoSaudeDetalhes" className="text-sm font-medium text-gray-700 mb-2 block">
                  Detalhes Adicionais (Opcional)
                </Label>
                <Textarea
                  id="planoSaudeDetalhes"
                  value={data.planoSaude}
                  onChange={(e) => updateData({ planoSaude: e.target.value })}
                  placeholder="Informações adicionais sobre o plano de saúde..."
                  className="w-full border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Termos e Condições */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Termos e Condições</h3>
            <p className="text-sm text-gray-600">Leia e aceite os termos para prosseguir com o cadastro</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termo1"
                checked={data.termo1}
                onCheckedChange={(checked) => updateData({ termo1: checked as boolean })}
                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label htmlFor="termo1" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                <strong className="text-green-700">1.</strong> Considero-me plenamente apto a realizar atividades físicas, eximindo o PROJETO MAIS VIDA de qualquer responsabilidade civil.
              </Label>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termo2"
                checked={data.termo2}
                onCheckedChange={(checked) => updateData({ termo2: checked as boolean })}
                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label htmlFor="termo2" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                <strong className="text-green-700">2.</strong> Assumo integralmente a responsabilidade por eventuais danos que eu venha a sofrer em caso de saída não autorizada do local escolhido para o Acampamento do Projeto Mais Vida e/ou pelo descumprimento das normas e orientações de segurança dadas pela equipe de organização do evento, inclusive em relação aos horários de recolhimento e silêncio.
              </Label>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="termo3"
                checked={data.termo3}
                onCheckedChange={(checked) => updateData({ termo3: checked as boolean })}
                className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label htmlFor="termo3" className="text-sm leading-relaxed text-gray-700 cursor-pointer">
                <strong className="text-green-700">3.</strong> Eu autorizo ao Projeto Mais Vida, pessoa jurídica de direito privado, devidamente inscrito no CNPJ sob nº 04.585.680/0001-03, com sede à praça da Catedral, Zona 1, em Maringá, no estado do Paraná – CEP: 87.010-530 a utilização do meu nome, meu áudio, vídeo e da minha imagem, para veiculação de propagandas desta empresa, em jornais, rádios, televisões, internet, panfletos publicitários entre outros. Estou ciente, que diante desta autorização, não posso reclamar contra o Projeto Mais Vida, nenhum tipo de indenização relativa a direitos autorais, direitos de imagem, danos morais ou qualquer outro tipo de indenização, em tempo ou lugar algum. Sendo assim, firmo ser verdade todas as informações acima descritas e autorizo o termo descrito.
              </Label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botões de Navegação */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious} 
          className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors" 
          disabled={formLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
          disabled={formLoading}
        >
          <Check className="mr-2 h-4 w-4" />
          {formLoading ? "Finalizando..." : "Finalizar Cadastro"}
        </Button>
      </div>
    </form>
  );
}
