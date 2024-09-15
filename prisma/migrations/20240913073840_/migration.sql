/*
  Warnings:

  - Added the required column `musclePartId` to the `Excercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Excercise" ADD COLUMN     "musclePartId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MusclePart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusclePart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Excercise" ADD CONSTRAINT "Excercise_musclePartId_fkey" FOREIGN KEY ("musclePartId") REFERENCES "MusclePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
