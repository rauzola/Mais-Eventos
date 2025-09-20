-- CreateEnum
CREATE TYPE "public"."InscricaoStatus" AS ENUM ('pendente', 'confirmada', 'cancelada', 'rejeitada');

-- CreateTable
CREATE TABLE "public"."inscricoes_eventos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "public"."InscricaoStatus" NOT NULL DEFAULT 'pendente',
    "dataInscricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataConfirmacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "comprovantePagamento" TEXT,
    "valorPago" DOUBLE PRECISION,
    "formaPagamento" TEXT,
    "dadosAdicionais" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscricoes_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inscricoes_eventos_userId_eventId_key" ON "public"."inscricoes_eventos"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "public"."inscricoes_eventos" ADD CONSTRAINT "inscricoes_eventos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscricoes_eventos" ADD CONSTRAINT "inscricoes_eventos_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
