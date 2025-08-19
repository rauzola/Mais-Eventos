import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, cleanupPrisma } from '@/lib/prisma-vercel';

// GET - Buscar inscrições do usuário logado
export async function GET() {
  try {
    console.log('Buscando inscrições do usuário...');
    
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

    const registrations = await prisma.$queryRaw`
      SELECT 
        er.id,
        er."eventId",
        er."userId",
        er."createdAt",
        e.name as "eventName",
        e.date as "eventDate",
        e."startTime" as "eventStartTime",
        e."endTime" as "eventEndTime",
        e.location as "eventLocation",
        e.image as "eventImage"
      FROM event_registrations er
      LEFT JOIN events e ON er."eventId" = e.id
      WHERE er."userId" = ${session.User.id}
      ORDER BY er."createdAt" DESC
    `;

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
