/*
  Warnings:

  - A unique constraint covering the columns `[userId,startDate,endDate]` on the table `Budgets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Budgets_startDate_endDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "Budgets_userId_startDate_endDate_key" ON "Budgets"("userId", "startDate", "endDate");
