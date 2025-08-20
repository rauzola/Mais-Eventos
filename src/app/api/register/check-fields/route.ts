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
    console.log("CPF recebido - tipo:", typeof cpf, "valor:", cpf, "length:", cpf?.length);

    let emailExists = false;
    let cpfExists = false;

    // Verificar email se fornecido
    if (email && email.trim() !== "") {
      try {
        const emailUser = await prisma.user.findFirst({
          where: { email: email.trim() },
          select: { id: true }
        });
        emailExists = !!emailUser;
        console.log("Email verificado:", { email, emailExists });
      } catch (error) {
        console.error("Erro ao verificar email:", error);
        emailExists = false;
      }
    }

    // Verificar CPF se fornecido
    if (cpf && cpf.trim() !== "") {
      try {
        console.log("Buscando CPF no banco:", cpf.trim());
        
        // Buscar CPF exato com máscara
        const cpfUser = await prisma.user.findFirst({
          where: { cpf: cpf.trim() },
          select: { id: true, cpf: true, email: true }
        });
        
        cpfExists = !!cpfUser;
        console.log("CPF verificado:", { 
          cpfBuscado: cpf.trim(), 
          cpfExists, 
          usuarioEncontrado: cpfUser ? { id: cpfUser.id, email: cpfUser.email, cpf: cpfUser.cpf } : null 
        });
        
        if (!cpfExists) {
          console.log("CPF não encontrado no banco");
        }
        
      } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        cpfExists = false;
      }
    }



    const result = {
      emailExists,
      cpfExists,
      message: "Verificação concluída"
    };

    console.log("Resultado final:", result);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Erro na verificação de campos:", error);
    
    // Em caso de erro, retornar false para não bloquear
    return NextResponse.json({
      emailExists: false,
      cpfExists: false,
      message: "Verificação não concluída - usando valores padrão"
    });
  }
}
