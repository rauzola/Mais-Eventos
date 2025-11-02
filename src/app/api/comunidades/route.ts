import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma, cleanupPrisma } from "@/lib/prisma-vercel";
import { hasAtLeastRole, isRole, type AppRole } from "@/lib/roles";

export const revalidate = 0;

type CorTema = "blue" | "green" | "purple" | "red" | "amber" | "pink" | "indigo" | "teal";

type ComunidadeRecord = {
  id: string;
  nome: string;
  descricao: string;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa: Date;
  data_segundo_acampa?: Date | null;
  data_envio?: Date | null;
  assessores?: string | null;
  cor_tema: CorTema;
  createdAt: Date;
  updatedAt: Date;
};

type ComunidadeCreateInput = {
  nome: string;
  descricao?: string;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa: Date | string;
  data_segundo_acampa?: Date | string | null;
  data_envio?: Date | string | null;
  assessores?: string | null;
  cor_tema?: CorTema;
};

type ComunidadeUpdateInput = {
  nome?: string;
  descricao?: string;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa?: Date | string;
  data_segundo_acampa?: Date | string | null;
  data_envio?: Date | string | null;
  assessores?: string | null;
  cor_tema?: CorTema;
};

/**
 * GET /api/comunidades - Lista todas as comunidades
 * Permissão: Público (não requer autenticação)
 */
export async function GET() {
  try {
    const comunidadesRaw = await prisma.comunidades.findMany({
      orderBy: { createdAt: "desc" },
    });

    const comunidades = (comunidadesRaw as unknown as ComunidadeRecord[]).map((com) => ({
      id: com.id,
      nome: com.nome,
      descricao: com.descricao || "",
      brasao_url: com.brasao_url || null,
      foto_comunidade_url: com.foto_comunidade_url || null,
      data_primeiro_acampa: com.data_primeiro_acampa.toISOString(),
      data_segundo_acampa: com.data_segundo_acampa?.toISOString() || null,
      data_envio: com.data_envio?.toISOString() || null,
      assessores: com.assessores || null,
      cor_tema: com.cor_tema || "blue",
      createdAt: com.createdAt.toISOString(),
      updatedAt: com.updatedAt.toISOString(),
    }));

    return NextResponse.json({ comunidades }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar comunidades:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

/**
 * POST /api/comunidades - Cria uma nova comunidade
 * Permissão: Apenas CONCELHO e ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    type SessionWithUser = { User?: { role?: AppRole } };
    let requesterRole = (session as unknown as SessionWithUser).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    
    // Verifica se tem permissão para criar comunidades
    if (!hasAtLeastRole(requesterRole, "CONCELHO")) {
      return NextResponse.json(
        { error: "Sem permissão. Apenas CONCELHO e ADMIN podem criar comunidades." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as Partial<ComunidadeCreateInput>;
    
    // Validação dos campos obrigatórios
    if (!body.nome || !body.data_primeiro_acampa) {
      return NextResponse.json(
        { error: "Nome e data_primeiro_acampa são obrigatórios" },
        { status: 400 }
      );
    }

    const toDateOrNull = (value?: string | Date | null): Date | null => {
      if (!value) return null;
      if (value instanceof Date) return value;
      const str = String(value);
      const iso = /^\d{4}-\d{2}-\d{2}$/.test(str) ? `${str}T00:00:00.000Z` : str;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    };

    const data: ComunidadeCreateInput = {
      nome: body.nome,
      descricao: body.descricao || "",
      brasao_url: body.brasao_url || null,
      foto_comunidade_url: body.foto_comunidade_url || null,
      data_primeiro_acampa: toDateOrNull(body.data_primeiro_acampa)!,
      data_segundo_acampa: toDateOrNull(body.data_segundo_acampa),
      data_envio: toDateOrNull(body.data_envio),
      assessores: body.assessores || null,
      cor_tema: body.cor_tema || "blue",
    };

    const created = await prisma.comunidades.create({ data });
    
    const result = {
      id: created.id,
      nome: created.nome,
      descricao: created.descricao || "",
      brasao_url: created.brasao_url || null,
      foto_comunidade_url: created.foto_comunidade_url || null,
      data_primeiro_acampa: (created as unknown as ComunidadeRecord).data_primeiro_acampa.toISOString(),
      data_segundo_acampa: (created as unknown as ComunidadeRecord).data_segundo_acampa?.toISOString() || null,
      data_envio: (created as unknown as ComunidadeRecord).data_envio?.toISOString() || null,
      assessores: created.assessores || null,
      cor_tema: (created as unknown as ComunidadeRecord).cor_tema || "blue",
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    return NextResponse.json({ comunidade: result }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar comunidade:", error);
    return NextResponse.json({ error: "Erro ao criar comunidade" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

/**
 * PUT /api/comunidades - Atualiza uma comunidade
 * Permissão: Apenas CONCELHO e ADMIN
 */
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    type SessionWithUser = { User?: { role?: AppRole } };
    let requesterRole = (session as unknown as SessionWithUser).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    
    // Verifica se tem permissão para atualizar comunidades
    if (!hasAtLeastRole(requesterRole, "CONCELHO")) {
      return NextResponse.json(
        { error: "Sem permissão. Apenas CONCELHO e ADMIN podem atualizar comunidades." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as Partial<ComunidadeUpdateInput> & { id: string };
    
    if (!body.id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const toDateOrNull = (value?: string | Date | null): Date | null => {
      if (!value) return null;
      if (value instanceof Date) return value;
      const str = String(value);
      const iso = /^\d{4}-\d{2}-\d{2}$/.test(str) ? `${str}T00:00:00.000Z` : str;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    };

    type ComunidadeUpdateData = {
      nome?: string;
      descricao?: string;
      brasao_url?: string | null;
      foto_comunidade_url?: string | null;
      data_primeiro_acampa?: Date;
      data_segundo_acampa?: Date | null;
      data_envio?: Date | null;
      assessores?: string | null;
      cor_tema?: CorTema;
    };

    const updateData: ComunidadeUpdateData = {};
    
    if (body.nome !== undefined) updateData.nome = body.nome;
    if (body.descricao !== undefined) updateData.descricao = body.descricao;
    if (body.brasao_url !== undefined) updateData.brasao_url = body.brasao_url;
    if (body.foto_comunidade_url !== undefined) updateData.foto_comunidade_url = body.foto_comunidade_url;
    if (body.data_primeiro_acampa !== undefined) {
      const date = toDateOrNull(body.data_primeiro_acampa);
      if (date !== null) updateData.data_primeiro_acampa = date;
    }
    if (body.data_segundo_acampa !== undefined) {
      const date = toDateOrNull(body.data_segundo_acampa);
      updateData.data_segundo_acampa = date;
    }
    if (body.data_envio !== undefined) {
      const date = toDateOrNull(body.data_envio);
      updateData.data_envio = date;
    }
    if (body.assessores !== undefined) updateData.assessores = body.assessores;
    if (body.cor_tema !== undefined) updateData.cor_tema = body.cor_tema;

    const updated = await prisma.comunidades.update({
      where: { id: body.id },
      data: updateData,
    });
    
    const result = {
      id: updated.id,
      nome: updated.nome,
      descricao: updated.descricao || "",
      brasao_url: updated.brasao_url || null,
      foto_comunidade_url: updated.foto_comunidade_url || null,
      data_primeiro_acampa: (updated as unknown as ComunidadeRecord).data_primeiro_acampa.toISOString(),
      data_segundo_acampa: (updated as unknown as ComunidadeRecord).data_segundo_acampa?.toISOString() || null,
      data_envio: (updated as unknown as ComunidadeRecord).data_envio?.toISOString() || null,
      assessores: updated.assessores || null,
      cor_tema: (updated as unknown as ComunidadeRecord).cor_tema || "blue",
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    return NextResponse.json({ comunidade: result }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar comunidade:", error);
    return NextResponse.json({ error: "Erro ao atualizar comunidade" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

/**
 * DELETE /api/comunidades - Deleta uma comunidade
 * Permissão: Apenas CONCELHO e ADMIN
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    type SessionWithUser = { User?: { role?: AppRole } };
    let requesterRole = (session as unknown as SessionWithUser).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    
    // Verifica se tem permissão para deletar comunidades
    if (!hasAtLeastRole(requesterRole, "CONCELHO")) {
      return NextResponse.json(
        { error: "Sem permissão. Apenas CONCELHO e ADMIN podem deletar comunidades." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await prisma.comunidades.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comunidade deletada com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar comunidade:", error);
    return NextResponse.json({ error: "Erro ao deletar comunidade" }, { status: 500 });
  } finally {
    if (process.env.NODE_ENV === "production") await cleanupPrisma();
  }
}

