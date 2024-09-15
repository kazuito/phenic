-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('STRENGTH', 'CARDIO');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "type" "ExerciseType" NOT NULL DEFAULT 'STRENGTH';

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "time" INTEGER,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "reps" DROP NOT NULL;
