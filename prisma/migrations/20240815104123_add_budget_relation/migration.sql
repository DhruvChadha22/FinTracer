/*
  Warnings:

  - You are about to drop the column `category` on the `Budgets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budgets" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Budgets" ADD CONSTRAINT "Budgets_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
