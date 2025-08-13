// /app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { Role } from "@prisma/client";

interface RegisterProps {
  email: string;
  password: string;
  password2: string;
  role?: Role; // opcional, padrão USER
}

export interface RegisterResponse {
  error?: string;
  user?: {
    id: string;
    email: string;
  };
  message?: string;
}

/**
 * Realiza o cadastro simplificado com email e senha
 */
export async function POST(request: Request) {
  try {
    console.log("=== INÍCIO DO REGISTRO ===");
    
    const body = (await request.json()) as RegisterProps;
    console.log("Dados recebidos:", { 
      email: body.email, 
      passwordLength: body.password.length 
    });

    const { email, password, password2, role } = body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!email || !password || !password2) {
      console.log("❌ Campos obrigatórios faltando");
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    console.log("✅ Validações básicas passaram");

    // Validação da senha
    if (password.length < 6) {
      console.log("❌ Senha muito curta:", password.length);
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (password !== password2) {
      console.log("❌ Senhas não coincidem");
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    console.log("✅ Validações de senha passaram");
    
    // Hash da senha
    const hash = bcrypt.hashSync(password, 12);
    console.log("✅ Hash da senha gerado");

    console.log("🔌 Conectando ao banco de dados...");
    const prisma = PrismaGetInstance();

    // Testa a conexão
    try {
      await prisma.$connect();
      console.log("✅ Conexão com banco estabelecida");
    } catch (dbError) {
      console.error("❌ Erro na conexão com banco:", dbError);
      return NextResponse.json(
        { error: "Erro na conexão com banco de dados" },
        { status: 500 }
      );
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      console.log("❌ Usuário já existe");
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Cria o usuário no banco de dados
    console.log("📝 Criando usuário no banco...");
    
    const userData = {
      email: email.toLowerCase(),
      password: hash,
      role: role && Object.values(Role).includes(role) ? role : Role.USER,
    };

    console.log("Dados do usuário a serem inseridos:", {
      ...userData,
      password: "[HIDDEN]"
    });

    const user = await prisma.user.create({
      data: userData,
    });

    console.log("✅ Usuário criado com sucesso:", user.id);

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso!",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== ERRO NO REGISTRO ===");
    console.error("Tipo do erro:", typeof error);
    console.error("Erro:", error);
    
    if (error instanceof Error) {
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
    }
    
    return NextResponse.json(
      { error: "Erro interno do servidor. Verifique os logs." },
      { status: 500 }
    );
  }
}
