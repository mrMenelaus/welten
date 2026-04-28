/*
  Warnings:

  - You are about to drop the `PlayerComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlayerCommentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToPostLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerComment" DROP CONSTRAINT "PlayerComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerComment" DROP CONSTRAINT "PlayerComment_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerCommentLike" DROP CONSTRAINT "PlayerCommentLike_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerCommentLike" DROP CONSTRAINT "PlayerCommentLike_playerCommentId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToPostLike" DROP CONSTRAINT "_PostToPostLike_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToPostLike" DROP CONSTRAINT "_PostToPostLike_B_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "playerId" TEXT,
ALTER COLUMN "postId" DROP NOT NULL;

-- DropTable
DROP TABLE "PlayerComment";

-- DropTable
DROP TABLE "PlayerCommentLike";

-- DropTable
DROP TABLE "PostLike";

-- DropTable
DROP TABLE "_PostToPostLike";

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "commentId" TEXT,
    "postId" TEXT,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
