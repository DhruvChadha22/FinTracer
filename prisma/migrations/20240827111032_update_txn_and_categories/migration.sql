/*
  Warnings:

  - You are about to drop the column `itemId` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "notes";

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_name_key" ON "Transactions"("name");
