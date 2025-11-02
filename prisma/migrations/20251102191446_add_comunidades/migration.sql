-- CreateEnum
CREATE TYPE "public"."CorTema" AS ENUM ('blue', 'green', 'purple', 'red', 'amber', 'pink', 'indigo', 'teal');

-- CreateTable
CREATE TABLE "public"."comunidades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL DEFAULT '',
    "brasao_url" TEXT,
    "foto_comunidade_url" TEXT,
    "data_primeiro_acampa" TIMESTAMP(3) NOT NULL,
    "data_segundo_acampa" TIMESTAMP(3),
    "data_envio" TIMESTAMP(3),
    "assessores" TEXT,
    "cor_tema" "public"."CorTema" NOT NULL DEFAULT 'blue',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("id")
);
