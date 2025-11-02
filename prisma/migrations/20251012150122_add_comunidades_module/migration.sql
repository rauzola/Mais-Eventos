-- CreateEnum
CREATE TYPE "public"."ComunidadeStatus" AS ENUM ('ativo', 'inativo', 'suspenso');

-- CreateEnum
CREATE TYPE "public"."TipoMembro" AS ENUM ('membro', 'assessor', 'coordenador');

-- CreateEnum
CREATE TYPE "public"."TipoAviso" AS ENUM ('aviso', 'comunicado', 'evento', 'informativo');

-- CreateTable
CREATE TABLE "public"."comunidades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "endereco" TEXT,
    "cidade" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "site" TEXT,
    "logo_url" TEXT,
    "status" "public"."ComunidadeStatus" NOT NULL DEFAULT 'ativo',
    "dataFundacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidade_membros" (
    "id" TEXT NOT NULL,
    "comunidadeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipoMembro" "public"."TipoMembro" NOT NULL DEFAULT 'membro',
    "dataIngresso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSaida" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidade_membros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidade_assessores" (
    "id" TEXT NOT NULL,
    "comunidadeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cargo" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidade_assessores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidade_eventos" (
    "id" TEXT NOT NULL,
    "comunidadeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidade_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidade_avisos" (
    "id" TEXT NOT NULL,
    "comunidadeId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "public"."TipoAviso" NOT NULL DEFAULT 'informativo',
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "prioridade" INTEGER NOT NULL DEFAULT 0,
    "autorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidade_avisos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_membros_comunidadeId_userId_key" ON "public"."comunidade_membros"("comunidadeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_assessores_comunidadeId_userId_key" ON "public"."comunidade_assessores"("comunidadeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "comunidade_eventos_comunidadeId_eventId_key" ON "public"."comunidade_eventos"("comunidadeId", "eventId");

-- AddForeignKey
ALTER TABLE "public"."comunidade_membros" ADD CONSTRAINT "comunidade_membros_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "public"."comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_membros" ADD CONSTRAINT "comunidade_membros_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_assessores" ADD CONSTRAINT "comunidade_assessores_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "public"."comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_assessores" ADD CONSTRAINT "comunidade_assessores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_eventos" ADD CONSTRAINT "comunidade_eventos_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "public"."comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_eventos" ADD CONSTRAINT "comunidade_eventos_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidade_avisos" ADD CONSTRAINT "comunidade_avisos_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "public"."comunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
