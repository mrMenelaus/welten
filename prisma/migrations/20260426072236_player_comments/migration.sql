-- CreateTable
CREATE TABLE "PlayerComment" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerComment" ADD CONSTRAINT "PlayerComment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
