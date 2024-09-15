/*
  Warnings:

  - You are about to drop the column `excerciseId` on the `Work` table. All the data in the column will be lost.
  - You are about to drop the `Excercise` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exerciseId` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Excercise" DROP CONSTRAINT "Excercise_musclePartId_fkey";

-- DropForeignKey
ALTER TABLE "Excercise" DROP CONSTRAINT "Excercise_userId_fkey";

-- DropForeignKey
ALTER TABLE "Work" DROP CONSTRAINT "Work_excerciseId_fkey";

-- AlterTable
ALTER TABLE "Work" DROP COLUMN "excerciseId",
ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Excercise";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "musclePartId" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_musclePartId_fkey" FOREIGN KEY ("musclePartId") REFERENCES "MusclePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
