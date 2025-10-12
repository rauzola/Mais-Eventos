import { NextRequest, NextResponse } from "next/server";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    console.log("API: Buscando evento com ID:", eventId);

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        event_date_start: true,
        location: true,
        max_participants: true,
      },
    });

    if (!event) {
      console.log("API: Evento não encontrado para ID:", eventId);
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    console.log("API: Evento encontrado:", event.title);

    // Buscar todas as inscrições do evento com dados dos usuários
    const inscricoes = await prisma.inscricaoEvento.findMany({
      where: {
        eventId: eventId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nomeCompleto: true,
            cpf: true,
            telefone: true,
            cidade: true,
            dataNascimento: true,
            estadoCivil: true,
            tamanhoCamiseta: true,
            profissao: true,
            contatoEmergencia: true,
            telefoneEmergencia: true,
            portadorDoenca: true,
            alergiaIntolerancia: true,
            medicacaoUso: true,
            restricaoAlimentar: true,
            operadora: true,
            numeroPlano: true,
            termo1: true,
            termo2: true,
            termo3: true,
            role: true,
          },
        },
      },
      orderBy: {
        dataInscricao: "asc",
      },
    });

    console.log("API: Inscrições encontradas:", inscricoes.length);

    // Estatísticas das inscrições
    const stats = {
      total: inscricoes.filter(i => i.status === "confirmada" || i.status === "pendente").length,
      confirmadas: inscricoes.filter(i => i.status === "confirmada").length,
      pendentes: inscricoes.filter(i => i.status === "pendente").length,
      canceladas: inscricoes.filter(i => i.status === "cancelada").length,
      inativo: inscricoes.filter(i => i.status === "inativo").length,
      porFrente: inscricoes.reduce((acc, inscricao) => {
        const frente = inscricao.frente;
        acc[frente] = (acc[frente] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    console.log("API: Stats calculadas:", stats);

    return NextResponse.json({
      success: true,
      event,
      inscricoes,
      stats,
    });
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

// Para atualizar status de uma inscrição
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { inscricaoId, status, observacoes } = body;

    // Preparar dados para atualização
    const updateData: {
      status?: "pendente" | "confirmada" | "cancelada" | "inativo";
      dataConfirmacao?: Date | null;
      observacoes?: string;
    } = {};
    
    if (status !== undefined) {
      updateData.status = status;
      updateData.dataConfirmacao = status === "confirmada" ? new Date() : null;
    }
    
    if (observacoes !== undefined) {
      updateData.observacoes = observacoes;
    }

    // Atualizar a inscrição
    const inscricaoAtualizada = await prisma.inscricaoEvento.update({
      where: {
        id: inscricaoId,
        eventId: eventId,
      },
      data: updateData,
      include: {
        user: {
          select: {
            nomeCompleto: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      inscricao: inscricaoAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

