import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cpf = searchParams.get('cpf');
    
    if (!cpf) {
      return NextResponse.json({ error: "CPF não fornecido" }, { status: 400 });
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    
    console.log('CPF recebido:', cpf);
    console.log('CPF limpo:', cleanCpf);
    
    // Buscar todos os usuários para debug
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, cpf: true }
    });
    
    console.log('Todos os usuários:', allUsers);
    
    // Buscar por CPF específico
    const userWithCpf = await prisma.user.findFirst({
      where: { cpf: cleanCpf },
      select: { id: true, email: true, cpf: true }
    });
    
    const userWithFormattedCpf = await prisma.user.findFirst({
      where: { cpf: cpf },
      select: { id: true, email: true, cpf: true }
    });
    
    return NextResponse.json({ 
      success: true,
      debug: {
        cpfRecebido: cpf,
        cpfLimpo: cleanCpf,
        userWithCpf,
        userWithFormattedCpf,
        todosUsuarios: allUsers
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao debugar CPF:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
