// /components/Eventos/EventoDetalhes/index.tsx

"use client";

import { JSX, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Usar hook do toast

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  horaInicio: Date;
  horaFim: Date;
  local: string;
  status: string;
}

interface EventoDetalhesProps {
  eventoId: string;
  userId: string;
}

export default function EventoDetalhes({
  eventoId,
  userId,
}: EventoDetalhesProps): JSX.Element {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast(); // Usando o hook do toast para mostrar mensagens

  useEffect(() => {
    const fetchEvento = async (): Promise<void> => {
      setLoading(true);
      try {
        if (!eventoId) {
          throw new Error("ID do evento não foi fornecido");
        }

        const response = await fetch(`/api/eventos/${eventoId}`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simula um pequeno delay (opcional)

        if (!response.ok) {
          throw new Error("Erro ao carregar evento");
        }

        const data = await response.json();
        setEvento(data.evento);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        toast({
          title: "Erro",
          description: "Falha ao carregar evento",
          variant: "destructive", // Tipo de erro do Toast
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [eventoId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInscricao = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/eventos/${eventoId}/inscrever`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar inscrição");
      }

      toast({
        title: "Inscrição realizada",
        description: "Você foi inscrito no evento com sucesso.",
        variant: "default", // Sucesso do Toast
      });
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive", // Tipo de erro do Toast
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  if (!evento) {
    return <p>Evento não encontrado</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{evento.nome}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Descrição:</strong> {evento.descricao}
        </p>
        <p>
          <strong>Data:</strong>{" "}
          {new Date(evento.dataInicio).toLocaleDateString()}
        </p>
        <p>
          <strong>Hora de Início:</strong>{" "}
          {new Date(evento.horaInicio).toLocaleTimeString()}
        </p>
        <p>
          <strong>Hora de Término:</strong>{" "}
          {new Date(evento.horaFim).toLocaleTimeString()}
        </p>
        <p>
          <strong>Local:</strong> {evento.local}
        </p>
        <Button onClick={handleInscricao} disabled={isSubmitting}>
          {isSubmitting ? "Inscrevendo..." : "Inscrever-se"}
        </Button>
      </CardContent>
    </Card>
  );
}
