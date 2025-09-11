/*
  Warnings:

  - The values [inativo] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventStatus_new" AS ENUM ('ativo', 'cancelado', 'finalizado', 'lotado');
ALTER TABLE "public"."events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."events" ALTER COLUMN "status" TYPE "public"."EventStatus_new" USING ("status"::text::"public"."EventStatus_new");
ALTER TYPE "public"."EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "public"."EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "public"."EventStatus_old";
ALTER TABLE "public"."events" ALTER COLUMN "status" SET DEFAULT 'ativo';
COMMIT;

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "accommodation_included" BOOLEAN DEFAULT false,
ADD COLUMN     "cancellation_policy" TEXT,
ADD COLUMN     "event_date_end" TIMESTAMP(3),
ADD COLUMN     "event_time_end" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "max_participants" INTEGER,
ADD COLUMN     "meals_included" BOOLEAN DEFAULT false,
ADD COLUMN     "organizer_contact" TEXT,
ADD COLUMN     "payment_info" TEXT,
ADD COLUMN     "required_items" TEXT[],
ADD COLUMN     "target_audience" TEXT,
ADD COLUMN     "transportation" TEXT;
