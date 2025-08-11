// /components/Perfil/PerfilForm.tsx

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfilSchema, PerfilFormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PerfilForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await fetch("/api/perfil");
        const data = await response.json();

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

 

  const onSubmit = async (data: PerfilFormData) => {
    const formattedData = {
      ...data,
      data_nascimento: new Date(data.data_nascimento),
    };

    try {
      console.log("Enviando dados para atualização...");

      const response = await fetch("/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        console.log("Dados atualizados com sucesso!");
      } else {
        const errorData = await response.json();
        console.error(
          "Erro ao atualizar dados:",
          errorData.message || "Erro desconhecido"
        );
      }
    } catch (error) {
      console.error("Erro ao enviar dados para o servidor:", error);
    }
  };


  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          {...register("nome")}
          placeholder="Seu nome completo"
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{errors.nome.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          placeholder="seu.email@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          {...register("cpf")}
          placeholder="000.000.000-00"
          disabled
        />
        {errors.cpf && (
          <p className="text-sm text-red-500">{errors.cpf.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="data_nascimento">Data de Nascimento</Label>
        <Input
          id="data_nascimento"
          {...register("data_nascimento")}
          type="date"
          disabled
        />
        {errors.data_nascimento && (
          <p className="text-sm text-red-500">
            {errors.data_nascimento.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="estado_civil">Estado Civil</Label>
        <Select
          onValueChange={(value) => setValue("estado_civil", value)}
          defaultValue={watch("estado_civil")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione seu estado civil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solteiro">Solteiro(a)</SelectItem>
            <SelectItem value="casado">Casado(a)</SelectItem>
            <SelectItem value="divorciado">Divorciado(a)</SelectItem>
            <SelectItem value="viuvo">Viúvo(a)</SelectItem>
          </SelectContent>
        </Select>
        {errors.estado_civil && (
          <p className="text-sm text-red-500">{errors.estado_civil.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="profissao">Profissão</Label>
        <Input
          id="profissao"
          {...register("profissao")}
          placeholder="Sua profissão"
        />
        {errors.profissao && (
          <p className="text-sm text-red-500">{errors.profissao.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="telefone_contato">Telefone de Contato</Label>
        <Input
          id="telefone_contato"
          {...register("telefone_contato")}
          placeholder="(00) 00000-0000"
        />
        {errors.telefone_contato && (
          <p className="text-sm text-red-500">
            {errors.telefone_contato.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="contato_emergencia">Contato de Emergência</Label>
        <Input
          id="contato_emergencia"
          {...register("contato_emergencia")}
          placeholder="Nome do contato"
        />
        {errors.contato_emergencia && (
          <p className="text-sm text-red-500">
            {errors.contato_emergencia.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="telefone_contato_emergencia">
          Telefone do Contato de Emergência
        </Label>
        <Input
          id="telefone_contato_emergencia"
          {...register("telefone_contato_emergencia")}
          placeholder="(00) 00000-0000"
        />
        {errors.telefone_contato_emergencia && (
          <p className="text-sm text-red-500">
            {errors.telefone_contato_emergencia.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="tamanho_camiseta">Tamanho da Camiseta</Label>
        <Select
          onValueChange={(value) => setValue("tamanho_camiseta", value)}
          defaultValue={watch("tamanho_camiseta")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tamanho da camiseta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="P">P</SelectItem>
            <SelectItem value="M">M</SelectItem>
            <SelectItem value="G">G</SelectItem>
            <SelectItem value="GG">GG</SelectItem>
          </SelectContent>
        </Select>
        {errors.tamanho_camiseta && (
          <p className="text-sm text-red-500">
            {errors.tamanho_camiseta.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
};
