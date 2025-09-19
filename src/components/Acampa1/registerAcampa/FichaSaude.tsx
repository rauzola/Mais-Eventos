"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Heart, Shield, FileText, Activity, AlertTriangle, Pill, Utensils, Stethoscope } from 'lucide-react';
import { CadastroData } from './index';
import { useToast } from '@/components/ui/toast';

interface FichaSaudeProps {
  data: CadastroData;
  updateData: (data: Partial<CadastroData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  formError: string;
  setFormError: (error: string) => void;
  formLoading: boolean;
}

export const FichaSaude = ({ 
  data, 
  updateData, 
  onPrevious, 
  onNext, 
  formError, 
  setFormError,
  formLoading 
}: FichaSaudeProps) => {
  const { showError } = useToast();
  
  // Estados para controlar quais campos estão ativos
  const [portadorDoencaAtivo, setPortadorDoencaAtivo] = useState(false);
  const [alergiaIntoleranciaAtivo, setAlergiaIntoleranciaAtivo] = useState(false);
  const [medicacaoUsoAtivo, setMedicacaoUsoAtivo] = useState(false);
  const [restricaoAlimentarAtivo, setRestricaoAlimentarAtivo] = useState(false);
  const [planoSaudeAtivo, setPlanoSaudeAtivo] = useState(false);

  // Sincronizar estados dos checkboxes com dados existentes
  useEffect(() => {
    setPortadorDoencaAtivo(!!data.portadorDoenca);
    setAlergiaIntoleranciaAtivo(!!data.alergiaIntolerancia);
    setMedicacaoUsoAtivo(!!data.medicacaoUso);
    setRestricaoAlimentarAtivo(!!data.restricaoAlimentar);
    // Não sincronizar planoSaudeAtivo aqui, deixar o estado local controlar
  }, [data]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header da seção */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Stethoscope className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ficha de Saúde</h2>
        <p className="text-gray-600">Informe sobre sua condição de saúde para melhor atendimento</p>
      </div>

      <div className="space-y-6">
        {/* Campo 1: Portador de Doença */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                portadorDoencaAtivo 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="portadorDoencaCheck"
                  checked={portadorDoencaAtivo}
                  onCheckedChange={(checked) => {
                    setPortadorDoencaAtivo(checked as boolean);
                    if (!checked) {
                      updateData({ portadorDoenca: "" });
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor="portadorDoencaCheck" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  É portador de alguma doença?
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Informe sobre condições de saúde que possam afetar sua participação
              </p>
            </div>
          </div>
          {portadorDoencaAtivo && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Textarea
                id="portadorDoenca"
                value={data.portadorDoenca}
                onChange={(e) => updateData({ portadorDoenca: e.target.value })}
                placeholder="Descreva detalhadamente sua condição de saúde, sintomas e qualquer informação relevante..."
                className="mt-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Campo 2: Alergia/Intolerância */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                alergiaIntoleranciaAtivo 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="alergiaIntoleranciaCheck"
                  checked={alergiaIntoleranciaAtivo}
                  onCheckedChange={(checked) => {
                    setAlergiaIntoleranciaAtivo(checked as boolean);
                    if (!checked) {
                      updateData({ alergiaIntolerancia: "" });
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor="alergiaIntoleranciaCheck" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  É alérgico ou intolerante?
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Alergias alimentares, medicamentosas ou outras intolerâncias
              </p>
            </div>
          </div>
          {alergiaIntoleranciaAtivo && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Textarea
                id="alergiaIntolerancia"
                value={data.alergiaIntolerancia}
                onChange={(e) => updateData({ alergiaIntolerancia: e.target.value })}
                placeholder="Descreva suas alergias ou intolerâncias, sintomas e gravidade..."
                className="mt-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Campo 3: Medicação de Uso Contínuo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                medicacaoUsoAtivo 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Pill className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="medicacaoUsoCheck"
                  checked={medicacaoUsoAtivo}
                  onCheckedChange={(checked) => {
                    setMedicacaoUsoAtivo(checked as boolean);
                    if (!checked) {
                      updateData({ medicacaoUso: "" });
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor="medicacaoUsoCheck" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  Utiliza medicação de uso contínuo?
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Medicamentos que você toma regularmente
              </p>
            </div>
          </div>
          {medicacaoUsoAtivo && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Textarea
                id="medicacaoUso"
                value={data.medicacaoUso}
                onChange={(e) => updateData({ medicacaoUso: e.target.value })}
                placeholder="Liste os medicamentos, dosagens e horários de uso..."
                className="mt-3 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Campo 4: Restrição Alimentar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                restricaoAlimentarAtivo 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Utensils className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="restricaoAlimentarCheck"
                  checked={restricaoAlimentarAtivo}
                  onCheckedChange={(checked) => {
                    setRestricaoAlimentarAtivo(checked as boolean);
                    if (!checked) {
                      updateData({ restricaoAlimentar: "" });
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor="restricaoAlimentarCheck" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  Possui alguma restrição alimentar?
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Dietas especiais, intolerâncias ou preferências alimentares
              </p>
            </div>
          </div>
          {restricaoAlimentarAtivo && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <Textarea
                id="restricaoAlimentar"
                value={data.restricaoAlimentar}
                onChange={(e) => updateData({ restricaoAlimentar: e.target.value })}
                placeholder="Descreva suas restrições alimentares, alimentos que não pode consumir..."
                className="mt-3 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 transition-colors duration-200"
                rows={3}
              />
            </div>
          )}
        </div>
        
        {/* Campo 5: Plano de Saúde */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                planoSaudeAtivo 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                                 <Checkbox
                   id="planoSaudeCheck"
                   checked={planoSaudeAtivo}
                                                             onCheckedChange={(checked) => {
                        const isChecked = checked as boolean;
                        setPlanoSaudeAtivo(isChecked);
                        if (isChecked) {
                          // Inicializar campos quando marcar
                          updateData({ operadora: "", numeroPlano: "" });
                        } else {
                          // Limpar campos quando desmarcar
                          updateData({ numeroPlano: "", operadora: "" });
                        }
                      }}
                   className="mt-1"
                 />
                <Label htmlFor="planoSaudeCheck" className="text-lg font-semibold text-gray-900 cursor-pointer">
                  Possui plano de saúde?
                </Label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Informações sobre cobertura de saúde
              </p>
            </div>
          </div>
                     {planoSaudeAtivo && (
             <div className="animate-in slide-in-from-top-2 duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="operadora" className="text-sm font-medium text-gray-700 mb-2 block">
                     Operadora
                   </Label>
                                       <Textarea
                      id="operadora"
                      value={data.operadora}
                      onChange={(e) => updateData({ operadora: e.target.value })}
                      placeholder="Ex: Unimed, Amil, SulAmérica..."
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors duration-200"
                      rows={2}
                    />
                 </div>
                 
                 <div>
                   <Label htmlFor="numeroPlano" className="text-sm font-medium text-gray-700 mb-2 block">
                     Número do Plano
                   </Label>
                                       <Textarea
                      id="numeroPlano"
                      value={data.numeroPlano}
                      onChange={(e) => updateData({ numeroPlano: e.target.value })}
                      placeholder="Número da carteirinha ou contrato"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 transition-colors duration-200"
                      rows={2}
                    />
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
      
      
      


      {/* Botões de Navegação */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious} 
          className="w-full sm:w-auto px-8 py-3 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200" 
          disabled={formLoading}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:flex-1 px-8 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
          disabled={formLoading}
        >
          <Check className="mr-2 h-5 w-5" />
          {formLoading ? "Carregando..." : "Continuar para Termos"}
        </Button>
      </div>
    </form>
  );
};
