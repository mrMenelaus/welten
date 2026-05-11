/*
  Warnings:

  - You are about to drop the column `foreground` on the `Donate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Donate" DROP COLUMN "foreground",
ALTER COLUMN "background" SET DEFAULT 'https://nxq44gfls2.ufs.sh/f/DO8NPlKTQEfVM4Zpv6k0RaFld893AgyTWrQXH4n6txC1SKjG';
