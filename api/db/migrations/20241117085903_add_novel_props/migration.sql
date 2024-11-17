/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Novel` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Novel` table. All the data in the column will be lost.
  - Added the required column `description` to the `Novel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Novel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Novel" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "share" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
