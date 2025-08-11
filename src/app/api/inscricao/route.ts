import { PrismaGetInstance } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = PrismaGetInstance();

export async function POST(req: NextRequest) {
  try {
    const { eventoId } = await req.json();
    const userId = "id-do-usuario"; // Substituir pelo ID do usuário autenticado

    const inscricao = await prisma.inscricao.create({
      data: {
        userId,
        eventoId,
      },
    });

    return NextResponse.json({ success: true, inscricao }, { status: 201 });
  } catch (error) {
    console.error("Erro ao inscrever usuário:", error);
    return NextResponse.json({ success: false, error: "Erro ao inscrever usuário" }, { status: 500 });
  }
}
