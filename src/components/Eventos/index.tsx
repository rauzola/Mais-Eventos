// /components/Eventos/index.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: string;
  horaInicio: string;
  horaFim: string;
  local: string;
}

export function EventosListar() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchEventos() {
      try {
        const response = await fetch("/api/eventos");
        if (!response.ok) {
          throw new Error("Erro ao carregar eventos");
        }
        const data = await response.json();
        setEventos(data.eventos);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchEventos();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listar Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listar Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Lista de eventos cadastrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead>Hora de Início</TableHead>
              <TableHead>Hora de Término</TableHead>
              <TableHead>Local</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id} className="cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/eventos/${evento.id}`)}>
                <TableCell>{evento.nome}</TableCell>
                <TableCell>{evento.descricao}</TableCell>
                <TableCell>{new Date(evento.dataInicio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(evento.horaInicio).toLocaleTimeString()}</TableCell>
                <TableCell>{new Date(evento.horaFim).toLocaleTimeString()}</TableCell>
                <TableCell>{evento.local}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}