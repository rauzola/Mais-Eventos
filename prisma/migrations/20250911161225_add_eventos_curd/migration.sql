-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('ativo', 'inativo');

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "category" TEXT,
    "location" TEXT,
    "organizer_name" TEXT,
    "image_url" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'ativo',
    "event_date_start" TIMESTAMP(3),
    "event_time_start" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
