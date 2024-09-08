-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_categoryId_fkey";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
