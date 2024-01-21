/*
  Warnings:

  - You are about to drop the column `isActivated` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActivated",
ADD COLUMN     "is_activated" BOOLEAN NOT NULL DEFAULT false;
