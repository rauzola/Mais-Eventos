import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    
    // Buscar inscrições confirmadas e pendentes
    const inscricoes = await prisma.inscricaoEvento.findMany({
      where: {
        eventId: eventId,
        status: {
          in: ["confirmada", "pendente"]
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    const totalInscricoes = inscricoes.length;
    const isLotado = totalInscricoes >= 66;

    return NextResponse.json({
      success: true,
      totalInscricoes,
      isLotado,
      limite: 66
    });
  } catch (error) {
    console.error("Erro ao verificar capacidade do evento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
