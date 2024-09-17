-- CreateEnum
CREATE TYPE "ExerciseIconName" AS ENUM ('DUMBBELL', 'BARBELL');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "iconName" "ExerciseIconName" NOT NULL DEFAULT 'DUMBBELL';
