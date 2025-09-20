-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."FrenteType" ADD VALUE 'anjonoturno';
ALTER TYPE "public"."FrenteType" ADD VALUE 'assessores';
ALTER TYPE "public"."FrenteType" ADD VALUE 'intercessao';
ALTER TYPE "public"."FrenteType" ADD VALUE 'musicaEanimacao';
