// /app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GenerateSession } from "@/lib/generate-session";
import { addHours } from "date-fns";
import { cookies } from "next/headers";

interface RegisterProps {
  email: string;
  nome: string;
  dataNascimento: string;
  profissao: string;
  telefoneContato: string;
  contatoEmergencia: string;
  telefoneContatoEmergencia: string;
  cpf: string;
  estadoCivil: string;
  tamanhoCamiseta: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  error?: string;
  user?: User;
}

/**
 * Realiza o cadastro
 */
export async function POST(request: Request) {
  const body = (await request.json()) as RegisterProps;

  const {
    email,
    nome,
    dataNascimento,
    profissao,
    telefoneContato,
    contatoEmergencia,
    telefoneContatoEmergencia,
    cpf,
    estadoCivil,
    tamanhoCamiseta,
    password,
    password2,
  } = body;

  // Verifica se todos os campos obrigatórios estão presentes
  if (
    !email ||
    !nome ||
    !dataNascimento ||
    !profissao ||
    !telefoneContato ||
    !contatoEmergencia ||
    !telefoneContatoEmergencia ||
    !cpf ||
    !estadoCivil ||
    !tamanhoCamiseta ||
    !password ||
    !password2
  ) {
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 400 }
    );
  }

  // Validação do e-mail
  const emailReg = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  if (!emailReg.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  // Validação da senha
  if (password.length < 8 || password !== password2) {
    return NextResponse.json({ error: "invalid password" }, { status: 400 });
  }

  // Hash da senha
  const hash = bcrypt.hashSync(password, 12);

  try {
    const prisma = PrismaGetInstance();

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email,
        nome,
        data_nascimento: new Date(dataNascimento), // Nome correto da coluna
        profissao,
        telefone_contato: telefoneContato, // Nome correto da coluna
        contato_emergencia: contatoEmergencia, // Nome correto da coluna
        telefone_contato_emergencia: telefoneContatoEmergencia, // Nome correto da coluna
        cpf,
        estado_civil: estadoCivil, // Nome correto da coluna
        tamanho_camiseta: tamanhoCamiseta, // Nome correto da coluna
        password: hash,
      },
    });

    // Gera um token de sessão
    const sessionToken = GenerateSession({
      email,
      passwordHash: hash,
    });

    // Cria a sessão no banco de dados
    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: sessionToken,
        valid: true,
        expiresAt: addHours(new Date(), 24),
      },
    });

    // Define o cookie de autenticação
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth-session",
      value: sessionToken,
      httpOnly: true,
      expires: addHours(new Date(), 0.5), // Expiração de 1 hora para o cookie
      path: "/",
    });

    // Retorna o usuário criado
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Usuário já existe
        return NextResponse.json(
          { error: "user already exists" },
          { status: 400 }
        );
      }
    }
    // Captura de erro genérico
    return NextResponse.json(
      { error: "an error occurred during registration" },
      { status: 500 }
    );
  }
}