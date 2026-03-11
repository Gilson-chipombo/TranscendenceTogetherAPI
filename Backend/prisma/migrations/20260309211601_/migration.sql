/*
  Warnings:

  - You are about to drop the column `requesterId` on the `DirectMessage` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DirectMessage" DROP COLUMN "requesterId",
ADD COLUMN     "senderId" TEXT NOT NULL;
