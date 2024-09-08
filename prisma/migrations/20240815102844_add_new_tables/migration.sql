-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plaidId" TEXT NOT NULL,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plaidId" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "payee" TEXT NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
