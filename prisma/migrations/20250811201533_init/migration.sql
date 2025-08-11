-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "estado_civil" TEXT NOT NULL,
    "profissao" TEXT NOT NULL,
    "telefone_contato" TEXT NOT NULL,
    "contato_emergencia" TEXT NOT NULL,
    "telefone_contato_emergencia" TEXT NOT NULL,
    "tamanho_camiseta" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL DEFAULT 'campista',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ComunidadeId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comunidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dataAcampa1" TIMESTAMP(3),
    "nomeAcampa2" TEXT,
    "dataAcampa2" TIMESTAMP(3),
    "dataEnvio" TIMESTAMP(3),
    "assessores" TEXT NOT NULL,

    CONSTRAINT "Comunidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Saude" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "portadorDoenca" BOOLEAN NOT NULL DEFAULT false,
    "doencas" TEXT,
    "alergias" BOOLEAN NOT NULL DEFAULT false,
    "alergiasDetalhe" TEXT,
    "medicacao" BOOLEAN NOT NULL DEFAULT false,
    "medicamentos" TEXT,
    "planoSaude" BOOLEAN NOT NULL DEFAULT false,
    "operadoraPlano" TEXT,
    "numeroInscricaoPlano" TEXT,

    CONSTRAINT "Saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFim" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscricao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Presenca" (
    "id" SERIAL NOT NULL,
    "inscricaoId" TEXT NOT NULL,
    "dataPresenca" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ausente',

    CONSTRAINT "Presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "public"."User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Saude_userId_key" ON "public"."Saude"("userId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_ComunidadeId_fkey" FOREIGN KEY ("ComunidadeId") REFERENCES "public"."Comunidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Saude" ADD CONSTRAINT "Saude_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Presenca" ADD CONSTRAINT "Presenca_inscricaoId_fkey" FOREIGN KEY ("inscricaoId") REFERENCES "public"."Inscricao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
