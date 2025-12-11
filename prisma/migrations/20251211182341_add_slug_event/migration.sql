/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "public"."events"("slug");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
