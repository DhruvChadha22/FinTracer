import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { prisma } from "@/lib/db";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

type PeriodData = {
    income: string;
    expenses: string;
    remaining: string;
}[];

type CategoryData = {
    name: string;
    value: string;
}[];

type DaysData = {
    date: Date;
    income: string;
    expenses: string;
}[];

type ExpenseData = {
    expenses: string;
}[];

type BanksData = {
    name: string;
    balance: string;
}[];

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional().nullable(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            let { from, to, accountId } = c.req.valid("query");

            accountId = accountId ? accountId : null;

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

            const periodLength = differenceInDays(endDate, startDate) + 1;
            const lastPeriodStart = subDays(startDate, periodLength);
            const lastPeriodEnd = subDays(endDate, periodLength);

            const fetchFinancialData = async (startDate: Date, endDate: Date) => {
                const result: PeriodData = await prisma.$queryRaw
                    `SELECT 
                        SUM(CASE WHEN amount >= 0 THEN amount ELSE 0 END) AS income,
                        SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS expenses,
                        SUM(amount) AS remaining
                    FROM 
                        "Transactions"
                    WHERE 
                        "userId" = ${auth.userId}
                        AND date >= ${startDate}
                        AND date <= ${endDate}
                        AND (CAST(${accountId} AS VARCHAR) IS NULL OR "accountId" = ${accountId});
                    `;
                    
                return result.map((data) => ({
                    income: Number(data.income),
                    expenses: Number(data.expenses),
                    remaining: Number(data.remaining),
                }));
            };

            const [currentPeriod] = await fetchFinancialData(startDate, endDate);
            const [lastPeriod] = await fetchFinancialData(lastPeriodStart, lastPeriodEnd);

            const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
            const expensesChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
            const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

            const categories: CategoryData = await prisma.$queryRaw
                `SELECT 
                    categories.name AS name,
                    SUM(ABS(amount)) AS value
                FROM 
                    "Transactions" as transactions
                INNER JOIN 
                    "Categories" as categories ON transactions."categoryId" = categories.id
                WHERE 
                    transactions."userId" = ${auth.userId}
                    AND amount < 0
                    AND date >= ${startDate}
                    AND date <= ${endDate}
                    AND (CAST(${accountId} AS VARCHAR) IS NULL OR "accountId" = ${accountId})
                GROUP BY 
                    categories.name
                ORDER BY 
                    SUM(ABS(amount)) DESC;
                `

            const allCategories = categories.map((category) => ({
                name: category.name,
                value: Number(category.value),
            }));

            const topCategories = allCategories.slice(0, 3);
            const otherCategories = allCategories.slice(3);

            const finalCategories = topCategories;
            if (otherCategories.length > 0) {
                const otherCategoriesSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

                finalCategories.push({
                    name: "Other",
                    value: otherCategoriesSum,
                });
            }

            const days: DaysData = await prisma.$queryRaw
                `SELECT 
                    date, 
                    SUM(CASE WHEN amount >= 0 THEN amount ELSE 0 END) as income,
                    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expenses
                FROM
                    "Transactions"
                WHERE 
                    "userId" = ${auth.userId}
                    AND date >= ${startDate}
                    AND date <= ${endDate}
                    AND (CAST(${accountId} AS VARCHAR) IS NULL OR "accountId" = ${accountId})
                GROUP BY 
                    date
                ORDER BY 
                    date;
                `

            const activeDays = days.map((day) => ({
                date: day.date,
                income: Number(day.income),
                expenses: Number(day.expenses),
            }));

            const allDays = fillMissingDays(activeDays, startDate, endDate);

            const allBudgets = await prisma.budgets.findMany({
                where: {
                    userId: auth.userId,
                },
                orderBy: {
                    amount: "desc",
                },
            });

            const budgets = await Promise.all(allBudgets.map(async (budget) => {
                const expenseData: ExpenseData = await prisma.$queryRaw
                    `SELECT 
                        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS expenses
                    FROM 
                        "Transactions"
                    WHERE 
                        "userId" = ${auth.userId}
                        AND date >= ${budget.startDate}
                        AND date <= ${budget.endDate}
                        AND (CAST(${budget.categoryId} AS VARCHAR) IS NULL OR "categoryId" = ${budget.categoryId});
                    `
            
                const expense = Number(expenseData[0].expenses);
                const remaining = budget.amount - expense;

                return {
                    id: budget.id,
                    name: budget.name,
                    value: budget.amount,
                    remaining: remaining,
                    startDate: budget.startDate,
                    endDate: budget.endDate,
                };
            }));

            const topBudgets = budgets.slice(0, 2);
            const otherBudgets = budgets.slice(2);

            const finalBudgets = topBudgets;
            if (otherBudgets.length > 0) {
                const otherBudgetsSum = otherBudgets.reduce((sum, current) => ({
                    id: "other",
                    name: "Other",
                    value: sum.value + current.value,
                    remaining: sum.remaining + current.remaining,
                    startDate: sum.startDate < current.startDate ? sum.startDate : current.startDate,
                    endDate: sum.endDate > current.endDate ? sum.endDate : current.endDate,
                }));

                finalBudgets.push(otherBudgetsSum);
            }

            const banks: BanksData = await prisma.$queryRaw
                `SELECT
                    "bankName" as name,
                    SUM(balance) as balance
                FROM
                    "Items"
                INNER JOIN 
                    "Accounts" ON "Items".id = "Accounts"."itemId"
                WHERE
                    "Items"."userId" = ${auth.userId}
                GROUP BY
                    "Items"."bankName"
                ORDER BY
                    SUM(balance) DESC;
                `
            const allBanks = banks.map((bank) => ({
                name: bank.name,
                balance: Number(bank.balance),
            }));

            const topBanks = allBanks.slice(0, 3);
            const otherBanks = allBanks.slice(3);

            const finalBanks = topBanks;
            if (otherBanks.length > 0) {
                const otherBanksBalance = otherBanks.reduce((sum, current) => sum + current.balance, 0);

                finalBanks.push({
                    name: "Other",
                    balance: otherBanksBalance,
                });
            }
            
            return c.json({ 
                data: {
                    remainingAmount: currentPeriod.remaining,
                    remainingChange,
                    incomeAmount: currentPeriod.income,
                    incomeChange,
                    expensesAmount: currentPeriod.expenses,
                    expensesChange,
                    categories: finalCategories,
                    allDays,
                    budgets: finalBudgets,
                    banks: finalBanks,
                }
            });
    });

export default app;