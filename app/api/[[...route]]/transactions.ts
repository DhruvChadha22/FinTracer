import { Hono } from "hono";
import { z } from "zod";
import { subDays, parse } from "date-fns";
import { verifyAuth } from "@hono/auth-js";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { ItemsModel, TransactionsModel } from "@/prisma/zod";
import { plaidClient } from "@/lib/plaid";
import { RemovedTransaction, Transaction } from "plaid";
import { convertAmountToMiliUnits, formatCategory } from "@/lib/utils";

const app = new Hono()
    .get(
        "/", 
        verifyAuth(),
        zValidator(
            "query", 
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { from, to, accountId } = c.req.valid("query"); 

            if (!auth.token?.id) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

            const data = await prisma.transactions.findMany({
                where: {
                    userId: auth.token.id,
                    accountId: accountId ? accountId : undefined,
                    date: {
                        gte: startDate,
                        lte: endDate,
                    }
                },
                select: {
                    id: true,
                    amount: true,
                    name: true,
                    date: true,
                    account: {
                        select: {
                            name: true,
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                },
                orderBy: {
                    date: "desc"
                },
            });

            return c.json({
                data
            });
    })
    .get(
        "/:id",
        verifyAuth(),
        zValidator(
            "param", 
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.transactions.findUnique({
                where: {
                    userId: auth.token.id,
                    id: id,
                },
                select: {
                    id: true,
                    amount: true,
                    name: true,
                    date: true,
                    accountId: true,
                    categoryId: true,
                },
            });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json", 
            TransactionsModel.omit({
                id: true,
                userId: true
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.create({
                data: {
                    userId: auth.token.id,
                    ...values
                }
            });

            return c.json({ data });
    })
    .post(
        "/bulk-create",
        verifyAuth(),
        zValidator(
            "json",
            z.array(
                TransactionsModel.omit({
                    id: true,
                    userId: true,
                })
            )
        ),
        async (c) => {
            const auth = c.get("authUser");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.transactions.createManyAndReturn({
                data: 
                    values.map((value) => ({
                        userId: auth.token?.id as string,
                        ...value
                    }))
            });

            return c.json({ data });
    })
    .post(
        "/bulk-delete",
        verifyAuth(),
        zValidator(
            "json", 
            z.object({
                ids: z.array(z.string()),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            await prisma.transactions.deleteMany({
                where: {
                    userId: auth.token.id,
                    id: {
                        in: values.ids
                    }
                }
            });

            return c.json({ messsage: "Transactions deleted successfully." });
    })
    .patch(
        "/:id",
        verifyAuth(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        zValidator(
            "json",
            TransactionsModel.omit({
                id: true,
                userId: true,
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!id) {
                return c.json({
                    error: "Missing id"
                }, 400);
            }

            if (!auth.token?.id) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.update({
                where: {
                    id: id,
                    userId: auth.token.id,
                },
                data: {
                    ...values
                }
            });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .delete(
        "/:id",
        verifyAuth(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({
                    error: "Missing id"
                }, 400);
            }

            if (!auth.token?.id) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.delete({
                where: {
                    id: id,
                    userId: auth.token.id,
                }
            })

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .post(
        "/sync",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                itemId: z.string(),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { itemId } = c.req.valid("json");

            if (!itemId) {
                return c.json({ error: "Missing itemId" }, 400);
            }

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const bank = await prisma.items.findUnique({
                    where: {
                        id: itemId,
                        userId: auth.token.id,
                    },
                    select: {
                        id: true,
                        userId: true,
                        accessToken: true,
                        txnCursor: true,
                    }
                });

                if (!bank) {
                    return c.json({ error: "Not found" }, 404);
                }

                await syncTransactions(bank);

                return c.json({ message: "Transactions synced" });
            }
            catch(error) {
                return c.json({ error: "Failure" }, 500);
            }
    });


type ItemProps = z.infer<typeof ItemsModel>;
type UpdateProps = {
    id: string;
    userId: string;
    added: Transaction[];
    modified: Transaction[];
    removed: RemovedTransaction[];
    txnCursor: string | null | undefined; 
};

const syncTransactions = async ({
    id,
    userId,
    accessToken,
    txnCursor,
}: ItemProps) => {
    let added: Transaction[] = [];
    let modified: Transaction[] = [];
    let removed: RemovedTransaction[] = [];
    let hasMore = true;

    while (hasMore) {
        const response = await plaidClient.transactionsSync({
            access_token: accessToken,
            cursor: txnCursor ?? undefined,
        });

        const data = response.data;
        added.push(...data.added);
        modified.push(...data.modified);
        removed.push(...data.removed);
        hasMore = data.has_more;
        txnCursor = data.next_cursor;
    }

    await applyUpdates({ id, userId, added, modified, removed, txnCursor });
};

const applyUpdates = async ({
    id,
    userId,
    added,
    modified,
    removed,
    txnCursor,
}: UpdateProps) => {
    //Process all categories for both added and modified
    const allTxns = [...added, ...modified];
    const categoriesMap = await resolveCategories(userId, allTxns);
    
    //Add, Update and Delete Transactions
    const removedTxnIds = removed.map((txn) => txn.transaction_id);
    await Promise.all([
        insertTxns(userId, added, categoriesMap),
        updateTxns(modified, categoriesMap),
        prisma.transactions.deleteMany({
            where: { 
                id: { 
                    in: removedTxnIds,
                },
            },
        }),
    ]);

    //Update cursor
    await prisma.items.update({
        where: { id },
        data: { txnCursor },
    });
};

const resolveCategories = async (
    userId: string,
    txnArray: Transaction[]
) => {
    const rawCategories = txnArray
        .filter((txn) => txn.personal_finance_category?.primary)
        .map((txn) => formatCategory(txn.personal_finance_category!.primary));

    //Remove Duplicates
    const categoryNames = rawCategories.filter((value, index, self) => self.indexOf(value) === index);

    const existing = await prisma.categories.findMany({
        where: { 
            userId, 
            name: { 
                in: categoryNames,
            },
        },
    });

    const categoriesMap = new Map<string, string>();
    for (const cat of existing) {
        categoriesMap.set(cat.name, cat.id);
    }

    const missing = categoryNames.filter((name) => !categoriesMap.has(name));

    if (missing.length > 0) {
        const created = await prisma.$transaction(
            missing.map((name) =>
                prisma.categories.create({ 
                    data: { 
                        userId, 
                        name,
                    },
                })
            )
        );
        for (const cat of created) {
            categoriesMap.set(cat.name, cat.id);
        }
    }

    return categoriesMap;
};

const insertTxns = async (
    userId: string,
    txnArray: Transaction[],
    categoriesMap: Map<string, string>
) => {
    if (txnArray.length === 0) return;

    const newTxns = txnArray.map((txn) => ({
        id: txn.transaction_id,
        userId,
        name: txn.merchant_name ?? txn.name,
        amount: convertAmountToMiliUnits(txn.amount * -1),
        date: new Date(txn.authorized_date ?? txn.date),
        accountId: txn.account_id,
        categoryId: txn.personal_finance_category?.primary
            ? categoriesMap.get(formatCategory(txn.personal_finance_category.primary))
            : undefined,
    }));

    await prisma.transactions.createMany({
        data: newTxns,
    });
};

const updateTxns = async (
    txnArray: Transaction[],
    categoriesMap: Map<string, string>
) => {
    if (txnArray.length === 0) return;

    const values: string[] = [];
    const params: unknown[] = [];

    txnArray.forEach((txn, index) => {
        const id = txn.transaction_id;
        const name = txn.merchant_name ?? txn.name;
        const amount = convertAmountToMiliUnits(txn.amount * -1);
        const date = new Date(txn.authorized_date ?? txn.date);
        const accountId = txn.account_id;
        const categoryId = txn.personal_finance_category?.primary
            ? categoriesMap.get(formatCategory(txn.personal_finance_category.primary))
            : null;

        const paramStart = index * 6 + 1; // 6 params per row
        values.push(`($${paramStart}, $${paramStart + 1}, $${paramStart + 2}, $${paramStart + 3}, $${paramStart + 4}, $${paramStart + 5})`);
        params.push(id, name, amount, date, accountId, categoryId);
    });

    const sql = `
        UPDATE "Transactions" AS t 
        SET
            name = v.name,
            amount = v.amount,
            date = v.date,
            "accountId" = v."accountId",
            "categoryId" = v."categoryId"
        FROM (
            VALUES
            ${values.join(',\n')}
        ) AS v(id, name, amount, date, "accountId", "categoryId")
        WHERE t.id = v.id;
    `;

    await prisma.$executeRawUnsafe(sql, ...params);
};

export default app;