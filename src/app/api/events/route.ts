import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

type PrismaEvents = { event: { findMany(args: unknown): Promise<unknown[]>; create(args: unknown): Promise<unknown> } };
const db = prisma as unknown as PrismaEvents;

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "ativo" | "inativo" | null;
    const where = status ? { status } : {};
    const events = await db.event.findMany({
      where: where as any,
      orderBy: { event_date_start: "desc" },
      take: 200,
    } as any);
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
    const body = await request.json();
    const created = await db.event.create({ data: body } as any);
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events erro:", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


