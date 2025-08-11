// /app/api/login/route.ts


import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma";
import { cookies } from "next/headers";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";

interface LoginProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: string;
}

export const revalidate = 0;

/**
 * Verifica o estado da autenticação, pegando o token de login nos cookies
 * Verifica se a sessão existe, se não expirou e se ainda está válida
 * Retorna 401 se não permitir a autenticação e 200 se permitir
 */
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth-session");
  
    if (!authCookie?.value) {
      // Redireciona para o login caso o cookie não exista
      return NextResponse.redirect("/login");
    }
  
    const sessionToken = authCookie.value;
    const prisma = PrismaGetInstance();
    const session = await prisma.sessions.findFirst({
      where: {
        token: sessionToken,
      },
    });
  
    if (!session || !session.valid || session.expiresAt < new Date()) {
      // Redireciona para o login caso a sessão seja inválida ou tenha expirado
      return NextResponse.redirect("/login");
    }
  
    return NextResponse.json({ message: "Bem-vindo!" }, { status: 200 });
  }
  

/**
 * Realiza o login
 */
export async function POST(request: Request) {
  const body = (await request.json()) as LoginProps;

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
  }

  try {
    const prisma = PrismaGetInstance();

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });

    const userPassword = user.password;
    const passwordResult = bcrypt.compareSync(password, userPassword);

    if (!passwordResult) {
      return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
    }

    const sessionToken = GenerateSession({
      email,
      passwordHash: userPassword,
    });

    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: sessionToken,
        valid: true,
        expiresAt: addHours(new Date(), 24),  // Expiração do banco de dados para 24 horas
      },
    });

    // Aguarde a resolução do cookies antes de definir o cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: addHours(new Date(), 1),  // Expiração do cookie para 1 hora
      path: "/",
    });

    return NextResponse.json({ session: sessionToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json<LoginResponse>({ session: "" }, { status: 400 });
  }
}
