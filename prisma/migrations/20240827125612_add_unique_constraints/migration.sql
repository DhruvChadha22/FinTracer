/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Budgets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Categories_itemId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Budgets_userId_name_key" ON "Budgets"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_userId_name_key" ON "Categories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_userId_name_key" ON "Transactions"("userId", "name");
