import { z } from "zod"

export const ItemsModel = z.object({
    id: z.string(),
    userId: z.string(),
    accessToken: z.string(),
    txnCursor: z.string().nullish(),
    bankName: z.string().nullish(),
});

export const AccountsModel = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    itemId: z.string(),
    balance: z.number().int(),
    mask: z.string().nullish(),
});

export const CategoriesModel = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
});

export const TransactionsModel = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    amount: z.number().int(),
    date: z.coerce.date(),
    accountId: z.string().nullish(),
    categoryId: z.string().nullish(),
});

export const BudgetsModel = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    amount: z.number().int(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    categoryId: z.string().nullish(),
});  
