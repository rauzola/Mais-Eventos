import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

type EventStatus = "ativo" | "inativo";

type EventRecord = {
  id: string;
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  organizer_name?: string | null;
  image_url?: string | null;
  price: number;
  status: EventStatus;
  event_date_start?: Date | null;
  event_time_start?: string | null;
  confirmation_text?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type EventUpdateInput = Partial<Omit<EventRecord, "id" | "createdAt" | "updatedAt">>;

type EventsFindUniqueArgs = { where: { id: string } };
type EventsUpdateArgs = { where: { id: string }; data: EventUpdateInput };
type EventsDeleteArgs = { where: { id: string } };

type PrismaEvents = {
  event: {
    findUnique(args: EventsFindUniqueArgs): Promise<EventRecord | null>;
    update(args: EventsUpdateArgs): Promise<EventRecord>;
    delete(args: EventsDeleteArgs): Promise<EventRecord>;
  };
};
const db = prisma as unknown as PrismaEvents;

export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = (await request.json()) as EventUpdateInput;
    const { id } = await params;
    const updated = await db.event.update({ where: { id }, data: body });
    return NextResponse.json({ event: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.event.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao remover evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


