// /app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { Role, EstadoCivil, TamanhoCamiseta, User } from "@prisma/client";

interface RegisterProps {
  // Campos básicos
  email: string;
  password: string;
  password2: string;
  role?: Role;
  
  // Dados Pessoais
  nomeCompleto?: string;
  cpf?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  tamanhoCamiseta?: string;
  profissao?: string;
  telefone?: string;
  contatoEmergencia?: string;
  telefoneEmergencia?: string;
  cidade?: string;
  
  // Ficha de Saúde
  portadorDoenca?: string;
  alergiaIntolerancia?: string;
  medicacaoUso?: string;
  restricaoAlimentar?: string;
  numeroPlano?: string;
  operadora?: string;
  
  // Termos e Condições
  termo1?: boolean;
  termo2?: boolean;
  termo3?: boolean;
}

export interface RegisterResponse {
  error?: string;
  user?: {
    id: string;
    email: string;
    nomeCompleto?: string;
  };
  message?: string;
}

/**
 * Realiza o cadastro completo com todos os dados do formulário
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterProps;
    
    console.log("=== DADOS RECEBIDOS NA API ===");
    console.log("Dados de saúde:", {
      portadorDoenca: body.portadorDoenca,
      alergiaIntolerancia: body.alergiaIntolerancia,
      medicacaoUso: body.medicacaoUso,
      restricaoAlimentar: body.restricaoAlimentar,
      numeroPlano: body.numeroPlano,
      operadora: body.operadora
    });

    const { 
      email, 
      password, 
      password2, 
      role,
      nomeCompleto,
      cpf,
      dataNascimento,
      estadoCivil,
      tamanhoCamiseta,
      profissao,
      telefone,
      contatoEmergencia,
      telefoneEmergencia,
      cidade,
      portadorDoenca,
      alergiaIntolerancia,
      medicacaoUso,
      restricaoAlimentar,
      numeroPlano,
      operadora,
      termo1,
      termo2,
      termo3
    } = body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!email || !password || !password2) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação da senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (password !== password2) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }
    
    // Hash da senha (assíncrono para melhor performance)
    const hash = await bcrypt.hash(password, 12);

    const prisma = PrismaGetInstance();

    // Verifica se o usuário já existe (email)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Verifica se o CPF já existe (se fornecido)
    if (cpf) {
      const existingUserByCpf = await prisma.user.findUnique({
        where: { cpf: cpf }
      });

      if (existingUserByCpf) {
        return NextResponse.json(
          { error: "Este CPF já está cadastrado" },
          { status: 400 }
        );
      }
    }

    // Cria o usuário no banco de dados
    
    // Converte strings para enums se necessário
    const estadoCivilEnum = estadoCivil ? 
      (Object.values(EstadoCivil).includes(estadoCivil.toUpperCase() as EstadoCivil) ? 
        estadoCivil.toUpperCase() as EstadoCivil : null) : null;
    
    const tamanhoCamisetaEnum = tamanhoCamiseta ? 
      (Object.values(TamanhoCamiseta).includes(tamanhoCamiseta.toUpperCase() as TamanhoCamiseta) ? 
        tamanhoCamiseta.toUpperCase() as TamanhoCamiseta : null) : null;

    const userData = {
      email: email.toLowerCase(),
      password: hash,
      role: role && Object.values(Role).includes(role) ? role : Role.USER,
      
      // Dados Pessoais
      nomeCompleto: nomeCompleto || null,
      cpf: cpf || null,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
      estadoCivil: estadoCivilEnum,
      tamanhoCamiseta: tamanhoCamisetaEnum,
      profissao: profissao || null,
      telefone: telefone || null,
      contatoEmergencia: contatoEmergencia || null,
      telefoneEmergencia: telefoneEmergencia || null,
      cidade: cidade || null,
      
      // Ficha de Saúde
      portadorDoenca: portadorDoenca || null,
      alergiaIntolerancia: alergiaIntolerancia || null,
      medicacaoUso: medicacaoUso || null,
      restricaoAlimentar: restricaoAlimentar || null,
      numeroPlano: numeroPlano || null,
      operadora: operadora || null,
      
      // Termos e Condições
      termo1: termo1 || false,
      termo2: termo2 || false,
      termo3: termo3 || false,
    };



    console.log("=== CRIANDO USUÁRIO ===");
    console.log("Dados a serem inseridos:", {
      ...userData,
      password: "[HIDDEN]",
      cpf: cpf ? "***" : null
    });
    
    // Timeout para evitar erro 504 na Vercel
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), 8000);
    });

    const user = await Promise.race([
      prisma.user.create({ data: userData }),
      timeoutPromise
    ]) as User;



    return NextResponse.json(
      {
        message: "Usuário criado com sucesso!",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          nomeCompleto: user.nomeCompleto,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
