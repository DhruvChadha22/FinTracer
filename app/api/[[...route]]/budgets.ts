import { Hono } from "hono";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { BudgetsModel } from "@/prisma/zod";

const app = new Hono()
    .get(
        "/", 
        verifyAuth(),
        async (c) => {
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.budgets.findMany({
                where: {
                    userId: auth.token.id
                },
                select: {
                    id: true,
                    name: true,
                    amount: true,
                    startDate: true,
                    endDate: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            return c.json({ data });
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

            const data = await prisma.budgets.findUnique({
                where: {
                    id: id,
                    userId: auth.token.id
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
            BudgetsModel.omit({
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

            const data = await prisma.budgets.create({
                data: {
                    userId: auth.token.id,
                    ...values
                }
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

            await prisma.budgets.deleteMany({
                where: {
                    userId: auth.token.id,
                    id: {
                        in: values.ids
                    }
                }
            });

            return c.json({ messsage: "Budgets deleted successfully." });
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
            BudgetsModel.omit({
                id: true,
                userId: true,
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!id) {
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.budgets.update({
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

            const data = await prisma.budgets.delete({
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

export default app;