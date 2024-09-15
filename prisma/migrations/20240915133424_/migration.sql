/*
  Warnings:

  - You are about to drop the column `musclePartId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the `MusclePart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_musclePartId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "musclePartId";

-- DropTable
DROP TABLE "MusclePart";
