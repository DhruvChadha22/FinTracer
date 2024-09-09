import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { plaidClient } from "@/lib/plaid";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { CountryCode, Products } from "plaid";
import { convertAmountToMiliUnits } from "@/lib/utils";

const app = new Hono()
    .post(
        "/create_link_token",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            
            const plaidRequest = {
                user: {
                    client_user_id: auth.userId,
                },
                client_name: 'FinTracer',
                products: [Products.Transactions],
                language: 'en',
                country_codes: [CountryCode.Us],
            };

            try {
                const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
                return c.json(createTokenResponse.data);
            }
            catch (error) {
                return c.json({ error: "Failure" }, 500);
            }
    })
    .post(
        "/exchange_public_token",
        clerkMiddleware(),
        zValidator(
            "json",
            z.object({
                publicToken: z.string(),
            })
        ),
        async (c) => {
            const auth = getAuth(c);
            const { publicToken } = c.req.valid("json");

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const plaidResponse = await plaidClient.itemPublicTokenExchange({
                    public_token: publicToken,
                });
                
                const tokenData = plaidResponse.data;

                await prisma.items.create({
                    data: {
                        id: tokenData.item_id,
                        userId: auth.userId,
                        accessToken: tokenData.access_token,
                    }
                });
                await populateBankName(tokenData.item_id, tokenData.access_token);
                await populateAccountNames(tokenData.access_token, auth.userId);

                return c.json({ message: "Item added successfully" });
            }
            catch (error) {
                return c.json({ error: "Failure" }, 500);
            }
    })
    .get(
        "/banks",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.items.findMany({
                where: {
                    userId: auth.userId,
                },
                select: {
                    id: true,
                    bankName: true,
                },
            });

            return c.json({ data });
    })
    .get(
        "/",
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                itemId: z.string().optional()
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { itemId } = c.req.valid("query");
            
            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.accounts.findMany({
                where: {
                    itemId: itemId ? itemId : undefined,
                    userId: auth.userId,
                },
                select: {
                    id: true,
                    name: true,
                    balance: true,
                    mask: true,
                },
            });

            return c.json({ data });
    })
    .delete(
        "/",
        clerkMiddleware(),
        zValidator(
            "query",
            z.object({
                itemId: z.string().optional()
            }),
        ),
        async (c) => {
            const auth = getAuth(c);
            const { itemId } = c.req.valid("query");

            if (!itemId) {
                return c.json({ error: "Missing itemId" }, 400);
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const data = await prisma.items.findUnique({
                    where: {
                        id: itemId,
                        userId: auth.userId,
                    }
                });

                if (!data) {
                    return c.json({ error: "Not found" }, 404);
                }

                await plaidClient.itemRemove({
                    access_token: data.accessToken,
                });

                await prisma.items.delete({
                    where: {
                        id: itemId,
                        userId: auth.userId,
                    }
                });

                return c.json({ data });
            }
            catch(error) {
                return c.json({ error: "Failure" }, 500);
            }
    })
    .post(
        "/sync",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c);

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const banks = await prisma.items.findMany({
                where: {
                    userId: auth.userId,
                },
            });

            await Promise.all(banks.map(async (bank) => 
                await syncBalances(bank.accessToken, auth.userId)
            ));

            return c.json({ message: "Balances synced" });       
    });


const populateBankName = async (itemId: string, accessToken: string) => {
    try {
        const itemResponse = await plaidClient.itemGet({
            access_token: accessToken,
        });

        const institutionId = itemResponse.data.item.institution_id;

        if (institutionId == null) {
            return;
        }

        const institutionResponse = await plaidClient.institutionsGetById({
            institution_id: institutionId,
            country_codes: [CountryCode.Us],
        });

        const institutionName = institutionResponse.data.institution.name;
        await prisma.items.update({
            where: {
                id: itemId,
            },
            data: {
                bankName: institutionName,
            },
        });

    } catch (error) {
        console.log(error);
    }
};
    
const populateAccountNames = async (accessToken: string, userId: string) => {
    try {
        const acctsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const acctsData = acctsResponse.data;
        const itemId = acctsData.item.item_id;

        await Promise.all(
            acctsData.accounts.map(async (acct) => {
                await prisma.accounts.create({
                    data: {
                        id: acct.account_id,
                        userId: userId,
                        name: acct.name,
                        itemId: itemId,
                        balance: convertAmountToMiliUnits(acct.balances.current ?? acct.balances.available!),
                        mask: acct.mask,
                    },
                });
            })
        );

    } catch (error) {
        console.log(error);
    }
};

const syncBalances = async (accessToken: string, userId: string) => {
    try {
        const acctsResponse = await plaidClient.accountsBalanceGet({
            access_token: accessToken,
        });

        const acctsData = acctsResponse.data;
        const itemId = acctsData.item.item_id;

        await Promise.all(
            acctsData.accounts.map(async (acct) => {
                await prisma.accounts.update({
                    where: {
                        id: acct.account_id,
                        userId: userId,
                        itemId: itemId,
                    },
                    data: {
                        balance: convertAmountToMiliUnits(acct.balances.current ?? acct.balances.available!),
                    },
                });
            })
        );
    } catch (error) {
        console.log(error);
    }
};

export default app;