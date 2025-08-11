// /app/api/saude/route.ts

import { NextResponse } from "next/server";
import { PrismaGetInstance } from "@/lib/prisma";
import { cookies } from "next/headers";
import { saudeSchema } from "@/components/Perfil/types"; // Ajuste o caminho conforme necessário

/**
 * Endpoint para buscar os dados do perfil do usuário autenticado
 */

export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    // Retorna 401 se o usuário não estiver autenticado
    return NextResponse.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
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
        User: {
          include: {
            Saude: true, // Inclui os dados de saúde do usuário
          },
        },
      },
    });

    if (!session || !session.valid || session.expiresAt < new Date()) {
      // Retorna 401 se a sessão não for válida ou expirou
      return NextResponse.json(
        { message: "Sessão inválida ou expirada" },
        { status: 401 }
      );
    }

    // Retorna os dados de saúde do usuário
    return NextResponse.json(session.User.Saude, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar dados de saúde" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    return NextResponse.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
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
      return NextResponse.json(
        { message: "Sessão inválida ou expirada" },
        { status: 401 }
      );
    }

    // Valida os dados recebidos
    const body = await request.json();
    const validatedData = saudeSchema.parse(body);

    // Verifica se o usuário já tem um registro na tabela Saude
    const existingSaude = await prisma.saude.findUnique({
      where: {
        userId: session.User.id,
      },
    });

    if (existingSaude) {
      return NextResponse.json(
        { message: "Dados de saúde já cadastrados para este usuário" },
        { status: 400 }
      );
    }

    // Cria os dados de saúde do usuário
    const newSaude = await prisma.saude.create({
      data: {
        userId: session.User.id,
        ...validatedData,
      },
    });

    return NextResponse.json(newSaude, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar dados de saúde:", error);
    return NextResponse.json(
      { message: "Erro ao criar dados de saúde" },
      { status: 500 }
    );
  }
}

/**
 * Endpoint para atualizar os dados do perfil do usuário autenticado
 */
export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  if (!authCookie?.value) {
    return NextResponse.json(
      { message: "Usuário não autenticado" },
      { status: 401 }
    );
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
      return NextResponse.json(
        { message: "Sessão inválida ou expirada" },
        { status: 401 }
      );
    }

    // Valida os dados recebidos
    const body = await request.json();
    const validatedData = saudeSchema.parse(body);

    // Atualiza ou cria os dados de saúde
    const updatedSaude = session.userId
      ? await prisma.saude.update({
          where: {
            userId: session.User.id,
          },
          data: validatedData,
        })
      : await prisma.saude.create({
          data: {
            userId: session.User.id,
            ...validatedData,
          },
        });

    return NextResponse.json(updatedSaude, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao atualizar dados de saúde" },
      { status: 500 }
    );
  }
}
