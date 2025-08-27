"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check } from "lucide-react";
import { CadastroData } from "./index";
import { useToast } from "@/components/ui/toast";

interface FichaSaudeProps {
  data: CadastroData;
  updateData: (data: Partial<CadastroData>) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  formError: string;
  setFormError: (error: string) => void;
  formLoading: boolean;
}

export const FichaSaude = ({ 
  data, 
  updateData, 
  onPrevious, 
  onSubmit, 
  formError, 
  setFormError,
  formLoading 
}: FichaSaudeProps) => {
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
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Termos e Condições</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termo1"
              checked={data.termo1}
              onCheckedChange={(checked) => updateData({ termo1: checked as boolean })}
              className="mt-1"
            />
            <Label htmlFor="termo1" className="text-sm leading-relaxed">
              <strong>1.</strong> Considero-me plenamente apto a realizar atividades físicas, eximindo o PROJETO MAIS VIDA de qualquer responsabilidade civil.
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termo2"
              checked={data.termo2}
              onCheckedChange={(checked) => updateData({ termo2: checked as boolean })}
              className="mt-1"
            />
            <Label htmlFor="termo2" className="text-sm leading-relaxed">
              <strong>2.</strong> Assumo integralmente a responsabilidade por eventuais danos que eu venha a sofrer em caso de saída não autorizada do local escolhido para o Acampamento do Projeto Mais Vida e/ou pelo descumprimento das normas e orientações de segurança dadas pela equipe de organização do evento, inclusive em relação aos horários de recolhimento e silêncio.
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termo3"
              checked={data.termo3}
              onCheckedChange={(checked) => updateData({ termo3: checked as boolean })}
              className="mt-1"
            />
            <Label htmlFor="termo3" className="text-sm leading-relaxed">
              <strong>3.</strong> Eu autorizo ao Projeto Mais Vida, pessoa jurídica de direito privado, devidamente inscrito no CNPJ sob nº 04.585.680/0001-03, com sede à praça da Catedral, Zona 1, em Maringá, no estado do Paraná – CEP: 87.010-530 a utilização do meu nome, meu áudio, vídeo e da minha imagem, para veiculação de propagandas desta empresa, em jornais, rádios, televisões, internet, panfletos publicitários entre outros. Estou ciente, que diante desta autorização, não posso reclamar contra o Projeto Mais Vida, nenhum tipo de indenização relativa a direitos autorais, direitos de imagem, danos morais ou qualquer outro tipo de indenização, em tempo ou lugar algum. Sendo assim, firmo ser verdade todas as informações acima descritas e autorizo o termo descrito.
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto" disabled={formLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button type="submit" className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" disabled={formLoading}>
          <Check className="mr-2 h-4 w-4" />
          {formLoading ? "Finalizando..." : "Finalizar Cadastro"}
        </Button>
      </div>
    </form>
  );
};
