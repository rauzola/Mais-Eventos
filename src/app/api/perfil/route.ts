// /app/api/perfil/route.ts

import { NextResponse } from "next/server";
import { PrismaGetInstance } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Endpoint para buscar os dados do perfil do usuário autenticado
 */
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    // Retorna 401 se o usuário não estiver autenticado
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const sessionToken = authCookie.value;
  const prisma = PrismaGetInstance();

  try {
    // Busca a sessão do usuário no banco de dados
    const session = await prisma.sessions.findFirst({
      where: {
        token: sessionToken,
      },
      include: {
        User: true,  // Corrigido para 'user' em minúsculo
      },
    });

    if (!session || !session.valid || session.expiresAt < new Date()) {
      // Retorna 401 se a sessão não for válida ou expirou
      return NextResponse.json({ message: "Sessão inválida ou expirada" }, { status: 401 });
    }

    // Retorna os dados do usuário
    return NextResponse.json(session.User, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao buscar dados do perfil" }, { status: 500 });
  }
}

/**
 * Endpoint para atualizar os dados do perfil do usuário autenticado
 */
export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    // Retorna 401 se o usuário não estiver autenticado
    return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });
  }

  const sessionToken = authCookie.value;
  const prisma = PrismaGetInstance();

  try {
    const session = await prisma.sessions.findFirst({
      where: {
        token: sessionToken,
      },
      include: {
        User: true,
      },
    });

    if (!session || !session.valid || session.expiresAt < new Date()) {
      return NextResponse.json({ message: "Sessão inválida ou expirada" }, { status: 401 });
    }

    // Lê os dados enviados no corpo da requisição
    const data = await request.json();

    // Atualiza os dados do usuário no banco
    const updatedUser = await prisma.user.update({
      where: {
        id: session.User.id, // Usa o ID do usuário da sessão para atualizar
      },
      data,
    });

    // Retorna os dados atualizados
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao atualizar dados do perfil" }, { status: 500 });
  }
}
