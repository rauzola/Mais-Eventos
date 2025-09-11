import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

type PrismaEvents = { event: { findUnique(args: unknown): Promise<unknown | null>; update(args: unknown): Promise<unknown>; delete(args: unknown): Promise<unknown> } };
const db = prisma as unknown as PrismaEvents;

export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await db.event.findUnique({ where: { id: params.id } } as any);
    if (!event) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await db.event.update({ where: { id: params.id }, data: body } as any);
    return NextResponse.json({ event: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.event.delete({ where: { id: params.id } } as any);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events/[id] erro:", error);
    return NextResponse.json({ error: "Erro ao remover evento" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}


