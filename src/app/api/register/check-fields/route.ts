import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-pg";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ status: "Conexão OK", userCount });
  } catch (error) {
    console.error("Erro no teste de conexão:", error);
    return NextResponse.json(
      { error: "Erro de conexão", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, cpf } = body;

    // Queries otimizadas usando count em vez de findUnique
    const [emailCount, cpfCount] = await Promise.all([
      email && email.trim() 
        ? prisma.user.count({ where: { email: email.trim() } })
        : 0,
      cpf && cpf.trim()
        ? prisma.user.count({ where: { cpf: cpf.trim() } })
        : 0
    ]);

    return NextResponse.json({
      emailExists: emailCount > 0,
      cpfExists: cpfCount > 0,
      message: "Verificação concluída"
    });

  } catch (error) {
    console.error("Erro na verificação de campos:", error);
    return NextResponse.json(
      { 
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
