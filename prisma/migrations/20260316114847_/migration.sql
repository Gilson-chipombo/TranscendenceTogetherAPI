/*
  Warnings:

  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Friendship" ADD COLUMN     "block" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "fullName",
ADD COLUMN     "block" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "public"."Settings" (
    "id" TEXT NOT NULL,
    "pushNotifications" BOOLEAN DEFAULT true,
    "sound" BOOLEAN NOT NULL DEFAULT true,
    "privateProfile" BOOLEAN DEFAULT false,
    "showStatus" BOOLEAN DEFAULT true,
    "autoReprodution" BOOLEAN DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'portugues',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
