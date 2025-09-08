// /app/api/email/route.ts
import { Resend } from 'resend';
import React from 'react';
import { EmailTemplate } from '@/components/Email/bem-vindo';



const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: ['raul_sigoli@hotmail.com'],
      subject: 'asdasd world',
      react: React.createElement(EmailTemplate, { firstName: 'Raul Sigoli' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}