import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";
import { hasAtLeastRole, isRole, type AppRole } from "@/lib/roles";
import type { Prisma } from "@prisma/client";

export const revalidate = 0;

/**
 * Lista usuários (apenas para COORD e acima)
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    type SessionWithUser = { User?: { role?: AppRole } };
    let requesterRole = (session as unknown as SessionWithUser).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    if (!hasAtLeastRole(requesterRole, "COORD")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const usersRaw = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    type RawUser = { id: string; email: string; role?: string; createdAt: Date; updatedAt: Date };
    const users = (usersRaw as unknown as RawUser[]).map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role ?? "USER",
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

interface UpdateRoleBody {
  userId: string;
  role: "USER" | "STAFF" | "COORD" | "CONCELHO" | "ADMIN";
}

/**
 * Atualiza a role de um usuário (apenas para COORD e acima)
 */
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    type SessionWithUser2 = { User?: { role?: AppRole; id: string } };
    let requesterRole = (session as unknown as SessionWithUser2).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    if (!hasAtLeastRole(requesterRole, "COORD")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = (await request.json()) as UpdateRoleBody;
    const { userId, role } = body || ({} as UpdateRoleBody);

    if (!userId || !role) {
      return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
    }

    const validRoles = ["USER", "STAFF", "COORD", "CONCELHO", "ADMIN"] as const;
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    // Evita auto-rebaixar/alterar role de si mesmo sem ser ADMIN
    if (session.User.id === userId && !hasAtLeastRole(requesterRole, "ADMIN")) {
      return NextResponse.json({ error: "Operação não permitida" }, { status: 403 });
    }

    const dataUpdate = { role } as unknown as Prisma.UserUpdateInput;
    const updatedRaw = await prisma.user.update({
      where: { id: userId },
      data: dataUpdate,
    });
    const updated = {
      id: updatedRaw.id,
      email: updatedRaw.email,
      role: (updatedRaw as unknown as { role?: string }).role ?? "USER",
      updatedAt: updatedRaw.updatedAt,
    };

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


