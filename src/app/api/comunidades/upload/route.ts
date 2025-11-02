import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { hasAtLeastRole, isRole, type AppRole } from "@/lib/roles";
import { prisma } from "@/lib/prisma-vercel";

export const revalidate = 0;

/**
 * POST /api/comunidades/upload - Faz upload de imagem (brasão ou foto) para uma comunidade
 * Permissão: Apenas CONCELHO e ADMIN
 */
export async function POST(request: NextRequest) {
  try {
    console.log("=== INICIANDO UPLOAD DE IMAGEM ===");
    
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth-session")?.value;

    if (!auth) {
      console.error("Erro: Não autenticado");
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const session = await prisma.sessions.findFirst({
      where: { token: auth, valid: true, expiresAt: { gt: new Date() } },
      include: { User: true },
    });

    if (!session) {
      console.error("Erro: Sessão não encontrada");
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    type SessionWithUser = { User?: { role?: AppRole } };
    let requesterRole = (session as unknown as SessionWithUser).User?.role || "USER";
    if (!isRole(requesterRole)) requesterRole = "USER";
    
    // Verifica se tem permissão
    if (!hasAtLeastRole(requesterRole, "CONCELHO")) {
      console.error("Erro: Sem permissão");
      return NextResponse.json(
        { error: "Sem permissão. Apenas CONCELHO e ADMIN podem fazer upload." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const comunidadeId = formData.get("comunidadeId") as string | null;
    const tipo = formData.get("tipo") as "brasao" | "foto" | null;
    const nomeComunidade = formData.get("nomeComunidade") as string | null;

    console.log("Dados recebidos:", {
      hasFile: !!file,
      fileSize: file?.size,
      fileType: file?.type,
      comunidadeId,
      tipo,
      nomeComunidade,
    });

    if (!file || !comunidadeId || !tipo) {
      console.error("Erro: Dados faltando", { file: !!file, comunidadeId, tipo });
      return NextResponse.json(
        { error: "Arquivo, comunidadeId e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      console.error("Erro: Tipo de arquivo inválido", file.type);
      return NextResponse.json(
        { error: "Apenas arquivos de imagem são permitidos" },
        { status: 400 }
      );
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.error("Erro: Arquivo muito grande", file.size);
      return NextResponse.json(
        { error: "Arquivo deve ser de até 10MB" },
        { status: 400 }
      );
    }

    // Tentar listar buckets para debug
    const { data: availableBuckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.warn("Não foi possível listar buckets (pode ser problema de permissão):", listError.message);
    } else {
      console.log("Buckets disponíveis:", availableBuckets?.map(b => b.name) || []);
    }

    // Gerar nome do arquivo com nome da comunidade e ano atual
    const extension = file.name.split(".").pop() || "jpg";
    const nomeSanitizado = (nomeComunidade || "comunidade")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const anoAtual = new Date().getFullYear();

    // Nome final: {nomeComunidade}_{tipo}_{ano}.{extensão}
    const filename = `${nomeSanitizado}_${tipo}_${anoAtual}.${extension}`;

    // Caminho: comunidades/{nomeComunidade}/{filename}
    const filePath = `${nomeSanitizado}/${filename}`;

    console.log("Fazendo upload para:", filePath);

    // Upload no Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comunidades")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Erro ao fazer upload:", uploadError);

      if (uploadError.message.includes("Bucket not found") || uploadError.message.includes("not found")) {
        return NextResponse.json(
          { 
            error: "Bucket 'comunidades' não encontrado. Crie o bucket manualmente no Supabase.",
            details: "Painel Supabase → Storage → New bucket → nome: 'comunidades' (minúsculo) → public: true"
          },
          { status: 404 }
        );
      }

      const errorMessage = uploadError.message.toLowerCase();
      const isRLSError = errorMessage.includes("policy") || 
                         errorMessage.includes("permission") ||
                         errorMessage.includes("row-level security");

      if (isRLSError) {
        return NextResponse.json(
          { 
            error: "Erro de permissão RLS. As políticas de segurança do Supabase estão bloqueando o upload.",
            details: `
Execute estas políticas no SQL Editor do Supabase:

1️⃣ Upload (INSERT):
CREATE POLICY "Permitir upload comunidades" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'comunidades');

2️⃣ Leitura (SELECT):
CREATE POLICY "Permitir leitura comunidades" ON storage.objects
FOR SELECT
USING (bucket_id = 'comunidades');

3️⃣ (Opcional) Update:
CREATE POLICY "Permitir update comunidades" ON storage.objects
FOR UPDATE
USING (bucket_id = 'comunidades')
WITH CHECK (bucket_id = 'comunidades');

4️⃣ (Opcional) Delete:
CREATE POLICY "Permitir delete comunidades" ON storage.objects
FOR DELETE
USING (bucket_id = 'comunidades');
            `.trim()
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: "Erro ao fazer upload: " + uploadError.message },
        { status: 500 }
      );
    }

    console.log("Upload bem-sucedido:", uploadData);

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from("comunidades")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      console.error("Erro: Não foi possível obter URL pública");
      return NextResponse.json(
        { error: "Erro ao obter URL pública do arquivo" },
        { status: 500 }
      );
    }

    console.log("URL pública gerada:", publicUrlData.publicUrl);

    // Verificar se a comunidade existe
    const comunidade = await prisma.comunidades.findUnique({
      where: { id: comunidadeId },
    });

    if (!comunidade) {
      console.error("Erro: Comunidade não encontrada", comunidadeId);
      return NextResponse.json(
        { error: "Comunidade não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar campo correto no banco
    const updateField = tipo === "brasao" ? "brasao_url" : "foto_comunidade_url";
    await prisma.comunidades.update({
      where: { id: comunidadeId },
      data: {
        [updateField]: publicUrlData.publicUrl,
      },
    });

    console.log("Comunidade atualizada com sucesso");

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      filePath: filePath,
      message: `${tipo === "brasao" ? "Brasão" : "Foto"} enviado com sucesso`
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo: " + errorMessage },
      { status: 500 }
    );
  }
}
