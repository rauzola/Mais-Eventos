// /app/api/eventos/[id]/route.ts

import { PrismaGetInstance } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = PrismaGetInstance();

export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  horaInicio: Date;
  horaFim: Date;
  local: string;
  status: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: eventoId } = await context.params; // Aguardar `params`

    if (!eventoId) {
      return NextResponse.json(
        { success: false, error: "ID do evento não foi fornecido" },
        { status: 400 }
      );
    }

    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
    });

    if (!evento) {
      return NextResponse.json(
        { success: false, error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, evento }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar evento" },
      { status: 500 }
    );
  }
}
