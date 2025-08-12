import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { redirect } from "next/navigation";

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
      const prisma = PrismaGetInstance();
      
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

    // Remove o cookie
    cookieStore.delete("auth-session");

    // Redireciona para a página de login
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("Erro no logout:", error);
    // Em caso de erro, ainda redireciona para login
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
}
