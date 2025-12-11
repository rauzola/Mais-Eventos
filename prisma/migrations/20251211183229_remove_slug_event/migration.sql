/*
  Warnings:

  - You are about to drop the column `parentId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_parentId_fkey";

-- DropIndex
DROP INDEX "public"."events_slug_key";

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "parentId",
DROP COLUMN "slug";
