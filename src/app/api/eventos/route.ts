// /app/api/eventos/route.ts

import { PrismaGetInstance } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = PrismaGetInstance();

export async function POST(req: NextRequest) {
  try {
    const { nome, descricao, dataInicio, horaInicio, horaFim, local } = await req.json();

    const evento = await prisma.evento.create({
      data: {
        nome,
        descricao,
        dataInicio: new Date(dataInicio),
        horaInicio: new Date(`${dataInicio}T${horaInicio}`),
        horaFim: new Date(`${dataInicio}T${horaFim}`),
        local,
      },
    });

    return NextResponse.json({ success: true, evento }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ success: false, error: "Erro ao criar evento" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany();
    return NextResponse.json({ success: true, eventos }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return NextResponse.json({ success: false, error: "Erro ao listar eventos" }, { status: 500 });
  }
}
