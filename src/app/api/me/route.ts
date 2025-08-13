import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-session")?.value;

    if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const session = await prisma.sessions.findFirst({
      where: { token, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session?.User) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { id, email } = session.User as { id: string; email: string };
    const role = (session.User as unknown as { role?: string })?.role;

    return NextResponse.json({ id, email, role: role ?? "USER" }, { status: 200 });
  } catch (error) {
    console.error("/api/me erro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


