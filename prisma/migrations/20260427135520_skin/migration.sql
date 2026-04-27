-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "background" TEXT NOT NULL DEFAULT 'transparent',
ALTER COLUMN "skin" SET DEFAULT 'alex',
ALTER COLUMN "skin" SET DATA TYPE TEXT;
