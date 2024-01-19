/*
  Warnings:

  - You are about to drop the column `activationCode` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activation_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activation_code` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "activationCode",
ADD COLUMN     "activation_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_activation_code_key" ON "users"("activation_code");
