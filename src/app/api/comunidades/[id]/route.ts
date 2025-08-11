// /api/comunidades/[id]/route.ts

// app/api/comunidades/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type ComunidadeUpdateFields = {
  nome?: string | null;
  brasao_url?: string | null;
  foto_comunidade_url?: string | null;
  data_primeiro_acampa?: string | null;
  primeiro_nome?: string | null;
  data_segundo_acampa?: string | null;
  segundo_nome?: string | null;
  data_envio?: string | null;
  assessores?: string | null;
  descricao?: string | null;
  cor_tema?: string | null;
};

type ErrorResponse = { error: string };

// ✅ PUT: atualiza uma comunidade
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ComunidadeUpdateFields | ErrorResponse>> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Partial<ComunidadeUpdateFields>;
    const filtered: Partial<ComunidadeUpdateFields> = {};
    Object.entries(body).forEach(([k, v]) => {
      if (v === null) filtered[k as keyof typeof filtered] = null;
      else if (typeof v === 'string') filtered[k as keyof typeof filtered] = v === '' ? null : v;
    });

    const res = await fetch(
      `https://app.base44.com/api/apps/68517c13e045c1681c30f703/entities/Comunidade/${id}`,
      {
        method: 'PUT',
        headers: {
          api_key: process.env.BASE44_API_KEY ?? 'dd17ef7221344934b36b6620dcf092e7',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtered),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('Erro Base44:', err);
      return NextResponse.json({ error: err.message ?? 'Erro ao atualizar' }, { status: res.status });
    }

    const updated = (await res.json()) as ComunidadeUpdateFields;
    return NextResponse.json(
      {
        ...updated,
        data_segundo_acampa: updated.data_segundo_acampa ?? null,
        data_envio: updated.data_envio ?? null,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('Erro interno:', e);
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 });
  }
}

// ✅ GET: buscar comunidade específica (exemplo básico)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Aqui você faria fetch ou busca, mas por ora:
  return NextResponse.json({ error: `GET não implementado para ID ${id}` }, { status: 501 });
}

// ✅ DELETE: remover comunidade (exemplo)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Aqui o fetch de DELETE, se desejar:
  return NextResponse.json({ error: `DELETE não implementado para ID ${id}` }, { status: 501 });
}
