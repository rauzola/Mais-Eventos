// /app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaGetInstance } from "@/lib/prisma-pg";
import { Role, EstadoCivil, TamanhoCamiseta } from "@prisma/client";

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
  planoSaude?: string;
  
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
    console.log("=== INÍCIO DO REGISTRO COMPLETO ===");
    
    const body = (await request.json()) as RegisterProps;
    console.log("Dados recebidos:", { 
      email: body.email, 
      passwordLength: body.password.length,
      nomeCompleto: body.nomeCompleto,
      cpf: body.cpf ? "***" : undefined
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
      planoSaude,
      termo1,
      termo2,
      termo3
    } = body;

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

    // Verifica se o usuário já existe (email)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUserByEmail) {
      console.log("❌ Usuário já existe (email)");
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
        console.log("❌ CPF já cadastrado");
        return NextResponse.json(
          { error: "Este CPF já está cadastrado" },
          { status: 400 }
        );
      }
    }

    // Cria o usuário no banco de dados
    console.log("📝 Criando usuário no banco...");
    
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
      planoSaude: planoSaude || null,
      
      // Termos e Condições
      termo1: termo1 || false,
      termo2: termo2 || false,
      termo3: termo3 || false,
    };

    console.log("Dados do usuário a serem inseridos:", {
      ...userData,
      password: "[HIDDEN]",
      cpf: cpf ? "***" : null
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
          nomeCompleto: user.nomeCompleto,
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
