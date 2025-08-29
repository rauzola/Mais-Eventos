"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Heart, Shield, FileText } from 'lucide-react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormError("");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="portadorDoenca" className="text-base font-medium">
            É portador de alguma doença?
          </Label>
          <Textarea
            id="portadorDoenca"
            value={data.portadorDoenca}
            onChange={(e) => updateData({ portadorDoenca: e.target.value })}
            placeholder="Descreva se possui alguma doença ou condição de saúde..."
            className="mt-2"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="alergiaIntolerancia" className="text-base font-medium">
            É alérgico ou intolerante?
          </Label>
          <Textarea
            id="alergiaIntolerancia"
            value={data.alergiaIntolerancia}
            onChange={(e) => updateData({ alergiaIntolerancia: e.target.value })}
            placeholder="Descreva alergias ou intolerâncias alimentares ou medicamentosas..."
            className="mt-2"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="medicacaoUso" className="text-base font-medium">
            Utiliza medicação de uso contínuo?
          </Label>
          <Textarea
            id="medicacaoUso"
            value={data.medicacaoUso}
            onChange={(e) => updateData({ medicacaoUso: e.target.value })}
            placeholder="Liste os medicamentos de uso contínuo..."
            className="mt-2"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="restricaoAlimentar" className="text-base font-medium">
            Possui alguma restrição alimentar?
          </Label>
          <Textarea
            id="restricaoAlimentar"
            value={data.restricaoAlimentar}
            onChange={(e) => updateData({ restricaoAlimentar: e.target.value })}
            placeholder="Descreva restrições alimentares específicas..."
            className="mt-2"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="planoSaude" className="text-base font-medium">
            Possui plano de saúde?
          </Label>
          <Textarea
            id="planoSaude"
            value={data.planoSaude}
            onChange={(e) => updateData({ planoSaude: e.target.value })}
            placeholder="Informe o nome do plano de saúde ou 'Não possuo'..."
            className="mt-2"
            rows={2}
          />
        </div>
      </div>
      
      
      
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto" disabled={formLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button type="submit" className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" disabled={formLoading}>
          <Check className="mr-2 h-4 w-4" />
          {formLoading ? "Carregando..." : "Próximo"}
        </Button>
      </div>
    </form>
  );
};
