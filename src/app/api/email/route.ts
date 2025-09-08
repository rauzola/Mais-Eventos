// /app/api/email/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Confirmação de envio</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #111; padding: 16px;">
          <h1 style="margin: 0 0 12px;">Olá, John!</h1>
          <p style="margin: 0 0 8px;">Seu e-mail de teste do Projeto Mais Vida foi enviado com sucesso.</p>
          <p style="margin: 0;">Se você recebeu esta mensagem, o serviço de e-mail está funcionando 👍</p>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Projeto Mais Vida <no-reply@resend.dev>',
      to: ['raulsigoli2000@gmail.com'],
      subject: 'Hello world',
      html,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}