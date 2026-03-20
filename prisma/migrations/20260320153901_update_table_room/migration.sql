/*
  Warnings:

  - Added the required column `dataInicio` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "dataInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataTermino" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "inviteToken" DROP NOT NULL;
