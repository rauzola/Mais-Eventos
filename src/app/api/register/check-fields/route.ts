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

    let emailExists = false;
    let cpfExists = false;

    // Verificar email e CPF em paralelo para ser mais rápido
    const promises = [];

    // Verificar email se fornecido
    if (email && email.trim() !== "") {
      promises.push(
        prisma.user.findFirst({
          where: { email: email.trim() },
          select: { id: true }
        }).then(user => {
          emailExists = !!user;
          console.log("Email verificado:", { email, emailExists });
        }).catch(error => {
          console.error("Erro ao verificar email:", error);
          emailExists = false;
        })
      );
    }

    // Verificar CPF se fornecido
    if (cpf && cpf.trim() !== "") {
      promises.push(
        prisma.user.findFirst({
          where: { cpf: cpf.trim() },
          select: { id: true, cpf: true, email: true }
        }).then(user => {
          cpfExists = !!user;
          console.log("CPF verificado:", { 
            cpfBuscado: cpf.trim(), 
            cpfExists, 
            usuarioEncontrado: user ? { id: user.id, email: user.email, cpf: user.cpf } : null 
          });
        }).catch(error => {
          console.error("Erro ao verificar CPF:", error);
          cpfExists = false;
        })
      );
    }

    // Aguardar todas as verificações com timeout
    if (promises.length > 0) {
      await Promise.race([
        Promise.all(promises),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        )
      ]);
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
    
    // Em caso de erro ou timeout, retornar false para não bloquear
    return NextResponse.json({
      emailExists: false,
      cpfExists: false,
      message: "Verificação não concluída - usando valores padrão"
    });
  }
}
