-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;
