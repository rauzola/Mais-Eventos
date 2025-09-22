/*
  Warnings:

  - The values [rejeitada] on the enum `InscricaoStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."InscricaoStatus_new" AS ENUM ('pendente', 'confirmada', 'cancelada', 'inativo');
ALTER TABLE "public"."inscricoes_eventos" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."inscricoes_eventos" ALTER COLUMN "status" TYPE "public"."InscricaoStatus_new" USING ("status"::text::"public"."InscricaoStatus_new");
ALTER TYPE "public"."InscricaoStatus" RENAME TO "InscricaoStatus_old";
ALTER TYPE "public"."InscricaoStatus_new" RENAME TO "InscricaoStatus";
DROP TYPE "public"."InscricaoStatus_old";
ALTER TABLE "public"."inscricoes_eventos" ALTER COLUMN "status" SET DEFAULT 'pendente';
COMMIT;
