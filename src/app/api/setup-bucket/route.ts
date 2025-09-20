import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("=== CONFIGURANDO BUCKET PROJETOMAISVIDA ===");

    // Criar o bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket("projetomaisvida", {
      public: true,
      allowedMimeTypes: ['image/*', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      console.error("Erro ao criar bucket:", bucketError);
      return NextResponse.json(
        { error: "Erro ao criar bucket: " + bucketError.message },
        { status: 500 }
      );
    }

    console.log("Bucket criado com sucesso:", bucketData);

    // Configurar políticas de acesso
    const policies = [
      {
        name: "Permitir upload de arquivos",
        policy: `CREATE POLICY "Permitir upload de arquivos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projetomaisvida');`
      },
      {
        name: "Permitir leitura de arquivos",
        policy: `CREATE POLICY "Permitir leitura de arquivos" ON storage.objects FOR SELECT USING (bucket_id = 'projetomaisvida');`
      }
    ];

    console.log("Bucket 'projetomaisvida' configurado com sucesso!");
    console.log("Políticas que devem ser configuradas manualmente no Supabase:");
    policies.forEach(policy => {
      console.log(`- ${policy.name}: ${policy.policy}`);
    });

    return NextResponse.json({
      success: true,
      message: "Bucket configurado com sucesso!",
      bucket: bucketData,
      policies: policies
    });

  } catch (error) {
    console.error("Erro na configuração do bucket:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Listar buckets existentes
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Erro ao listar buckets:", error);
      return NextResponse.json(
        { error: "Erro ao listar buckets: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      buckets: buckets
    });

  } catch (error) {
    console.error("Erro ao listar buckets:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
