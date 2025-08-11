// /components/Perfil/SaudeForm.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saudeSchema, SaudeFormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SaudeForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SaudeFormData>({
    resolver: zodResolver(saudeSchema),
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch("/api/saude");
        const data = await response.json();
        reset(data); // Certifique-se de que os dados estão no formato correto
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    };

    fetchPerfil();
  }, [reset]);

  const onSubmit = async (data: SaudeFormData) => {
    console.log("Formulário enviado!", data); // Teste para ver se está sendo chamado
    try {
      const response = await fetch("/api/saude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Dados de saúde atualizados com sucesso!");
      } else {
        console.error("Erro ao atualizar dados de saúde");
      }
    } catch (error) {
      console.error("Erro ao enviar dados de saúde:", error);
    }
  };

  return (
    <div className="pt-8">
    {/* <Button className="mb-4">Atualizar</Button> */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="portadorDoenca">Portador de Doença?</Label>
          <Select
            onValueChange={(value) =>
              setValue("portadorDoenca", value === "true")
            }
            defaultValue={watch("portadorDoenca") ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="doencas">Doenças</Label>
          <Input
            id="doencas"
            {...register("doencas")}
            placeholder="Liste as doenças, se houver"
          />
          {errors.doencas && (
            <p className="text-sm text-red-500">{errors.doencas.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="alergias">Tem Alergias?</Label>
          <Select
            onValueChange={(value) => setValue("alergias", value === "true")}
            defaultValue={watch("alergias") ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="alergiasDetalhe">Detalhes das Alergias</Label>
          <Input
            id="alergiasDetalhe"
            {...register("alergiasDetalhe")}
            placeholder="Descreva as alergias, se houver"
          />
        </div>

        <div>
          <Label htmlFor="medicacao">Faz uso de medicação?</Label>
          <Select
            onValueChange={(value) => setValue("medicacao", value === "true")}
            defaultValue={watch("medicacao") ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="medicamentos">Medicamentos</Label>
          <Input
            id="medicamentos"
            {...register("medicamentos")}
            placeholder="Liste os medicamentos, se houver"
          />
        </div>

        <div>
          <Label htmlFor="planoSaude">Possui Plano de Saúde?</Label>
          <Select
            onValueChange={(value) => setValue("planoSaude", value === "true")}
            defaultValue={watch("planoSaude") ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="operadoraPlano">Operadora do Plano</Label>
          <Input
            id="operadoraPlano"
            {...register("operadoraPlano")}
            placeholder="Nome da operadora"
          />
        </div>

        <div>
          <Label htmlFor="numeroInscricaoPlano">
            Número de Inscrição no Plano
          </Label>
          <Input
            id="numeroInscricaoPlano"
            {...register("numeroInscricaoPlano")}
            placeholder="Número de inscrição"
          />
        </div>

        {/* <div className="flex justify-end">
          <Button type="submit">Criar Relatorio de Saude e Bem Estar</Button>
        </div> */}
      </form>
    </div>
  );
};
