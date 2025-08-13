import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma-vercel";

export async function GET() {
  return await handleLogout();
}

export async function POST() {
  return await handleLogout();
}

async function handleLogout() {
  try {
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth-session");

    if (authSession?.value) {
      // Invalida a sessão no banco
      await prisma.sessions.updateMany({
        where: {
          token: authSession.value
        },
        data: {
          valid: false
        }
      });
    }

    // Cria resposta de sucesso
    const response = NextResponse.json({ success: true });
    
    // Remove o cookie
    response.cookies.delete("auth-session");

    return response;
  } catch (error) {
    console.error("Erro no logout:", error);
    // Em caso de erro, ainda retorna sucesso para não quebrar o fluxo
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth-session");
    return response;
  }
}
