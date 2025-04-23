import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { plaidClient } from "@/lib/plaid";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { CountryCode, Products } from "plaid";
import { convertAmountToMiliUnits } from "@/lib/utils";

const app = new Hono()
    .post(
        "/create_link_token",
        verifyAuth(),
        async (c) => {
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }
            
            const plaidRequest = {
                user: {
                    client_user_id: auth.token.id,
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
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                publicToken: z.string(),
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { publicToken } = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const plaidResponse = await plaidClient.itemPublicTokenExchange({
                    public_token: publicToken,
                });
                
                const tokenData = plaidResponse.data;

                //Create Item and Add Item Name
                const connectedBank = await prisma.items.create({
                    data: {
                        id: tokenData.item_id,
                        userId: auth.token.id,
                        accessToken: tokenData.access_token,
                    }
                });

                const itemResponse = await plaidClient.itemGet({
                    access_token: tokenData.access_token,
                });
        
                const institutionId = itemResponse.data.item.institution_id;
        
                if (institutionId) {
                    const institutionResponse = await plaidClient.institutionsGetById({
                        institution_id: institutionId,
                        country_codes: [CountryCode.Us],
                    });
            
                    const institutionName = institutionResponse.data.institution.name;
                    await prisma.items.update({
                        where: {
                            id: tokenData.item_id,
                        },
                        data: {
                            bankName: institutionName,
                        },
                    });
                }

                //Add Accounts
                const plaidAccounts = await plaidClient.accountsGet({
                    access_token: tokenData.access_token,
                });

                const newAccounts = plaidAccounts.data.accounts.map((acct) => ({
                    id: acct.account_id,
                    userId: auth.token?.id!,
                    name: acct.name,
                    itemId: plaidAccounts.data.item.item_id,
                    balance: convertAmountToMiliUnits(acct.balances.current ?? acct.balances.available!),
                    mask: acct.mask,
                }));

                await prisma.accounts.createMany({
                    data: newAccounts,
                });
                
                return c.json({ 
                    id: connectedBank.id,
                    bankName: connectedBank.bankName,
                });
            }
            catch (error) {
                return c.json({ error: "Failure" }, 500);
            }
    })
    .get(
        "/banks",
        verifyAuth(),
        async (c) => {
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.items.findMany({
                where: {
                    userId: auth.token.id,
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
        verifyAuth(),
        zValidator(
            "query",
            z.object({
                itemId: z.string().optional()
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { itemId } = c.req.valid("query");
            
            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.accounts.findMany({
                where: {
                    itemId: itemId ? itemId : undefined,
                    userId: auth.token.id,
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
        verifyAuth(),
        zValidator(
            "query",
            z.object({
                itemId: z.string().optional()
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { itemId } = c.req.valid("query");

            if (!itemId) {
                return c.json({ error: "Missing itemId" }, 400);
            }

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const data = await prisma.items.findUnique({
                    where: {
                        id: itemId,
                        userId: auth.token.id,
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
                        userId: auth.token.id,
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
                        accessToken: true,
                    },
                });

                if (!bank) {
                    return c.json({ error: "Not found" }, 404);
                }

                const acctsResponse = await plaidClient.accountsBalanceGet({
                    access_token: bank.accessToken,
                });
        
                const acctsData = acctsResponse.data;
                
                const values: string[] = [];
                const params: unknown[] = [auth.token.id, itemId];

                acctsData.accounts.forEach((acct, _ind) => {
                    const balance = convertAmountToMiliUnits(acct.balances.current ?? acct.balances.available!);
                    values.push(`($${params.length + 1}, $${params.length + 2})`);
                    params.push(acct.account_id, balance);
                });

                const sql = `
                    UPDATE "Accounts" AS a 
                    SET
                        balance = v.balance
                    FROM (
                        VALUES
                        ${values.join(',\n')}
                    ) AS v(id, balance)
                    WHERE a.id = v.id
                      AND a."userId" = $1
                      AND a."itemId" = $2;
                `;

                await prisma.$executeRawUnsafe(sql, ...params);
                
                return c.json({ message: "Balances synced" });                 
            } 
            catch(error) {
                return c.json({ error: "Failure" }, 500);
            }     
    });

export default app;