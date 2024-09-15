/*
  Warnings:

  - You are about to drop the column `status` on the `Workout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workoutId_fkey";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "status";

-- DropEnum
DROP TYPE "WorkoutStatus";

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
