/*
  Warnings:

  - A unique constraint covering the columns `[sequentialId]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequentialId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "sequentialId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tickets_sequentialId_key" ON "tickets"("sequentialId");
