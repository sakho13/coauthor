/*
  Warnings:

  - You are about to drop the column `author_id` on the `Novel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Novel" DROP CONSTRAINT "Novel_author_id_fkey";

-- AlterTable
ALTER TABLE "Novel" DROP COLUMN "author_id";
