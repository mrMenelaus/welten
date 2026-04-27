-- CreateTable
CREATE TABLE "PlayerCommentLike" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "playerCommentId" TEXT NOT NULL,

    CONSTRAINT "PlayerCommentLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerCommentLike" ADD CONSTRAINT "PlayerCommentLike_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCommentLike" ADD CONSTRAINT "PlayerCommentLike_playerCommentId_fkey" FOREIGN KEY ("playerCommentId") REFERENCES "PlayerComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
