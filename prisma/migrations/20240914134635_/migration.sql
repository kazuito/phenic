-- CreateEnum
CREATE TYPE "WorkoutStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "status" "WorkoutStatus" NOT NULL DEFAULT 'ACTIVE';
