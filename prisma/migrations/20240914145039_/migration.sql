-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_locationId_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "locationId" DROP NOT NULL,
ALTER COLUMN "locationId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
