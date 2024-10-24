import { Hono } from "hono";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { prisma } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { CategoriesModel } from "@/prisma/zod";

const app = new Hono()
    .get(
        "/", 
        verifyAuth(),
        async (c) => {
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.findMany({
                where: {
                    userId: auth.token.id
                },
                select: {
                    id: true,
                    name: true,
                },
            });

            return c.json({ data });
    })
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json", 
            CategoriesModel.omit({
                id: true,
                userId: true,
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.create({
                data: {
                    userId: auth.token.id,
                    ...values
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

            const data = await prisma.categories.findUnique({
                where: {
                    id: id,
                    userId: auth.token.id
                },
                select: {
                    id: true,
                    name: true,
                }
            });

            if (!data) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data });
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
            CategoriesModel.omit({
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

            const data = await prisma.categories.update({
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
                return c.json({ error: "Missing id" }, 400);
            }

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await prisma.categories.delete({
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