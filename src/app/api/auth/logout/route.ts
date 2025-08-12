import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaGetInstance } from "@/lib/prisma-pg";

export async function POST() {
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

    return NextResponse.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
