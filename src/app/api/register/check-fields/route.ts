import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-pg";

export async function GET() {
  try {
    console.log("Testando conexão com banco...");
    const userCount = await prisma.user.count();
    console.log("Conexão OK, total de usuários:", userCount);
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
    
    console.log("API check-fields recebeu:", { email, cpf });

    // Verificações paralelas para melhor performance
    const [emailExists, cpfExists] = await Promise.all([
      // Verificar email
      email && email.trim() !== "" 
        ? prisma.user.findUnique({
            where: { email: email.trim() },
            select: { id: true }
          }).then(user => !!user).catch(() => false)
        : false,
      
      // Verificar CPF  
      cpf && cpf.trim() !== ""
        ? prisma.user.findUnique({
            where: { cpf: cpf.trim() },
            select: { id: true }
          }).then(user => !!user).catch(() => false)
        : false
    ]);

    const result = {
      emailExists,
      cpfExists,
      message: "Verificação concluída"
    };

    console.log("Resultado:", result);
    return NextResponse.json(result);

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
