// /components/Perfil/ComunidadeForm.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ComunidadeFormData } from "./types";

// Esquema de validação com Zod para Comunidade
const schema = z.object({
  nomeComunidade: z.string().min(1, "Nome da comunidade é obrigatório"),
  dataAcampa1: z.string().optional(),
  nomeAcampa2: z.string().optional(),
  dataAcampa2: z.string().optional(),
  dataEnvio: z.string().optional(),
  assessores: z.string().min(1, "Assessores é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export const ComunidadeForm = () => {
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    // watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch("/api/comunidade");
        const data = await response.json();

        // Caso haja necessidade de formatar datas, faça aqui.
        if (data.data_nascimento) {
          const formattedDate = new Date(data.data_nascimento)
            .toISOString()
            .split("T")[0];
          data.data_nascimento = formattedDate;
        }

        reset(data);
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    };

    fetchPerfil();
  }, [reset]);

  const onSubmit = async (data: ComunidadeFormData) => {
    try {
      const response = await fetch("/api/comunidade", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Dados da comunidade atualizados com sucesso!");
      } else {
        console.error("Erro ao atualizar dados da comunidade");
      }
    } catch (error) {
      console.error("Erro ao enviar dados da comunidade:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="nomeComunidade">Nome da Comunidade</Label>
        <Input
          id="nomeComunidade"
          {...register("nomeComunidade")}
          placeholder="Nome da comunidade"
        />
        {errors.nomeComunidade && (
          <p className="text-red-500 text-sm">{errors.nomeComunidade.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dataAcampa1">Data do Primeiro Acampamento</Label>
        <Input id="dataAcampa1" {...register("dataAcampa1")} type="date" />
        {errors.dataAcampa1 && (
          <p className="text-red-500 text-sm">{errors.dataAcampa1.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="nomeAcampa2">Nome do Segundo Acampamento</Label>
        <Input
          id="nomeAcampa2"
          {...register("nomeAcampa2")}
          placeholder="Nome do segundo acampamento"
        />
        {errors.nomeAcampa2 && (
          <p className="text-red-500 text-sm">{errors.nomeAcampa2.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dataAcampa2">Data do Segundo Acampamento</Label>
        <Input id="dataAcampa2" {...register("dataAcampa2")} type="date" />
        {errors.dataAcampa2 && (
          <p className="text-red-500 text-sm">{errors.dataAcampa2.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dataEnvio">Data de Envio</Label>
        <Input id="dataEnvio" {...register("dataEnvio")} type="date" />
        {errors.dataEnvio && (
          <p className="text-red-500 text-sm">{errors.dataEnvio.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="assessores">Assessores</Label>
        <Input
          id="assessores"
          {...register("assessores")}
          placeholder="Nomes dos assessores"
        />
        {errors.assessores && (
          <p className="text-red-500 text-sm">{errors.assessores.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
};
