import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, cleanupPrisma } from '@/lib/prisma-vercel';

// GET - Buscar evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Buscando evento: ${params.id}`);
    
         const event = await prisma.$queryRaw`
       SELECT 
         e.id,
         e.name,
         e.location,
         e.date,
         e."startTime",
         e."endTime",
         e.description,
         e.image,
         e."createdAt",
         e."createdBy",
         u.email as "creatorEmail",
         u.role as "creatorRole",
         COALESCE(COUNT(er.id), 0)::int as "registrationCount"
       FROM events e
       LEFT JOIN users u ON e."createdBy" = u.id
       LEFT JOIN event_registrations er ON e.id = er."eventId"
       WHERE e.id = ${params.id}
       GROUP BY e.id, u.email, u.role
     `;

    if (!event || (Array.isArray(event) && event.length === 0)) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    const eventData = Array.isArray(event) ? event[0] : event;
    return NextResponse.json(eventData);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

// PUT - Atualizar evento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Atualizando evento: ${params.id}`);
    
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

    // Verificar se o usuário tem permissão (CONCELHO ou ADMIN)
    const userRole = (session.User as unknown as { role?: string })?.role;
    if (userRole !== 'CONCELHO' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, location, date, startTime, endTime, description, image } = body;

    // Validação básica
    if (!name || !location || !date || !startTime || !endTime || !description) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Atualizar evento usando SQL direto
    await prisma.$executeRaw`
      UPDATE events 
      SET 
        name = ${name},
        location = ${location},
        date = ${new Date(date)}::timestamp,
        "startTime" = ${startTime},
        "endTime" = ${endTime},
        description = ${description},
        image = ${image || null},
        "updatedAt" = NOW()
      WHERE id = ${params.id}
    `;

         // Buscar evento atualizado
     const updatedEvent = await prisma.$queryRaw`
       SELECT 
         e.id,
         e.name,
         e.location,
         e.date,
         e."startTime",
         e."endTime",
         e.description,
         e.image,
         e."createdAt",
         e."createdBy",
         u.email as "creatorEmail",
         u.role as "creatorRole",
         COALESCE(COUNT(er.id), 0)::int as "registrationCount"
       FROM events e
       LEFT JOIN users u ON e."createdBy" = u.id
       LEFT JOIN event_registrations er ON e.id = er."eventId"
       WHERE e.id = ${params.id}
       GROUP BY e.id, u.email, u.role
     `;

    const event = Array.isArray(updatedEvent) ? updatedEvent[0] : updatedEvent;
    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

// DELETE - Deletar evento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Deletando evento: ${params.id}`);
    
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

    // Apenas ADMIN pode deletar eventos
    const userRole = (session.User as unknown as { role?: string })?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem deletar eventos' },
        { status: 403 }
      );
    }

    // Deletar evento usando SQL direto
    await prisma.$executeRaw`
      DELETE FROM events WHERE id = ${params.id}
    `;

    return NextResponse.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
