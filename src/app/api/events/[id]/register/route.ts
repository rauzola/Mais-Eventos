import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, cleanupPrisma } from '@/lib/prisma-vercel';

// POST - Inscrever em um evento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Inscrevendo usuário no evento: ${params.id}`);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const session = await prisma.sessions.findFirst({
      where: { token, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session?.User) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o evento existe
    const event = await prisma.$queryRaw`
      SELECT id, name, date FROM events WHERE id = ${params.id}
    `;

    if (!event || (Array.isArray(event) && event.length === 0)) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário já está inscrito
    const existingRegistration = await prisma.$queryRaw`
      SELECT id FROM event_registrations 
      WHERE "eventId" = ${params.id} AND "userId" = ${session.User.id}
    `;

    if (existingRegistration && (Array.isArray(existingRegistration) ? existingRegistration.length > 0 : existingRegistration)) {
      return NextResponse.json(
        { error: 'Você já está inscrito neste evento' },
        { status: 400 }
      );
    }

    // Criar inscrição usando SQL direto
    await prisma.$executeRaw`
      INSERT INTO event_registrations (id, "eventId", "userId", "createdAt")
      VALUES (gen_random_uuid()::text, ${params.id}, ${session.User.id}, NOW())
    `;

    // Buscar inscrição criada
    const registration = await prisma.$queryRaw`
      SELECT 
        er.id,
        er."eventId",
        er."userId",
        er."createdAt",
        e.name as "eventName",
        e.date as "eventDate",
        u.email as "userEmail"
      FROM event_registrations er
      LEFT JOIN events e ON er."eventId" = e.id
      LEFT JOIN users u ON er."userId" = u.id
      WHERE er."eventId" = ${params.id} AND er."userId" = ${session.User.id}
    `;

    const registrationData = Array.isArray(registration) ? registration[0] : registration;
    return NextResponse.json(registrationData, { status: 201 });
  } catch (error) {
    console.error('Erro ao inscrever no evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

// DELETE - Cancelar inscrição
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Cancelando inscrição no evento: ${params.id}`);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const session = await prisma.sessions.findFirst({
      where: { token, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session?.User) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se a inscrição existe
    const registration = await prisma.$queryRaw`
      SELECT id FROM event_registrations 
      WHERE "eventId" = ${params.id} AND "userId" = ${session.User.id}
    `;

    if (!registration || (Array.isArray(registration) && registration.length === 0)) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      );
    }

    // Deletar inscrição usando SQL direto
    await prisma.$executeRaw`
      DELETE FROM event_registrations 
      WHERE "eventId" = ${params.id} AND "userId" = ${session.User.id}
    `;

    return NextResponse.json({ message: 'Inscrição cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
