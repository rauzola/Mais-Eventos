import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, cleanupPrisma } from '@/lib/prisma-vercel';

// GET - Listar todos os eventos
export async function GET() {
  try {
    console.log('Buscando eventos...');
    
    // Usar SQL direto para contornar problemas do cliente Prisma
         const events = await prisma.$queryRaw`
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
       GROUP BY e.id, u.email, u.role
       ORDER BY e.date ASC
     `;

    console.log(`Eventos encontrados: ${Array.isArray(events) ? events.length : 0}`);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro detalhado ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando criação de evento...');
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-session")?.value;

    if (!token) {
      console.log('Token não encontrado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('Verificando sessão...');
    const session = await prisma.sessions.findFirst({
      where: { token, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session?.User) {
      console.log('Sessão inválida ou expirada');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const userRole = (session.User as { role?: string })?.role;
    console.log(`Usuário autenticado: ${session.User.email} com role: ${userRole}`);
    if (userRole !== 'CONCELHO' && userRole !== 'ADMIN') {
      console.log(`Usuário sem permissão. Role: ${userRole}`);
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log('Dados recebidos:', body);
    
    const { name, location, date, startTime, endTime, description, image } = body;

    // Validação básica
    if (!name || !location || !date || !startTime || !endTime || !description) {
      console.log('Campos obrigatórios faltando:', { name, location, date, startTime, endTime, description });
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    console.log('Criando evento no banco...');
    
         // Usar SQL direto para criar o evento
     const result = await prisma.$executeRaw`
       INSERT INTO events (id, name, location, date, "startTime", "endTime", description, image, "createdAt", "updatedAt", "createdBy")
       VALUES (
         gen_random_uuid()::text,
         ${name},
         ${location},
         ${new Date(date)}::timestamp,
         ${startTime},
         ${endTime},
         ${description},
         ${image || null},
         NOW(),
         NOW(),
         ${session.User.id}
       )
     `;

    console.log('Evento criado com sucesso');
    
         // Buscar o evento criado para retornar
     const createdEvent = await prisma.$queryRaw`
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
         u.role as "creatorRole"
       FROM events e
       LEFT JOIN users u ON e."createdBy" = u.id
       WHERE e."createdBy" = ${session.User.id}
       ORDER BY e."createdAt" DESC
       LIMIT 1
     `;

    const event = Array.isArray(createdEvent) ? createdEvent[0] : createdEvent;
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Erro detalhado ao criar evento:', error);
    
    // Log mais específico para erros do Prisma
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message);
      console.error('Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}
