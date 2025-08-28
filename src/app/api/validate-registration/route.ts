import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export const revalidate = 0;

interface ValidationBody {
  email?: string;
  cpf?: string;
}

// Função para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar CPF
function isValidCpf(cpf: string): boolean {
  const cleanCpf = cpf.replace(/\D/g, '');
  
  if (cleanCpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ValidationBody;
    const { email, cpf } = body;

    const results: { email?: { exists: boolean; message?: string }; cpf?: { exists: boolean; message?: string } } = {};

    // Validar email se fornecido
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      
      console.log('Email recebido:', email);
      console.log('Email limpo:', cleanEmail);
      console.log('Email é válido:', isValidEmail(cleanEmail));
      
      // Primeiro validar o formato
      if (!isValidEmail(cleanEmail)) {
        results.email = {
          exists: false,
          message: "Formato de e-mail inválido"
        };
      } else {
        // Verificar se já existe no banco
        const emailExists = await prisma.user.findFirst({
          where: { email: cleanEmail },
          select: { id: true }
        });

        results.email = {
          exists: !!emailExists,
          message: emailExists ? "Este e-mail já está cadastrado" : "E-mail disponível"
        };
      }
    }

    // Validar CPF se fornecido
    if (cpf) {
      // Remove formatação do CPF para busca
      const cleanCpf = cpf.replace(/\D/g, '');
      
      console.log('CPF recebido:', cpf);
      console.log('CPF limpo:', cleanCpf);
      console.log('CPF é válido:', isValidCpf(cpf));
      
      // Primeiro validar o formato
      if (!isValidCpf(cpf)) {
        results.cpf = {
          exists: false,
          message: "CPF inválido"
        };
      } else {
        // Buscar por CPF com múltiplas variações de formato
        const cpfExists = await prisma.user.findFirst({
          where: {
            OR: [
              { cpf: cleanCpf },                    // CPF sem formatação
              { cpf: cpf },                         // CPF com formatação original
              { cpf: cpf.replace(/[.-]/g, '') },   // CPF sem pontos e hífens
              { cpf: cpf.replace(/\./g, '') },     // CPF sem pontos
              { cpf: cpf.replace(/-/g, '') }       // CPF sem hífens
            ]
          },
          select: { id: true, cpf: true }
        });

        console.log('CPF encontrado no banco:', cpfExists);

        results.cpf = {
          exists: !!cpfExists,
          message: cpfExists ? "Este CPF já está cadastrado" : "CPF disponível"
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      results 
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao validar registro:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
