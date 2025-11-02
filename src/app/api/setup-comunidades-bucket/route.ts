import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("=== CONFIGURANDO BUCKET COMUNIDADES ===");

    // Criar o bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket("comunidades", {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      // Se o bucket já existe, não é um erro crítico
      if (bucketError.message.includes("already exists")) {
        console.log("Bucket 'comunidades' já existe");
        return NextResponse.json({
          success: true,
          message: "Bucket 'comunidades' já existe",
          bucket: { name: "comunidades" },
          policies: [
            {
              name: "Permitir upload de arquivos",
              policy: `CREATE POLICY "Permitir upload comunidades" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'comunidades');`
            },
            {
              name: "Permitir leitura de arquivos",
              policy: `CREATE POLICY "Permitir leitura comunidades" ON storage.objects FOR SELECT USING (bucket_id = 'comunidades');`
            }
          ]
        });
      }
      
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
        policy: `CREATE POLICY "Permitir upload comunidades" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'comunidades');`
      },
      {
        name: "Permitir leitura de arquivos",
        policy: `CREATE POLICY "Permitir leitura comunidades" ON storage.objects FOR SELECT USING (bucket_id = 'comunidades');`
      }
    ];

    console.log("Bucket 'comunidades' configurado com sucesso!");
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
    // Verificar se o bucket existe
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error("Erro ao listar buckets:", error);
      return NextResponse.json(
        { error: "Erro ao listar buckets: " + error.message },
        { status: 500 }
      );
    }

    const comunidadesBucket = buckets?.find(b => b.name === "comunidades");

    return NextResponse.json({
      success: true,
      exists: !!comunidadesBucket,
      bucket: comunidadesBucket
    });

  } catch (error) {
    console.error("Erro ao verificar bucket:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

