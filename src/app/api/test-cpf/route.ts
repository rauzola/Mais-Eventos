import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export const revalidate = 0;

export async function GET() {
  try {
    // Buscar todos os usuários para ver o que está no banco
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, cpf: true }
    });
    
    console.log('=== DEBUG CPF ===');
    console.log('Todos os usuários:', JSON.stringify(allUsers, null, 2));
    
    // Testar busca específica por CPF
    const testCpf = "118.834.989-96";
    const cleanCpf = testCpf.replace(/\D/g, '');
    
    console.log('CPF de teste:', testCpf);
    console.log('CPF limpo:', cleanCpf);
    
    const userWithCpf = await prisma.user.findFirst({
      where: { cpf: cleanCpf },
      select: { id: true, email: true, cpf: true }
    });
    
    const userWithFormattedCpf = await prisma.user.findFirst({
      where: { cpf: testCpf },
      select: { id: true, email: true, cpf: true }
    });
    
    console.log('Usuário com CPF limpo:', userWithCpf);
    console.log('Usuário com CPF formatado:', userWithFormattedCpf);
    
    return NextResponse.json({ 
      success: true,
      debug: {
        totalUsers: allUsers.length,
        usersWithCpf: allUsers.filter(u => u.cpf),
        testCpf,
        cleanCpf,
        userWithCpf,
        userWithFormattedCpf
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao testar CPF:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
