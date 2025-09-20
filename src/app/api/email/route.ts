// /app/api/email/route.ts
import { Resend } from 'resend';
import React from 'react';
import acampaCapista from '@/components/Email/acampa-campista';

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
  termo1?: boolean;
  termo2?: boolean;
  termo3?: boolean;
  frente?: string;
  arquivoUrl?: string;
  eventTitle?: string;
  eventDateStart?: string;
  eventDateEnd?: string;
}

export async function POST(request: Request) {
  try {
    const emailData: EmailData = await request.json();

    // Sempre usar o template do acampamento
    const subject = `Bem-vindo(a) ao ${emailData.eventTitle || 'Acampamento'}! ⛪`;

    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: [emailData.email],
      subject,
      react: React.createElement(acampaCapista, emailData),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}