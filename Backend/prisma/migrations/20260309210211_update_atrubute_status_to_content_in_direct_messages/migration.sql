/*
  Warnings:

  - You are about to drop the column `status` on the `DirecteMessage` table. All the data in the column will be lost.
  - Added the required column `content` to the `DirecteMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DirecteMessage" DROP COLUMN "status",
ADD COLUMN     "content" TEXT NOT NULL;
