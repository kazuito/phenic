/*
  Warnings:

  - The `iconName` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "iconName",
ADD COLUMN     "iconName" TEXT NOT NULL DEFAULT 'dumbbell';

-- DropEnum
DROP TYPE "ExerciseIconName";
