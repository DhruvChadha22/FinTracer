/*
  Warnings:

  - You are about to drop the column `plaidId` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `plaidId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `payee` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "plaidId",
ADD COLUMN     "itemId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "plaidId",
ADD COLUMN     "itemId" TEXT;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "payee",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "txnCursor" TEXT,
    "bankName" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
