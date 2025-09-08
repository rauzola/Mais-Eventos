// /app/api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma-vercel";
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
    
    // Hash da senha (salt otimizado para Vercel)
    const hash = await bcrypt.hash(password, 10);

    // Verificações em paralelo para maior velocidade
    const [existingUserByEmail, existingUserByCpf] = await Promise.all([
      prisma.user.findUnique({ where: { email: email.toLowerCase() } }),
      cpf ? prisma.user.findUnique({ where: { cpf: cpf } }) : null
    ]);

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    if (existingUserByCpf) {
      return NextResponse.json(
        { error: "Este CPF já está cadastrado" },
        { status: 400 }
      );
    }

    // Conversões de enum simplificadas para performance
    const estadoCivilEnum = estadoCivil && Object.values(EstadoCivil).includes(estadoCivil.toUpperCase() as EstadoCivil) 
      ? estadoCivil.toUpperCase() as EstadoCivil : null;
    
    const tamanhoCamisetaEnum = tamanhoCamiseta && Object.values(TamanhoCamiseta).includes(tamanhoCamiseta.toUpperCase() as TamanhoCamiseta)
      ? tamanhoCamiseta.toUpperCase() as TamanhoCamiseta : null;

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

    // Timeout otimizado para Vercel (15 segundos)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), 15000);
    });

    const user = await Promise.race([
      prisma.user.create({ data: userData }),
      timeoutPromise
    ]) as User;

    // Enviar email de boas-vindas (não bloqueia o cadastro se falhar)
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: user.nomeCompleto || '',
          email: user.email,
          cpf: user.cpf || '',
          dataNascimento: user.dataNascimento ? new Date(user.dataNascimento).toLocaleDateString('pt-BR') : '',
          estadoCivil: user.estadoCivil || '',
          tamanhoCamiseta: user.tamanhoCamiseta || '',
          profissao: user.profissao || '',
          telefone: user.telefone || '',
          contatoEmergencia: user.contatoEmergencia || '',
          telefoneEmergencia: user.telefoneEmergencia || '',
          cidade: user.cidade || '',
          portadorDoenca: user.portadorDoenca || '',
          alergiaIntolerancia: user.alergiaIntolerancia || '',
          medicacaoUso: user.medicacaoUso || '',
          restricaoAlimentar: user.restricaoAlimentar || '',
          numeroPlano: user.numeroPlano || '',
          operadora: user.operadora || '',
        }),
      });

      if (!emailResponse.ok) {
        console.error('Erro ao enviar email de boas-vindas:', await emailResponse.text());
      }
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
      // Não falha o cadastro se o email não for enviado
    }

    return NextResponse.json({
      message: "Usuário criado com sucesso!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nomeCompleto: user.nomeCompleto,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Erro no registro:", error);
    
    // Tratamento específico para timeouts
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: "Tempo limite excedido. Tente novamente." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}
