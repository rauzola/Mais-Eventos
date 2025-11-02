/*
  Warnings:

  - You are about to drop the `comunidade_assessores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidade_avisos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidade_eventos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidade_membros` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comunidades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."comunidade_assessores" DROP CONSTRAINT "comunidade_assessores_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_assessores" DROP CONSTRAINT "comunidade_assessores_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_avisos" DROP CONSTRAINT "comunidade_avisos_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_eventos" DROP CONSTRAINT "comunidade_eventos_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_eventos" DROP CONSTRAINT "comunidade_eventos_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_membros" DROP CONSTRAINT "comunidade_membros_comunidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."comunidade_membros" DROP CONSTRAINT "comunidade_membros_userId_fkey";

-- DropTable
DROP TABLE "public"."comunidade_assessores";

-- DropTable
DROP TABLE "public"."comunidade_avisos";

-- DropTable
DROP TABLE "public"."comunidade_eventos";

-- DropTable
DROP TABLE "public"."comunidade_membros";

-- DropTable
DROP TABLE "public"."comunidades";

-- DropEnum
DROP TYPE "public"."ComunidadeStatus";

-- DropEnum
DROP TYPE "public"."TipoAviso";

-- DropEnum
DROP TYPE "public"."TipoMembro";
