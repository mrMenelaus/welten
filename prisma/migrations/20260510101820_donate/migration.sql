-- CreateTable
CREATE TABLE "Donate" (
    "id" TEXT NOT NULL,
    "param" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "donateId" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donate_param_key" ON "Donate"("param");

-- CreateIndex
CREATE INDEX "Player_name_idx" ON "Player"("name");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_donateId_fkey" FOREIGN KEY ("donateId") REFERENCES "Donate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
