// /app/api/email/route.ts
import { Resend } from 'resend';
import React from 'react';
import { EmailTemplate } from '@/components/Email/bem-vindo';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  estadoCivil: string;
  tamanhoCamiseta: string;
  profissao: string;
  telefone: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  cidade: string;
  portadorDoenca: string;
  alergiaIntolerancia: string;
  medicacaoUso: string;
  restricaoAlimentar: string;
  numeroPlano: string;
  operadora: string;
}

export async function POST(request: Request) {
  try {
    const emailData: EmailData = await request.json();

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [emailData.email],
      subject: 'Bem-vindo(a) ao Projeto Mais Vida! 🏥',
      react: React.createElement(EmailTemplate, emailData),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}