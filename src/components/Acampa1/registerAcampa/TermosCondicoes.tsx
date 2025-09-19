"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Shield, FileText, UserCheck } from 'lucide-react';
import { CadastroData } from './index';
import { useToast } from '@/components/ui/toast';

interface TermosCondicoesProps {
  data: CadastroData;
  updateData: (data: Partial<CadastroData>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  formError: string;
  setFormError: (error: string) => void;
  formLoading: boolean;
}

export const TermosCondicoes = ({ 
  data, 
  updateData, 
  onPrevious, 
  onSubmit, 
  formError, 
  setFormError,
  formLoading 
}: TermosCondicoesProps) => {
  const { showError } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required terms with toast
    if (!data.termo1) {
      showError("Você deve aceitar o termo 1 para continuar");
      return;
    }
    if (!data.termo2) {
      showError("Você deve aceitar o termo 2 para continuar");
      return;
    }
    if (!data.termo3) {
      showError("Você deve aceitar o termo 3 para continuar");
      return;
    }
    
    setFormError("");
    onSubmit();
  };

  const termos = [
    {
      id: 'termo1',
      checked: data.termo1,
      icon: Shield,
      title: 'Aptidão Física',
      description: 'Considero-me plenamente apto a realizar atividades físicas, eximindo o PROJETO MAIS VIDA de qualquer responsabilidade civil.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'termo2',
      checked: data.termo2,
      icon: FileText,
      title: 'Responsabilidade',
      description: 'Assumo integralmente a responsabilidade por eventuais danos que eu venha a sofrer em caso de saída não autorizada do local escolhido para o Acampamento do Projeto Mais Vida e/ou pelo descumprimento das normas e orientações de segurança dadas pela equipe de organização do evento, inclusive em relação aos horários de recolhimento e silêncio.',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'termo3',
      checked: data.termo3,
      icon: UserCheck,
      title: 'Autorização de Imagem',
      description: 'Eu autorizo ao Projeto Mais Vida, pessoa jurídica de direito privado, devidamente inscrito no CNPJ sob nº 04.585.680/0001-03, com sede à praça da Catedral, Zona 1, em Maringá, no estado do Paraná – CEP: 87.010-530 a utilização do meu nome, meu áudio, vídeo e da minha imagem, para veiculação de propagandas desta empresa, em jornais, rádios, televisões, internet, panfletos publicitários entre outros. Estou ciente, que diante desta autorização, não posso reclamar contra o Projeto Mais Vida, nenhum tipo de indenização relativa a direitos autorais, direitos de imagem, danos morais ou qualquer outro tipo de indenização, em tempo ou lugar algum. Sendo assim, firmo ser verdade todas as informações acima descritas e autorizo o termo descrito.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Termos e Condições</h2>
        <p className="text-gray-600 text-lg">Leia atentamente e aceite os termos para continuar</p>
      </div>
      
      <div className="space-y-6">
        {termos.map((termo, index) => {
          const IconComponent = termo.icon;
          return (
            <div
              key={termo.id}
              className={`relative group transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                termo.checked 
                  ? 'ring-2 ring-green-500 ring-opacity-50 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className={`
                bg-white rounded-xl border-2 p-6 transition-all duration-300 ease-in-out
                ${termo.checked 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <div className="flex items-start space-x-4">
                  {/* Checkbox com design melhorado */}
                  <div className="relative flex-shrink-0">
                    <Checkbox
                      id={termo.id}
                      checked={termo.checked}
                      onCheckedChange={(checked) => updateData({ [termo.id]: checked as boolean })}
                      className={`
                        h-6 w-6 transition-all duration-300 ease-in-out
                        ${termo.checked 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                        }
                      `}
                    />
                    {termo.checked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Ícone */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    bg-gradient-to-r ${termo.color} text-white shadow-md
                    transition-all duration-300 ease-in-out
                    ${termo.checked ? 'scale-110' : 'group-hover:scale-105'}
                  `}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={termo.id} 
                      className={`
                        text-lg font-semibold mb-2 block cursor-pointer
                        transition-colors duration-300
                        ${termo.checked ? 'text-green-700' : 'text-gray-900'}
                      `}
                    >
                      {index + 1}. {termo.title}
                    </Label>
                    <p className={`
                      text-sm leading-relaxed text-gray-600
                      transition-colors duration-300
                      ${termo.checked ? 'text-gray-700' : 'text-gray-600'}
                    `}>
                      {termo.description}
                    </p>
                  </div>
                </div>

                {/* Indicador visual de aceite */}
                {termo.checked && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                      Aceito
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious} 
          className="w-full sm:w-auto h-12 text-base font-medium" 
          disabled={formLoading}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:flex-1 h-12 text-base font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={formLoading}
        >
          <Check className="mr-2 h-5 w-5" />
          {formLoading ? "Finalizando..." : "Finalizar Cadastro"}
        </Button>
      </div>
    </form>
  );
};
