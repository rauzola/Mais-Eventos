import { NextRequest, NextResponse } from "next/server";
import { PrismaGetInstance } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const prisma = PrismaGetInstance();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId não fornecido" },
      { status: 400 }
    );
  }

  try {
    const inscricoes = await prisma.inscricao.findMany({
      where: { userId },
      include: { Evento: true },
    });

    const formattedData = inscricoes.map(({ Evento, ...inscricao }) => ({
      ...inscricao,
      evento: Evento, // Renomeia "Evento" para "evento"
    }));

    return NextResponse.json({ inscricoes: formattedData }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inscrições" },
      { status: 500 }
    );
  }
}
