import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

type EventStatus = "ativo" | "inativo";
type SortOrder = "asc" | "desc";

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
  createdAt: Date;
  updatedAt: Date;
};

type EventCreateInput = {
  title: string;
  short_description?: string | null;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  organizer_name?: string | null;
  image_url?: string | null;
  price?: number;
  status?: EventStatus;
  event_date_start?: Date | string | null;
  event_time_start?: string | null;
};

type EventsFindManyArgs = {
  where?: { status?: EventStatus };
  orderBy?: { event_date_start?: SortOrder };
  take?: number;
};

type EventsCreateArgs = { data: EventCreateInput };

type PrismaEvents = {
  event: {
    findMany(args: EventsFindManyArgs): Promise<EventRecord[]>;
    create(args: EventsCreateArgs): Promise<EventRecord>;
  };
};
const db = prisma as unknown as PrismaEvents;

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const status: EventStatus | undefined =
      statusParam === "ativo" || statusParam === "inativo" ? (statusParam as EventStatus) : undefined;
    const where: { status?: EventStatus } | undefined = status ? { status } : undefined;
    const events = await db.event.findMany({
      where,
      orderBy: { event_date_start: "desc" },
      take: 200,
    });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("GET /api/events erro:", error);
    return NextResponse.json({ error: "Erro ao listar eventos" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<EventCreateInput>;

    const toDateOrNull = (value?: string | Date | null) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      // Espera yyyy-MM-dd ou ISO completo
      const str = String(value);
      const iso = /^\d{4}-\d{2}-\d{2}$/.test(str) ? `${str}T00:00:00.000Z` : str;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    };

    const data: EventCreateInput = {
      title: body.title ?? "",
      short_description: body.short_description ?? null,
      description: body.description ?? null,
      category: body.category ?? null,
      location: body.location ?? null,
      organizer_name: body.organizer_name ?? null,
      image_url: body.image_url ?? null,
      price: typeof body.price === "number" ? body.price : 0,
      status: body.status ?? "ativo",
      event_date_start: toDateOrNull(body.event_date_start) ?? null,
      event_time_start: body.event_time_start ?? null,
    };
    const created = await db.event.create({ data });
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events erro:", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


