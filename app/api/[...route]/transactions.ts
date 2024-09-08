import { Hono } from "hono";
import { z } from "zod";
import { subDays, parse } from "date-fns";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { ItemsModel, TransactionsModel } from "@/prisma/zod";
import { plaidClient } from "@/lib/plaid";
import { RemovedTransaction, Transaction, TransactionsSyncRequest } from "plaid";
import { convertAmountToMiliUnits, formatCategory } from "@/lib/utils";

const app = new Hono()
    .get(
        "/", 
        clerkMiddleware(),
        zValidator(
            "query", 
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { from, to, accountId } = c.req.valid("query"); 

            if (!auth?.userId) {
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
                    userId: auth.userId,
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
        clerkMiddleware(),
        zValidator(
            "param", 
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.transactions.findUnique({
                where: {
                    userId: auth.userId,
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
        clerkMiddleware(),
        zValidator(
            "json", 
            TransactionsModel.omit({
                id: true,
                userId: true
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.create({
                data: {
                    userId: auth.userId,
                    ...values
                }
            });

            return c.json({ data });
    })
    .post(
        "/bulk-create",
        clerkMiddleware(),
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
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.transactions.createManyAndReturn({
                data: 
                    values.map((value) => ({
                        userId: auth.userId,
                        ...value
                    }))
            });

            return c.json({ data });
    })
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator(
            "json", 
            z.object({
                ids: z.array(z.string()),
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const values = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            await prisma.transactions.deleteMany({
                where: {
                    userId: auth.userId,
                    id: {
                        in: values.ids
                    }
                }
            });

            return c.json({ messsage: "Transactions deleted successfully." });
    })
    .patch(
        "/:id",
        clerkMiddleware(),
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
            const auth = getAuth(c);
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!id) {
                return c.json({
                    error: "Missing id"
                }, 400);
            }

            if (!auth?.userId) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.update({
                where: {
                    id: id,
                    userId: auth.userId,
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
        clerkMiddleware(),
        zValidator(
            "param",
            z.object({
                id: z.string().optional(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { id } = c.req.valid("param");

            if (!id) {
                return c.json({
                    error: "Missing id"
                }, 400);
            }

            if (!auth?.userId) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            const data = await prisma.transactions.delete({
                where: {
                    id: id,
                    userId: auth.userId,
                }
            })

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
    })
    .post(
        "/sync",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const items = await prisma.items.findMany({
                where: {
                    userId: auth.userId,
                },
                select: {
                    id: true,
                    userId: true,
                    accessToken: true,
                    txnCursor: true,
                }
            });

            await Promise.all(
                items.map(async (item) => await syncTransactions(item))
            );

            return c.json({ message: "Transactions synced" });
    })


type ItemProps = z.infer<typeof ItemsModel>;
type UpdateProps = {
    id: string;
    userId: string;
    added: Array<Transaction>;
    modified: Array<Transaction>;
    removed: Array<RemovedTransaction>;
    txnCursor: string | null | undefined; 
};

const syncTransactions = async ({
    id, 
    userId, 
    accessToken, 
    txnCursor,
}: ItemProps) => {
    let added: Array<Transaction> = [];
    let modified: Array<Transaction> = [];
    let removed: Array<RemovedTransaction> = [];
    let hasMore = true;

    while (hasMore) {
        const request: TransactionsSyncRequest = {
            access_token: accessToken,
            cursor: txnCursor ?? undefined,
        };
        const response = await plaidClient.transactionsSync(request);
        const data = response.data;

        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);

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
    await addTxnsAndCategories(userId, added);
    await addTxnsAndCategories(userId, modified);

    const txns = removed.map((txnObj) => txnObj.transaction_id);

    await prisma.transactions.deleteMany({
        where: {
            id: {
                in: txns
            }
        }
    });
  
    await prisma.items.update({
        where: {
            id: id,
        },
        data: {
            txnCursor: txnCursor,
        },
    });
};

const addTxnsAndCategories = async (userId: string, txnArray: Array<Transaction>) => {
    for (const txn of txnArray) {
        let category;

        if (txn.personal_finance_category?.primary) {
            category = await prisma.categories.findFirst({
                where: {
                    userId: userId,
                    name: formatCategory(txn.personal_finance_category.primary),
                },
                select: {
                    id: true,
                },
            });

            if (!category?.id) {
                category = await prisma.categories.create({
                    data: {
                        userId: userId,
                        name: formatCategory(txn.personal_finance_category.primary),
                    },
                });
            }
        }

        await prisma.transactions.upsert({
            where: {
                id: txn.transaction_id,
            },
            update: {
                name: txn.merchant_name ?? txn.name,
                amount: convertAmountToMiliUnits(txn.amount * -1),
                date: txn.authorized_date ? new Date(txn.authorized_date) : new Date(txn.date),
                accountId: txn.account_id,
                categoryId: category?.id,
            },
            create: {
                id: txn.transaction_id,
                userId: userId,
                name: txn.merchant_name ?? txn.name,
                amount: convertAmountToMiliUnits(txn.amount * -1),
                date: txn.authorized_date ? new Date(txn.authorized_date) : new Date(txn.date),
                accountId: txn.account_id,
                categoryId: category?.id,
            },
        });
    }
};

export default app;