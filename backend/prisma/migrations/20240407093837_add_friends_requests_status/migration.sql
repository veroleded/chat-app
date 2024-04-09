/*
  Warnings:

  - Changed the type of `status` on the `friend_requests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FriendsRequsetStatus" AS ENUM ('SENDED', 'ACCEPTED', 'CANCELED', 'REJECTED');

-- AlterTable
ALTER TABLE "friend_requests" DROP COLUMN "status",
ADD COLUMN     "status" "FriendsRequsetStatus" NOT NULL;
