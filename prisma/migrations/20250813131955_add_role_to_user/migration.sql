-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'STAFF', 'COORD', 'CONCELHO', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';
