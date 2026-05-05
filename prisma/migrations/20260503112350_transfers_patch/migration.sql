-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_targetId_fkey";

-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "comment" TEXT,
ALTER COLUMN "sourceId" DROP NOT NULL,
ALTER COLUMN "targetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
