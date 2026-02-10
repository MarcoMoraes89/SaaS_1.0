/*
  Warnings:

  - The `status` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ABERTA', 'EM_COTACAO', 'AGUARDANDO_APROVACAO', 'APROVADA', 'AGUARDANDO_FORNECEDOR', 'EM_EXECUCAO', 'PENDENTE_FINALIZACAO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PAGO');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'ABERTA';

-- DropEnum
DROP TYPE "Status";
