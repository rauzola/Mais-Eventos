// /components/Eventos/Inscritos/ListaEventosInscritos.tsx

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Se estiver usando uma função para classes dinâmicas

interface Inscricao {
  id: string;
  evento: {
    id: string;
    nome: string;
    descricao: string;
    dataInicio: string;
    horaInicio: string;
    local: string;
    status: string;
  };
  status: string;
}

interface ListaEventosInscritosProps {
  userId: string;
}

export default function ListaEventosInscritos({
  userId,
}: ListaEventosInscritosProps) {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInscricoes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/inscricoes?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Erro ao carregar inscrições");
        }

        const data = await response.json();
        setInscricoes(data.inscricoes);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        toast({
          title: "Erro",
          description: "Falha ao carregar eventos inscritos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInscricoes();
  }, [userId]);

  if (loading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (error) {
    return <p className="text-red-500">Erro: {error}</p>;
  }

  if (inscricoes.length === 0) {
    return <p>Nenhuma inscrição encontrada.</p>;
  }

  return (
    <div className="grid gap-4">
      {inscricoes.map((inscricao) => {
        const dataInicio = new Date(inscricao.evento.dataInicio);
        const eventoPassado = dataInicio < new Date(); // Verifica se a data já passou

        return (
          <Card
            key={inscricao.id}
            className={cn(
              "border transition-colors ",
              eventoPassado && "border-red-500 cursor-not-allowed"
            )}
          >
            <CardHeader>
              <CardTitle>
                {inscricao.evento?.nome ?? "Evento não encontrado"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Data:</strong>{" "}
                {inscricao.evento?.dataInicio
                  ? new Intl.DateTimeFormat("pt-BR").format(dataInicio)
                  : "Data não disponível"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
