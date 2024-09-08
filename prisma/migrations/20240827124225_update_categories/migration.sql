/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Budgets_name_key";

-- DropIndex
DROP INDEX "Transactions_name_key";

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "itemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Categories_itemId_key" ON "Categories"("itemId");
