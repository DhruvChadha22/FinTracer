/*
  Warnings:

  - Added the required column `balance` to the `Accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "balance" INTEGER NOT NULL,
ADD COLUMN     "mask" TEXT;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "accountId" DROP NOT NULL;
