import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { cookies } from "next/headers";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";

interface LoginProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  session?: string;
  error?: string;
  authenticated?: boolean;
}

export const revalidate = 0;

/**
 * Verifica o estado da autenticação, pegando o token de login nos cookies
 * Verifica se a sessão existe, se não expirou e se ainda está válida
 * Retorna 401 se não permitir a autenticação e 200 se permitir
 */
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-session");

  const sessionToken = authCookie?.value || "";

  const prisma = PrismaGetInstance();
  const session = await prisma.sessions.findFirst({
    where: {
      token: sessionToken,
    },
  });

  if (!session || !session.valid || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}

/**
 * Realiza o login
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginProps;

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        { error: "Email e senha são obrigatórios" }, 
        { status: 400 }
      );
    }

    const prisma = PrismaGetInstance();

    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json<LoginResponse>(
        { error: "Credenciais inválidas" }, 
        { status: 401 }
      );
    }

    // Verifica a senha
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json<LoginResponse>(
        { error: "Credenciais inválidas" }, 
        { status: 401 }
      );
    }

    // Gera token de sessão
    const sessionToken = GenerateSession({
      email,
      passwordHash: user.password,
    });

    // Cria a sessão no banco
    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: sessionToken,
        valid: true,
        expiresAt: addHours(new Date(), 24),
      },
    });

    // Define o cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: addHours(new Date(), 24),
      path: "/",
    });

    return NextResponse.json({ session: sessionToken }, { status: 200 });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json<LoginResponse>(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    );
  }
}
