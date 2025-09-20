-- CreateEnum
CREATE TYPE "public"."ParticipantType" AS ENUM ('campista', 'servo', 'espera');

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "participant_type" "public"."ParticipantType";
