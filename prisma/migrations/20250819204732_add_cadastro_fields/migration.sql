/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "public"."TamanhoCamiseta" AS ENUM ('PP', 'P', 'M', 'G', 'GG', 'XGG');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "alergiaIntolerancia" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "contatoEmergencia" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "estadoCivil" "public"."EstadoCivil",
ADD COLUMN     "medicacaoUso" TEXT,
ADD COLUMN     "nomeCompleto" TEXT,
ADD COLUMN     "planoSaude" TEXT,
ADD COLUMN     "portadorDoenca" TEXT,
ADD COLUMN     "profissao" TEXT,
ADD COLUMN     "restricaoAlimentar" TEXT,
ADD COLUMN     "tamanhoCamiseta" "public"."TamanhoCamiseta",
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "telefoneEmergencia" TEXT,
ADD COLUMN     "termo1" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "termo2" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "termo3" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "public"."users"("cpf");
