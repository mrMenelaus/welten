-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "answer" "Answer" NOT NULL DEFAULT 'PENDING';
