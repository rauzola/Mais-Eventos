-- CreateEnum
CREATE TYPE "public"."FrenteType" AS ENUM ('cozinha', 'estrutura', 'externa', 'coordenacao', 'primeiros_socorros', 'animacao', 'campista');

-- AlterTable
ALTER TABLE "public"."inscricoes_eventos" ADD COLUMN     "frente" "public"."FrenteType" NOT NULL DEFAULT 'campista';
