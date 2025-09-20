-- AlterTable
ALTER TABLE "public"."inscricoes_eventos" ADD COLUMN     "arquivoUrl" TEXT,
ADD COLUMN     "nomeArquivo" TEXT,
ADD COLUMN     "tamanhoArquivo" INTEGER,
ADD COLUMN     "tipoArquivo" TEXT;
