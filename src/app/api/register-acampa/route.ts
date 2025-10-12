import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma-vercel";
import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';
import React from 'react';
import acampaCapista from '@/components/Email/acampa-campista';
// import { cleanupPrisma } from "@/lib/prisma-config";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegisterAcampaRequest {
  // Dados básicos
  email: string;
  password: string;
  password2: string;
  
  // Dados Pessoais
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  estadoCivil: string;
  tamanhoCamiseta: string;
  profissao: string;
  telefone: string;
  contatoEmergencia: string;
  telefoneEmergencia: string;
  cidade: string;
  frente: string;
  
  // Ficha de Saúde
  portadorDoenca: string;
  alergiaIntolerancia: string;
  medicacaoUso: string;
  restricaoAlimentar: string;
  operadora: string;
  numeroPlano: string;
  
  // Termos e Condições
  termo1: boolean;
  termo2: boolean;
  termo3: boolean;
  
  // Evento
  eventId: string;
  
  // Lista de Espera
  isListaEspera?: boolean;
}

interface RegisterAcampaResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("arquivo") as File | null;
    const jsonData = formData.get("data") as string;
    const data = JSON.parse(jsonData) as RegisterAcampaRequest;

    // Verificar se é lista de espera
    const isListaEspera = data.isListaEspera || false;

    // Verificar se o arquivo foi enviado (não obrigatório para lista de espera)
    if (!isListaEspera && !file) {
      return NextResponse.json(
        { error: "Arquivo é obrigatório" },
        { status: 400 }
      );
    }

    // Validar tipo e tamanho do arquivo (apenas se não for lista de espera)
    if (!isListaEspera && file) {
      if (!(file.type.startsWith("image/") || file.type === "application/pdf")) {
        return NextResponse.json(
          { error: "Apenas arquivos de imagem ou PDF são permitidos" },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Arquivo deve ser de até 10MB" },
          { status: 400 }
        );
      }
    }

    // Validações básicas
    if (!data.email || !data.password || !data.password2) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (data.password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (data.password !== data.password2) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    if (!data.eventId) {
      return NextResponse.json(
        { error: "ID do evento é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: data.eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está cadastrado" },
        { status: 400 }
      );
    }

    // Verificar se o CPF já existe
    const existingCpf = await prisma.user.findUnique({
      where: { cpf: data.cpf }
    });

    if (existingCpf) {
      return NextResponse.json(
        { error: "CPF já está cadastrado" },
        { status: 400 }
      );
    }

    // Upload do arquivo para o Supabase (apenas se não for lista de espera)
    let publicUrlData: { publicUrl: string } | null = null;
    let filename: string | null = null;
    let fileType: string | null = null;
    let fileSize: number | null = null;

    if (!isListaEspera && file) {
      // Data e hora no fuso horário de São Paulo (UTC-3)
      const now = new Date();
      const saoPauloTime = new Date(now.getTime() - (3 * 60 * 60 * 1000)); // UTC-3
      
      // Formatar data como dd/mm/aa
      const day = String(saoPauloTime.getUTCDate()).padStart(2, '0');
      const month = String(saoPauloTime.getUTCMonth() + 1).padStart(2, '0');
      const year = String(saoPauloTime.getUTCFullYear()).slice(-2);
      const formattedDate = `${day}/${month}/${year}`;
      
      // Formatar hora como hh:mm
      const hours = String(saoPauloTime.getUTCHours()).padStart(2, '0');
      const minutes = String(saoPauloTime.getUTCMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      // Nome do arquivo: nomeCompleto_data_hora_nomeEvento.extensao
      const nomeEvento = event.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const nomeCompleto = data.nomeCompleto.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const extensao = file.name.split(".").pop();
      filename = `${nomeCompleto}_${formattedDate.replace(/\//g, "-")}_${formattedTime.replace(/:/g, "-")}_${nomeEvento}.${extensao}`;

      const filePath = `acampa/${data.eventId}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("AcampaNovembro")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: "Erro ao fazer upload do arquivo: " + uploadError.message },
          { status: 500 }
        );
      }

      // Obter URL pública
      const { data: publicUrlDataResult } = supabase.storage
        .from("AcampaNovembro")
        .getPublicUrl(filePath);

      if (!publicUrlDataResult?.publicUrl) {
        return NextResponse.json(
          { error: "Erro ao obter URL pública do arquivo" },
          { status: 500 }
        );
      }

      publicUrlData = publicUrlDataResult;
      fileType = file.type;
      fileSize = file.size;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Converter data de nascimento
    let dataNascimentoFormatada: Date | null = null;
    if (data.dataNascimento) {
      if (data.dataNascimento.includes('/')) {
        // Formato dd/mm/aaaa
        const [day, month, year] = data.dataNascimento.split('/');
        dataNascimentoFormatada = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        // Formato aaaa-mm-dd
        dataNascimentoFormatada = new Date(data.dataNascimento);
      }
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        dataNascimento: dataNascimentoFormatada,
        estadoCivil: data.estadoCivil.toUpperCase().replace("-", "_") as "SOLTEIRO" | "CASADO" | "DIVORCIADO" | "VIUVO" | "UNIAO_ESTAVEL",
        tamanhoCamiseta: data.tamanhoCamiseta.toUpperCase() as "PP" | "P" | "M" | "G" | "GG" | "XGG",
        profissao: data.profissao,
        telefone: data.telefone,
        contatoEmergencia: data.contatoEmergencia,
        telefoneEmergencia: data.telefoneEmergencia,
        cidade: data.cidade,
        portadorDoenca: data.portadorDoenca,
        alergiaIntolerancia: data.alergiaIntolerancia,
        medicacaoUso: data.medicacaoUso,
        restricaoAlimentar: data.restricaoAlimentar,
        operadora: data.operadora,
        numeroPlano: data.numeroPlano,
        termo1: data.termo1,
        termo2: data.termo2,
        termo3: data.termo3,
      }
    });

    // Verificar se já existe inscrição para este usuário e evento
    const existingInscricao = await prisma.inscricaoEvento.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: data.eventId
        }
      }
    });

    if (existingInscricao) {
      return NextResponse.json<RegisterAcampaResponse>(
        { error: "Usuário já está inscrito neste evento" },
        { status: 400 }
      );
    }

    // Função para mapear frente para valores válidos do enum
    const mapFrenteToEnum = (frente: string): "anjonoturno" | "animacao" | "assessores" | "campista" | "coordenacao" | "cozinha" | "estrutura" | "externa" | "intercessao" | "musicaEanimacao" | "primeiros_socorros" => {
      const normalizedFrente = frente.toLowerCase().replace(/\s+/g, "");
      
      // Mapear variações comuns para os valores corretos do enum
      const frenteMap: Record<string, "anjonoturno" | "animacao" | "assessores" | "campista" | "coordenacao" | "cozinha" | "estrutura" | "externa" | "intercessao" | "musicaEanimacao" | "primeiros_socorros"> = {
        // Valores exatos do enum
        "anjonoturno": "anjonoturno",
        "animacao": "animacao",
        "assessores": "assessores",
        "campista": "campista",
        "coordenacao": "coordenacao",
        "cozinha": "cozinha",
        "estrutura": "estrutura",
        "externa": "externa",
        "intercessao": "intercessao",
        "musicaeanimacao": "musicaEanimacao",
        "primeiros_socorros": "primeiros_socorros",
        
        // Variações comuns que podem vir do frontend
        "anjo_noturno": "anjonoturno",
        "anjo noturno": "anjonoturno",
        
        "animação": "animacao",
        
        "assessor": "assessores",
        
        "campistas": "campista",
        
        "coordenação": "coordenacao",
        "coordenador": "coordenacao",
        
        "cozinheiro": "cozinha",
        "cozinheiros": "cozinha",
        
        "estrutural": "estrutura",
        
        "externo": "externa",
        
        "intercessão": "intercessao",
        "intercessor": "intercessao",
        
        "musicaanimacao": "musicaEanimacao",
        "musica_e_animacao": "musicaEanimacao",
        "música_e_animação": "musicaEanimacao",
        "música e animação": "musicaEanimacao",
        "musica e animacao": "musicaEanimacao",
        
        "primeirossocorros": "primeiros_socorros",
        "primeiros socorros": "primeiros_socorros",
        "socorrista": "primeiros_socorros"
      };
      
      return frenteMap[normalizedFrente] || "campista";
    };

    // Criar inscrição no evento
    const inscricaoData = {
      userId: user.id,
      eventId: data.eventId,
      status: "pendente" as const,
      frente: mapFrenteToEnum(data.frente || "campista"),
      arquivoUrl: publicUrlData?.publicUrl || null,
      nomeArquivo: filename,
      tipoArquivo: fileType,
      tamanhoArquivo: fileSize,
      dadosAdicionais: {
        dataInscricao: new Date().toISOString(),
        tipoEvento: isListaEspera ? "acampamento_lista_espera" : "acampamento",
        isListaEspera: isListaEspera
      }
    };

    try {
      const inscricao = await prisma.inscricaoEvento.create({
        data: inscricaoData
      });

      console.log("Inscrição criada com sucesso:", inscricao.id);

      // Enviar email de confirmação diretamente
      try {
        const emailData = {
          nomeCompleto: data.nomeCompleto,
          email: data.email,
          cpf: data.cpf,
          dataNascimento: data.dataNascimento,
          estadoCivil: data.estadoCivil,
          tamanhoCamiseta: data.tamanhoCamiseta,
          profissao: data.profissao,
          telefone: data.telefone,
          contatoEmergencia: data.contatoEmergencia,
          telefoneEmergencia: data.telefoneEmergencia,
          cidade: data.cidade,
          portadorDoenca: data.portadorDoenca,
          alergiaIntolerancia: data.alergiaIntolerancia,
          medicacaoUso: data.medicacaoUso,
          restricaoAlimentar: data.restricaoAlimentar,
          numeroPlano: data.numeroPlano,
          operadora: data.operadora,
          termo1: data.termo1,
          termo2: data.termo2,
          termo3: data.termo3,
          frente: data.frente,
          arquivoUrl: publicUrlData?.publicUrl || undefined,
          eventTitle: event.title,
          eventDateStart: event.event_date_start ? new Date(event.event_date_start).toLocaleDateString('pt-BR') : undefined,
          eventDateEnd: event.event_date_end ? new Date(event.event_date_end).toLocaleDateString('pt-BR') : undefined
        };

        // Limpar o título do evento para o assunto do email
        const cleanEventTitle = (event.title || 'Acampamento')
          .replace(/\n/g, ' ')
          .replace(/\r/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        const subject = isListaEspera 
          ? `Lista de Espera - ${cleanEventTitle} ⛪`
          : `Bem-vindo(a) ao ${cleanEventTitle}! ⛪`;

        const { error: emailError } = await resend.emails.send({
          from: `${process.env.EMAIL_FROM}`,
          to: [data.email],
          subject,
          react: React.createElement(acampaCapista, emailData),
        });

        if (emailError) {
          console.error("Erro ao enviar email:", emailError);
          // Não falhar o cadastro se o email não for enviado
        } else {
          console.log("Email enviado com sucesso para:", data.email);
        }
      } catch (emailError) {
        console.error("Erro ao enviar email:", emailError);
        // Não falhar o cadastro se o email não for enviado
      }

    } catch (inscricaoError) {
      console.error("Erro ao criar inscrição:", inscricaoError);
      return NextResponse.json<RegisterAcampaResponse>(
        { error: "Erro ao criar inscrição no evento" },
        { status: 500 }
      );
    }
    
    return NextResponse.json<RegisterAcampaResponse>({
      success: true,
      message: "Cadastro realizado com sucesso!"
    });

  } catch (error) {
    console.error("Erro no cadastro de acampamento:", error);
    return NextResponse.json<RegisterAcampaResponse>(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    // Cleanup em produção
    // if (process.env.NODE_ENV === "production") {
    //   await cleanupPrisma();
    // }
  }
}